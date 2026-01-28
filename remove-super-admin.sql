-- ============================================
-- REMOVE SUPER ADMIN AND REVERT TO ORIGINAL SYSTEM
-- ============================================
-- Run this in Supabase SQL Editor to clean up

-- Step 1: Remove the super admin user (iprt.hrg@gmail.com)
DELETE FROM admin_users WHERE email = 'iprt.hrg@gmail.com';

-- Step 2: Change the existing admin back to regular admin (if needed)
UPDATE admin_users 
SET 
    role = 'admin',
    username = 'admin',
    updated_at = NOW()
WHERE email = 'abdallaahmet11@iprt.org';

-- Step 3: Drop the admin_users table entirely (optional - if you want to go back to original system)
-- Uncomment the line below if you want to completely remove admin user management
-- DROP TABLE IF EXISTS admin_users;

-- Step 4: Verify remaining users
SELECT email, username, role, is_active FROM admin_users;

-- Success message
DO $
DECLARE
    admin_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO admin_count FROM admin_users;
    
    RAISE NOTICE '✅ Super Admin system removed successfully!';
    RAISE NOTICE 'Remaining admin users: %', admin_count;
    RAISE NOTICE '';
    RAISE NOTICE 'System reverted to original state.';
END $;