-- ============================================
-- ADD MEMBERS TABLE FOR LOGIN CREDENTIALS
-- ============================================
-- Run this in Supabase SQL Editor to add member management

-- Members Table (for login credentials)
CREATE TABLE IF NOT EXISTS members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL, -- In production, this should be hashed
    phone TEXT NOT NULL,
    image TEXT, -- Base64 or URL
    status TEXT NOT NULL CHECK (status IN ('Active', 'Inactive')) DEFAULT 'Active',
    assigned_projects TEXT[], -- Array of project IDs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_members_status ON members(status);

-- Add trigger for updated_at
CREATE TRIGGER update_members_updated_at 
    BEFORE UPDATE ON members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Allow all operations on members" ON members FOR ALL USING (true) WITH CHECK (true);

-- Sample members (3 examples)
INSERT INTO members (name, email, password, phone, status, assigned_projects)
VALUES 
    ('John Doe', 'john.doe@iprt.edu', 'member123', '+252-61-444-4444', 'Active', ARRAY[]::TEXT[]),
    ('Sarah Ahmed', 'sarah.ahmed@iprt.edu', 'member123', '+252-61-555-5555', 'Active', ARRAY[]::TEXT[]),
    ('Ali Mohamed', 'ali.mohamed@iprt.edu', 'member123', '+252-61-666-6666', 'Inactive', ARRAY[]::TEXT[])
ON CONFLICT (email) DO NOTHING;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Members table created successfully!';
    RAISE NOTICE '📊 3 sample members added';
    RAISE NOTICE '🔑 Default password for all: member123';
END $$;
