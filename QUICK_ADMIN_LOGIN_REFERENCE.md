# Quick Admin Login Reference Card

## 🚀 Quick Start

### Login URL
```
http://localhost:5173/admin
```

### Current Admin Credentials
```
Email:    abdallaahmet11@iprt.org
Username: abdalla_admin
Password: [Your Supabase Auth Password]
Role:     super_admin
```

## ✅ Quick Test

1. Start server: `npm run dev`
2. Go to: `http://localhost:5173/admin`
3. Login with email or username
4. Should see: "Welcome abdalla_admin!"

## 🔍 Quick Verify

### Check Admin Exists (Supabase SQL Editor)
```sql
SELECT email, username, role, is_active 
FROM admin_users 
WHERE email = 'abdallaahmet11@iprt.org';
```

Expected: 1 row, `is_active = true`

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| "Invalid credentials" | Check password in Supabase Dashboard > Authentication |
| "User not found" | Run `create-first-admin.sql` |
| "Missing Supabase variables" | Check `.env` has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` |
| Login works but empty dashboard | Check RLS policies are enabled |

## 📚 Documentation Files

- `ADMIN_LOGIN_FIX_COMPLETE.md` - Complete details
- `TEST_ADMIN_LOGIN.md` - Full testing guide
- `ADMIN_LOGIN_MIGRATION_SUMMARY.md` - Migration overview
- `create-first-admin.sql` - Create admin user
- `verify-admin-user.sql` - Verify admin exists

## 🔐 Security Notes

✅ Passwords hashed by Supabase
✅ No credentials in `.env`
✅ Only anon key in frontend
✅ RLS policies protect data

## 🎯 Key Changes Made

1. ✅ `pages/Admin.tsx` - Uses `loginAdmin()` from `lib/auth.ts`
2. ✅ `README.md` - Updated authentication section
3. ✅ `.env.example` - Removed old credential variables

## 💡 Quick Commands

### Reset Password
1. Supabase Dashboard > Authentication > Users
2. Find user > "..." > "Reset Password"
3. Set new password

### Create New Admin
1. Supabase Dashboard > Authentication > Add User
2. Run SQL:
```sql
INSERT INTO admin_users (id, email, username, role, is_active)
SELECT id, email, 'new_username', 'admin', true
FROM auth.users
WHERE email = 'new@email.com';
```

---

**Status:** ✅ READY
**Last Updated:** January 20, 2026
