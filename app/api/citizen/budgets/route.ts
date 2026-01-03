import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET: fetch all budgets
export async function GET(req: NextRequest) {
  try {
    const budgets = await prisma.budget.findMany({
      include: {
        department: true,
      },
    })

    const formatted = budgets.map((b) => ({
      id: b.id,
      name: b.department.name + " Budget",
      department: b.department.name,
      allocated: b.allocatedAmount,
      spent: b.spentAmount,
      year: parseInt(b.fiscalYear.split("/")[0]), // assuming fiscalYear is "2082/83"
      status: "Active" as "Active" | "Planning" | "Closed", // adjust if needed
    }))

    return NextResponse.json(formatted)
  } catch (err) {
    console.error(err)
    return NextResponse.error()
  }
}