/*
  # Fix Authentication Schema and Data Types

  1. New Tables
    - `users` table that extends auth.users
    - Proper foreign key relationships for all tables
    
  2. Schema Updates
    - Fix user_id column types from text to uuid
    - Update foreign key constraints
    - Fix RLS policies to work with uuid types
    
  3. Functions and Triggers
    - Create user profile automatically on signup
    - Update last login timestamp
    - Handle updated_at timestamps
    
  4. Security
    - Enable RLS on all tables
    - Create proper policies for data access
    - Grant necessary permissions
*/

-- First, drop all existing policies that depend on user_id columns
DROP POLICY IF EXISTS "Users can delete their own assessments" ON public.skin_assessments;
DROP POLICY IF EXISTS "Users can insert their own assessments" ON public.skin_assessments;
DROP POLICY IF EXISTS "Users can update their own assessments" ON public.skin_assessments;
DROP POLICY IF EXISTS "Users can view their own assessments" ON public.skin_assessments;

DROP POLICY IF EXISTS "Users can delete their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;

DROP POLICY IF EXISTS "Users can insert their own sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Users can update their own sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Users can view their own sessions" ON public.user_sessions;

-- Drop existing foreign key constraints
ALTER TABLE public.skin_assessments DROP CONSTRAINT IF EXISTS skin_assessments_user_id_fkey;
ALTER TABLE public.user_profiles DROP CONSTRAINT IF EXISTS user_profiles_user_id_fkey;
ALTER TABLE public.user_sessions DROP CONSTRAINT IF EXISTS user_sessions_user_id_fkey;

-- Create users table that extends auth.users
CREATE TABLE IF NOT EXISTS public.users (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Now we can safely alter the column types
-- Update skin_assessments user_id column type
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'skin_assessments' 
    AND column_name = 'user_id' 
    AND data_type = 'text'
  ) THEN
    -- Convert text user_id to uuid
    ALTER TABLE skin_assessments ALTER COLUMN user_id TYPE uuid USING user_id::uuid;
  END IF;
END $$;

-- Update user_profiles user_id column type if needed
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' 
    AND column_name = 'user_id' 
    AND data_type = 'uuid'
  ) THEN
    -- If column doesn't exist as uuid, recreate it
    ALTER TABLE user_profiles DROP COLUMN IF EXISTS user_id;
    ALTER TABLE user_profiles ADD COLUMN user_id uuid;
  END IF;
END $$;

-- Update user_sessions user_id column type if needed
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_sessions' 
    AND column_name = 'user_id' 
    AND data_type = 'uuid'
  ) THEN
    -- If column doesn't exist as uuid, recreate it
    ALTER TABLE user_sessions DROP COLUMN IF EXISTS user_id;
    ALTER TABLE user_sessions ADD COLUMN user_id uuid;
  END IF;
END $$;

-- Add foreign key constraints
ALTER TABLE public.skin_assessments 
ADD CONSTRAINT skin_assessments_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.user_profiles 
ADD CONSTRAINT user_profiles_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.user_sessions 
ADD CONSTRAINT user_sessions_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

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
EXCEPTION
  WHEN others THEN
    -- Log error but don't fail the auth process
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
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
EXCEPTION
  WHEN others THEN
    -- Log error but don't fail the process
    RAISE WARNING 'Error in update_last_login: %', SQLERRM;
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

-- Drop existing triggers if they exist and recreate
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

-- Now recreate all RLS policies with correct uuid types

-- Policies for users table
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Policies for user_profiles table
CREATE POLICY "Users can delete their own profile" ON public.user_profiles
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Policies for user_sessions table
CREATE POLICY "Users can insert their own sessions" ON public.user_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions" ON public.user_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own sessions" ON public.user_sessions
  FOR SELECT USING (auth.uid() = user_id);

-- Policies for skin_assessments table
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
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_skin_assessments_user_id ON public.skin_assessments(user_id);

-- Insert demo user data if it doesn't exist
DO $$
BEGIN
  -- This will be handled by the trigger when a user signs up
  -- No need to manually insert demo data here
END $$;