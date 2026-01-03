"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"

interface Budget {
  id: string
  name: string
  department: string
  allocated: number
  spent: number
  year: number
  status: "Active" | "Planning" | "Closed"
}

export default function CitizenBudgetsPage() {
  const { data: session } = useSession()
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [filterDept, setFilterDept] = useState("")

  useEffect(() => {
    fetch("/api/budgets")
      .then((res) => res.json())
      .then((data) => setBudgets(data))
      .catch(console.error)
  }, [])

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-NP", { 
      style: "currency", 
      currency: "NPR", 
      minimumFractionDigits: 0 
    }).format(value)
    
  const filteredBudgets = filterDept ? budgets.filter((b) => b.department === filterDept) : budgets
  const departments = Array.from(new Set(budgets.map((b) => b.department)))

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Budget Overview</h1>

      {/* Filter */}
      <Card className="p-4 mb-6">
        <p className="text-sm font-medium mb-2">Filter by Department</p>
        <div className="flex gap-2 flex-wrap">
          <Button variant={filterDept === "" ? "default" : "outline"} onClick={() => setFilterDept("")} size="sm">
            All Departments
          </Button>
          {departments.map((dept) => (
            <Button
              key={dept}
              variant={filterDept === dept ? "default" : "outline"}
              onClick={() => setFilterDept(dept)}
              size="sm"
            >
              {dept}
            </Button>
          ))}
        </div>
      </Card>

      {/* Budgets Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredBudgets.map((budget) => {
          const utilization = (budget.spent / budget.allocated) * 100
          return (
            <Card key={budget.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{budget.name}</h3>
                  <p className="text-sm text-muted-foreground">{budget.department}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    budget.status === "Active"
                      ? "bg-green-500/10 text-green-700"
                      : budget.status === "Planning"
                      ? "bg-blue-500/10 text-blue-700"
                      : "bg-gray-500/10 text-gray-700"
                  }`}
                >
                  {budget.status}
                </span>
              </div>
              <p className="text-sm">Allocated: {formatCurrency(budget.allocated)}</p>
              <p className="text-sm">Spent: {formatCurrency(budget.spent)}</p>
              <p className="text-sm font-semibold">Utilization: {utilization.toFixed(1)}%</p>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
