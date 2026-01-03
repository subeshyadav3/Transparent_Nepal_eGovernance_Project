"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import Loader from "@/components/Loader"
import { 
  Wallet, 
  Plus, 
  Building2, 
  IndianRupee, 
  Calendar, 
  Filter,
  ArrowUpRight,
  TrendingDown,
  PieChart
} from "lucide-react"

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
      fetch("/api/admin/budgets").then((res) => res.json()),
      fetch("/api/admin/departments").then((res) => res.json()),
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
      const res = await fetch("/api/admin/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
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
      await fetch(`/api/admin/budgets?id=${budgetId}`, {
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
    <div className="min-h-screen bg-[#f8fafc] p-6 md:p-10 space-y-8">
      {actionLoading && <Loader />}
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Wallet className="text-blue-900" size={32} />
            Fiscal Oversight
          </h1>
          <p className="text-slate-500 mt-1">Manage departmental allocations and expenditure audits.</p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-900 hover:bg-blue-800 text-white font-bold gap-2 px-6 shadow-lg shadow-blue-900/20"
        >
          <Plus size={18} /> Add New Budget
        </Button>
      </div>

      {/* Creation Form */}
      {showForm && (
        <Card className="p-8 border-2 border-blue-900 shadow-2xl bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <PieChart size={120} className="text-blue-900" />
          </div>
          <h2 className="text-lg font-black text-blue-900 uppercase tracking-tighter italic border-b pb-4 mb-6">Create New Budget Allocation</h2>
          <div className="grid md:grid-cols-4 gap-6 mb-6 relative z-10">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Entry Name</label>
              <Input placeholder="e.g. Road Expansion 2026" value={newBudget.name} onChange={(e) => setNewBudget({ ...newBudget, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Department</label>
              <select 
                value={newBudget.departmentId} 
                onChange={(e) => setNewBudget({ ...newBudget, departmentId: e.target.value })}
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
              >
                <option value="">Select Department</option>
                {departments.map((dept) => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Total NPR</label>
              <Input type="number" placeholder="0.00" value={newBudget.allocated} onChange={(e) => setNewBudget({ ...newBudget, allocated: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Fiscal Year</label>
              <Input type="number" value={newBudget.year} onChange={(e) => setNewBudget({ ...newBudget, year: Number(e.target.value) })} />
            </div>
          </div>
          <div className="flex gap-3 relative z-10">
            <Button onClick={handleAddBudget} className="bg-blue-900 px-8 font-bold">Commence Allocation</Button>
            <Button variant="ghost" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-red-600 font-bold">Cancel</Button>
          </div>
        </Card>
      )}

      {/* Budget Table */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
            <Filter size={14} /> Master Ledger
          </h3>
          <span className="text-[10px] font-bold text-slate-400 bg-white border px-2 py-1 rounded italic">Records: {budgets.length}</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Ledger Name</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Department</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 text-right">Allocation</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 w-1/4">Expenditure Audit</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Auth Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {budgets.map((budget) => {
                const spentPercentage = Math.min((budget.spent / budget.allocated) * 100, 100);
                return (
                  <tr key={budget.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900 text-sm">{budget.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">FY {budget.year}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Building2 size={14} className="text-blue-900" />
                        <span className="text-sm font-semibold text-slate-600">{budget.department}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-black text-blue-900 font-mono">{formatCurrency(budget.allocated)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-end">
                           <Input
                            type="number"
                            defaultValue={budget.spent}
                            onBlur={(e) => handleUpdateBudget(budget.id, "spent", e.target.value)}
                            className="w-24 h-7 text-xs font-bold border-slate-200 bg-slate-50"
                          />
                          <span className="text-[10px] font-black text-slate-400 italic">{spentPercentage.toFixed(1)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-1000 ${spentPercentage > 90 ? 'bg-red-600' : 'bg-blue-900'}`} 
                            style={{ width: `${spentPercentage}%` }} 
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={budget.status}
                        onChange={(e) => handleUpdateBudget(budget.id, "status", e.target.value)}
                        className={`text-[10px] font-black uppercase rounded px-2 py-1 border transition-colors ${
                          budget.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                          budget.status === "Closed" ? "bg-slate-100 text-slate-600 border-slate-200" :
                          "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        <option value="Active">Active</option>
                        <option value="Planning">Planning</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}