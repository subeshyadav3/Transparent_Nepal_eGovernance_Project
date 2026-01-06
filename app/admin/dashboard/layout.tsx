"use client"

import { useSession, signOut } from "next-auth/react"
import { redirect, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Menu, X, LayoutDashboard, ShieldCheck } from "lucide-react"
import type React from "react"
import Loader from "@/components/Loader"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  if (status === "loading") return <Loader />
  if (!session) redirect("/auth/login")
  if (session.user?.role !== "ADMIN") redirect("/citizen/dashboard")

  const handleLogout = async () => await signOut({ redirect: true, callbackUrl: "/" })

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/dashboard/budgets", label: "Budgets" },
    { href: "/admin/dashboard/projects", label: "Projects" },
    { href: "/admin/dashboard/contractors", label: "Contractors" },
    { href: "/admin/dashboard/complaints", label: "Complaints" },
    { href: "/admin/dashboard/analytics", label: "Analytics" },
    { href: "/admin/dashboard/kyc", label: "KYC" },
  ]

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background overflow-hidden">
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-sky-200 z-50">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-sky-700" size={20} />
          <div className="flex flex-col">
            <span className="text-lg font-black text-sky-900 leading-none">Transparent Nepal</span>
            <span className="text-[9px] text-red-600 font-bold uppercase tracking-widest mt-0.5">Admin Panel</span>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-sky-50 text-sky-600 border border-sky-200"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <aside className={`fixed md:relative inset-y-0 left-0 w-64 bg-gradient-to-b from-sky-50 to-sky-100 border-r border-sky-200 transition-transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 flex flex-col z-40`}>
        <div className="p-6 border-b border-sky-200 hidden md:block">
          <h2 className="text-2xl font-bold text-sky-900 tracking-tight">Transparent Nepal</h2>
          <p className="text-[10px] text-red-600 font-black uppercase tracking-widest mt-1">Admin Control Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto mt-14 md:mt-0">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}>
                <Button 
                  variant={isActive ? "secondary" : "ghost"} 
                  className={`w-full justify-start h-11 transition-all ${isActive ? "bg-sky-200 text-sky-900 font-bold border-r-4 border-sky-600" : "hover:bg-sky-200 text-slate-700"}`}
                >
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-sky-200 bg-sky-100/30 space-y-3">
          <div className="px-2">
            <p className="text-sm font-bold text-slate-900 truncate">{session.user?.name}</p>
            <p className="text-[10px] font-medium text-slate-500 truncate lowercase">{session.user?.email}</p>
          </div>
          <Button 
            onClick={handleLogout} 
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs uppercase tracking-wider"
          >
            Sign Out
          </Button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-sky-900/40 backdrop-blur-sm md:hidden z-30" onClick={() => setSidebarOpen(false)} />
      )}

      <main className="flex-1 overflow-auto w-full bg-white">
        {children}
      </main>
    </div>
  )
}