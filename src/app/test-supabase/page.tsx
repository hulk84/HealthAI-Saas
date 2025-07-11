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
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseKey) {
        setResults((prev: any) => ({ ...prev, directApi: { error: 'Environment variables not loaded' } }))
        setLoading(false)
        return
      }
      
      const healthResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      })

      const healthResult = {
        status: healthResponse.status,
        statusText: healthResponse.statusText,
        headers: Object.fromEntries(healthResponse.headers.entries())
      }

      // Test 2: Try auth endpoint
      const authResponse = await fetch(`${supabaseUrl}/auth/v1/signup`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
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
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseKey) {
        setResults((prev: any) => ({ ...prev, testKey: { error: 'Environment variables not loaded' } }))
        setLoading(false)
        return
      }
      
      const response = await fetch(`${supabaseUrl}/auth/v1/signup`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
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
          keyUsed: supabaseKey.substring(0, 50) + '...'
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
          <li>• URL del proyecto: {process.env.NEXT_PUBLIC_SUPABASE_URL || 'No configurada'}</li>
          <li>• La API key debe empezar con: eyJhbGciOiJIUzI1NiI...</li>
          <li>• Si ves status 401 = Invalid API key</li>
          <li>• Si ves status 400 = Error en los datos (email, password, etc.)</li>
          <li>• Si ves status 200 = ¡Éxito!</li>
        </ul>
      </div>
    </div>
  )
}