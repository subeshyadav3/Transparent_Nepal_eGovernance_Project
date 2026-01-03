import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma" // make sure you export prisma client from lib/prisma.ts

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
      status: "Active" as "Active" | "Planning" | "Closed", // you can adjust based on logic
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
