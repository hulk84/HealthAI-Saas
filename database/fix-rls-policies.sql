-- EJECUTAR ESTOS COMANDOS EN CLAUDE DESKTOP CON MCP SUPABASE
-- O en el SQL Editor de Supabase Dashboard

-- 1. Habilitar RLS en todas las tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainer_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutritionist_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE chef_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE psychologist_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_plans ENABLE ROW LEVEL SECURITY;

-- 2. Crear políticas para la tabla profiles
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- 3. Crear políticas para trainer_assessments
CREATE POLICY "Users can manage own trainer assessments" 
ON trainer_assessments FOR ALL 
USING (auth.uid() = user_id);

-- 4. Crear políticas para nutritionist_assessments
CREATE POLICY "Users can manage own nutritionist assessments" 
ON nutritionist_assessments FOR ALL 
USING (auth.uid() = user_id);

-- 5. Crear políticas para chef_preferences
CREATE POLICY "Users can manage own chef preferences" 
ON chef_preferences FOR ALL 
USING (auth.uid() = user_id);

-- 6. Crear políticas para psychologist_assessments
CREATE POLICY "Users can manage own psychologist assessments" 
ON psychologist_assessments FOR ALL 
USING (auth.uid() = user_id);

-- 7. Crear políticas para chat_history
CREATE POLICY "Users can manage own chat history" 
ON chat_history FOR ALL 
USING (auth.uid() = user_id);

-- 8. Crear políticas para generated_plans
CREATE POLICY "Users can manage own plans" 
ON generated_plans FOR ALL 
USING (auth.uid() = user_id);

-- 9. Crear función para auto-crear perfil al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, created_at)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', now())
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Crear trigger para ejecutar la función
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 11. IMPORTANTE: Política temporal para permitir lectura pública en profiles (para testing)
-- ELIMINAR EN PRODUCCIÓN
CREATE POLICY "Temporary public read for testing" 
ON profiles FOR SELECT 
USING (true);