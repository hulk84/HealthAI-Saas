# HealthAI SaaS - Sistema Integral de Salud con IA

## 🚀 Descripción

HealthAI es una plataforma SaaS que integra 4 agentes de inteligencia artificial especializados en salud:
- 💪 **Entrenador Personal**: Rutinas personalizadas y seguimiento de progreso
- 🥗 **Nutricionista**: Planes alimenticios adaptados a tus objetivos
- 👨‍🍳 **Chef**: Recetas saludables basadas en tu plan nutricional
- 🧠 **Psicólogo**: Apoyo motivacional y bienestar mental

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Estilos**: Tailwind CSS
- **Base de datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Despliegue**: Vercel (frontend) + Railway (backend/agentes)

## 📋 Configuración Inicial

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
Copia `.env.local.example` a `.env.local` y añade tus credenciales de Supabase:
```
NEXT_PUBLIC_SUPABASE_URL=tu-url-de-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima
```

### 3. Configurar Supabase
1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ejecuta las migraciones SQL en `database/migrations/`
3. Habilita la autenticación por email

### 4. Ejecutar en desarrollo
```bash
npm run dev
```

## 🗂️ Estructura del Proyecto

```
healthai-saas/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── (auth)/       # Rutas de autenticación
│   │   ├── onboarding/   # Flujo de onboarding
│   │   └── dashboard/    # Panel principal
│   ├── components/       # Componentes reutilizables
│   ├── lib/             # Utilidades y configuraciones
│   ├── types/           # TypeScript types
│   └── hooks/           # Custom hooks
├── public/              # Assets estáticos
└── database/            # Migraciones SQL
```

## 🔄 Flujo de Usuario

1. **Registro/Login**: Autenticación con Supabase
2. **Onboarding**: Evaluación completa con los 4 agentes
3. **Dashboard**: Acceso a chat y planes personalizados
4. **Interacción**: Chat en tiempo real con agentes IA

## 🚀 Despliegue

### Frontend (Vercel)
```bash
vercel deploy
```

### Backend (Railway)
- Los agentes se ejecutan como servicios en Railway
- n8n orquesta la comunicación entre frontend y agentes

## 📝 Desarrollo

### Fase 1 (Actual): MVP con Claude Code
- Los agentes se ejecutan manualmente a través de Claude Code
- Ideal para testing y validación

### Fase 2: Producción con API
- Migración a Claude API para automatización completa
- Sistema de selección inteligente de modelos (Haiku/Sonnet/Opus)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y propietario.

## 👥 Equipo

Desarrollado con ❤️ por el equipo de HealthAI