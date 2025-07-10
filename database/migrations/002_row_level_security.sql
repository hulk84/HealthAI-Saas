-- Enable Row Level Security for all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainer_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nutritionist_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chef_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.psychologist_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_plans ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Trainer assessments policies
CREATE POLICY "Users can view own trainer assessment" ON public.trainer_assessments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trainer assessment" ON public.trainer_assessments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trainer assessment" ON public.trainer_assessments
    FOR UPDATE USING (auth.uid() = user_id);

-- Nutritionist assessments policies
CREATE POLICY "Users can view own nutritionist assessment" ON public.nutritionist_assessments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own nutritionist assessment" ON public.nutritionist_assessments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own nutritionist assessment" ON public.nutritionist_assessments
    FOR UPDATE USING (auth.uid() = user_id);

-- Chef preferences policies
CREATE POLICY "Users can view own chef preferences" ON public.chef_preferences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chef preferences" ON public.chef_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chef preferences" ON public.chef_preferences
    FOR UPDATE USING (auth.uid() = user_id);

-- Psychologist assessments policies
CREATE POLICY "Users can view own psychologist assessment" ON public.psychologist_assessments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own psychologist assessment" ON public.psychologist_assessments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own psychologist assessment" ON public.psychologist_assessments
    FOR UPDATE USING (auth.uid() = user_id);

-- Chat history policies
CREATE POLICY "Users can view own chat history" ON public.chat_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat messages" ON public.chat_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Generated plans policies
CREATE POLICY "Users can view own plans" ON public.generated_plans
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own plans" ON public.generated_plans
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own plans" ON public.generated_plans
    FOR UPDATE USING (auth.uid() = user_id);

-- Create function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (user_id, full_name)
    VALUES (new.id, new.raw_user_meta_data->>'full_name');
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();