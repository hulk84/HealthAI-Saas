'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Activity, Brain, Heart, Utensils, LogOut, MessageSquare, Calendar } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { user, profile, loading, signOut } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">HealthAI Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Hola, {profile?.full_name || user?.email}</span>
            <button
              onClick={signOut}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <LogOut className="w-5 h-5" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Resumen de Progreso */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Tu Progreso</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Evaluación inicial</span>
                <span className="text-green-600 font-medium">Pendiente</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Plan activo</span>
                <span className="text-gray-400">No disponible</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Días activo</span>
                <span className="font-medium">0</span>
              </div>
            </div>
            <Link href="/onboarding" className="btn-primary w-full mt-6">
              Comenzar Evaluación
            </Link>
          </div>

          {/* Acceso Rápido */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Acceso Rápido</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/chat?agent=trainer" className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors">
                <Activity className="w-6 h-6 text-primary-600" />
                <span className="text-sm font-medium">Entrenador</span>
              </Link>
              <Link href="/chat?agent=nutritionist" className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors">
                <Heart className="w-6 h-6 text-primary-600" />
                <span className="text-sm font-medium">Nutricionista</span>
              </Link>
              <Link href="/chat?agent=chef" className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors">
                <Utensils className="w-6 h-6 text-primary-600" />
                <span className="text-sm font-medium">Chef</span>
              </Link>
              <Link href="/chat?agent=psychologist" className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors">
                <Brain className="w-6 h-6 text-primary-600" />
                <span className="text-sm font-medium">Psicólogo</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Actividad Reciente */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Actividad Reciente</h2>
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No hay actividad reciente</p>
            <p className="text-sm text-gray-400 mt-2">
              Comienza tu evaluación para recibir tu plan personalizado
            </p>
          </div>
        </div>

        {/* Planes */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <div className="card text-center">
            <Activity className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">Plan de Ejercicio</h3>
            <p className="text-sm text-gray-500 mt-1">No disponible</p>
          </div>
          <div className="card text-center">
            <Heart className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">Plan Nutricional</h3>
            <p className="text-sm text-gray-500 mt-1">No disponible</p>
          </div>
          <div className="card text-center">
            <Utensils className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">Recetas</h3>
            <p className="text-sm text-gray-500 mt-1">No disponible</p>
          </div>
          <div className="card text-center">
            <Brain className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">Bienestar Mental</h3>
            <p className="text-sm text-gray-500 mt-1">No disponible</p>
          </div>
        </div>
      </main>
    </div>
  )
}