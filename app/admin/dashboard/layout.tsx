"use client"

import { useSession, signOut } from "next-auth/react"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import type React from "react"
import Loader from "@/components/Loader"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()

  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  if (status === "loading") return <Loader />  // wait for session
  if (!session) redirect("/auth/login")

  if (session.user?.role !== "ADMIN") redirect("/citizen/dashboard")

  const handleLogout = async () => await signOut({ redirect: true, callbackUrl: "/" })

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/dashboard/budgets", label: "Budgets" },
    { href: "/admin/dashboard/projects", label: "Projects" },
    { href: "/admin/dashboard/contractors", label: "Contractors" },
    // { href: "/admin/dashboard/tenders", label: "Tenders" },
    { href: "/admin/dashboard/complaints", label: "Complaints" },
    { href: "/admin/dashboard/analytics", label: "Analytics" },
  ]

  return (
    <div className="flex h-screen bg-background">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-sky-600 text-white"
      >
        {sidebarOpen ? "✖" : "☰"}
      </button>

      <aside className={`fixed md:relative inset-y-0 left-0 w-64 bg-gradient-to-b from-sky-50 to-sky-100 border-r border-sky-200 transition-transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 flex flex-col z-40`}>
        <div className="p-6 border-b border-sky-200">
          <h2 className="text-2xl font-bold text-sky-900">OpenBudget</h2>
          <p className="text-xs text-sky-700 mt-1 font-semibold">ADMIN PANEL</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button variant="ghost" className="w-full justify-start hover:bg-sky-200">{item.label}</Button>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-sky-200 space-y-3">
          <div className="text-sm">
            <p className="font-semibold">{session.user?.name}</p>
            <p className="text-xs truncate">{session.user?.email}</p>
          </div>
          <Button onClick={handleLogout} className="w-full bg-sky-600 hover:bg-sky-700 text-white">Sign Out</Button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 md:hidden z-30" onClick={() => setSidebarOpen(false)} />}
      <main className="flex-1 overflow-auto w-full">{children}</main>
    </div>
  )
}
