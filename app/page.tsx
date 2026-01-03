// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import { CheckCircle2, BarChart3, Users, FileText, TrendingUp, Shield, ArrowRight } from "lucide-react"

// export default function Home() {
//   const features = [
//     {
//       icon: BarChart3,
//       title: "Budget Transparency",
//       description:
//         "Real-time budget allocation, spending reports, and detailed financial statements accessible to all citizens.",
//     },
//     {
//       icon: TrendingUp,
//       title: "Project Tracking",
//       description: "Monitor government projects from planning through completion with real-time progress updates.",
//     },
//     {
//       icon: Shield,
//       title: "Contractor Management",
//       description: "Transparent vendor profiles, performance ratings, and secure tender tracking.",
//     },
//     {
//       icon: FileText,
//       title: "Complaint System",
//       description: "File and track complaints with full accountability and resolution tracking measures.",
//     },
//     {
//       icon: BarChart3,
//       title: "Analytics Dashboard",
//       description: "Data-driven insights into government spending patterns and departmental performance.",
//     },
//     {
//       icon: Users,
//       title: "Public Engagement",
//       description: "Citizen feedback, surveys, and community participation tools for better governance.",
//     },
//   ]

//   return (
//     <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
//       {/* Navigation Header */}
//       <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
//         <div className="container mx-auto px-4 py-4 flex justify-between items-center">
//           <div className="flex items-center gap-2">
//             <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
//               <span className="text-primary-foreground font-bold text-sm">OB</span>
//             </div>
//             <span className="font-bold text-lg text-foreground">OpenBudget</span>
//           </div>
//           <div className="flex gap-3">
//             <Link href="/auth/login">
//               <Button variant="ghost">Login</Button>
//             </Link>
//             <Link href="/auth/signup">
//               <Button>Sign Up</Button>
//             </Link>
//           </div>
//         </div>
//       </div>

//       <div className="container mx-auto px-4">
//         {/* Hero Section */}
//         <section className="py-20 md:py-32 flex flex-col items-center text-center">
//           <div className="max-w-3xl mx-auto">
//             <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
//               <CheckCircle2 className="h-4 w-4 text-primary" />
//               <span className="text-sm font-medium text-primary">Transparent Government for All</span>
//             </div>

//             <h1 className="text-5xl md:text-6xl font-bold text-balance mb-6 text-foreground">
//               OpenBudget: A Transparent E-Governance Platform
//             </h1>

//             <p className="text-xl text-muted-foreground mb-8 text-balance">
//               Empowering citizens with real-time access to government budgets, projects, and spending. Building trust
//               through transparency and accountability.
//             </p>

//             <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
//               <Link href="/signup">
//                 <Button size="lg" className="gap-2 min-w-48">
//                   Get Started
//                   <ArrowRight className="h-4 w-4" />
//                 </Button>
//               </Link>
//               <Link href="/login">
//                 <Button size="lg" variant="outline" className="min-w-48 bg-transparent">
//                   Sign In
//                 </Button>
//               </Link>
//             </div>

//             <div className="grid grid-cols-3 gap-6 text-sm pt-8 border-t border-border">
//               <div>
//                 <div className="text-2xl font-bold text-primary mb-1">100K+</div>
//                 <p className="text-muted-foreground">Active Citizens</p>
//               </div>
//               <div>
//                 <div className="text-2xl font-bold text-primary mb-1">$500M+</div>
//                 <p className="text-muted-foreground">Budgets Tracked</p>
//               </div>
//               <div>
//                 <div className="text-2xl font-bold text-primary mb-1">50+</div>
//                 <p className="text-muted-foreground">Government Bodies</p>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Dual Role Section */}
//         <section className="py-16 md:py-24">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Role</h2>
//             <p className="text-lg text-muted-foreground">Access tailored features based on your needs</p>
//           </div>

//           <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
//             {/* Government Officials Card */}
//             <Card className="p-0 overflow-hidden hover:shadow-lg transition-shadow duration-300">
//               <div className="bg-gradient-to-br from-primary/10 to-primary/5 h-32 flex items-center justify-center">
//                 <Shield className="h-16 w-16 text-primary/40" />
//               </div>
//               <div className="p-8">
//                 <h3 className="text-2xl font-bold mb-3">Government Officials</h3>
//                 <p className="text-muted-foreground mb-6">
//                   Manage budgets, projects, contracts, and track performance with complete transparency and
//                   accountability measures.
//                 </p>
//                 <Link href="/login">
//                   <Button className="w-full gap-2">
//                     Admin Dashboard
//                     <ArrowRight className="h-4 w-4" />
//                   </Button>
//                 </Link>
//               </div>
//             </Card>

