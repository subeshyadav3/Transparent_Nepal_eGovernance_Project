"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // 2. Fetch from your api
        const response = await fetch('/api/common/analytics');
        const result = await response.json();
        
        if (result.error) throw new Error(result.error);
        
        setData(result);
      } catch (err) {
        console.error("Failed to load analytics:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      minimumFractionDigits: 0,
    }).format(value);
  }

  if (loading) return <div className="p-8 space-y-4"><Skeleton className="h-12 w-1/4" /><Skeleton className="h-64 w-full" /></div>;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#1a2b4b] uppercase tracking-tight">Sushasan Analytics</h1>
        <p className="text-muted-foreground">Live data from the National Database</p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 border-t-4 border-t-blue-600">
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Total Treasury Allocation</p>
          <p className="text-3xl font-black text-[#1c3f94] mt-2">{formatCurrency(data.totalAllocated)}</p>
        </Card>
        <Card className="p-6 border-t-4 border-t-green-600">
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Total Expenditure</p>
          <p className="text-3xl font-black text-green-700 mt-2">{formatCurrency(data.totalSpent)}</p>
          <p className="text-xs font-bold mt-2 text-green-600">
            {((data.totalSpent / data.totalAllocated) * 100).toFixed(1)}% Utilization Rate
          </p>
        </Card>
        <Card className="p-6 border-t-4 border-t-red-600">
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Public Grievances</p>
          <p className="text-3xl font-black text-[#1a2b4b] mt-2">{data.complaintMetrics.total}</p>
          <p className="text-xs font-bold mt-2 text-red-500">
            {data.complaintMetrics.open} Actions Pending
          </p>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Department Distribution */}
        <Card className="p-6">
          <h2 className="text-xl font-black text-[#1a2b4b] mb-6 uppercase">Budget by Department</h2>
          <div className="space-y-6">
            {data.departmentBudgets.map((dept: any) => (
              <div key={dept.name}>
                <div className="flex justify-between mb-2">
                  <span className="font-bold text-slate-700">{dept.name}</span>
                  <span className="text-sm font-black">{dept.percentage}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#1c3f94] rounded-full transition-all" style={{ width: `${dept.percentage}%` }} />
                </div>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">
                    {formatCurrency(dept.amount)} Allocated
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Project Status */}
        <Card className="p-6">
          <h2 className="text-xl font-black text-[#1a2b4b] mb-6 uppercase">Infrastructure Progress</h2>
          <div className="space-y-6">
            <StatusRow label="Completed" count={data.projectMetrics.completed} total={data.projectMetrics.total} color="bg-green-500" />
            <StatusRow label="Ongoing" count={data.projectMetrics.ongoing} total={data.projectMetrics.total} color="bg-blue-500" />
            <StatusRow label="Planned" count={data.projectMetrics.planned} total={data.projectMetrics.total} color="bg-yellow-500" />
            
            <div className="pt-6 border-t mt-4">
                <div className="flex h-4 w-full rounded-full overflow-hidden">
                    <div className="bg-green-500" style={{ width: `${(data.projectMetrics.completed / data.projectMetrics.total) * 100}%` }} />
                    <div className="bg-blue-500" style={{ width: `${(data.projectMetrics.ongoing / data.projectMetrics.total) * 100}%` }} />
                    <div className="bg-yellow-500" style={{ width: `${(data.projectMetrics.planned / data.projectMetrics.total) * 100}%` }} />
                </div>
                <p className="text-center text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Cumulative Project Lifecycle</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

function StatusRow({ label, count, total, color }: any) {
    const percent = Math.round((count / total) * 100);
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${color}`} />
                <span className="font-bold text-slate-700 uppercase text-sm">{label}</span>
            </div>
            <div className="text-right">
                <span className="text-lg font-black block leading-none">{count}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">{percent}%</span>
            </div>
        </div>
    )
}