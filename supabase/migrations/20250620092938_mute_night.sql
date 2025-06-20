/*
  # Fix Authentication Schema

  This migration creates the missing database schema required for the authentication system to work properly.

  ## What this fixes:
  1. Creates the missing `users` table that references auth.users
  2. Creates proper triggers for user profile creation
  3. Fixes the user_profiles table structure
  4. Adds proper RLS policies
  5. Creates necessary functions

  ## Tables:
  - `users` - References auth.users for additional user data
  - Updates to `user_profiles` table
  - Updates to `user_sessions` table

  ## Security:
  - Enables RLS on all tables
  - Creates policies for authenticated users
*/

-- Create users table that extends auth.users
CREATE TABLE IF NOT EXISTS public.users (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Update user_profiles table to ensure proper structure
DO $$
BEGIN
  -- Check if user_id column exists and has correct type
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' 
    AND column_name = 'user_id' 
    AND data_type = 'uuid'
  ) THEN
    -- Drop and recreate the column with correct type
    ALTER TABLE user_profiles DROP COLUMN IF EXISTS user_id;
    ALTER TABLE user_profiles ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Ensure user_profiles has proper foreign key constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'user_profiles' 
    AND constraint_name = 'user_profiles_user_id_fkey'
  ) THEN
    ALTER TABLE user_profiles 
    ADD CONSTRAINT user_profiles_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Update user_sessions table to ensure proper structure
DO $$
BEGIN
  -- Check if user_id column exists and has correct type
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_sessions' 
    AND column_name = 'user_id' 
    AND data_type = 'uuid'
  ) THEN
    -- Drop and recreate the column with correct type
    ALTER TABLE user_sessions DROP COLUMN IF EXISTS user_id;
    ALTER TABLE user_sessions ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Ensure user_sessions has proper foreign key constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'user_sessions' 
    AND constraint_name = 'user_sessions_user_id_fkey'
  ) THEN
    ALTER TABLE user_sessions 
    ADD CONSTRAINT user_sessions_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Update skin_assessments table to use proper user_id type
DO $$
BEGIN
  -- Check if user_id column exists and has correct type
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'skin_assessments' 
    AND column_name = 'user_id' 
    AND data_type = 'text'
  ) THEN
    -- Convert text user_id to uuid
    ALTER TABLE skin_assessments ALTER COLUMN user_id TYPE uuid USING user_id::uuid;
    
    -- Add foreign key constraint if it doesn't exist
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE table_name = 'skin_assessments' 
      AND constraint_name = 'skin_assessments_user_id_fkey'
    ) THEN
      ALTER TABLE skin_assessments 
      ADD CONSTRAINT skin_assessments_user_id_fkey 
      FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
  END IF;
END $$;

-- Create or replace the handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Insert into public.users table
  INSERT INTO public.users (id, email, name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  );

  -- Insert into user_profiles table
  INSERT INTO public.user_profiles (
    user_id,
    email,
    full_name,
    username
  )
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  );

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create or replace the update_last_login function
CREATE OR REPLACE FUNCTION public.update_last_login()
RETURNS trigger AS $$
BEGIN
  UPDATE public.user_profiles
  SET last_login = now()
  WHERE user_id = new.user_id;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create or replace the update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Ensure triggers exist on user_profiles
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Ensure triggers exist on user_sessions
DROP TRIGGER IF EXISTS on_session_created ON public.user_sessions;
CREATE TRIGGER on_session_created
  AFTER INSERT ON public.user_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_last_login();

DROP TRIGGER IF EXISTS update_skin_assessments_updated_at ON public.skin_assessments;
CREATE TRIGGER update_skin_assessments_updated_at
  BEFORE UPDATE ON public.skin_assessments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Update RLS policies for skin_assessments to use uuid
DROP POLICY IF EXISTS "Users can delete their own assessments" ON public.skin_assessments;
DROP POLICY IF EXISTS "Users can insert their own assessments" ON public.skin_assessments;
DROP POLICY IF EXISTS "Users can update their own assessments" ON public.skin_assessments;
DROP POLICY IF EXISTS "Users can view their own assessments" ON public.skin_assessments;

CREATE POLICY "Users can delete their own assessments" ON public.skin_assessments
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own assessments" ON public.skin_assessments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assessments" ON public.skin_assessments
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own assessments" ON public.skin_assessments
  FOR SELECT USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_skin_assessments_user_id ON public.skin_assessments(user_id);