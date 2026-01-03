import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const complaints = await prisma.complaint.findMany({
      include: {
        project: {
          include: {
            contractor: {
              select: { companyName: true }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    
    return NextResponse.json(complaints);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch complaints" }, { status: 500 });
  }
}