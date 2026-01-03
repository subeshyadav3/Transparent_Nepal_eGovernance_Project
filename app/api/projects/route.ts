import prisma from "@/lib/prisma";

export async function GET() {
  const projects = await prisma.project.findMany();
  return new Response(JSON.stringify(projects), { status: 200 });
}
