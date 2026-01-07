"use client"

import type React from "react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
      } else if (result?.ok) {
        const res = await fetch("/api/auth/session")
        const sessionData = await res.json()

        if (callbackUrl) {
          router.push(callbackUrl)
        } else if (sessionData?.user?.role === "ADMIN") {
          router.push("/admin/dashboard")
        } else {
          router.push("/citizen/dashboard")
        }
      }
    } catch (err: any) {
      setError("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
      <div className="mb-8">
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">OB</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-center text-slate-900 mb-2">Welcome Back</h1>
        <p className="text-center text-slate-600 text-sm">Sign in to OpenBudget Platform</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
          <p className="font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
          <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
          <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 rounded-lg">
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-300"></div></div>
        <div className="relative flex justify-center text-sm"><span className="px-3 bg-white text-slate-500">or</span></div>
      </div>

      <p className="text-center text-slate-600 text-sm">
        Don't have an account? <Link href="/auth/signup" className="text-blue-600 font-semibold">Create one</Link>
      </p>
    </div>
  )
}