/*
  # Fix Database Schema and RLS Policies for Skincare Assessment
  
  This migration addresses the critical issues identified in testing:
  1. Ensures all required lifestyle assessment fields exist in user_profiles table
  2. Fixes RLS policies for skin_assessments table
  3. Grants proper permissions for assessment flow
  
  ## Issues Fixed:
  - Missing 'comfortable_routine_length' column error
  - RLS policy violations for skin_assessments table
  - Proper data insertion and retrieval permissions
  
  ## Security:
  - Updated RLS policies to allow authenticated users to manage their own data
  - Proper permissions for assessment workflow
*/

-- First, ensure all required columns exist in user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS daily_water_intake text,
ADD COLUMN IF NOT EXISTS sun_exposure text,
ADD COLUMN IF NOT EXISTS current_skincare_steps text,
ADD COLUMN IF NOT EXISTS comfortable_routine_length text,
ADD COLUMN IF NOT EXISTS known_allergies text,
ADD COLUMN IF NOT EXISTS side_effects_ingredients text,
ADD COLUMN IF NOT EXISTS skin_type text,
ADD COLUMN IF NOT EXISTS hydration_level text,
ADD COLUMN IF NOT EXISTS sleep_pattern text,
ADD COLUMN IF NOT EXISTS work_hours text,
ADD COLUMN IF NOT EXISTS food_preference text,
ADD COLUMN IF NOT EXISTS meal_type text;

-- Create the skin_assessments table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.skin_assessments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    skin_type text NOT NULL,
    hydration_level text NOT NULL,
    assessment_answers jsonb NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create the user_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    username text,
    email text,
    full_name text,
    avatar_url text,
    bio text,
    preferences jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL,
    last_login timestamptz,
    daily_water_intake text,
    sun_exposure text,
    current_skincare_steps text,
    comfortable_routine_length text,
    known_allergies text,
    side_effects_ingredients text,
    skin_type text,
    hydration_level text,
    sleep_pattern text,
    work_hours text,
    food_preference text,
    meal_type text
);

-- Enable RLS on both tables
ALTER TABLE public.skin_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can insert their own assessments" ON public.skin_assessments;
DROP POLICY IF EXISTS "Users can update their own assessments" ON public.skin_assessments;
DROP POLICY IF EXISTS "Users can view their own assessments" ON public.skin_assessments;
DROP POLICY IF EXISTS "Users can delete their own assessments" ON public.skin_assessments;

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.user_profiles;

-- Create comprehensive RLS policies for skin_assessments
CREATE POLICY "Users can manage their own assessments" ON public.skin_assessments
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Create comprehensive RLS policies for user_profiles
CREATE POLICY "Users can manage their own profile" ON public.user_profiles
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Grant necessary permissions
GRANT ALL ON public.skin_assessments TO authenticated;
GRANT ALL ON public.user_profiles TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

-- Create function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, email, full_name, username)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'username'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_skin_assessments_user_id ON public.skin_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_skin_assessments_created_at ON public.skin_assessments(created_at);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_skin_type ON public.user_profiles(skin_type);
CREATE INDEX IF NOT EXISTS idx_user_profiles_hydration_level ON public.user_profiles(hydration_level);

-- Update function to handle profile updates
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic updated_at timestamps
DROP TRIGGER IF EXISTS update_skin_assessments_updated_at ON public.skin_assessments;
CREATE TRIGGER update_skin_assessments_updated_at
    BEFORE UPDATE ON public.skin_assessments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();