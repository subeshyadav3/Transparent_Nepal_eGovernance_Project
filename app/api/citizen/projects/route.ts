import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// --- Session types ---
interface SessionUser {
  id: string;
  role: "ADMIN" | "CITIZEN";
  kycVerified: boolean;
}
interface Session {
  user: SessionUser;
}

// Helper to require citizen login for POST actions
function requireCitizen(session: Session | null) {
  if (!session) throw new Error("Unauthorized");
  if (session.user.role !== "CITIZEN") throw new Error("Forbidden");
}

// ---------------- GET /api/projects/citizen?id= ----------------
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (id) {
    // Single project with full details
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        contractor: true,
        projectReports: true,
        rescheduleLogs: true,
        comments: { include: { user: true } },
        complaints: { include: { user: true } },
        budget: true,
      },
    });

    if (!project)
      return NextResponse.json({ error: "Project not found" }, { status: 404 });

    return NextResponse.json(project);
  }

  // All projects (public)
  const projects = await prisma.project.findMany({
    include: {
      contractor: true,
      budget: true,
      comments: true,
      complaints: true,
    },
  });

  // Map to include counts for comments & complaints
  const projectsWithCounts = projects.map((p) => ({
    ...p,
    commentsCount: p.comments.length,
    complaintsCount: p.complaints.length,
  }));

  return NextResponse.json(projectsWithCounts);
}

export async function POST(req: NextRequest) {
  const session = (await getServerSession(authOptions)) as Session | null;

  try {
    requireCitizen(session);
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message },
      { status: e.message === "Unauthorized" ? 401 : 403 }
    );
  }

  const body = await req.json();
  const { projectId, action, message, title, description, type } = body;

  if (!projectId || !action)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  switch (action) {
    case "comment":
      if (!message) return NextResponse.json({ error: "Message required" }, { status: 400 });
      const comment = await prisma.comment.create({
        data: { 
          projectId, 
          message, 
          userId: session!.user.id 
        },
      });
      return NextResponse.json(comment);

    case "complaint":
      if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 });
      const complaint = await prisma.complaint.create({
        data: { 
          projectId, 
          title, 
          description: description ?? "", 
          userId: session!.user.id 
        },
      });
      return NextResponse.json(complaint);

    case "vote":
      if (type !== "up" && type !== "down")
        return NextResponse.json({ error: "Type must be 'up' or 'down'" }, { status: 400 });

      const project = await prisma.project.findUnique({ where: { id: projectId } });
      if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

      const updatedProject = await prisma.project.update({
        where: { id: projectId },
        data: {
          upvotes: type === "up" ? project.upvotes + 1 : project.upvotes,
          downvotes: type === "down" ? project.downvotes + 1 : project.downvotes,
        },
      });
      return NextResponse.json(updatedProject);

    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }
}
