# Comandos para MCP Supabase en Claude Desktop

## EJECUTAR ESTOS COMANDOS EN CLAUDE DESKTOP CON MCP SUPABASE

### 1. Primero, verifica si las tablas existen:

```
Usa el MCP de Supabase para listar todas las tablas en el schema public
```

### 2. Si NO existen las tablas, ejecuta este SQL:

```sql
-- CREAR TABLA PROFILES
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CREAR TABLA TRAINER_ASSESSMENTS
CREATE TABLE public.trainer_assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  fitness_level TEXT CHECK (fitness_level IN ('beginner', 'intermediate', 'advanced')),
  goals TEXT[],
  available_equipment TEXT[],
  workout_frequency INTEGER,
  injuries TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CREAR TABLA NUTRITIONIST_ASSESSMENTS
CREATE TABLE public.nutritionist_assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  dietary_restrictions TEXT[],
  allergies TEXT[],
  health_conditions TEXT[],
  weight_goal TEXT CHECK (weight_goal IN ('lose', 'maintain', 'gain')),
  target_calories INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CREAR TABLA CHEF_PREFERENCES
CREATE TABLE public.chef_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  cuisine_preferences TEXT[],
  cooking_skill TEXT CHECK (cooking_skill IN ('beginner', 'intermediate', 'expert')),
  cooking_time INTEGER,
  kitchen_equipment TEXT[],
  favorite_ingredients TEXT[],
  disliked_ingredients TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CREAR TABLA PSYCHOLOGIST_ASSESSMENTS
CREATE TABLE public.psychologist_assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 10),
  motivation_level INTEGER CHECK (motivation_level >= 1 AND motivation_level <= 10),
  main_challenges TEXT[],
  support_needed TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CREAR TABLA CHAT_HISTORY
CREATE TABLE public.chat_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  agent_type TEXT CHECK (agent_type IN ('trainer', 'nutritionist', 'chef', 'psychologist')) NOT NULL,
  message TEXT NOT NULL,
  is_user BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CREAR TABLA GENERATED_PLANS
CREATE TABLE public.generated_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  plan_type TEXT CHECK (plan_type IN ('workout', 'meal', 'recipe', 'motivation')) NOT NULL,
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3. Después, deshabilita RLS temporalmente:

```sql
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE trainer_assessments DISABLE ROW LEVEL SECURITY;
ALTER TABLE nutritionist_assessments DISABLE ROW LEVEL SECURITY;
ALTER TABLE chef_preferences DISABLE ROW LEVEL SECURITY;
ALTER TABLE psychologist_assessments DISABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE generated_plans DISABLE ROW LEVEL SECURITY;
```

### 4. Da permisos necesarios:

```sql
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
```

### 5. Crea el trigger para auto-crear perfiles:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 6. Finalmente, verifica que todo funcione:

```sql
-- Verifica que las tablas existen
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Inserta un registro de prueba
INSERT INTO profiles (id, email, created_at) 
VALUES ('00000000-0000-0000-0000-000000000000', 'test@test.com', NOW())
ON CONFLICT (id) DO NOTHING;

-- Verifica que se puede leer
SELECT * FROM profiles LIMIT 1;
```

## IMPORTANTE:
- Ejecuta cada bloque de comandos por separado
- Verifica que no haya errores después de cada comando
- Si algún comando falla, detente y repórtalo

## Después de ejecutar todo:
1. Ve a https://healthai-saas.vercel.app/supabase-test
2. Prueba "Conexión a Base de Datos"
3. Debería mostrar "✅ Conexión exitosa"