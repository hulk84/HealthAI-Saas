'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function TestLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Test users from the database
  const testUsers = [
    { email: 'test1752224929895@example.com', name: 'test1752224929895' },
    { email: 'test1752224366571@example.com', name: 'test1752224366571' },
    { email: 'test1752223606917@example.com', name: 'test1752223606917' },
    { email: 'test2@example.com', name: 'test2' },
    { email: 'test1752224401828@example.com', name: 'test1752224401828' }
  ]

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      // Try to sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        setResult({
          success: false,
          error: error.message,
          timestamp: new Date().toISOString()
        })
      } else {
        setResult({
          success: true,
          user: {
            id: data.user?.id,
            email: data.user?.email,
            created_at: data.user?.created_at
          },
          session: {
            access_token: data.session?.access_token ? 'Present' : 'Missing',
            refresh_token: data.session?.refresh_token ? 'Present' : 'Missing'
          },
          timestamp: new Date().toISOString()
        })
        
        // Redirect after successful login
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      }
    } catch (err: any) {
      setResult({
        success: false,
        error: err.message,
        timestamp: new Date().toISOString()
      })
    }
    
    setLoading(false)
  }

  const quickFillUser = (userEmail: string) => {
    setEmail(userEmail)
    setPassword('testpassword123') // Default test password
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Test de Login</h1>
      
      <div className="card mb-6">
        <h2 className="font-bold mb-4">Usuarios de prueba existentes:</h2>
        <div className="space-y-2">
          {testUsers.map((user) => (
            <button
              key={user.email}
              onClick={() => quickFillUser(user.email)}
              className="block w-full text-left p-2 hover:bg-gray-100 rounded"
            >
              <span className="font-medium">{user.name}</span>
              <span className="text-gray-500 ml-2">({user.email})</span>
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-4">
          * Haz clic en un usuario para auto-completar el formulario
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-primary"
            placeholder="email@example.com"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-primary"
            placeholder="Tu contraseña"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>

      {result && (
        <div className={`card ${result.success ? 'bg-green-50' : 'bg-red-50'}`}>
          <h2 className="font-bold mb-2">
            {result.success ? '✓ Login exitoso' : '✗ Error en login'}
          </h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
          
          {result.success && (
            <p className="mt-4 text-green-700 font-medium">
              Redirigiendo al dashboard...
            </p>
          )}
        </div>
      )}

      <div className="mt-6 card bg-yellow-50">
        <h3 className="font-bold text-yellow-800 mb-2">Notas importantes:</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• La contraseña por defecto es: testpassword123</li>
          <li>• Si no conoces la contraseña, tendrás que resetearla</li>
          <li>• Verifica que el email coincida exactamente</li>
          <li>• Los usuarios creados con error "Invalid API key" SÍ existen</li>
        </ul>
      </div>
    </div>
  )
}