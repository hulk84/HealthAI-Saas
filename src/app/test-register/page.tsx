'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TestRegisterPage() {
  const [email, setEmail] = useState('test@example.com')
  const [password, setPassword] = useState('123456')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testSignUp = async () => {
    setLoading(true)
    setResult(null)
    
    try {
      const supabase = createClient()
      
      // Primero, intentar obtener la sesión actual
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      console.log('Session check:', { sessionData, sessionError })
      
      // Intentar registro
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: 'Test User'
          }
        }
      })
      
      setResult({
        success: !error,
        data: data,
        error: error,
        timestamp: new Date().toISOString()
      })
      
      console.log('SignUp result:', { data, error })
      
    } catch (err: any) {
      setResult({
        success: false,
        error: { message: err.message, stack: err.stack },
        timestamp: new Date().toISOString()
      })
    }
    
    setLoading(false)
  }

  const testSignIn = async () => {
    setLoading(true)
    setResult(null)
    
    try {
      const supabase = createClient()
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      setResult({
        success: !error,
        data: data,
        error: error,
        timestamp: new Date().toISOString()
      })
      
    } catch (err: any) {
      setResult({
        success: false,
        error: { message: err.message },
        timestamp: new Date().toISOString()
      })
    }
    
    setLoading(false)
  }

  const testDirect = async () => {
    setLoading(true)
    setResult(null)
    
    try {
      const response = await fetch('https://fulxozhozkeovsdvwjbl.supabase.co/auth/v1/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        },
        body: JSON.stringify({
          email,
          password
        })
      })
      
      const data = await response.json()
      
      setResult({
        success: response.ok,
        status: response.status,
        data: data,
        timestamp: new Date().toISOString()
      })
      
    } catch (err: any) {
      setResult({
        success: false,
        error: { message: err.message },
        timestamp: new Date().toISOString()
      })
    }
    
    setLoading(false)
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Test de Registro Detallado</h1>
      
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-primary"
          />
        </div>
      </div>
      
      <div className="flex gap-4 mb-6">
        <button 
          onClick={testSignUp}
          disabled={loading}
          className="btn-primary"
        >
          Test Sign Up (Cliente)
        </button>
        
        <button 
          onClick={testSignIn}
          disabled={loading}
          className="btn-secondary"
        >
          Test Sign In
        </button>
        
        <button 
          onClick={testDirect}
          disabled={loading}
          className="btn-secondary"
        >
          Test Direct API
        </button>
      </div>
      
      {result && (
        <div className="card">
          <h2 className="font-bold mb-2">Resultado:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
      
      <div className="mt-6 text-sm text-gray-600">
        <p>Abre la consola del navegador (F12) para ver logs adicionales</p>
      </div>
    </div>
  )
}