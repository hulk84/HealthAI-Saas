'use client'

import { useState, useEffect } from 'react'

export default function TestSupabasePage() {
  const [results, setResults] = useState<any>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check environment variables on load
    setResults((prev: any) => ({
      ...prev,
      env: {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        keyPrefix: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 50) + '...'
      }
    }))
  }, [])

  const testDirectAPI = async () => {
    setLoading(true)
    try {
      // Test 1: Check if API is accessible
      const healthResponse = await fetch('https://fulxozhozkeovsdvwjbl.supabase.co/rest/v1/', {
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`
        }
      })

      const healthResult = {
        status: healthResponse.status,
        statusText: healthResponse.statusText,
        headers: Object.fromEntries(healthResponse.headers.entries())
      }

      // Test 2: Try auth endpoint
      const authResponse = await fetch('https://fulxozhozkeovsdvwjbl.supabase.co/auth/v1/signup', {
        method: 'POST',
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'test123456'
        })
      })

      const authData = await authResponse.json()
      const authResult = {
        status: authResponse.status,
        statusText: authResponse.statusText,
        data: authData
      }

      setResults({
        env: results.env,
        health: healthResult,
        auth: authResult,
        timestamp: new Date().toISOString()
      })
    } catch (error: any) {
      setResults({
        ...results,
        error: error.message
      })
    }
    setLoading(false)
  }

  const testWithDifferentKey = async () => {
    setLoading(true)
    try {
      // Try with the exact key from the error message
      const testKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1bHhvemhvemtlb3ZzZHZ3amJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwOTM4MjQsImV4cCI6MjA2NzY2OTgyNH0.UWsV9DGCE-_pYRO_N2sdohmP5aAdFFl_BFdCnU_jvZE'
      
      const response = await fetch('https://fulxozhozkeovsdvwjbl.supabase.co/auth/v1/signup', {
        method: 'POST',
        headers: {
          'apikey': testKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'test2@example.com',
          password: 'test123456'
        })
      })

      const data = await response.json()
      setResults({
        ...results,
        hardcodedKeyTest: {
          status: response.status,
          data: data,
          keyUsed: testKey.substring(0, 50) + '...'
        }
      })
    } catch (error: any) {
      setResults({
        ...results,
        hardcodedKeyTest: { error: error.message }
      })
    }
    setLoading(false)
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Test Completo de Supabase</h1>
      
      <div className="space-y-4 mb-6">
        <button 
          onClick={testDirectAPI} 
          disabled={loading}
          className="btn-primary mr-4"
        >
          Test API con Variables de Entorno
        </button>
        
        <button 
          onClick={testWithDifferentKey} 
          disabled={loading}
          className="btn-secondary"
        >
          Test con Key Hardcoded
        </button>
      </div>

      <div className="space-y-4">
        <div className="card">
          <h2 className="font-bold mb-2">Resultados:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      </div>

      <div className="mt-6 card bg-blue-50">
        <h3 className="font-bold mb-2">Información de Debug:</h3>
        <ul className="text-sm space-y-1">
          <li>• URL del proyecto: https://fulxozhozkeovsdvwjbl.supabase.co</li>
          <li>• La API key debe empezar con: eyJhbGciOiJIUzI1NiI...</li>
          <li>• Si ves status 401 = Invalid API key</li>
          <li>• Si ves status 400 = Error en los datos (email, password, etc.)</li>
          <li>• Si ves status 200 = ¡Éxito!</li>
        </ul>
      </div>
    </div>
  )
}