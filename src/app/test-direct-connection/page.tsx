'use client'

import { useState } from 'react'

export default function TestDirectConnection() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    const results: any = {
      timestamp: new Date().toISOString(),
      tests: []
    }

    // Test 1: Direct REST API call
    try {
      const response = await fetch('https://fulxozhozkeovsdvwjbl.supabase.co/rest/v1/profiles', {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1bHhvemhvemtlb3ZzZHZ3amJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwOTM4MjQsImV4cCI6MjA2NzY2OTgyNH0.UWsV9DGCE-_pYRO_N2sdohmP5aAdFFl_BFdCnU_jvZE',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1bHhvemhvemtlb3ZzZHZ3amJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwOTM4MjQsImV4cCI6MjA2NzY2OTgyNH0.UWsV9DGCE-_pYRO_N2sdohmP5aAdFFl_BFdCnU_jvZE'
        }
      })

      const data = await response.json()
      results.tests.push({
        name: 'Direct REST API - Profiles',
        status: response.status,
        ok: response.ok,
        data: data
      })
    } catch (error: any) {
      results.tests.push({
        name: 'Direct REST API - Profiles',
        error: error.message
      })
    }

    // Test 2: Try to create a test user with service role key
    try {
      const response = await fetch('/api/test-create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: `test${Date.now()}@example.com`,
          password: 'test123456',
          full_name: 'Test User Direct'
        })
      })

      const data = await response.json()
      results.tests.push({
        name: 'Create User via API',
        status: response.status,
        data: data
      })
    } catch (error: any) {
      results.tests.push({
        name: 'Create User via API',
        error: error.message
      })
    }

    setResult(results)
    setLoading(false)
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Test Conexión Directa a Supabase</h1>

      <button
        onClick={testConnection}
        disabled={loading}
        className="btn-primary mb-6"
      >
        {loading ? 'Probando...' : 'Probar Conexión'}
      </button>

      {result && (
        <div className="space-y-4">
          {result.tests.map((test: any, index: number) => (
            <div key={index} className="card">
              <h3 className="font-bold mb-2">{test.name}</h3>
              <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
                {JSON.stringify(test, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 card bg-yellow-50">
        <h3 className="font-bold text-yellow-800">Información del Proyecto:</h3>
        <ul className="text-sm text-yellow-700">
          <li>URL: https://fulxozhozkeovsdvwjbl.supabase.co</li>
          <li>Proyecto: fulxozhozkeovsdvwjbl</li>
        </ul>
      </div>
    </div>
  )
}