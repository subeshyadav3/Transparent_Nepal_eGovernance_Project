import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { ProjectStatus } from "@/app/generated/prisma/enums";


interface SessionUser {
  id: string;
  role: "ADMIN" | "CITIZEN";
  kycVerified: boolean;
}


interface Session {
  user: SessionUser;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (id) {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        contractor: true,
        budget: true,
        complaints: { include: { user: true } },
        comments: { include: { user: true } },
        projectReports: true,
        rescheduleLogs: true,
      },
    });

    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    return NextResponse.json({
      ...project,
      commentsCount: project.comments.length,
      complaintsCount: project.complaints.length,
    });
  }

  const projects = await prisma.project.findMany({
    include: { comments: true, complaints: true, contractor: true },
  });

  return NextResponse.json(
    projects.map((p) => ({
      ...p,
      commentsCount: p.comments.length,
      complaintsCount: p.complaints.length,
    }))
  );
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { 
      projectName, 
      description, 
      budgetId, 
      totalCost, 
      startDate, 
      endDate,
      contractorId,
      newContractor 
    } = body;

    const cost = parseFloat(totalCost);

    if (!projectName || !budgetId || isNaN(cost) || !startDate || !endDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      
      // Check budget and funds availability
      const budget = await tx.budget.findUnique({ where: { id: budgetId } });
      if (!budget) throw new Error("Target budget record not found");
      
      if (Number(budget.remainingAmount) < cost) {
        throw new Error(`Insufficient funds. Available: ${budget.remainingAmount}`);
      }

      // Handle Contractor logic
      let finalContractorId = contractorId;

      if (newContractor && !contractorId) {
        const createdContractor = await tx.contractor.create({
          data: {
            companyName: newContractor.companyName,
            registrationNo: newContractor.registrationNo,
            contactPerson: newContractor.contactPerson,
            phone: newContractor.phone,
            email: newContractor.email,
          },
        });
        finalContractorId = createdContractor.id;
      }

      if (!finalContractorId) throw new Error("Contractor assignment failed");

      // Create Project record
      const newProject = await tx.project.create({
        data: {
          projectName,
          description,
          budgetId,
          contractorId: finalContractorId,
          totalCost: cost,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          status: ProjectStatus.PLANNED,
          progress: 0,
        },
      });

      // Update budget totals
      await tx.budget.update({
        where: { id: budgetId },
        data: {
          spentAmount: { increment: cost },
          remainingAmount: { decrement: cost },
        },
      });

      // Create audit trail entry
      await tx.budgetTransaction.create({
        data: {
          budgetId,
          projectId: newProject.id,
          amount: cost,
          transactionDate: new Date(),
          remarks: `Project Allocation: ${projectName}`,
        },
      });

      return newProject;
    });

    return NextResponse.json(result, { status: 201 });

  } catch (error: any) {
    console.error("Project Deployment Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" }, 
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const session = (await getServerSession(authOptions)) as Session | null;
  if (!session || session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const projectId = url.searchParams.get("id");
  if (!projectId) return NextResponse.json({ error: "Project id required" }, { status: 400 });

  const body = await req.json();
  const allowedFields = ["status", "progress", "endDate"];
  const dataToUpdate: any = {};

  allowedFields.forEach((f) => {
    if (body[f] !== undefined) {
      dataToUpdate[f] = f === "endDate" ? new Date(body[f]) : body[f];
    }
  });

  // Fetch current project before update
  const currentProject = await prisma.project.findUnique({ where: { id: projectId } });
  if (!currentProject) return NextResponse.json({ error: "Project not found" }, { status: 404 });

  // Update the project
  const updatedProject = await prisma.project.update({
    where: { id: projectId },
    data: dataToUpdate,
  });

  // Create RescheduleLog if endDate changed and reason provided
  if (body.endDate && body.rescheduleReason) {
    await prisma.rescheduleLog.create({
      data: {
        projectId,
        oldDate: currentProject.endDate,
        newDate: new Date(body.endDate),
        reason: body.rescheduleReason,
      },
    });
  }

  // Return updated project with all relations
  const fullProject = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      contractor: true,
      budget: true,
      comments: { include: { user: true } },
      complaints: { include: { user: true } },
      projectReports: true,
      rescheduleLogs: true, // include reschedule logs
    },
  });

  return NextResponse.json(fullProject);
}
