"use client"

import { useSession, signIn } from "next-auth/react"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export default function CitizenDashboardPage() {
  const { data: session } = useSession()

  // Function to handle login-required actions
  const requireLogin = (action: () => void) => {
    if (!session) {
      signIn() // prompts login
    } else {
      action()
    }
  }

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-sky-900 mb-2">Citizen Portal</h1>
        <p className="text-slate-600">
          Welcome {session ? `back, ${session.user?.name}` : "to the public dashboard"}
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/citizen/budgets">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-sky-600 bg-white">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-semibold mb-2 text-lg text-sky-900">Budget Overview</h2>
                <p className="text-sm text-slate-600">View government spending and allocations</p>
              </div>
              <div className="text-3xl">💵</div>
            </div>
          </Card>
        </Link>

        <Link href="/citizen/projects">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-sky-600 bg-white">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-semibold mb-2 text-lg text-sky-900">Project Status</h2>
                <p className="text-sm text-slate-600">Track ongoing projects in your area</p>
              </div>
              <div className="text-3xl">🏗️</div>
            </div>
          </Card>
        </Link>

        <Card
          onClick={() =>
            requireLogin(() => {
              // Perform add complaint action
              window.location.href = "/citizen/complaints"
            })
          }
          className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-sky-600 bg-white"
        >
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-semibold mb-2 text-lg text-sky-900">File Complaint</h2>
              <p className="text-sm text-slate-600">Report issues or concerns to authorities</p>
            </div>
            <div className="text-3xl">📝</div>
          </div>
        </Card>

        <Link href="/citizen/contractors">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-sky-600 bg-white">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-semibold mb-2 text-lg text-sky-900">Contractors</h2>
                <p className="text-sm text-slate-600">View contractor ratings and details</p>
              </div>
              <div className="text-3xl">⭐</div>
            </div>
          </Card>
        </Link>

        <Link href="/citizen/tenders">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-sky-600 bg-white">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-semibold mb-2 text-lg text-sky-900">Tenders</h2>
                <p className="text-sm text-slate-600">View public tender announcements</p>
              </div>
              <div className="text-3xl">📢</div>
            </div>
          </Card>
        </Link>

        <Card
          onClick={() =>
            requireLogin(() => {
              alert("Feedback form opened!")
              // You can navigate to feedback page or open modal here
            })
          }
          className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-sky-600 bg-white"
        >
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-semibold mb-2 text-lg text-sky-900">Share Feedback</h2>
              <p className="text-sm text-slate-600">Help us improve our services</p>
            </div>
            <div className="text-3xl">💬</div>
          </div>
        </Card>
      </div>
    </div>
  )
}
