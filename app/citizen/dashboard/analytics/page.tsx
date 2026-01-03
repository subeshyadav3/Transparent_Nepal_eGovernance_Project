"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"

interface BudgetTrend {
  month: string
  allocated: number
  spent: number
}

interface DepartmentBudget {
  name: string
  percentage: number
  amount: number
}

interface ProjectMetrics {
  total: number
  completed: number
  inProgress: number
  planning: number
}

interface ComplaintMetrics {
  total: number
  open: number
  resolved: number
  average_resolution_days: number
}

export default function AnalyticsPage() {
  const { data: session } = useSession()
  const isCitizen = session?.user?.role === "citizen"

  const [timeRange, setTimeRange] = useState("year")

  // Sample data for charts
  const budgetTrends: BudgetTrend[] = [
    { month: "Jan", allocated: 8000000, spent: 2000000 },
    { month: "Feb", allocated: 8000000, spent: 2500000 },
    { month: "Mar", allocated: 8000000, spent: 3200000 },
    { month: "Apr", allocated: 8000000, spent: 3800000 },
    { month: "May", allocated: 8000000, spent: 4500000 },
    { month: "Jun", allocated: 8000000, spent: 5200000 },
  ]

  const departmentBudgets: DepartmentBudget[] = [
    { name: "Public Works", percentage: 35, amount: 5000000 },
    { name: "Education", percentage: 30, amount: 3500000 },
    { name: "Health", percentage: 20, amount: 2800000 },
    { name: "Environment", percentage: 10, amount: 1500000 },
    { name: "Others", percentage: 5, amount: 700000 },
  ]

  const projectMetrics: ProjectMetrics = {
    total: 48,
    completed: 38,
    inProgress: 8,
    planning: 2,
  }

  const complaintMetrics: ComplaintMetrics = {
    total: 125,
    open: 12,
    resolved: 105,
    average_resolution_days: 8,
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value)
  }

  const totalBudget = budgetTrends.reduce((sum, t) => sum + t.allocated, 0)
  const totalSpent = budgetTrends.reduce((sum, t) => sum + t.spent, 0)

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics & Reports</h1>
          <p className="text-muted-foreground">Government performance metrics and insights</p>
        </div>
        <div className="flex gap-2">
          <Button variant={timeRange === "month" ? "default" : "outline"} onClick={() => setTimeRange("month")}>
            Month
          </Button>
          <Button variant={timeRange === "year" ? "default" : "outline"} onClick={() => setTimeRange("year")}>
            Year
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card className="p-6">
          <p className="text-muted-foreground text-sm">Total Budget</p>
          <p className="text-2xl font-bold">{formatCurrency(totalBudget)}</p>
          <p className="text-xs text-muted-foreground mt-2">Across all departments</p>
        </Card>
        <Card className="p-6">
          <p className="text-muted-foreground text-sm">Total Spent</p>
          <p className="text-2xl font-bold">{formatCurrency(totalSpent)}</p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-2">
            {((totalSpent / totalBudget) * 100).toFixed(1)}% utilization
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-muted-foreground text-sm">Projects Completed</p>
          <p className="text-2xl font-bold">{projectMetrics.completed}</p>
          <p className="text-xs text-muted-foreground mt-2">of {projectMetrics.total} total</p>
        </Card>
        <Card className="p-6">
          <p className="text-muted-foreground text-sm">Avg Resolution Time</p>
          <p className="text-2xl font-bold">{complaintMetrics.average_resolution_days} days</p>
          <p className="text-xs text-muted-foreground mt-2">For complaints</p>
        </Card>
      </div>

      {/* Budget Trend Chart */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6">Budget Spending Trend</h2>
        <div className="space-y-4">
          {budgetTrends.map((trend) => {
            const spentPercentage = (trend.spent / trend.allocated) * 100
            return (
              <div key={trend.month}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{trend.month}</span>
                  <div className="text-sm text-muted-foreground">
                    <span>{formatCurrency(trend.spent)}</span>
                    <span className="mx-2">/</span>
                    <span>{formatCurrency(trend.allocated)}</span>
                  </div>
                </div>
                <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${Math.min(spentPercentage, 100)}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Department Budget Distribution */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Budget Distribution by Department</h2>
          <div className="space-y-4">
            {departmentBudgets.map((dept) => (
              <div key={dept.name}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{dept.name}</span>
                  <span className="text-sm font-semibold">{dept.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full" style={{ width: `${dept.percentage}%` }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{formatCurrency(dept.amount)}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Project Status Distribution */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Project Status Overview</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="font-medium">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg">{projectMetrics.completed}</span>
                <span className="text-sm text-muted-foreground">
                  ({((projectMetrics.completed / projectMetrics.total) * 100).toFixed(0)}%)
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="font-medium">In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg">{projectMetrics.inProgress}</span>
                <span className="text-sm text-muted-foreground">
                  ({((projectMetrics.inProgress / projectMetrics.total) * 100).toFixed(0)}%)
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="font-medium">Planning</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg">{projectMetrics.planning}</span>
                <span className="text-sm text-muted-foreground">
                  ({((projectMetrics.planning / projectMetrics.total) * 100).toFixed(0)}%)
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="w-full h-4 bg-muted rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${(projectMetrics.completed / projectMetrics.total) * 100}%` }}
                />
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${(projectMetrics.inProgress / projectMetrics.total) * 100}%` }}
                />
                <div
                  className="h-full bg-yellow-500"
                  style={{ width: `${(projectMetrics.planning / projectMetrics.total) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Complaint Analytics */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6">Complaint Management Analytics</h2>
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-muted-foreground text-sm">Total Complaints</p>
            <p className="text-2xl font-bold mt-1">{complaintMetrics.total}</p>
          </div>
          <div className="p-4 bg-red-500/10 rounded-lg">
            <p className="text-red-700 dark:text-red-400 text-sm">Open</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">{complaintMetrics.open}</p>
          </div>
          <div className="p-4 bg-green-500/10 rounded-lg">
            <p className="text-green-700 dark:text-green-400 text-sm">Resolved</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{complaintMetrics.resolved}</p>
          </div>
          <div className="p-4 bg-blue-500/10 rounded-lg">
            <p className="text-blue-700 dark:text-blue-400 text-sm">Resolution Rate</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
              {((complaintMetrics.resolved / complaintMetrics.total) * 100).toFixed(0)}%
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-border">
          <p className="text-sm font-medium mb-4">Status Distribution</p>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Resolved</span>
                <span className="font-semibold">{complaintMetrics.resolved}</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${(complaintMetrics.resolved / complaintMetrics.total) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Open</span>
                <span className="font-semibold">{complaintMetrics.open}</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full"
                  style={{ width: `${(complaintMetrics.open / complaintMetrics.total) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Key Insights */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Key Insights & Recommendations</h2>
        <div className="space-y-4">
          <div className="p-4 border border-primary/20 rounded-lg bg-primary/5">
            <p className="font-medium mb-1">Budget Utilization</p>
            <p className="text-sm text-muted-foreground">
              Current budget utilization is at {((totalSpent / totalBudget) * 100).toFixed(1)}%. Continue monitoring
              spending patterns to ensure efficient resource allocation.
            </p>
          </div>

          <div className="p-4 border border-accent/20 rounded-lg bg-accent/5">
            <p className="font-medium mb-1">Project Completion Rate</p>
            <p className="text-sm text-muted-foreground">
              {((projectMetrics.completed / projectMetrics.total) * 100).toFixed(0)}% of projects have been completed
              successfully. Focus on completing the {projectMetrics.inProgress} in-progress projects on schedule.
            </p>
          </div>

          <div className="p-4 border border-green-500/20 rounded-lg bg-green-500/5">
            <p className="font-medium mb-1">Complaint Resolution</p>
            <p className="text-sm text-muted-foreground">
              Average resolution time is {complaintMetrics.average_resolution_days} days with a{" "}
              {((complaintMetrics.resolved / complaintMetrics.total) * 100).toFixed(0)}% resolution rate. Maintain focus
              on timely resolution of pending complaints.
            </p>
          </div>

          <div className="p-4 border border-blue-500/20 rounded-lg bg-blue-500/5">
            <p className="font-medium mb-1">Department Performance</p>
            <p className="text-sm text-muted-foreground">
              Public Works leads with 35% of budget allocation. Review budget distribution across departments to
              optimize resource allocation based on project priorities.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
