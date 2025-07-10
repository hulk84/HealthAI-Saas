# Instrucciones para Claude Desktop - HealthAI SaaS

## Información del Proyecto
- **Nombre**: HealthAI SaaS
- **Descripción**: Sistema integral de salud con IA
- **Usuario GitHub**: hulk84
- **Repositorio**: https://github.com/hulk84/healthai-saas

## Comandos Rápidos

### Despliegue Automático
```bash
./deploy.sh
```

### Desarrollo Local
```bash
npm run dev
```

### Git Push
```bash
git add .
git commit -m "tu mensaje de commit"
git push origin main
```

### Actualizar Vercel
El push a GitHub actualiza automáticamente Vercel.

## Variables de Entorno Necesarias
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Estructura del Proyecto
```
/
├── src/app/          # Páginas y rutas
├── src/components/   # Componentes React
├── src/lib/         # Utilidades y configuraciones
├── src/types/       # TypeScript types
├── database/        # Migraciones SQL
└── public/          # Assets estáticos
```

## Tareas Pendientes
1. Implementar páginas de autenticación (login/registro)
2. Crear flujo de onboarding
3. Desarrollar dashboard principal
4. Integrar chat con agentes IA
5. Implementar sistema de planes personalizados

## Notas de Desarrollo
- Framework: Next.js 14 con App Router
- Base de datos: Supabase (PostgreSQL)
- Estilos: Tailwind CSS
- Despliegue: Vercel
- Los 4 agentes IA: Entrenador, Nutricionista, Chef, Psicólogo