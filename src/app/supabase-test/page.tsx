'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function SupabaseTestPage() {
  const [result, setResult] = useState<string>('No probado')
  const [loading, setLoading] = useState(false)
  
  const testConnection = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      
      // Test 1: Verificar conexión
      const { data, error } = await supabase.from('profiles').select('count').limit(1)
      
      if (error) {
        setResult(`Error: ${error.message} (${error.code})`)
      } else {
        setResult('✅ Conexión exitosa con Supabase')
      }
    } catch (err) {
      setResult(`Error inesperado: ${err}`)
    }
    setLoading(false)
  }

  const testAuth = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      
      // Test 2: Verificar auth
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        setResult(`Error Auth: ${error.message}`)
      } else {
        setResult(`✅ Auth funcionando. Sesión: ${data.session ? 'Activa' : 'No activa'}`)
      }
    } catch (err) {
      setResult(`Error inesperado: ${err}`)
    }
    setLoading(false)
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Test de Conexión Supabase</h1>
      
      <div className="space-y-4">
        <button 
          onClick={testConnection}
          disabled={loading}
          className="btn-primary"
        >
          Probar Conexión a Base de Datos
        </button>
        
        <button 
          onClick={testAuth}
          disabled={loading}
          className="btn-secondary"
        >
          Probar Autenticación
        </button>
        
        <div className="p-4 bg-gray-100 rounded">
          <p className="font-mono text-sm">{loading ? 'Probando...' : result}</p>
        </div>
        
        <div className="text-sm text-gray-600">
          <p>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
          <p>Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20)}...</p>
        </div>
      </div>
    </div>
  )
}