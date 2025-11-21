-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Active', 'Completed', 'On Hold')),
  description TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  assigned_members TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust based on your security needs)
CREATE POLICY "Allow all operations on projects" ON projects
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Sample projects
INSERT INTO projects (name, status, description, start_date, end_date, assigned_members) VALUES
  ('Mental Health Awareness Campaign', 'Active', 'Community-wide campaign to raise awareness about mental health and reduce stigma', '2025-01-15', '2025-06-30', ARRAY[]::TEXT[]),
  ('Youth Counseling Program', 'Active', 'Providing counseling services to youth in local schools', '2025-02-01', '2025-12-31', ARRAY[]::TEXT[]),
  ('Stress Management Workshop Series', 'On Hold', 'Monthly workshops teaching stress management techniques', '2025-03-01', '2025-11-30', ARRAY[]::TEXT[]),
  ('Community Support Groups', 'Active', 'Establishing support groups for various mental health challenges', '2024-11-01', '2025-12-31', ARRAY[]::TEXT[]),
  ('Parenting Skills Training', 'Completed', 'Training program for parents on emotional intelligence and child development', '2024-08-01', '2024-12-15', ARRAY[]::TEXT[]);

COMMENT ON TABLE projects IS 'Stores institute projects and their details';
