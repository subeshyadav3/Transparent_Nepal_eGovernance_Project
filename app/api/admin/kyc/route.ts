import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

// Helper to ensure only ADMINs can access this
async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "ADMIN";
}

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const pendingUsers = await prisma.user.findMany({
      where: {
        role: "CITIZEN",
        kycVerified: false,
        NOT: { citizenshipNumber: null }, // Only show those who actually submitted something
      },
      select: {
        id: true,
        name: true,
        email: true,
        citizenshipNumber: true,
        idPhotoUrl: true,
      },
    });

    return NextResponse.json(pendingUsers);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { userId, approve } = await req.json();

    if (approve) {
      await prisma.user.update({
        where: { id: userId },
        data: { kycVerified: true },
      });
    } else {
      // If rejected, we clear the fields so they can re-submit
      await prisma.user.update({
        where: { id: userId },
        data: {
          citizenshipNumber: null,
          idPhotoUrl: null,
        },
      });
    }

    return NextResponse.json({ message: "Update successful" });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}