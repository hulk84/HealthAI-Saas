'use client'

import { useState } from 'react'

export default function DebugPage() {
  const [results, setResults] = useState<any>({})

  const runTests = async () => {
    const tests: any = {}

    // Test 1: Variables de entorno
    tests.env = {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      keyStart: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20)
    }

    // Test 2: Fetch directo
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseKey) {
        tests.directFetch = { error: 'Environment variables not loaded' }
        return
      }
      
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        headers: {
          'apikey': supabaseKey
        }
      })
      tests.directFetch = {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText
      }
    } catch (err: any) {
      tests.directFetch = { error: err.message }
    }

    // Test 3: Auth endpoint
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseKey) {
        tests.authHealth = { error: 'Environment variables not loaded' }
        return
      }
      
      const authResponse = await fetch(`${supabaseUrl}/auth/v1/health`, {
        headers: {
          'apikey': supabaseKey
        }
      })
      tests.authHealth = {
        status: authResponse.status,
        ok: authResponse.ok
      }
    } catch (err: any) {
      tests.authHealth = { error: err.message }
    }

    setResults(tests)
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Debug Completo</h1>
      
      <button onClick={runTests} className="btn-primary mb-4">
        Ejecutar Todos los Tests
      </button>

      <div className="space-y-4">
        <div className="card">
          <h2 className="font-bold mb-2">Variables de Entorno</h2>
          <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
            {JSON.stringify(results.env, null, 2)}
          </pre>
        </div>

        <div className="card">
          <h2 className="font-bold mb-2">Fetch Directo a API</h2>
          <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
            {JSON.stringify(results.directFetch, null, 2)}
          </pre>
        </div>

        <div className="card">
          <h2 className="font-bold mb-2">Auth Health Check</h2>
          <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
            {JSON.stringify(results.authHealth, null, 2)}
          </pre>
        </div>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 rounded">
        <h3 className="font-bold text-yellow-800">Información Importante:</h3>
        <ul className="text-sm text-yellow-700 mt-2 space-y-1">
          <li>• URL esperada: {process.env.NEXT_PUBLIC_SUPABASE_URL || 'No configurada'}</li>
          <li>• La key debe empezar con: eyJhbGciOiJIUzI1NiI...</li>
          <li>• Status 200 = OK, 401 = API key inválida</li>
        </ul>
      </div>
    </div>
  )
}