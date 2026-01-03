import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
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
  const session = (await getServerSession(authOptions)) as Session | null;

  if (!session || session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const projectId = url.searchParams.get("id");

  // Check if uploading report
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const summary = (formData.get("summary") as string) ?? "";
    const file = formData.get("file") as File | null;

    if (!projectId) return NextResponse.json({ error: "Project ID required" }, { status: 400 });
    if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 });

    let fileUrl: string | null = null;
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const fs = require("fs");
      const path = require("path");
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, file.name);
      fs.writeFileSync(filePath, buffer);
      fileUrl = `/uploads/${file.name}`;
    }

    const newReport = await prisma.projectReport.create({
      data: {
        projectId,
        title,
        summary,
        fileUrl,
      },
    });

    return NextResponse.json(newReport);
  }

  // Normal project creation
  const body = await req.json();
  const { budgetId, projectName, description, contractorId, startDate, endDate } = body;

  if (!budgetId || !projectName || !contractorId)
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

  const project = await prisma.project.create({
    data: {
      budgetId,
      projectName,
      description,
      contractorId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status: ProjectStatus.PLANNED,
      progress: 0,
      totalCost: 0,
    },
  });

  return NextResponse.json(project);
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
