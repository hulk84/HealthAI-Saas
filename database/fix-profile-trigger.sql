-- Drop the existing trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop the existing function
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create improved function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    -- Create profile with user_id and try to get full_name from metadata
    INSERT INTO public.profiles (user_id, full_name)
    VALUES (
        new.id, 
        COALESCE(
            new.raw_user_meta_data->>'full_name',
            new.raw_user_meta_data->>'name',
            split_part(new.email, '@', 1) -- Use email prefix as fallback
        )
    )
    ON CONFLICT (user_id) DO NOTHING; -- Don't fail if profile already exists
    
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update existing profiles that have NULL full_name
UPDATE public.profiles 
SET full_name = split_part(
    (SELECT email FROM auth.users WHERE id = profiles.user_id), 
    '@', 
    1
)
WHERE full_name IS NULL OR full_name = '';

-- Add a comment to document the trigger
COMMENT ON FUNCTION public.handle_new_user() IS 
'Creates a profile entry for new users with fallback logic for full_name';