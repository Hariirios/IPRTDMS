-- ============================================
-- CREATE FIRST ADMIN USER
-- ============================================
-- Run this AFTER creating the admin_users table

-- Step 1: Create admin_users table (if not exists)
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT,
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

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Anyone can view admin_users" ON admin_users;
CREATE POLICY "Anyone can view admin_users" ON admin_users FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage admin_users" ON admin_users;
CREATE POLICY "Authenticated users can manage admin_users" ON admin_users FOR ALL USING (auth.role() = 'authenticated');

-- Step 2: Insert your admin user
-- Replace the email with the one you created in Authentication
INSERT INTO admin_users (id, email, username, role, is_active, created_by)
SELECT 
    id, 
    email, 
    'abdalla_admin',  -- Your username
    'super_admin',    -- Role
    true,             -- Active
    'system'          -- Created by
FROM auth.users
WHERE email = 'abdallaahmet11@iprt.org'
ON CONFLICT (email) DO UPDATE SET
    username = EXCLUDED.username,
    role = EXCLUDED.role,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- Verify the admin was created
SELECT id, email, username, role, is_active, created_at
FROM admin_users
WHERE email = 'abdallaahmet11@iprt.org';

-- Success message
DO $$
DECLARE
    admin_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO admin_count FROM admin_users WHERE email = 'abdallaahmet11@iprt.org';
    
    IF admin_count > 0 THEN
        RAISE NOTICE ' Admin user created successfully!';
        RAISE NOTICE 'Email: abdallaahmet11@iprt.org';
        RAISE NOTICE 'Username: abdalla_admin';
        RAISE NOTICE 'Role: super_admin';
        RAISE NOTICE '';
        RAISE NOTICE 'You can now login to the application!';
    ELSE
        RAISE NOTICE ' Failed to create admin user';
        RAISE NOTICE 'Make sure the email exists in Authentication > Users';
    END IF;
END $$;
