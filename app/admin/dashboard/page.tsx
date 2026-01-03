"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import Loader from "@/components/Loader"
import { 
  LayoutDashboard, 
  Wallet, 
  Briefcase, 
  Users, 
  FileSearch, 
  AlertOctagon, 
  BarChart3,
  ArrowUpRight,
  ShieldCheck
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminDashboardPage() {
  const { data: session, status } = useSession()

  if (status === "loading") return <Loader />
  if (!session) redirect("/auth/login")
  if (session.user?.role !== "ADMIN") redirect("/citizen/dashboard")

  const navItems = [
    { href: "/admin/dashboard/budgets", label: "Budgets", icon: <Wallet size={20} />, description: "Manage allocations", color: "border-l-blue-900" },
    { href: "/admin/dashboard/projects", label: "Projects", icon: <Briefcase size={20} />, description: "Track infrastructure", color: "border-l-indigo-900" },
    { href: "/admin/dashboard/contractors", label: "Contractors", icon: <Users size={20} />, description: "Vendor registry", color: "border-l-slate-700" },
    { href: "/admin/dashboard/tenders", label: "Tenders", icon: <FileSearch size={20} />, description: "Bidding & procurement", color: "border-l-cyan-900" },
    { href: "/admin/dashboard/complaints", label: "Complaints", icon: <AlertOctagon size={20} />, description: "Citizen grievances", color: "border-l-red-800" },
    { href: "/admin/dashboard/analytics", label: "Analytics", icon: <BarChart3 size={20} />, description: "Data & performance", color: "border-l-emerald-800" },
  ]

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-200 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="text-blue-900" size={24} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">System Administrator</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Control Panel</h1>
            <p className="text-slate-500 font-medium">Authentication Verified: Welcome, {session.user?.name}</p>
          </div>

          {/* Real-time Quick Stats for Analytics */}
          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase">System Health</p>
              <p className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                Optimal <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase">Active Sessions</p>
              <p className="text-sm font-bold text-blue-900">1,204 Citizens</p>
            </div>
          </div>
        </header>

        {/* Dashboard Modules Grid */}
        <section>
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <LayoutDashboard size={14} /> Management Modules
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Card className={`group p-6 bg-white border border-slate-200 hover:border-blue-900 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/5 cursor-pointer border-l-4 ${item.color}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-slate-50 text-slate-700 group-hover:bg-blue-900 group-hover:text-white transition-colors rounded-xl">
                      {item.icon}
                    </div>
                    <ArrowUpRight className="text-slate-200 group-hover:text-blue-900 transition-colors" size={20} />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-1 group-hover:text-blue-900 transition-colors">
                    {item.label}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium">{item.description}</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Integrated Analytics Preview Section */}
        <section className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <BarChart3 size={200} />
          </div>
          
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="max-w-md">
              <h2 className="text-2xl font-black mb-3 italic">Analytical Overview</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Aggregate data indicates a 14% increase in project completion rates this fiscal year. Budget efficiency is currently at 89.4% across all departments.
              </p>
              <Link href="/admin/dashboard/analytics">
                <Button className="bg-white text-slate-900 hover:bg-blue-50 font-black uppercase text-[10px] tracking-widest px-8">
                  View Full Analytics
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full lg:w-auto">
               <MiniStat label="Budget Spent" value="₹4.2 Cr" trend="+12%" />
               <MiniStat label="Projects Live" value="48" trend="Steady" />
               <MiniStat label="Unresolved" value="12" trend="-4%" color="text-red-400" />
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}

function MiniStat({ label, value, trend, color = "text-white" }: any) {
  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</p>
      <p className={`text-2xl font-black ${color}`}>{value}</p>
      <p className="text-[10px] font-bold text-slate-500 mt-1">{trend} from last month</p>
    </div>
  )
}