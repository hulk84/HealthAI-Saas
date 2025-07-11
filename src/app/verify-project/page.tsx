'use client'

import { useState } from 'react'

export default function VerifyProjectPage() {
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const runTests = async () => {
    setLoading(true)
    const testResults: any = {
      timestamp: new Date().toISOString(),
      tests: []
    }

    // Test 1: Check if URL is accessible
    try {
      const response = await fetch('https://fulxozhozkeovsdvwjbl.supabase.co')
      testResults.tests.push({
        name: 'Base URL accessibility',
        status: response.status,
        ok: response.ok,
        url: response.url
      })
    } catch (error: any) {
      testResults.tests.push({
        name: 'Base URL accessibility',
        error: error.message
      })
    }

    // Test 2: Try different auth approach
    try {
      const response = await fetch('https://fulxozhozkeovsdvwjbl.supabase.co/auth/v1/', {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1bHhvemhvemtlb3ZzZHZ3amJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwOTM4MjQsImV4cCI6MjA2NzY2OTgyNH0.UWsV9DGCE-_pYRO_N2sdohmP5aAdFFl_BFdCnU_jvZE'
        }
      })
      testResults.tests.push({
        name: 'Auth endpoint with API key',
        status: response.status,
        ok: response.ok
      })
    } catch (error: any) {
      testResults.tests.push({
        name: 'Auth endpoint with API key',
        error: error.message
      })
    }

    // Test 3: Call our direct test API
    try {
      const response = await fetch('/api/direct-test')
      const data = await response.json()
      testResults.tests.push({
        name: 'Direct test API results',
        data: data
      })
    } catch (error: any) {
      testResults.tests.push({
        name: 'Direct test API results',
        error: error.message
      })
    }

    setResults(testResults)
    setLoading(false)
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Verify Supabase Project</h1>
      
      <button
        onClick={runTests}
        disabled={loading}
        className="btn-primary mb-6"
      >
        {loading ? 'Running tests...' : 'Run Verification Tests'}
      </button>

      {results && (
        <div className="space-y-4">
          <div className="card">
            <h2 className="font-bold mb-2">Test Results:</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>

          <div className="card bg-blue-50">
            <h3 className="font-bold text-blue-800 mb-2">Project Information:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Project URL: https://fulxozhozkeovsdvwjbl.supabase.co</li>
              <li>• Project Ref: fulxozhozkeovsdvwjbl</li>
              <li>• Region: Check Supabase dashboard</li>
            </ul>
          </div>

          <div className="card bg-yellow-50">
            <h3 className="font-bold text-yellow-800 mb-2">Common Issues:</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Project might be paused (free tier)</li>
              <li>• API keys might have been regenerated</li>
              <li>• CORS might be blocking requests</li>
              <li>• Project might have been deleted</li>
              <li>• Region-specific connectivity issues</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}