'use client'

import { useState } from 'react'

export default function FixSupabasePage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const fixAuth = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/fix-supabase-auth')
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Error:', error)
      setResult({ error: 'Error al ejecutar fix' })
    }
    setLoading(false)
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Fix Supabase Auth</h1>
      
      <div className="card mb-6 bg-yellow-50">
        <h2 className="font-bold text-yellow-800 mb-2">⚠️ Problema Detectado</h2>
        <p className="text-yellow-700">
          El error "Invalid API key" es un bug conocido de Supabase cuando se usa con Next.js.
        </p>
      </div>

      <button
        onClick={fixAuth}
        disabled={loading}
        className="btn-primary mb-6"
      >
        {loading ? 'Ejecutando fix...' : 'Ejecutar Fix de Autenticación'}
      </button>

      {result && (
        <div className="card">
          <h2 className="font-bold mb-2">Resultado:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-6 card bg-blue-50">
        <h3 className="font-bold text-blue-800 mb-2">Solución Manual:</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700">
          <li>Ve a tu dashboard de Supabase</li>
          <li>Settings → API</li>
          <li>Copia de nuevo el "anon public" key</li>
          <li>Settings → Authentication → Providers</li>
          <li>Asegúrate que "Email" esté habilitado</li>
          <li>Desactiva "Confirm email" temporalmente</li>
          <li>Actualiza las variables de entorno</li>
        </ol>
      </div>
    </div>
  )
}