# Supabase Setup Guide for IPRT

## ✅ Step 1: Environment Variables (COMPLETED)

Your Supabase credentials have been added to `.env`:

```env
VITE_SUPABASE_URL=https://wozvgekvgdggjwayamxn.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_JWT_SECRET=KTeYLxa7XDPE0n85qtAiqpb2etxVf3cCE0wpesQcj12LYoPi3WpatWKyoZcXIIJos6NLZ+Kw93MwYst0YXstow==
```

## 📋 Step 2: Create Database Tables

1. Go to your Supabase Dashboard: https://app.supabase.com/project/wozvgekvgdggjwayamxn
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy the entire content from `supabase-schema.sql` file
5. Paste it into the SQL editor
6. Click "Run" button

This will create all necessary tables:
- ✅ students
- ✅ projects
- ✅ project_students
- ✅ attendance
- ✅ requisitions
- ✅ deletion_requests
- ✅ team_members
- ✅ notifications

## 🔐 Step 3: Configure Authentication (Optional)

If you want to use Supabase Auth instead of hardcoded credentials:

1. Go to "Authentication" → "Providers" in Supabase Dashboard
2. Enable Email provider
3. Configure email templates if needed
4. Update your login logic to use Supabase Auth

## 🧪 Step 4: Test Connection

Restart your development server:

```bash
npm run dev
```

The Supabase client is now configured and ready to use!

## 📚 How to Use Supabase in Your Code

### Import the client:
```typescript
import { supabase } from './lib/supabase';
```

### Example: Fetch students
```typescript
const { data: students, error } = await supabase
  .from('students')
  .select('*')
  .order('created_at', { ascending: false });
```

### Example: Insert a student
```typescript
const { data, error } = await supabase
  .from('students')
  .insert({
    full_name: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    enrollment_date: '2024-01-15',
    status: 'Active',
    added_by: 'admin',
    added_by_email: 'admin@iprt.edu'
  });
```

### Example: Update a student
```typescript
const { data, error } = await supabase
  .from('students')
  .update({ status: 'Completed' })
  .eq('id', studentId);
```

### Example: Delete a student
```typescript
const { error } = await supabase
  .from('students')
  .delete()
  .eq('id', studentId);
```

## 🔄 Next Steps: Migrate from Local Storage to Supabase

You'll need to update these files to use Supabase instead of local storage:

1. **lib/studentStore.ts** - Replace with Supabase queries
2. **lib/deletionRequestStore.ts** - Replace with Supabase queries
3. **lib/notificationStore.ts** - Replace with Supabase queries
4. **lib/teamStore.ts** - Replace with Supabase queries

Example migration for studentStore:

```typescript
// OLD (local storage)
export const studentStore = {
  getAll: () => students,
  add: (student) => { students.push(student); }
};

// NEW (Supabase)
export const studentStore = {
  getAll: async () => {
    const { data, error } = await supabase.from('students').select('*');
    return data || [];
  },
  add: async (student) => {
    const { data, error } = await supabase.from('students').insert(student);
    return data;
  }
};
```

## 🔒 Security Notes

1. **Never commit `.env` to Git** - It's already in `.gitignore`
2. **Service Role Key** - Only use on server-side, never expose to client
3. **Row Level Security (RLS)** - Currently set to allow all for testing. Update policies for production:
   ```sql
   -- Example: Only allow admins to delete students
   CREATE POLICY "Only admins can delete" ON students
   FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');
   ```

## 📊 Database Schema Overview

```
students
├── id (UUID)
├── full_name (TEXT)
├── email (TEXT)
├── phone (TEXT)
├── enrollment_date (DATE)
├── status (Active/Completed/Dropped)
├── added_by (admin/member)
└── added_by_email (TEXT)

projects
├── id (UUID)
├── name (TEXT)
├── description (TEXT)
├── start_date (DATE)
├── end_date (DATE)
├── status (Planning/In Progress/Completed/On Hold)
└── created_by (TEXT)

project_students (junction table)
├── id (UUID)
├── project_id (UUID → projects)
├── student_id (UUID → students)
└── assigned_date (DATE)

attendance
├── id (UUID)
├── student_id (UUID → students)
├── project_id (UUID → projects)
├── date (DATE)
├── status (Present/Absent/Absent with Reason)
├── comment (TEXT)
└── marked_by (TEXT)

requisitions
├── id (UUID)
├── title (TEXT)
├── description (TEXT)
├── category (Equipment/Supplies/Services/Other)
├── quantity (INTEGER)
├── estimated_cost (TEXT)
├── priority (Low/Medium/High)
├── status (Pending/Approved/Rejected)
├── submitted_by (TEXT)
├── reviewed_by (TEXT)
└── review_notes (TEXT)

deletion_requests
├── id (UUID)
├── student_id (UUID)
├── student_name (TEXT)
├── reason (TEXT)
├── status (Pending/Approved/Rejected)
├── requested_by_email (TEXT)
├── admin_response (TEXT)
└── response_date (DATE)

team_members
├── id (UUID)
├── name (TEXT)
├── role (Staff/Facilitator/Technician)
├── email (TEXT)
├── phone (TEXT)
├── bio (TEXT)
└── image_url (TEXT)

notifications
├── id (UUID)
├── type (deletion_request/requisition/project/etc.)
├── title (TEXT)
├── message (TEXT)
├── related_id (UUID)
├── is_read (BOOLEAN)
└── created_by (TEXT)
```

## 🎉 You're All Set!

Your IPRT website is now connected to Supabase. The database is ready to store:
- ✅ Students
- ✅ Projects
- ✅ Attendance records
- ✅ Requisitions
- ✅ Deletion requests
- ✅ Team members
- ✅ Notifications

Happy coding! 🚀