//             {/* Citizens Card */}
//             <Card className="p-0 overflow-hidden hover:shadow-lg transition-shadow duration-300">
//               <div className="bg-gradient-to-br from-accent/10 to-accent/5 h-32 flex items-center justify-center">
//                 <Users className="h-16 w-16 text-accent/40" />
//               </div>
//               <div className="p-8">
//                 <h3 className="text-2xl font-bold mb-3">Citizens & Public</h3>
//                 <p className="text-muted-foreground mb-6">
//                   View government budgets, track project progress, file complaints, and engage with your government
//                   transparently.
//                 </p>
//                 <Link href="/login">
//                   <Button variant="outline" className="w-full gap-2 bg-transparent">
//                     Citizen Portal
//                     <ArrowRight className="h-4 w-4" />
//                   </Button>
//                 </Link>
//               </div>
//             </Card>
//           </div>
//         </section>

//         <section className="py-16 md:py-24">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
//             <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
//               Everything you need to manage government budgets and engage citizens transparently
//             </p>
//           </div>

//           <div className="grid md:grid-cols-3 gap-6 mb-8">
//             {features.map((feature, index) => {
//               const Icon = feature.icon
//               return (
//                 <Card key={index} className="p-6 hover:shadow-md transition-shadow duration-300 group">
//                   <div className="mb-4 p-3 bg-primary/10 rounded-lg w-fit group-hover:bg-primary/20 transition-colors">
//                     <Icon className="h-6 w-6 text-primary" />
//                   </div>
//                   <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
//                   <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
//                 </Card>
//               )
//             })}
//           </div>
//         </section>

//         {/* CTA Section */}
//         <section className="py-16 md:py-24">
//           <Card className="p-12 text-center bg-gradient-to-r from-primary/5 to-accent/5">
//             <h2 className="text-3xl md:text-4xl font-bold mb-4">Join the Transparency Movement</h2>
//             <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
//               Be part of a government that operates with full transparency and accountability. Start today.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <Link href="/signup">
//                 <Button size="lg">Create Account</Button>
//               </Link>
//               <Link href="/login">
//                 <Button size="lg" variant="outline">
//                   Existing User?
//                 </Button>
//               </Link>
//             </div>
//           </Card>
//         </section>
//       </div>

//       <footer className="mt-20 border-t border-border bg-muted/30">
//         <div className="container mx-auto px-4 py-12">
//           <div className="grid md:grid-cols-4 gap-8 mb-8">
//             <div>
//               <div className="flex items-center gap-2 mb-4">
//                 <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
//                   <span className="text-primary-foreground font-bold text-sm">OB</span>
//                 </div>
//                 <span className="font-bold text-foreground">OpenBudget</span>
//               </div>
//               <p className="text-sm text-muted-foreground">
//                 Transparent E-Governance Platform for Government Budget Accountability
//               </p>
//             </div>
//             <div>
//               <h4 className="font-semibold mb-4 text-foreground">Platform</h4>
//               <ul className="space-y-2 text-sm text-muted-foreground">
//                 <li>
//                   <a href="#" className="hover:text-foreground transition-colors">
//                     Features
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="hover:text-foreground transition-colors">
//                     Pricing
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="hover:text-foreground transition-colors">
//                     Documentation
//                   </a>
//                 </li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="font-semibold mb-4 text-foreground">Governance</h4>
//               <ul className="space-y-2 text-sm text-muted-foreground">
//                 <li>
//                   <a href="#" className="hover:text-foreground transition-colors">
//                     Privacy Policy
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="hover:text-foreground transition-colors">
//                     Terms of Service
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="hover:text-foreground transition-colors">
//                     Security
//                   </a>
//                 </li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="font-semibold mb-4 text-foreground">Contact</h4>
//               <ul className="space-y-2 text-sm text-muted-foreground">
//                 <li>
//                   <a href="#" className="hover:text-foreground transition-colors">
//                     Support
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="hover:text-foreground transition-colors">
//                     Contact Us
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="hover:text-foreground transition-colors">
//                     Report Issue
//                   </a>
//                 </li>
//               </ul>
//             </div>
//           </div>

