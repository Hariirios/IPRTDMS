# Test Admin Login - Quick Guide

## Prerequisites
✅ Admin user created in Supabase Authentication
✅ Admin user linked in `admin_users` table
✅ `.env` file configured with Supabase credentials

## Test Steps

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Open the Admin Page
Navigate to: `http://localhost:5173/admin`

### 3. Test Login

#### Admin Login Test
1. Select "Admin" user type
2. Enter credentials:
   - **Email:** `abdallaahmet11@iprt.org`
   - **Username:** `abdalla_admin` (can use either email or username)
   - **Password:** Your Supabase Auth password
3. Click "Login as Admin"

#### Expected Results
✅ Success message: "Welcome abdalla_admin!"
✅ Redirected to Admin Dashboard
✅ Can see all admin tabs (Dashboard, Projects, Students, etc.)
✅ Notification bell appears in header
✅ Logout button visible

#### If Login Fails
❌ Error: "Invalid admin credentials or account is inactive"
- Check password is correct
- Verify user exists in Supabase Dashboard > Authentication
- Run verification SQL (see below)

### 4. Verify in Browser Console
Open browser console (F12) and check for:
- ✅ No errors
- ✅ "Admin users fetched successfully" message
- ✅ localStorage items set:
  - `currentAdminId`
  - `currentAdminEmail`
  - `currentAdminUsername`
  - `currentAdminRole`

### 5. Test Logout
1. Click "Logout" button
2. Should return to login page
3. localStorage should be cleared

## Verification SQL Queries

### Check Admin Exists
Run in Supabase SQL Editor:
```sql
-- Check admin_users table
SELECT id, email, username, role, is_active, created_at
FROM admin_users
WHERE email = 'abdallaahmet11@iprt.org';

-- Check auth.users table
SELECT id, email, created_at, email_confirmed_at, last_sign_in_at
FROM auth.users
WHERE email = 'abdallaahmet11@iprt.org';

-- Check if they're linked (IDs should match)
SELECT 
    au.id as auth_id,
    adu.id as admin_id,
    adu.email,
    adu.username,
    adu.role,
    adu.is_active
FROM auth.users au
JOIN admin_users adu ON au.id = adu.id
WHERE au.email = 'abdallaahmet11@iprt.org';
```

### Expected Results
- Both queries should return 1 row
- `is_active` should be `true`
- `auth_id` and `admin_id` should match

## Troubleshooting

### Problem: "Missing Supabase environment variables"
**Solution:** Check `.env` file has:
```env
VITE_SUPABASE_URL=https://wozvgekvgdggjwayamxn.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Problem: "Admin user not found"
**Solution:** Run `create-first-admin.sql` in Supabase SQL Editor

### Problem: "Invalid credentials"
**Solution:** 
1. Go to Supabase Dashboard > Authentication > Users
2. Find user with email `abdallaahmet11@iprt.org`
3. Click "..." > "Reset Password"
4. Set a new password
5. Try logging in again

### Problem: Login works but dashboard is empty
**Solution:** Check RLS policies are set correctly:
```sql
-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view
CREATE POLICY "Anyone can view admin_users" 
ON admin_users FOR SELECT 
USING (true);
```

## Success Checklist
- [ ] Development server running
- [ ] Admin page loads without errors
- [ ] Can see login form with Admin/Member toggle
- [ ] Login with email works
- [ ] Login with username works
- [ ] Welcome message appears
- [ ] Dashboard loads with all tabs
- [ ] Notification bell visible
- [ ] Logout works correctly
- [ ] No console errors

## Next Steps After Successful Login
1. ✅ Test creating a project
2. ✅ Test adding a student
3. ✅ Test marking attendance
4. ✅ Test creating a requisition
5. ✅ Test member login (if members exist)

---

**Status:** Ready for testing
**Last Updated:** January 20, 2026
