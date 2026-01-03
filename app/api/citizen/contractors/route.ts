import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const contractors = await prisma.contractor.findMany({
      include: {
        projects: {
          select: {
            projectName: true,
            status: true,
          }
        },
        _count: {
          select: { projects: true }
        }
      },
      orderBy: { score: "desc" } 
    });
    
    return NextResponse.json(contractors);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch contractor data" }, { status: 500 });
  }
}