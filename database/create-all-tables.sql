-- CREAR TODAS LAS TABLAS NECESARIAS

-- 1. Crear tabla profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Crear tabla trainer_assessments
CREATE TABLE IF NOT EXISTS public.trainer_assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  fitness_level TEXT CHECK (fitness_level IN ('beginner', 'intermediate', 'advanced')),
  goals TEXT[],
  available_equipment TEXT[],
  workout_frequency INTEGER,
  injuries TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Crear tabla nutritionist_assessments
CREATE TABLE IF NOT EXISTS public.nutritionist_assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  dietary_restrictions TEXT[],
  allergies TEXT[],
  health_conditions TEXT[],
  weight_goal TEXT CHECK (weight_goal IN ('lose', 'maintain', 'gain')),
  target_calories INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Crear tabla chef_preferences
CREATE TABLE IF NOT EXISTS public.chef_preferences (
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

-- 5. Crear tabla psychologist_assessments
CREATE TABLE IF NOT EXISTS public.psychologist_assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 10),
  motivation_level INTEGER CHECK (motivation_level >= 1 AND motivation_level <= 10),
  main_challenges TEXT[],
  support_needed TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Crear tabla chat_history
CREATE TABLE IF NOT EXISTS public.chat_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  agent_type TEXT CHECK (agent_type IN ('trainer', 'nutritionist', 'chef', 'psychologist')) NOT NULL,
  message TEXT NOT NULL,
  is_user BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Crear tabla generated_plans
CREATE TABLE IF NOT EXISTS public.generated_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  plan_type TEXT CHECK (plan_type IN ('workout', 'meal', 'recipe', 'motivation')) NOT NULL,
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Deshabilitar RLS temporalmente para testing
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE trainer_assessments DISABLE ROW LEVEL SECURITY;
ALTER TABLE nutritionist_assessments DISABLE ROW LEVEL SECURITY;
ALTER TABLE chef_preferences DISABLE ROW LEVEL SECURITY;
ALTER TABLE psychologist_assessments DISABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE generated_plans DISABLE ROW LEVEL SECURITY;

-- 9. Dar permisos
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;

-- 10. Verificar que las tablas se crearon
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;