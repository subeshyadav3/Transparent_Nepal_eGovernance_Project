"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, BarChart3, Users, FileText, TrendingUp, Shield, ArrowRight } from "lucide-react"

export default function Home() {
  const features = [
    {
      icon: BarChart3,
      title: "Budget Transparency",
      description: "Real-time budget allocation and spending reports accessible to all citizens of Nepal.",
    },
    {
      icon: TrendingUp,
      title: "Project Tracking",
      description: "Monitor National Pride Projects and local infrastructure from planning to completion.",
    },
    {
      icon: Shield,
      title: "Contractor Management",
      description: "Transparent vendor profiles and secure e-tender tracking system.",
    },
    {
      icon: FileText,
      title: "Public Grievance",
      description: "File and track complaints (Hello Sarkar integration) with full accountability.",
    },
    {
      icon: BarChart3,
      title: "Provincial Analytics",
      description: "Data-driven insights into spending patterns across all 7 provinces.",
    },
    {
      icon: Users,
      title: "Citizen Participation",
      description: "Community participation tools for better local level governance.",
    },
  ]

  return (
    <main className="min-h-screen bg-[#f0f4f8]">
      {/* Navigation Header */}
      <div className="sticky top-0 z-50 bg-[#1c3f94] text-white border-b border-blue-800 shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-inner overflow-hidden p-1">
              <span className="text-[#1c3f94] font-bold text-xs text-center leading-tight">नेपाल<br />सरकार</span>
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight block uppercase">Transparent Nepal</span>
              <span className="text-[10px] uppercase tracking-widest block opacity-80 font-semibold tracking-tighter">Pardarshi Nepal initiative</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-white hover:bg-blue-800 font-semibold">Login</Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-[#dc2626] hover:bg-[#b91c1c] text-white border-none font-bold">Sign Up</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="py-20 md:py-28 flex flex-col items-center text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-blue-100 rounded-full border border-blue-200">
              <CheckCircle2 className="h-4 w-4 text-[#1c3f94]" />
              <span className="text-sm font-semibold text-[#1c3f94]">Digital Nepal Framework Initiative</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-[#1a2b4b] leading-tight">
              Transparent E-Governance for <br />
              <span className="text-[#dc2626]">Prosperous Nepal</span>
            </h1>

            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              Access real-time data on government spending, federal budgets, and provincial projects.
              Ensuring accountability through the <strong>Transparent Nepal</strong> Open Data Initiative.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/citizen/dashboard">
                <Button size="lg" className="bg-[#1c3f94] hover:bg-[#152e6d] gap-2 px-8 font-bold">
                  View Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/citizen/dashboard/projects">
                <Button size="lg" variant="outline" className="border-[#1c3f94] text-[#1c3f94] hover:bg-blue-50 px-8 font-bold">
                  View Projects
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 md:gap-8 pt-8 border-t border-blue-200">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-50">
                <div className="text-2xl font-bold text-[#1c3f94]">७५३</div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Local Levels</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-50">
                <div className="text-2xl font-bold text-[#1c3f94]">७</div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Provinces</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-50">
                <div className="text-2xl font-bold text-[#dc2626]">LIVE</div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Budget Tracking</p>
              </div>
            </div>
          </div>
        </section>

        {/* Role Section */}
        <section className="py-12">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="border-t-4 border-t-[#1c3f94] hover:shadow-xl transition-all border-x-0 border-b-0 shadow-md bg-white">
              <div className="p-8">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <Shield className="h-6 w-6 text-[#1c3f94]" />
                </div>
                <h3 className="text-2xl font-bold text-[#1a2b4b] mb-3 uppercase tracking-tighter">Public Officials</h3>
                <p className="text-slate-600 mb-6">Internal dashboard for budget entry, procurement management, and departmental reporting.</p>
                <Link href="/auth/login">
                  <Button className="w-full bg-[#1c3f94] hover:bg-[#152e6d] font-bold">Officer Login</Button>
                </Link>
              </div>
            </Card>

            <Card className="border-t-4 border-t-[#dc2626] hover:shadow-xl transition-all border-x-0 border-b-0 shadow-md bg-white">
              <div className="p-8">
                <div className="h-12 w-12 bg-red-50 rounded-lg flex items-center justify-center mb-6">
                  <Users className="h-6 w-6 text-[#dc2626]" />
                </div>
                <h3 className="text-2xl font-bold text-[#1a2b4b] mb-3 uppercase tracking-tighter">General Public</h3>
                <p className="text-slate-600 mb-6">Citizen portal to view spending, track local projects, and provide feedback on services.</p>
                <Link href="/auth/login">
                  <Button variant="outline" className="w-full border-[#dc2626] text-[#dc2626] hover:bg-red-50 font-bold">Enter Portal</Button>
                </Link>
              </div>
            </Card>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a2b4b] uppercase tracking-tight">Digital Governance Tools</h2>
            <div className="h-1 w-20 bg-[#dc2626] mx-auto mt-4"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Card key={i} className="p-6 border-none shadow-sm hover:shadow-md transition-shadow bg-white">
                <feature.icon className="h-8 w-8 text-[#1c3f94] mb-4" />
                <h4 className="font-bold text-lg mb-2 text-[#1a2b4b] uppercase tracking-tight">{feature.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">{feature.description}</p>
              </Card>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-[#1a2b4b] text-white pt-16 pb-8 border-t border-blue-800">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto mb-10">
            <h4 className="font-bold text-xl mb-4 uppercase tracking-widest text-[#dc2626]">Transparent Nepal</h4>
            <p className="text-blue-100 text-sm leading-relaxed opacity-80 font-medium">
              An initiative towards a digitally transparent Nepal, ensuring every rupee is accounted for and every project is visible to the taxpayer.
            </p>
          </div>

          <div className="border-t border-blue-800/50 pt-8 flex flex-col items-center gap-4 text-[10px] text-blue-300 font-bold uppercase tracking-[0.3em]">
            <p>© 2026 Transparent Nepal • Safa ra Pardarshi Nepal</p>
            {/* <div className="flex gap-6 opacity-60">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div> */}
          </div>
        </div>
      </footer>
    </main>
  )
}