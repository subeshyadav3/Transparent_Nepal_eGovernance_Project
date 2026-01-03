"use client"

import { useSession, signIn } from "next-auth/react"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { 
  Wallet, 
  Construction, 
  MessageSquareWarning, 
  Users, 
  Newspaper, 
  BarChart3,
  ArrowRight
} from "lucide-react"

export default function CitizenDashboardPage() {
  const { data: session } = useSession()
  const router = useRouter()

  const requireLogin = (href: string, requiresAuth: boolean) => {
    if (requiresAuth && !session) {
      signIn()
    } else {
      router.push(href)
    }
  }

  const dashboardItems = [
    { 
      href: "/citizen/dashboard/budgets", 
      label: "Budget Overview", 
      desc: "Track taxes and public fund allocations", 
      icon: <Wallet className="text-emerald-600" />, 
      color: "border-l-emerald-500",
      auth: false 
    },
    { 
      href: "/citizen/dashboard/projects", 
      label: "Project Status", 
      desc: "Live tracking of infrastructure works", 
      icon: <Construction className="text-blue-600" />, 
      color: "border-l-blue-500",
      auth: false 
    },
    { 
      href: "/citizen/dashboard/complaints", 
      label: "File Complaint", 
      desc: "Report issues directly to the ledger", 
      icon: <MessageSquareWarning className="text-orange-600" />, 
      color: "border-l-orange-500",
      auth: true 
    },
    { 
      href: "/citizen/dashboard/analytics", 
      label: "Visual Analytics", 
      desc: "Data-driven insights on governance", 
      icon: <BarChart3 className="text-purple-600" />, 
      color: "border-l-purple-500",
      auth: false 
    },
    { 
      href: "/citizen/dashboard/contractors", 
      label: "Contractor Info", 
      desc: "Review vendor performance and scores", 
      icon: <Users className="text-sky-600" />, 
      color: "border-l-sky-500",
      auth: false 
    },
    { 
      href: "/citizen/dashboard/tenders", 
      label: "Public Tenders", 
      desc: "View upcoming government contracts", 
      icon: <Newspaper className="text-slate-600" />, 
      color: "border-l-slate-500",
      auth: false 
    },
  ]

  return (
    <div className="p-6 md:p-10 bg-slate-50/50 min-h-full">
      {/* Welcome Header */}
      <div className="max-w-6xl mx-auto mb-10">
        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
          Citizen Command Center
        </h1>
        <p className="text-slate-500 font-medium text-sm mt-1">
          {session 
            ? `Verified Citizen: ${session.user?.name}` 
            : "Public Access Mode — Sign in to interact with the ledger"}
        </p>
      </div>

      {/* Stats Quick-View (Placeholder for real data) */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Active Projects</p>
          <p className="text-2xl font-black text-blue-900">24</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Total Budget (FY)</p>
          <p className="text-2xl font-black text-emerald-700">$4.2M</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Resolved Issues</p>
          <p className="text-2xl font-black text-orange-600">89%</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardItems.map((item) => (
          <Card
            key={item.href}
            onClick={() => requireLogin(item.href, item.auth)}
            className={`group p-6 hover:shadow-xl transition-all cursor-pointer border-l-4 ${item.color} bg-white relative overflow-hidden`}
          >
            <div className="flex flex-col h-full justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-slate-50 rounded-lg group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                {item.auth && !session && (
                  <span className="text-[9px] font-black bg-slate-100 text-slate-500 px-2 py-1 rounded uppercase">
                    Login Required
                  </span>
                )}
              </div>
              
              <div>
                <h2 className="font-black text-lg text-slate-900 uppercase tracking-tight flex items-center gap-2">
                  {item.label}
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 flex items-center text-[10px] font-black text-blue-900 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                Explore <ArrowRight size={12} className="ml-1" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}