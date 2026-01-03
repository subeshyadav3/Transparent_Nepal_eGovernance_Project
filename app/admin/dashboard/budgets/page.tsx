"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import Loader from "@/components/Loader"

interface Budget {
  id: string
  name: string
  department: string
  allocated: number
  spent: number
  year: number
  status: "Active" | "Planning" | "Closed"
  departmentId: string
}

export default function AdminBudgetsPage() {
  const router = useRouter()
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [newBudget, setNewBudget] = useState({ name: "", departmentId: "", allocated: "", year: new Date().getFullYear() })

  useEffect(() => {
    Promise.all([
      fetch("/api/budgets").then((res) => res.json()),
      fetch("/api/departments").then((res) => res.json()),
    ])
      .then(([budgetsData, departmentsData]) => {
        setBudgets(budgetsData)
        setDepartments(departmentsData)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-NP", { style: "currency", currency: "NPR", minimumFractionDigits: 0 }).format(value || 0)

  const handleAddBudget = async () => {
    if (!newBudget.name || !newBudget.departmentId || !newBudget.allocated) return

    setActionLoading(true)
    const body = {
      departmentId: newBudget.departmentId,
      fiscalYear: `${newBudget.year}/${(newBudget.year + 1).toString().slice(-2)}`,
      allocatedAmount: Number(newBudget.allocated),
      spentAmount: 0,
      status: "Active",
    }

    try {
      const res = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error("Failed to create budget")
      const added = await res.json()
      const departmentName = departments.find((d) => d.id === newBudget.departmentId)?.name || ""

      setBudgets((prev) => [
        ...prev,
        {
          id: added.id,
          name: newBudget.name,
          department: departmentName,
          departmentId: newBudget.departmentId,
          allocated: Number(newBudget.allocated),
          spent: 0,
          year: newBudget.year,
          status: "Active",
        },
      ])
      setShowForm(false)
      setNewBudget({ name: "", departmentId: "", allocated: "", year: new Date().getFullYear() })
    } catch (err) {
      console.error(err)
    } finally {
      setActionLoading(false)
    }
  }

  const handleUpdateBudget = async (budgetId: string, field: "status" | "spent", value: any) => {
    try {
      await fetch(`/api/budgets?id=${budgetId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(field === "spent" ? { spentAmount: Number(value) } : { status: value }),
      })
  
      setBudgets((prev) =>
        prev.map((b) => (b.id === budgetId ? { ...b, [field]: field === "spent" ? Number(value) : value } : b))
      )
    } catch (err) {
      console.error(err)
    }
  }
  

  if (loading) return <Loader />

  return (
    <div className="p-8 relative">
      {actionLoading && <Loader />}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Budget Management (Admin)</h1>
        <Button onClick={() => setShowForm(!showForm)}>Add Budget</Button>
      </div>

      {showForm && (
        <Card className="p-6 mb-8 border-primary/50">
          <h2 className="font-semibold mb-4">Create New Budget</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <Input
              placeholder="Budget Name"
              value={newBudget.name}
              onChange={(e) => setNewBudget({ ...newBudget, name: e.target.value })}
            />
            <select value={newBudget.departmentId} onChange={(e) => setNewBudget({ ...newBudget, departmentId: e.target.value })}>
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
            <Input
              type="number"
              placeholder="Allocated Amount"
              value={newBudget.allocated}
              onChange={(e) => setNewBudget({ ...newBudget, allocated: e.target.value })}
            />
            <Input
              type="number"
              value={newBudget.year}
              onChange={(e) => setNewBudget({ ...newBudget, year: Number(e.target.value) })}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAddBudget}>Create Budget</Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </Card>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Department</th>
                <th className="px-6 py-3 text-left">Allocated</th>
                <th className="px-6 py-3 text-left">Spent</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {budgets.map((budget) => (
                <tr key={budget.id} className="border-b hover:bg-muted/30 cursor-pointer">
                  <td className="px-6 py-4" onClick={() => router.push(`/admin/budgets/${budget.id}`)}>{budget.name}</td>
                  <td className="px-6 py-4">{budget.department}</td>
                  <td className="px-6 py-4">{formatCurrency(budget.allocated)}</td>
                  <td className="px-6 py-4">
                  <Input
  type="number"
  defaultValue={budget.spent}  // use defaultValue instead of value
  onBlur={(e) => handleUpdateBudget(budget.id, "spent", e.target.value)}
  className="w-24"
/>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={budget.status}
                      onChange={(e) => handleUpdateBudget(budget.id, "status", e.target.value)}
                      className="bg-transparent border-none"
                    >
                      <option value="Active">Active</option>
                      <option value="Planning">Planning</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
