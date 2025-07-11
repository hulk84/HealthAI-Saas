'use client'

import { useState } from 'react'

export default function SimpleTestPage() {
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/test-connection')
      const data = await response.json()
      setResults(data)
    } catch (error: any) {
      setResults({ error: error.message })
    }
    setLoading(false)
  }

  const testBasicAuth = async () => {
    setLoading(true)
    try {
      const url = 'https://fulxozhozkeovsdvwjbl.supabase.co'
      const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1bHhvemhvemtlb3ZzZHZ3amJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwOTM4MjQsImV4cCI6MjA2NzY2OTgyNH0.UWsV9DGCE-_pYRO_N2sdohmP5aAdFFl_BFdCnU_jvZE'

      // Test auth endpoint directly
      const response = await fetch(`${url}/auth/v1/signup`, {
        method: 'POST',
        headers: {
          'apikey': key,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: `test${Date.now()}@example.com`,
          password: 'testpassword123'
        })
      })

      const data = await response.json()
      
      setResults({
        status: response.status,
        statusText: response.statusText,
        data: data,
        timestamp: new Date().toISOString()
      })
    } catch (error: any) {
      setResults({ 
        error: error.message,
        timestamp: new Date().toISOString()
      })
    }
    setLoading(false)
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Simple Connection Test</h1>
      
      <div className="space-y-4 mb-6">
        <button
          onClick={testConnection}
          disabled={loading}
          className="btn-primary w-full"
        >
          Test API Connection
        </button>
        
        <button
          onClick={testBasicAuth}
          disabled={loading}
          className="btn-secondary w-full"
        >
          Test Direct Auth (Hardcoded)
        </button>
      </div>

      {results && (
        <div className="card">
          <h2 className="font-bold mb-2">Results:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-6 card bg-yellow-50">
        <h3 className="font-bold text-yellow-800 mb-2">Troubleshooting:</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• If you see 404: Project might be paused</li>
          <li>• If you see 401: API key is incorrect</li>
          <li>• If you see 500: Server error</li>
          <li>• Check browser console for CORS errors</li>
        </ul>
      </div>
    </div>
  )
}