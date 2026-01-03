// components/Loader.tsx
"use client"

export default function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center  z-50">
      <div className="w-10 h-10 border-4 border-t-sky-600 border-gray-200 rounded-full animate-spin"></div>
    </div>
  )
}
