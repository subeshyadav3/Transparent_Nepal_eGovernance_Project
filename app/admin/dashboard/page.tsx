"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import Loader from "@/components/Loader"

export default function AdminDashboardPage() {
  const { data: session, status } = useSession()
  if (status === "loading") return <Loader />  // wait for session
  if (!session) redirect("/auth/login")
  if (session.user?.role !== "ADMIN") redirect("/citizen/dashboard")

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-sky-900 mb-2">Admin Dashboard</h1>
        <p className="text-slate-600">Welcome back, {session.user?.name}</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/admin/dashboard/budgets">
          <Card className="p-6 hover:shadow-lg cursor-pointer border-l-4 border-l-sky-600 bg-white">
            <h2 className="font-semibold mb-2 text-lg text-sky-900">Budget Management</h2>
            <p className="text-sm text-slate-600">Create and manage government budgets</p>
          </Card>
        </Link>

        <Link href="/admin/dashboard/projects">
          <Card className="p-6 hover:shadow-lg cursor-pointer border-l-4 border-l-sky-600 bg-white">
            <h2 className="font-semibold mb-2 text-lg text-sky-900">Project Management</h2>
            <p className="text-sm text-slate-600">Track and oversee all projects</p>
          </Card>
        </Link>

        <Link href="/admin/dashboard/contractors">
          <Card className="p-6 hover:shadow-lg cursor-pointer border-l-4 border-l-sky-600 bg-white">
            <h2 className="font-semibold mb-2 text-lg text-sky-900">Contractor Management</h2>
            <p className="text-sm text-slate-600">Register and manage vendors</p>
          </Card>
        </Link>
      </div>
    </div>
  )
}
