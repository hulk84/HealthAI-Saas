-- SOLUCIÓN FINAL - EJECUTAR EN ORDEN

-- 1. Verificar que la tabla profiles existe
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles'
);

-- 2. Si RLS está causando problemas, deshabilitarlo temporalmente
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 3. Dar permisos completos al rol anon
GRANT ALL ON TABLE public.profiles TO anon;
GRANT ALL ON TABLE public.profiles TO authenticated;

-- 4. Crear una entrada de prueba
INSERT INTO profiles (id, email, created_at) 
VALUES ('00000000-0000-0000-0000-000000000000', 'test@test.com', NOW())
ON CONFLICT (id) DO NOTHING;

-- 5. Verificar que se puede leer
SELECT * FROM profiles LIMIT 1;