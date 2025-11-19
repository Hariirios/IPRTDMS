# Supabase Database Setup

## Quick Setup (3 Steps)

### Step 1: Run the Complete Setup SQL

1. Go to your Supabase Dashboard: https://lqchymjjjcavckqqvkei.supabase.co
2. Click **"SQL Editor"** in the left sidebar
3. Click **"New Query"**
4. Open the file: `COMPLETE_SETUP.sql`
5. Copy ALL the content and paste it
6. Click **"Run"**

### Step 2: Verify Tables Created

Click **"Table Editor"** and verify these tables exist:
- ✅ events
- ✅ services
- ✅ mentors
- ✅ testimonials
- ✅ videos
- ✅ bookings
- ✅ contacts
- ✅ partners
- ✅ admin_users
- ✅ password_reset_tokens

### Step 3: Test Login

1. Start your app: `npm run dev`
2. Go to: http://localhost:5173/admin
3. Login with:
   - **Email:** `malitmohamud@gmail.com`
   - **Username:** `malitos`
   - **Password:** `malitofx@?`

## Forgot Password Testing

1. Go to admin login page
2. Click **"Forgot Password?"**
3. Enter: `malitmohamud@gmail.com`
4. Check your email inbox
5. Click the reset link
6. Set a new password
7. Login with new password ✅

## Files in This Folder

- **COMPLETE_SETUP.sql** - Run this ONE file to set up everything
- **README.md** - This file

## Default Admin User

The setup automatically creates a super admin:

- **Email:** malitmohamud@gmail.com
- **Username:** malitos
- **Password:** malitofx@?
- **Role:** super_admin

## Admin Roles

**SUPER ADMIN** (super_admin)
- ✓ Create/Delete users
- ✓ Manage all content
- ✓ Change password

**ADMIN** (admin)
- ✓ Manage all content
- ✓ Change password
- ✗ Cannot create/delete users

## Need Help?

Check the main documentation: `QUICK_START_FORGOT_PASSWORD.md` in the root folder
