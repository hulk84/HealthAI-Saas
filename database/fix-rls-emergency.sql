-- POLÍTICA DE EMERGENCIA PARA DEBUGGING
-- EJECUTAR EN SUPABASE SQL EDITOR

-- 1. Primero, eliminar todas las políticas existentes de profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Temporary public read for testing" ON profiles;

-- 2. Crear una política súper permisiva temporal
CREATE POLICY "Allow all for debugging" 
ON profiles 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- 3. Verificar que RLS esté habilitado
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 4. También para la tabla que estamos probando, crear política permisiva
-- Si tienes una tabla 'test' o similar
CREATE POLICY "Allow public select for anon" 
ON profiles 
FOR SELECT 
TO anon
USING (true);

-- 5. Verificar el rol anon tiene permisos
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;