'use client'

import { useState } from 'react'

export default function VerifyUsersPage() {
  const [users, setUsers] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const checkUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/verify-users')
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Error:', error)
    }
    setLoading(false)
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Verificar Usuarios en Base de Datos</h1>
      
      <button
        onClick={checkUsers}
        disabled={loading}
        className="btn-primary mb-6"
      >
        {loading ? 'Verificando...' : 'Verificar Usuarios'}
      </button>

      {users && (
        <div className="space-y-4">
          <div className="card">
            <h2 className="font-bold mb-2">Usuarios en auth.users:</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(users.authUsers, null, 2)}
            </pre>
          </div>

          <div className="card">
            <h2 className="font-bold mb-2">Perfiles en public.profiles:</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(users.profiles, null, 2)}
            </pre>
          </div>

          <div className="card bg-blue-50">
            <h3 className="font-bold text-blue-800">Resumen:</h3>
            <p>Total usuarios: {users.authUsers?.length || 0}</p>
            <p>Total perfiles: {users.profiles?.length || 0}</p>
          </div>
        </div>
      )}
    </div>
  )
}