'use client'

import { useState } from 'react'

export default function DirectTestPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testDirect = async () => {
    setLoading(true)
    try {
      // Test directo sin usar el cliente de Supabase
      const response = await fetch(
        'https://fulxozhozkeovsdvwjbl.supabase.co/rest/v1/profiles?select=*&limit=1',
        {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1bHhvemhvemtlb3ZzZHZ3amJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwOTM4MjQsImV4cCI6MjA2NzY2OTgyNH0.UWsV9DGCE-_pYRO_N2sdohmP5aAdFFl_BFdCnU_jvZE',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1bHhvemhvemtlb3ZzZHZ3amJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwOTM4MjQsImV4cCI6MjA2NzY2OTgyNH0.UWsV9DGCE-_pYRO_N2sdohmP5aAdFFl_BFdCnU_jvZE',
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          }
        }
      )

      const text = await response.text()
      setResult({
        status: response.status,
        statusText: response.statusText,
        body: text
      })
    } catch (err: any) {
      setResult({
        error: err.message
      })
    }
    setLoading(false)
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Directo de API</h1>
      
      <button 
        onClick={testDirect}
        disabled={loading}
        className="btn-primary mb-4"
      >
        Test Directo
      </button>

      {result && (
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  )
}