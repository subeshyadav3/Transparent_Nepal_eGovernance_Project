"use client"

import { Suspense } from "react"
import LoginForm from "./login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-md">
        <Suspense fallback={
          <div className="p-8 bg-white rounded-2xl shadow-lg border border-slate-200 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        }>
          <LoginForm />
        </Suspense>
        <p className="text-center text-slate-600 text-xs mt-6">Secure login powered by Transparent Nepal</p>
      </div>
    </div>
  )
}