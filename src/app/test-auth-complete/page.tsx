'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TestAuthCompletePage() {
  const [results, setResults] = useState<any>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check environment variables immediately
    const envCheck = {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET',
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      anonKeyPrefix: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 30) || 'NOT SET',
      timestamp: new Date().toISOString()
    }
    setResults(prev => ({ ...prev, envCheck }))
  }, [])

  const testSupabaseClient = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      
      // Test 1: Check if we can get a session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      
      // Test 2: Check auth settings
      const authSettings = {
        sessionCheck: {
          hasSession: !!sessionData?.session,
          error: sessionError?.message || null
        }
      }

      // Test 3: Try to get auth URL (this should work even without valid auth)
      const { data: { url }, error: urlError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'https://example.com'
        }
      })

      authSettings['oauthTest'] = {
        gotUrl: !!url,
        error: urlError?.message || null
      }

      setResults(prev => ({ 
        ...prev, 
        supabaseClient: authSettings,
        timestamp: new Date().toISOString()
      }))
    } catch (error: any) {
      setResults(prev => ({ 
        ...prev, 
        supabaseClient: { error: error.message }
      }))
    }
    setLoading(false)
  }

  const testDirectAPI = async () => {
    setLoading(true)
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!url || !key) {
        setResults(prev => ({ ...prev, directAPI: { error: 'Missing environment variables' } }))
        setLoading(false)
        return
      }

      // Test different endpoints
      const tests = []

      // 1. Test REST API
      const restResponse = await fetch(`${url}/rest/v1/`, {
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`
        }
      })
      tests.push({
        endpoint: '/rest/v1/',
        status: restResponse.status,
        statusText: restResponse.statusText
      })

      // 2. Test Auth Health
      const authHealthResponse = await fetch(`${url}/auth/v1/health`, {
        headers: {
          'apikey': key
        }
      })
      tests.push({
        endpoint: '/auth/v1/health',
        status: authHealthResponse.status,
        statusText: authHealthResponse.statusText
      })

      // 3. Test Auth Settings
      const authSettingsResponse = await fetch(`${url}/auth/v1/settings`, {
        headers: {
          'apikey': key
        }
      })
      
      let authSettings = null
      if (authSettingsResponse.ok) {
        authSettings = await authSettingsResponse.json()
      }
      
      tests.push({
        endpoint: '/auth/v1/settings',
        status: authSettingsResponse.status,
        statusText: authSettingsResponse.statusText,
        data: authSettings
      })

      setResults(prev => ({ 
        ...prev, 
        directAPI: { tests },
        timestamp: new Date().toISOString()
      }))
    } catch (error: any) {
      setResults(prev => ({ 
        ...prev, 
        directAPI: { error: error.message }
      }))
    }
    setLoading(false)
  }

  const testRegistration = async () => {
    setLoading(true)
    try {
      const email = `test${Date.now()}@example.com`
      const password = 'testpassword123'

      // Test using Supabase client
      const supabase = createClient()
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })

      const registrationResult = {
        email,
        success: !error,
        error: error?.message || null,
        errorDetails: error,
        user: data?.user ? {
          id: data.user.id,
          email: data.user.email,
          confirmed: data.user.confirmed_at ? true : false
        } : null
      }

      setResults(prev => ({ 
        ...prev, 
        registration: registrationResult,
        timestamp: new Date().toISOString()
      }))
    } catch (error: any) {
      setResults(prev => ({ 
        ...prev, 
        registration: { error: error.message, stack: error.stack }
      }))
    }
    setLoading(false)
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Complete Authentication Test</h1>
      
      <div className="grid gap-4 mb-6">
        <button 
          onClick={testSupabaseClient}
          disabled={loading}
          className="btn-primary"
        >
          Test Supabase Client
        </button>
        
        <button 
          onClick={testDirectAPI}
          disabled={loading}
          className="btn-secondary"
        >
          Test Direct API Calls
        </button>
        
        <button 
          onClick={testRegistration}
          disabled={loading}
          className="btn-secondary"
        >
          Test User Registration
        </button>
      </div>

      <div className="space-y-6">
        {Object.entries(results).map(([key, value]) => (
          <div key={key} className="card">
            <h2 className="font-bold text-lg mb-2 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(value, null, 2)}
            </pre>
          </div>
        ))}
      </div>

      <div className="mt-8 card bg-blue-50">
        <h3 className="font-bold mb-2">Debug Information</h3>
        <ul className="text-sm space-y-1">
          <li>• Check browser console (F12) for additional logs</li>
          <li>• Environment variables are loaded at build time</li>
          <li>• Auth errors might be due to:</li>
          <li className="ml-4">- Incorrect API keys</li>
          <li className="ml-4">- Auth not enabled in Supabase</li>
          <li className="ml-4">- RLS policies blocking access</li>
          <li className="ml-4">- CORS issues (check browser console)</li>
        </ul>
      </div>
    </div>
  )
}