import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const contractors = await prisma.contractor.findMany({
      include: {
        _count: {
          select: { projects: true }
        }
      },
      orderBy: { companyName: "asc" }
    });
    return NextResponse.json(contractors);
  } catch (error) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { companyName, registrationNo, contactPerson, phone, email } = body;

    const contractor = await prisma.contractor.create({
      data: {
        companyName,
        registrationNo,
        contactPerson,
        phone,
        email,
        score: 100.0 // Default starting score
      },
    });

    return NextResponse.json(contractor, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}