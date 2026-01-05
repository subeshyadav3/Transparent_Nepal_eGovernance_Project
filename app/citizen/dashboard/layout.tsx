"use client"

import { useSession, signOut, signIn } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation" // Added this
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { User, LogOut, LayoutDashboard } from "lucide-react"
import type React from "react"

export default function CitizenLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const pathname = usePathname() // Initialize pathname
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" })
  }

  const navItems = [
    { href: "/citizen/dashboard", label: "Dashboard" },
    { href: "/citizen/dashboard/budgets", label: "Budgets" },
    { href: "/citizen/dashboard/projects", label: "Projects" },
    { href: "/citizen/dashboard/analytics", label: "Analytics" },
    { href: "/citizen/dashboard/complaints", label: "Complaints", requiresLogin: true },
    { href: "/citizen/dashboard/contractors", label: "Contractors" },
    { href: "/citizen/dashboard/tenders", label: "Tenders" },
  ]

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-sky-600 text-white shadow-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
          />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:relative inset-y-0 left-0 w-64 bg-gradient-to-b from-sky-50 to-sky-100 text-slate-900 border-r border-sky-200 transition-transform duration-300 ease-in-out z-40 flex flex-col`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-sky-200">
          <h2 className="text-2xl font-bold text-sky-900 tracking-tight">OpenBudget</h2>
          <p className="text-[10px] text-sky-700 mt-1 font-black uppercase tracking-widest">Citizen Portal</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            // Check if active
            const isActive = pathname === item.href;

            return (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start transition-colors mb-1 ${
                    isActive 
                      ? "bg-sky-200 text-sky-900 font-bold border-r-4 border-sky-600 shadow-sm" 
                      : "hover:bg-sky-200 text-slate-700 hover:text-sky-900 font-medium"
                  }`}
                >
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </nav>

        {/* User & Profile Section */}
        <div className="p-4 border-t border-sky-200 bg-sky-100/50">
          {session ? (
            <div className="space-y-3">
              <div className="px-2">
                <p className="text-sm font-bold text-slate-900 truncate">{session.user?.name}</p>
                <p className="text-[10px] text-slate-500 truncate lowercase">{session.user?.email}</p>
              </div>
              
              <div className="grid gap-2">
                <Link href="/citizen/dashboard/profile" onClick={() => setSidebarOpen(false)}>
                  <Button 
                    variant={pathname === "/citizen/dashboard/profile" ? "secondary" : "outline"} 
                    className={`w-full justify-start gap-2 border-sky-300 text-sky-900 hover:bg-white shadow-sm h-9 text-xs ${
                      pathname === "/citizen/dashboard/profile" ? "bg-sky-200 border-sky-600 border-r-4" : ""
                    }`}
                  >
                    <User size={14} />
                    My Account & KYC
                  </Button>
                </Link>

                <Button 
                  onClick={handleLogout} 
                  variant="destructive"
                  className="w-full justify-start gap-2 h-9 text-xs font-bold"
                >
                  <LogOut size={14} />
                  Sign Out
                </Button>
              </div>
            </div>
          ) : (
            <Button
              onClick={() => signIn()}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white shadow-md font-bold"
            >
              Sign In to Access
            </Button>
          )}
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm md:hidden z-30" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto w-full bg-white">{children}</main>
    </div>
  )
}