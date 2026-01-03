import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        complaints: {
          include: { project: { select: { projectName: true } } },
          orderBy: { createdAt: "desc" }
        },
        comments: {
          include: { project: { select: { projectName: true } } },
          orderBy: { createdAt: "desc" }
        }
      }
    });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { citizenshipNumber, idPhotoUrl } = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        // Note: Ensure these fields are added to your Prisma Schema
        // citizenshipNumber, 
        // idPhotoUrl,
        kycVerified: false, // Reset/Keep false until Admin reviews
      },
    });

    return NextResponse.json({ message: "KYC submitted for Admin review" });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}