//           <div className="border-t border-border pt-8 mt-8">
//             <div className="flex flex-col md:flex-row justify-between items-center gap-4">
//               <p className="text-sm text-muted-foreground">
//                 © 2025 OpenBudget. All rights reserved. A government transparency initiative.
//               </p>
//               <p className="text-sm text-muted-foreground">Empowering citizens through transparent e-governance.</p>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </main>
//   )
// }


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
    // Changed background to a soft blue/white gradient
    <main className="min-h-screen bg-[#f0f4f8]">
      {/* Navigation Header - Using Nepal Government Blue */}
      <div className="sticky top-0 z-50 bg-[#1c3f94] text-white border-b border-blue-800 shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-inner">
              <span className="text-[#1c3f94] font-bold text-xs text-center leading-tight">नेपाल<br/>सरकार</span>
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight block">OpenBudget</span>
              <span className="text-[10px] uppercase tracking-widest block opacity-80">Government of Nepal</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-white hover:bg-blue-800">Login</Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-[#dc2626] hover:bg-[#b91c1c] text-white border-none">Sign Up</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Hero Section - Light Blue Wash */}
        <section className="py-20 md:py-28 flex flex-col items-center text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-blue-100 rounded-full border border-blue-200">
              <CheckCircle2 className="h-4 w-4 text-[#1c3f94]" />
              <span className="text-sm font-semibold text-[#1c3f94]">Digital Nepal Framework Initiative</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-[#1a2b4b] leading-tight">
              Transparent E-Governance for <br/>
              <span className="text-[#dc2626]">Prosperous Nepal</span>
            </h1>

            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              Access real-time data on government spending, federal budgets, and provincial projects. 
              Ensuring accountability through the Open Data Initiative.
            </p>

            <div className="flex flex-col sm:row gap-4 justify-center mb-12">
              <Button size="lg" className="bg-[#1c3f94] hover:bg-[#152e6d] gap-2 px-8">
                Explore Budgets
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-[#1c3f94] text-[#1c3f94] hover:bg-blue-50 px-8">
                View Projects
              </Button>
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

        {/* Role Section - Professional Blue/Crimson accent */}
        <section className="py-12">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="border-t-4 border-t-[#1c3f94] hover:shadow-xl transition-all border-x-0 border-b-0 shadow-md">
              <div className="p-8">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <Shield className="h-6 w-6 text-[#1c3f94]" />
                </div>
                <h3 className="text-2xl font-bold text-[#1a2b4b] mb-3">Public Officials</h3>
                <p className="text-slate-600 mb-6">Internal dashboard for budget entry, procurement management, and departmental reporting.</p>
                <Button className="w-full bg-[#1c3f94] hover:bg-[#152e6d]">Officer Login</Button>
              </div>
            </Card>

            <Card className="border-t-4 border-t-[#dc2626] hover:shadow-xl transition-all border-x-0 border-b-0 shadow-md">
              <div className="p-8">
                <div className="h-12 w-12 bg-red-50 rounded-lg flex items-center justify-center mb-6">
                  <Users className="h-6 w-6 text-[#dc2626]" />
                </div>
                <h3 className="text-2xl font-bold text-[#1a2b4b] mb-3">General Public</h3>
                <p className="text-slate-600 mb-6">Citizen portal to view spending, track local projects, and provide feedback on services.</p>
                <Button variant="outline" className="w-full border-[#dc2626] text-[#dc2626] hover:bg-red-50">Enter Portal</Button>
              </div>
            </Card>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a2b4b]">Digital Governance Tools</h2>
            <div className="h-1 w-20 bg-[#dc2626] mx-auto mt-4"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Card key={i} className="p-6 border-none shadow-sm hover:shadow-md transition-shadow bg-white">
                <feature.icon className="h-8 w-8 text-[#1c3f94] mb-4" />
                <h4 className="font-bold text-lg mb-2 text-[#1a2b4b]">{feature.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </section>
      </div>

      {/* Footer - Solid Royal Blue */}
      <footer className="bg-[#1a2b4b] text-white pt-16 pb-8">
        <div className="container mx-auto px-4 text-center md:text-left">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <h4 className="font-bold text-lg mb-6 border-l-4 border-[#dc2626] pl-3">OpenBudget Nepal</h4>
              <p className="text-blue-100 text-sm leading-relaxed">
                An initiative towards a digitally transparent Nepal, ensuring every rupee is accounted for and every project is visible to the taxpayer.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6 border-l-4 border-[#dc2626] pl-3">Quick Links</h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-blue-100">
                <a href="#" className="hover:underline">Ministry of Finance</a>
                <a href="#" className="hover:underline">National Planning Commission</a>
                <a href="#" className="hover:underline">Audit Reports</a>
                <a href="#" className="hover:underline">Procurement Portal</a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6 border-l-4 border-[#dc2626] pl-3">Support</h4>
              <p className="text-sm text-blue-100">Toll Free: 1111 (Hello Sarkar)</p>
              <p className="text-sm text-blue-100">Email: info@budget.gov.np</p>
            </div>
          </div>
          <div className="border-t border-blue-800/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-blue-300">
            <p>© 2026 Government of Nepal. Designed for Transparency.</p>
            <div className="flex gap-6">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Open Data License</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}