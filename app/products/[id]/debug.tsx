"use client"

import { useParams, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function DebugPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div>Loading debug info...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Debug Information</h1>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">URL Parameters</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(params, null, 2)}
            </pre>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Search Parameters</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(Object.fromEntries(searchParams.entries()), null, 2)}
            </pre>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Current URL</h2>
            <p className="bg-gray-100 p-4 rounded text-sm">
              {typeof window !== 'undefined' ? window.location.href : 'Server side'}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">User Agent</h2>
            <p className="bg-gray-100 p-4 rounded text-sm">
              {typeof window !== 'undefined' ? window.navigator.userAgent : 'Server side'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 