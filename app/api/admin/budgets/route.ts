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

// POST: add a new budget
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { departmentId, fiscalYear, allocatedAmount, spentAmount } = body

    const budget = await prisma.budget.create({
      data: { departmentId, fiscalYear, allocatedAmount, spentAmount },
    })

    return NextResponse.json(budget)
  } catch (err) {
    console.error(err)
    return NextResponse.error()
  }
}

// PATCH: update budget fields (spent or status)
export async function PATCH(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const budgetId = searchParams.get("id")
    if (!budgetId) return NextResponse.json({ error: "Missing budget ID" }, { status: 400 })

    const body = await req.json()
    const updatedBudget = await prisma.budget.update({
      where: { id: budgetId },
      data: {
        ...(body.spentAmount !== undefined ? { spentAmount: body.spentAmount } : {}),
        ...(body.status ? { status: body.status } : {}),
      },
    })

    return NextResponse.json(updatedBudget)
  } catch (err) {
    console.error(err)
    return NextResponse.error()
  }
}
