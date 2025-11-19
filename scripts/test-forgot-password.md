# Test Forgot Password Functionality

## Quick Test Checklist

### ✅ Step 1: Verify Database Setup

1. Go to Supabase Dashboard: https://lqchymjjjcavckqqvkei.supabase.co
2. Click "Table Editor" in sidebar
3. Verify these tables exist:
   - ✅ `admin_users`
   - ✅ `password_reset_tokens`

### ✅ Step 2: Admin User Already Created!

The COMPLETE_SETUP.sql automatically created a super admin:

- **Email:** malitmohamud@gmail.com
- **Username:** malitos
- **Password:** malitofx@?

You can use this account for testing!

### ✅ Step 3: Test Login

1. Start your app: `npm run dev`
2. Go to: http://localhost:5173/admin
3. Try logging in with:
   - Username: `malitos`
   - Password: `malitofx@?`
4. Should successfully log in ✅

### ✅ Step 4: Test Forgot Password

1. Go to: http://localhost:5173/admin
2. Click "Forgot Password?"
3. Enter email: `malitmohamud@gmail.com`
4. Click "Send Reset Link"
5. Check your email inbox (malitmohamud@gmail.com)
6. You should receive an email with a reset link ✅

### ✅ Step 5: Test Password Reset

1. Click the reset link in the email
2. Should redirect to: http://localhost:5173/reset-password?token=...
3. Enter a new password (min 8 characters)
4. Confirm the password
5. Click "Set New Password"
6. Should see success message ✅
7. Should redirect to login page ✅

### ✅ Step 6: Test New Password

1. Go to: http://localhost:5173/admin
2. Try logging in with:
   - Email: `malitmohamud@gmail.com`
   - Password: `YourNewPassword`
3. Should successfully log in ✅

## Common Issues & Solutions

### ❌ "Email not found in admin users"
**Solution:** Make sure you ran the COMPLETE_SETUP.sql file in Supabase

### ❌ "Failed to send reset email"
**Solutions:**
- Check SMTP credentials in `.env`
- Verify Gmail App Password is correct
- Check console for detailed error messages
- Make sure 2-Step Verification is enabled on Gmail
- Generate a new App Password if needed

### ❌ "Invalid or expired token"
**Solutions:**
- Tokens expire after 1 hour - request a new one
- Tokens can only be used once - request a new one
- Make sure the URL includes `?token=...`

### ❌ Email not arriving
**Solutions:**
- Check spam/junk folder
- Verify SMTP settings in `.env`
- Check Vercel logs if deployed
- Try a different email address

### ❌ "This password was used before"
**Solution:** This is a security feature - choose a different password

## Verify Email Configuration

Your current email settings (from `.env`):
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=malitmohamud@gmail.com
SMTP_PASS=xgjv mrpi gwby sxnh
```

**Important:** The SMTP_PASS should be a Gmail App Password, not your regular password.

To generate a Gmail App Password:
1. Go to: https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Search for "App passwords"
4. Create new app password for "Mail"
5. Update `.env` with the new password

## Database Queries for Debugging

### Check if admin user exists:
```sql
SELECT id, email, username, role, is_active 
FROM admin_users 
WHERE email = 'malitmohamud@gmail.com';
```

### Check password reset tokens:
```sql
SELECT id, email, token, expires_at, used, created_at 
FROM password_reset_tokens 
WHERE email = 'malitmohamud@gmail.com'
ORDER BY created_at DESC
LIMIT 5;
```

### Delete old/expired tokens:
```sql
DELETE FROM password_reset_tokens 
WHERE expires_at < NOW() OR used = true;
```

### Reset a user's password manually (if needed):
```sql
-- First generate a hash using: node scripts/generate-password-hash.js NewPassword123!
UPDATE admin_users 
SET password_hash = 'YOUR_NEW_HASH_HERE',
    updated_at = NOW()
WHERE email = 'malitmohamud@gmail.com';
```

## Success Indicators

When everything is working correctly, you should see:

1. ✅ Login page loads without errors
2. ✅ "Forgot Password?" link is visible
3. ✅ Forgot password form accepts email
4. ✅ Success toast: "Password reset link sent to your email!"
5. ✅ Email arrives within 1-2 minutes
6. ✅ Reset link opens the reset password page
7. ✅ Password strength indicator shows
8. ✅ New password is accepted
9. ✅ Success message and redirect to login
10. ✅ Can login with new password

## Next Steps

Once testing is complete:

1. **Create your real admin users** with secure passwords
2. **Delete test users** if any
3. **Update production environment variables** in Vercel
4. **Test on production** URL
5. **Document admin credentials** securely

## Need More Help?

Check these files for implementation details:
- `pages/Admin.tsx` - Login and forgot password UI
- `pages/ResetPassword.tsx` - Reset password UI
- `lib/auth.ts` - Authentication logic
- `lib/email.ts` - Email sending logic
- `api/send-reset-email.ts` - Email API endpoint
- `supabase/COMPLETE_SETUP.sql` - Complete database schema
