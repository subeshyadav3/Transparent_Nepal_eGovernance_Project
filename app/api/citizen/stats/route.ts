import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {

    const activeProjects = await prisma.project.count({
      where: { status: "ONGOING" }
    });


    const budgetSum = await prisma.project.aggregate({
      _sum: { totalCost: true }
    });


    const totalComplaints = await prisma.complaint.count();
    const resolvedComplaints = await prisma.complaint.count({
      where: { status: "RESOLVED" } 
    });

    const resolutionRate = totalComplaints > 0 
      ? Math.round((resolvedComplaints / totalComplaints) * 100) 
      : 100;

    return NextResponse.json({
      activeProjects,
      totalBudget: budgetSum._sum.totalCost || 0,
      resolutionRate
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}