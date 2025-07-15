/*
  # Add Lifestyle Assessment Data to User Profiles

  This migration adds fields to store lifestyle assessment data in user profiles:
  - Daily water intake
  - Sun exposure time
  - Current skincare routine steps
  - Preferred routine length
  - Known allergies
  - Side effects with ingredients
  - Skin type and hydration level from assessment

  ## Fields Added:
  - daily_water_intake (text)
  - sun_exposure (text)
  - current_skincare_steps (text)
  - comfortable_routine_length (text)
  - known_allergies (text)
  - side_effects_ingredients (text)
  - skin_type (text)
  - hydration_level (text)
*/

-- Add lifestyle assessment fields to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS daily_water_intake text,
ADD COLUMN IF NOT EXISTS sun_exposure text,
ADD COLUMN IF NOT EXISTS current_skincare_steps text,
ADD COLUMN IF NOT EXISTS comfortable_routine_length text,
ADD COLUMN IF NOT EXISTS known_allergies text,
ADD COLUMN IF NOT EXISTS side_effects_ingredients text,
ADD COLUMN IF NOT EXISTS skin_type text,
ADD COLUMN IF NOT EXISTS hydration_level text;

-- Create indexes for better performance on frequently queried fields
CREATE INDEX IF NOT EXISTS idx_user_profiles_skin_type ON public.user_profiles(skin_type);
CREATE INDEX IF NOT EXISTS idx_user_profiles_hydration_level ON public.user_profiles(hydration_level);