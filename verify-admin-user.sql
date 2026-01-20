-- ============================================
-- VERIFY ADMIN USER EXISTS
-- ============================================
-- Run this in Supabase SQL Editor to check if your admin was created

-- Check 1: Does the user exist in auth.users?
SELECT 
    id,
    email,
    created_at,
    email_confirmed_at,
    last_sign_in_at
FROM auth.users
WHERE email = 'abdallaahmet11@iprt.org';

-- Check 2: Does the admin exist in admin_users table?
SELECT 
    id,
    email,
    username,
    role,
    is_active,
    created_at
FROM admin_users
WHERE email = 'abdallaahmet11@iprt.org';

-- Check 3: Are they linked? (IDs should match)
SELECT 
    au.id as auth_id,
    au.email as auth_email,
    adu.id as admin_id,
    adu.email as admin_email,
    adu.username,
    adu.role,
    adu.is_active
FROM auth.users au
LEFT JOIN admin_users adu ON au.id = adu.id
WHERE au.email = 'abdallaahmet11@iprt.org';

-- Check 4: Count total admins
SELECT COUNT(*) as total_admins FROM admin_users;

-- Check 5: List all admins
SELECT email, username, role, is_active FROM admin_users;
