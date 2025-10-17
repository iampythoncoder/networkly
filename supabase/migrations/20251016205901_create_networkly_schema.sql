/*
  # Networkly Platform Schema

  ## Overview
  Creates the complete database schema for Networkly, a student networking and opportunities platform.

  ## New Tables

  ### 1. profiles
  Student profile information linked to auth.users
  - `id` (uuid, primary key) - References auth.users
  - `email` (text, unique, not null) - Student email
  - `full_name` (text) - Student's full name
  - `school` (text) - High school name
  - `grade_level` (text) - Grade: 9, 10, 11, or 12
  - `bio` (text) - Personal bio
  - `interests` (text array) - Array of interests
  - `achievements` (text array) - List of achievements
  - `projects` (text array) - Projects worked on
  - `skills` (text array) - Skills list
  - `resume_url` (text) - URL to uploaded resume
  - `profile_image_url` (text) - Profile picture URL
  - `location` (text) - City/State
  - `created_at` (timestamptz) - Profile creation time
  - `updated_at` (timestamptz) - Last update time

  ### 2. opportunities
  Internships, scholarships, programs, competitions
  - `id` (uuid, primary key) - Unique identifier
  - `title` (text, not null) - Opportunity name
  - `type` (text, not null) - Type: internship, scholarship, summer_program, research, competition
  - `description` (text, not null) - Full description
  - `organization` (text, not null) - Hosting organization
  - `location` (text) - Location or "Remote"
  - `deadline` (date) - Application deadline
  - `grade_levels` (text array) - Eligible grades
  - `interests` (text array) - Related interests
  - `application_url` (text) - External application link
  - `is_featured` (boolean) - Featured on homepage
  - `created_by` (uuid) - Admin who created it
  - `created_at` (timestamptz) - Creation time
  - `updated_at` (timestamptz) - Last update

  ### 3. applications
  Tracks student applications to opportunities
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, not null) - References profiles
  - `opportunity_id` (uuid, not null) - References opportunities
  - `status` (text) - Status: saved, applied, accepted, rejected
  - `notes` (text) - Personal notes
  - `applied_at` (timestamptz) - Application timestamp
  - `created_at` (timestamptz) - Record creation

  ### 4. notifications
  User notifications for deadlines and updates
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, not null) - References profiles
  - `type` (text, not null) - Type: deadline, new_opportunity, profile_reminder
  - `title` (text, not null) - Notification title
  - `message` (text, not null) - Notification content
  - `link` (text) - Link to relevant page
  - `is_read` (boolean) - Read status
  - `created_at` (timestamptz) - Creation time

  ### 5. admin_users
  Tracks admin permissions
  - `id` (uuid, primary key) - References profiles
  - `email` (text, unique, not null) - Admin email
  - `created_at` (timestamptz) - When admin access granted

  ## Security
  - Enable RLS on all tables
  - Profiles: Users can read all, update own
  - Opportunities: All can read, only admins can write
  - Applications: Users can read/write own only
  - Notifications: Users can read/update own only
  - Admin_users: Only admins can read

  ## Notes
  - Admin emails: saatviksantosh10@gmail.com, aarush.kadira@gmail.com
  - All timestamps use UTC
  - Arrays allow flexible tagging and filtering
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  school text,
  grade_level text CHECK (grade_level IN ('9', '10', '11', '12')),
  bio text,
  interests text[] DEFAULT '{}',
  achievements text[] DEFAULT '{}',
  projects text[] DEFAULT '{}',
  skills text[] DEFAULT '{}',
  resume_url text,
  profile_image_url text,
  location text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create opportunities table
CREATE TABLE IF NOT EXISTS opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  type text NOT NULL CHECK (type IN ('internship', 'scholarship', 'summer_program', 'research', 'competition')),
  description text NOT NULL,
  organization text NOT NULL,
  location text,
  deadline date,
  grade_levels text[] DEFAULT '{}',
  interests text[] DEFAULT '{}',
  application_url text,
  is_featured boolean DEFAULT false,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  opportunity_id uuid NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  status text DEFAULT 'saved' CHECK (status IN ('saved', 'applied', 'accepted', 'rejected')),
  notes text,
  applied_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, opportunity_id)
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('deadline', 'new_opportunity', 'profile_reminder')),
  title text NOT NULL,
  message text NOT NULL,
  link text,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Opportunities policies
CREATE POLICY "Opportunities are viewable by everyone"
  ON opportunities FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can insert opportunities"
  ON opportunities FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Only admins can update opportunities"
  ON opportunities FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Only admins can delete opportunities"
  ON opportunities FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Applications policies
CREATE POLICY "Users can view own applications"
  ON applications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own applications"
  ON applications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications"
  ON applications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own applications"
  ON applications FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Admin users policies
CREATE POLICY "Admins can view admin list"
  ON admin_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_opportunities_type ON opportunities(type);
CREATE INDEX IF NOT EXISTS idx_opportunities_deadline ON opportunities(deadline);
CREATE INDEX IF NOT EXISTS idx_opportunities_featured ON opportunities(is_featured);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_opportunity_id ON applications(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_opportunities_updated_at
  BEFORE UPDATE ON opportunities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
