/*
  # Create skin assessments table

  1. New Tables
    - `skin_assessments`
      - `id` (uuid, primary key)
      - `user_id` (text, references users)
      - `skin_type` (text)
      - `hydration_level` (text)
      - `assessment_answers` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `skin_assessments` table
    - Add policy for authenticated users to manage their own assessments
*/

CREATE TABLE IF NOT EXISTS skin_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  skin_type text NOT NULL,
  hydration_level text NOT NULL,
  assessment_answers jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE skin_assessments ENABLE ROW LEVEL SECURITY;

-- Create policies for skin_assessments
CREATE POLICY "Users can view their own assessments"
  ON skin_assessments
  FOR SELECT
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert their own assessments"
  ON skin_assessments
  FOR INSERT
  WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update their own assessments"
  ON skin_assessments
  FOR UPDATE
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can delete their own assessments"
  ON skin_assessments
  FOR DELETE
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_skin_assessments_updated_at
  BEFORE UPDATE ON skin_assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();