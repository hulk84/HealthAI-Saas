-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    full_name TEXT,
    age INTEGER CHECK (age > 0 AND age < 150),
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id)
);

-- Create trainer_assessments table
CREATE TABLE IF NOT EXISTS public.trainer_assessments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE NOT NULL,
    fitness_level TEXT NOT NULL CHECK (fitness_level IN ('beginner', 'intermediate', 'advanced')),
    injuries JSONB DEFAULT '[]'::jsonb,
    goals JSONB NOT NULL DEFAULT '[]'::jsonb,
    equipment JSONB NOT NULL DEFAULT '[]'::jsonb,
    availability JSONB NOT NULL DEFAULT '{}'::jsonb,
    preferences JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id)
);

-- Create nutritionist_assessments table
CREATE TABLE IF NOT EXISTS public.nutritionist_assessments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE NOT NULL,
    weight DECIMAL(5,2) NOT NULL CHECK (weight > 0),
    height DECIMAL(5,2) NOT NULL CHECK (height > 0),
    activity_level TEXT NOT NULL CHECK (activity_level IN ('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active')),
    allergies JSONB DEFAULT '[]'::jsonb,
    dietary_restrictions JSONB DEFAULT '[]'::jsonb,
    caloric_needs INTEGER,
    macro_distribution JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id)
);

-- Create chef_preferences table
CREATE TABLE IF NOT EXISTS public.chef_preferences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE NOT NULL,
    cooking_level TEXT NOT NULL CHECK (cooking_level IN ('beginner', 'intermediate', 'advanced')),
    time_available TEXT NOT NULL CHECK (time_available IN ('15min', '30min', '45min', '60min+')),
    cooking_methods JSONB NOT NULL DEFAULT '[]'::jsonb,
    kitchen_tools JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id)
);

-- Create psychologist_assessments table
CREATE TABLE IF NOT EXISTS public.psychologist_assessments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE NOT NULL,
    stress_level INTEGER NOT NULL CHECK (stress_level >= 1 AND stress_level <= 10),
    motivations JSONB NOT NULL DEFAULT '[]'::jsonb,
    barriers JSONB NOT NULL DEFAULT '[]'::jsonb,
    learning_style TEXT NOT NULL CHECK (learning_style IN ('visual', 'auditory', 'kinesthetic', 'reading')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id)
);

-- Create chat_history table
CREATE TABLE IF NOT EXISTS public.chat_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE NOT NULL,
    agent_type TEXT NOT NULL CHECK (agent_type IN ('trainer', 'nutritionist', 'chef', 'psychologist')),
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    model_used TEXT,
    tokens_used INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create generated_plans table
CREATE TABLE IF NOT EXISTS public.generated_plans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE NOT NULL,
    plan_type TEXT NOT NULL CHECK (plan_type IN ('workout', 'meal', 'recipe', 'wellness')),
    content JSONB NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    expires_at TIMESTAMPTZ
);

-- Create indexes for better performance
CREATE INDEX idx_chat_history_user_id ON public.chat_history(user_id);
CREATE INDEX idx_chat_history_agent_type ON public.chat_history(agent_type);
CREATE INDEX idx_chat_history_created_at ON public.chat_history(created_at DESC);
CREATE INDEX idx_generated_plans_user_id ON public.generated_plans(user_id);
CREATE INDEX idx_generated_plans_active ON public.generated_plans(active);
CREATE INDEX idx_generated_plans_plan_type ON public.generated_plans(plan_type);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trainer_assessments_updated_at BEFORE UPDATE ON public.trainer_assessments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_nutritionist_assessments_updated_at BEFORE UPDATE ON public.nutritionist_assessments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chef_preferences_updated_at BEFORE UPDATE ON public.chef_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_psychologist_assessments_updated_at BEFORE UPDATE ON public.psychologist_assessments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();