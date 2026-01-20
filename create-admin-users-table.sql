-- ============================================
-- CREATE ADMIN_USERS TABLE
-- ============================================
-- This table stores admin user information
-- Run this in Supabase SQL Editor

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT, -- For backward compatibility (not used with Supabase Auth)
    role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin')) DEFAULT 'admin',
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by TEXT
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);
CREATE INDEX IF NOT EXISTS idx_admin_users_is_active ON admin_users(is_active);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "Anyone can view admin_users" ON admin_users;
CREATE POLICY "Anyone can view admin_users" ON admin_users
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage admin_users" ON admin_users;
CREATE POLICY "Authenticated users can manage admin_users" ON admin_users
    FOR ALL USING (auth.role() = 'authenticated');

-- Add trigger for updated_at
DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
CREATE TRIGGER update_admin_users_updated_at 
    BEFORE UPDATE ON admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ admin_users table created successfully!';
    RAISE NOTICE 'You can now create admin users.';
END $$;
