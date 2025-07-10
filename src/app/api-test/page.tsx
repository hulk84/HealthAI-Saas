'use client'

export default function ApiTestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test de Variables de Entorno</h1>
      <div className="space-y-2">
        <p><strong>SUPABASE_URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL || 'NO DEFINIDA'}</p>
        <p><strong>SUPABASE_ANON_KEY:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Definida' : '❌ NO DEFINIDA'}</p>
        <p className="text-sm text-gray-600 mt-4">
          URL esperada: https://fulxozhozkeovsdvwjbl.supabase.co
        </p>
      </div>
    </div>
  )
}