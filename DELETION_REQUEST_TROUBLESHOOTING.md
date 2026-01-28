# Deletion Request Troubleshooting Guide

## Issue
When members try to submit a deletion request, they get "Failed to submit deletion request" error.

## Possible Causes & Solutions

### 1. Database Table Missing
The `deletion_requests` table might not exist in your Supabase database.

**Solution**: Run the database schema to create the table:

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Run one of these schema files:
   - `FINAL-CORRECTED-SCHEMA.sql` (recommended)
   - `iprt-complete-schema.sql`
   - `supabase-schema.sql`

### 2. Row Level Security (RLS) Issues
The table might have RLS enabled but no proper policies.

**Solution**: Check and update RLS policies:

```sql
-- Check if table exists
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'deletion_requests';

-- Check RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'deletion_requests';

-- Check existing policies
SELECT * FROM pg_policies WHERE tablename = 'deletion_requests';

-- If needed, create/update policy
DROP POLICY IF EXISTS "Allow all operations on deletion_requests" ON deletion_requests;
CREATE POLICY "Allow all operations on deletion_requests" 
ON deletion_requests FOR ALL USING (true) WITH CHECK (true);
```

### 3. Authentication Issues
The user might not be properly authenticated.

**Solution**: Check member login status:
- Ensure member is logged in
- Check localStorage for `currentMemberEmail`
- Verify member session is valid

### 4. Network/Connection Issues
Supabase connection might be failing.

**Solution**: Test the connection:
1. Open browser developer tools
2. Check Network tab for failed requests
3. Look for CORS or network errors
4. Verify Supabase URL and API key in `.env`

## Testing Steps

1. **Check Browser Console**: Look for detailed error messages
2. **Test Database Connection**: Try other operations (viewing students)
3. **Verify Schema**: Ensure all tables exist in Supabase
4. **Check Authentication**: Verify member login works
5. **Test with Admin**: Try similar operations as admin user

## Enhanced Error Handling

The MemberStudents component has been updated with better error handling to show specific error messages:

- Database table not found
- Permission denied
- Network errors
- Generic errors with details

## Quick Fix Commands

If you have access to Supabase SQL Editor, run these commands:

```sql
-- 1. Check if table exists
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_name = 'deletion_requests';

-- 2. If table doesn't exist, create it
CREATE TABLE IF NOT EXISTS deletion_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL,
    student_name TEXT NOT NULL,
    student_email TEXT NOT NULL,
    requested_by TEXT NOT NULL,
    requested_by_email TEXT NOT NULL,
    reason TEXT NOT NULL,
    request_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    admin_response TEXT,
    admin_email TEXT,
    response_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable RLS and create policy
ALTER TABLE deletion_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on deletion_requests" 
ON deletion_requests FOR ALL USING (true) WITH CHECK (true);

-- 4. Test insertion
INSERT INTO deletion_requests (
    student_id, student_name, student_email, 
    requested_by, requested_by_email, reason
) VALUES (
    gen_random_uuid(), 'Test Student', 'test@example.com',
    'member', 'member@test.com', 'Test deletion request'
);

-- 5. Clean up test data
DELETE FROM deletion_requests WHERE student_name = 'Test Student';
```

## Next Steps

1. Try the deletion request again with the enhanced error handling
2. Check browser console for specific error messages
3. If table is missing, run the schema creation commands
4. If still failing, check Supabase dashboard for any issues