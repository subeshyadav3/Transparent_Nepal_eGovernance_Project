"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function BudgetDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [budget, setBudget] = useState<any>(null)
  const [editAllocated, setEditAllocated] = useState<number>(0)

  useEffect(() => {
    fetch(`/api/budgets/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setBudget(data)
        setEditAllocated(data.allocated)
      })
  }, [id])

  if (!budget) return <p>Loading...</p>

  const handleUpdate = async () => {
    await fetch(`/api/budgets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ allocatedAmount: editAllocated }),
    })
    router.back()
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Budget Details</h1>
      <Card className="p-6">
        <p className="mb-2"><strong>Name:</strong> {budget.name}</p>
        <p className="mb-2"><strong>Department:</strong> {budget.department}</p>
        <p className="mb-2"><strong>Spent:</strong> {budget.spent}</p>
        <p className="mb-2"><strong>Status:</strong> {budget.status}</p>

        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <Input type="number" value={editAllocated} onChange={(e) => setEditAllocated(Number(e.target.value))} />
          <Button onClick={handleUpdate}>Update Allocated</Button>
        </div>
      </Card>
    </div>
  )
}
