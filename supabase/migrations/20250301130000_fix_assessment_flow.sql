/*
  # Fix Database Schema Issues for Assessment Flow
  
  This migration addresses the issues identified in testing:
  1. Ensures all lifestyle assessment fields exist in user_profiles table
  2. Fixes RLS policies for skin_assessments table
  3. Adds proper permissions for assessment flow
  
  ## Tables Updated:
  - user_profiles: Add missing lifestyle fields
  - skin_assessments: Fix RLS policies
  
  ## Security:
  - Update RLS policies to allow proper data insertion
  - Grant necessary permissions for assessment flow
*/

-- Ensure all lifestyle assessment fields exist in user_profiles table
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

-- Update RLS policies for skin_assessments to allow proper insertion
DROP POLICY IF EXISTS "Users can insert their own assessments" ON public.skin_assessments;
DROP POLICY IF EXISTS "Users can update their own assessments" ON public.skin_assessments;
DROP POLICY IF EXISTS "Users can view their own assessments" ON public.skin_assessments;
DROP POLICY IF EXISTS "Users can delete their own assessments" ON public.skin_assessments;

-- Create new RLS policies for skin_assessments
CREATE POLICY "Users can insert their own assessments" ON public.skin_assessments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assessments" ON public.skin_assessments
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own assessments" ON public.skin_assessments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own assessments" ON public.skin_assessments
  FOR DELETE USING (auth.uid() = user_id);

-- Update RLS policies for user_profiles to allow proper updates
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
CREATE POLICY "Users can update their own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Grant necessary permissions for assessment flow
GRANT ALL ON public.skin_assessments TO authenticated;
GRANT ALL ON public.user_profiles TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Create indexes for better performance on new fields
CREATE INDEX IF NOT EXISTS idx_user_profiles_skin_type ON public.user_profiles(skin_type);
CREATE INDEX IF NOT EXISTS idx_user_profiles_hydration_level ON public.user_profiles(hydration_level);
CREATE INDEX IF NOT EXISTS idx_user_profiles_daily_water_intake ON public.user_profiles(daily_water_intake);
CREATE INDEX IF NOT EXISTS idx_user_profiles_sun_exposure ON public.user_profiles(sun_exposure);

-- Ensure the assessment flow works by allowing all necessary operations
ALTER TABLE public.skin_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;