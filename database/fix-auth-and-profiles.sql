-- 1. Primero, eliminamos el trigger existente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. Creamos una función mejorada que maneja correctamente el full_name
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    -- Insertar el perfil con el full_name de los metadatos
    INSERT INTO public.profiles (user_id, full_name)
    VALUES (
        new.id,
        COALESCE(
            new.raw_user_meta_data->>'full_name',
            new.raw_user_meta_data->>'name',
            NULL -- No usar el email como fallback
        )
    )
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        full_name = COALESCE(
            EXCLUDED.full_name, 
            public.profiles.full_name
        );
    
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Recrear el trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Actualizar los nombres de los usuarios existentes que tienen nombres raros
-- Solo actualizamos los que parecen ser generados automáticamente
UPDATE public.profiles 
SET full_name = CASE 
    WHEN full_name LIKE 'test%' AND length(full_name) > 10 THEN NULL
    ELSE full_name
END
WHERE full_name LIKE 'test%';

-- 5. Para el usuario test2, vamos a ponerle un nombre más apropiado
UPDATE public.profiles 
SET full_name = 'Usuario de Prueba'
WHERE user_id IN (
    SELECT id FROM auth.users WHERE email = 'test2@example.com'
);

-- 6. Asegurarnos de que las políticas RLS estén configuradas correctamente
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios puedan ver su propio perfil
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = user_id);

-- Política para que los usuarios puedan actualizar su propio perfil
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Política para permitir inserts desde el trigger
CREATE POLICY "Enable insert for authentication" ON public.profiles
    FOR INSERT WITH CHECK (true);

-- 7. Grant permisos necesarios
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;

-- 8. Verificar que todo está correcto
SELECT 
    p.user_id,
    p.full_name,
    u.email,
    u.created_at
FROM public.profiles p
JOIN auth.users u ON u.id = p.user_id
ORDER BY u.created_at DESC
LIMIT 10;