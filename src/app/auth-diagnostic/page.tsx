'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AuthDiagnosticPage() {
  const [results, setResults] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    runDiagnostics()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const runDiagnostics = async () => {
    const diagnostics: any = {
      timestamp: new Date().toISOString(),
      environment: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        appUrl: process.env.NEXT_PUBLIC_APP_URL
      },
      tests: []
    }

    // Test 1: Check Supabase client
    try {
      diagnostics.tests.push({
        name: 'Supabase Client',
        status: 'success',
        client: !!supabase
      })
    } catch (error: any) {
      diagnostics.tests.push({
        name: 'Supabase Client',
        status: 'error',
        error: error.message
      })
    }

    // Test 2: Check auth settings
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      diagnostics.tests.push({
        name: 'Auth Session Check',
        status: error ? 'error' : 'success',
        hasSession: !!session,
        error: error?.message
      })
    } catch (error: any) {
      diagnostics.tests.push({
        name: 'Auth Session Check',
        status: 'error',
        error: error.message
      })
    }

    // Test 3: Check if we can query profiles table
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1)
      
      diagnostics.tests.push({
        name: 'Profiles Table Access',
        status: error ? 'error' : 'success',
        error: error?.message,
        canAccess: !error
      })
    } catch (error: any) {
      diagnostics.tests.push({
        name: 'Profiles Table Access',
        status: 'error',
        error: error.message
      })
    }

    // Test 4: Try a test login
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'test2@example.com',
        password: 'testpassword123'
      })

      if (!error && data.user) {
        // If login successful, sign out immediately
        await supabase.auth.signOut()
      }

      diagnostics.tests.push({
        name: 'Test Login',
        status: error ? 'error' : 'success',
        error: error?.message,
        userFound: !!data?.user
      })
    } catch (error: any) {
      diagnostics.tests.push({
        name: 'Test Login',
        status: 'error',
        error: error.message
      })
    }

    // Test 5: Direct API test
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/health`, {
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
        }
      })

      diagnostics.tests.push({
        name: 'Direct Auth API Health',
        status: response.ok ? 'success' : 'error',
        statusCode: response.status,
        statusText: response.statusText
      })
    } catch (error: any) {
      diagnostics.tests.push({
        name: 'Direct Auth API Health',
        status: 'error',
        error: error.message
      })
    }

    setResults(diagnostics)
    setLoading(false)
  }

  const getSolution = () => {
    const hasInvalidApiKey = results.tests?.some((test: any) => 
      test.error?.includes('Invalid API key')
    )

    if (hasInvalidApiKey) {
      return {
        title: 'Solución para "Invalid API key"',
        steps: [
          '1. Ve a tu dashboard de Supabase',
          '2. Settings > API',
          '3. Copia de nuevo el "anon public" key',
          '4. Actualiza NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local',
          '5. Reinicia el servidor de desarrollo',
          '6. Si persiste, el proyecto puede estar pausado o las keys regeneradas'
        ]
      }
    }

    return null
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Diagnóstico de Autenticación</h1>

      {loading ? (
        <div className="card">
          <p>Ejecutando diagnósticos...</p>
        </div>
      ) : (
        <>
          <div className="card mb-6">
            <h2 className="font-bold mb-4">Configuración del Entorno</h2>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">URL:</span> {results.environment?.url || 'No configurada'}
              </div>
              <div>
                <span className="font-medium">Anon Key:</span> {results.environment?.hasAnonKey ? '✓ Configurada' : '✗ Falta'}
              </div>
              <div>
                <span className="font-medium">App URL:</span> {results.environment?.appUrl || 'No configurada'}
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            {results.tests?.map((test: any, index: number) => (
              <div 
                key={index} 
                className={`card ${test.status === 'success' ? 'bg-green-50' : 'bg-red-50'}`}
              >
                <h3 className="font-bold flex items-center gap-2">
                  {test.status === 'success' ? '✓' : '✗'} {test.name}
                </h3>
                {test.error && (
                  <p className="text-red-700 mt-2">Error: {test.error}</p>
                )}
                <pre className="text-xs mt-2 bg-gray-100 p-2 rounded overflow-auto">
                  {JSON.stringify(test, null, 2)}
                </pre>
              </div>
            ))}
          </div>

          {getSolution() && (
            <div className="card bg-blue-50">
              <h3 className="font-bold text-blue-800 mb-3">{getSolution()?.title}</h3>
              <ul className="space-y-1">
                {getSolution()?.steps.map((step, index) => (
                  <li key={index} className="text-sm text-blue-700">{step}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6">
            <button
              onClick={runDiagnostics}
              className="btn-primary"
            >
              Ejecutar Diagnósticos Nuevamente
            </button>
          </div>
        </>
      )}
    </div>
  )
}