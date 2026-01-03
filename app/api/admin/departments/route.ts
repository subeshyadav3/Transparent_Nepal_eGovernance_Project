import prisma from "@/lib/prisma";

export async function GET() {
  const departments = await prisma.department.findMany();
  return new Response(JSON.stringify(departments), { status: 200 });
}
