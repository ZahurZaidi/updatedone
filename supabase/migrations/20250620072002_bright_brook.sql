/*
  # Fix RLS policies for skin_assessments table

  1. Security Updates
    - Drop existing RLS policies that use complex JWT claims extraction
    - Create new RLS policies using auth.uid() function
    - Ensure authenticated users can manage their own assessment data

  2. Policy Changes
    - SELECT: Users can view their own assessments
    - INSERT: Users can insert their own assessments  
    - UPDATE: Users can update their own assessments
    - DELETE: Users can delete their own assessments
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own assessments" ON skin_assessments;
DROP POLICY IF EXISTS "Users can insert their own assessments" ON skin_assessments;
DROP POLICY IF EXISTS "Users can update their own assessments" ON skin_assessments;
DROP POLICY IF EXISTS "Users can delete their own assessments" ON skin_assessments;

-- Create new policies using auth.uid()
CREATE POLICY "Users can view their own assessments"
  ON skin_assessments
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own assessments"
  ON skin_assessments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own assessments"
  ON skin_assessments
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own assessments"
  ON skin_assessments
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id);