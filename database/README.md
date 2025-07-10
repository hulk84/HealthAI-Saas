# Base de Datos - HealthAI

## 📋 Estructura

La base de datos está diseñada en PostgreSQL (Supabase) con las siguientes tablas:

### Tablas principales

1. **profiles** - Información básica del usuario
2. **trainer_assessments** - Evaluación del entrenador personal
3. **nutritionist_assessments** - Evaluación del nutricionista
4. **chef_preferences** - Preferencias del cocinero
5. **psychologist_assessments** - Evaluación del psicólogo
6. **chat_history** - Historial de conversaciones
7. **generated_plans** - Planes generados (rutinas, dietas, recetas)

## 🔐 Seguridad

- Row Level Security (RLS) habilitado en todas las tablas
- Los usuarios solo pueden acceder a sus propios datos
- Trigger automático para crear perfil al registrarse

## 🚀 Configuración en Supabase

1. Crea un nuevo proyecto en [Supabase](https://supabase.com)

2. Ve a SQL Editor y ejecuta las migraciones en orden:
   - `001_initial_schema.sql`
   - `002_row_level_security.sql`

3. Configura la autenticación:
   - Habilita Email/Password
   - Configura el email de confirmación (opcional para desarrollo)

4. Copia las credenciales:
   - Project URL
   - Anon Key

5. Añádelas a tu archivo `.env.local`

## 📊 Diagrama ER

```
users (Supabase Auth)
  │
  └─> profiles
        ├─> trainer_assessments
        ├─> nutritionist_assessments
        ├─> chef_preferences
        ├─> psychologist_assessments
        ├─> chat_history
        └─> generated_plans
```

## 🔄 Migraciones futuras

Para añadir nuevas migraciones:
1. Crea un archivo `00X_description.sql`
2. Prueba en entorno de desarrollo
3. Ejecuta en producción

## 💡 Tips

- Los campos JSONB permiten flexibilidad para arrays y objetos
- Los triggers mantienen `updated_at` actualizado automáticamente
- Los índices optimizan las consultas más comunes