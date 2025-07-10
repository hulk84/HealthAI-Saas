import Link from 'next/link'
import { ArrowRight, Brain, Heart, Utensils, Activity } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Tu salud integral con
            <span className="text-primary-600"> Inteligencia Artificial</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Entrenador personal, nutricionista, cocinero y psicólogo. 
            Todo en una plataforma diseñada para transformar tu vida.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register" className="btn-primary text-lg px-8 py-3 inline-flex items-center gap-2">
              Comenzar gratis
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/login" className="btn-secondary text-lg px-8 py-3">
              Iniciar sesión
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Un equipo completo de expertos en tu bolsillo
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Activity className="w-8 h-8 text-primary-600" />}
            title="Entrenador Personal"
            description="Rutinas personalizadas adaptadas a tu nivel, objetivos y equipamiento disponible"
          />
          <FeatureCard
            icon={<Heart className="w-8 h-8 text-primary-600" />}
            title="Nutricionista Experto"
            description="Planes alimenticios calculados para tus necesidades y objetivos específicos"
          />
          <FeatureCard
            icon={<Utensils className="w-8 h-8 text-primary-600" />}
            title="Chef Personal"
            description="Recetas deliciosas y saludables basadas en tu plan nutricional"
          />
          <FeatureCard
            icon={<Brain className="w-8 h-8 text-primary-600" />}
            title="Psicólogo Deportivo"
            description="Apoyo motivacional y estrategias para mantener hábitos saludables"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Comienza tu transformación hoy
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Únete a miles de personas que ya están mejorando su salud
          </p>
          <Link href="/register" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2">
            Empezar ahora - Es gratis
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  )
}

function FeatureCard({ icon, title, description }: { 
  icon: React.ReactNode
  title: string
  description: string 
}) {
  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}