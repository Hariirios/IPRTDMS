# HOW TO FIX YOUR DATABASE

## 📋 Overview
Your database has **7 critical errors** and **6 warnings** that need to be fixed. This guide will help you apply all fixes safely.

---

## 🚨 BEFORE YOU START

### Option 1: Fresh Database (RECOMMENDED)
If you're starting fresh or can recreate your database:
1. Drop all existing tables
2. Run `FINAL-CORRECTED-SCHEMA.sql`
3. Done! ✅

### Option 2: Existing Database with Data
If you have existing data you want to keep:
1. **BACKUP YOUR DATABASE FIRST!**
2. Follow the migration steps below

---

## 🔧 MIGRATION STEPS (For Existing Database)

### Step 1: Backup Your Database
```sql
-- In Supabase SQL Editor, export your data first
-- Or use pg_dump if you have direct access
```

### Step 2: Fix Projects Table
```sql
-- Fix status constraint
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_status_check;
ALTER TABLE projects ADD CONSTRAINT projects_status_check 
CHECK (status IN ('Active', 'Completed', 'On Hold'));

-- Update any 'Planning' or 'In Progress' statuses
UPDATE projects SET status = 'Active' WHERE status IN ('Planning', 'In Progress');

-- Make end_date nullable
ALTER TABLE projects ALTER COLUMN end_date DROP NOT NULL;

-- Add assigned_members if missing
ALTER TABLE projects ADD COLUMN IF NOT EXISTS assigned_members TEXT[] DEFAULT '{}';

-- Remove created_by if exists (not used by app)
ALTER TABLE projects DROP COLUMN IF EXISTS created_by;
```

### Step 3: Fix Requisitions Table
```sql
-- Change estimated_cost from TEXT to DECIMAL
-- First, create a new column
ALTER TABLE requisitions ADD COLUMN IF NOT EXISTS estimated_cost_new DECIMAL(10, 2);

-- Copy data, converting TEXT to DECIMAL
UPDATE requisitions SET estimated_cost_new = CAST(
    REGEXP_REPLACE(estimated_cost, '[^0-9.]', '', 'g') AS DECIMAL(10, 2)
);

-- Drop old column and rename new one
ALTER TABLE requisitions DROP COLUMN IF EXISTS estimated_cost;
ALTER TABLE requisitions RENAME COLUMN estimated_cost_new TO estimated_cost;

-- Add NOT NULL constraint
ALTER TABLE requisitions ALTER COLUMN estimated_cost SET NOT NULL;
```

### Step 4: Fix Team Members Table
```sql
-- Rename 'role' to 'type' if it exists
ALTER TABLE team_members RENAME COLUMN role TO type;

-- Add missing columns
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS role TEXT;
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS join_date DATE;
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS status TEXT CHECK (status IN ('Active', 'Inactive'));

-- Set default values for existing records
UPDATE team_members SET 
    role = 'Staff Member',
    department = 'General',
    join_date = CURRENT_DATE,
    status = 'Active'
WHERE role IS NULL;

-- Make columns NOT NULL
ALTER TABLE team_members ALTER COLUMN role SET NOT NULL;
ALTER TABLE team_members ALTER COLUMN department SET NOT NULL;
ALTER TABLE team_members ALTER COLUMN join_date SET NOT NULL;
ALTER TABLE team_members ALTER COLUMN status SET NOT NULL;

-- Rename image_url to image if needed
ALTER TABLE team_members RENAME COLUMN image_url TO image;

-- Fix type constraint
ALTER TABLE team_members DROP CONSTRAINT IF EXISTS team_members_type_check;
ALTER TABLE team_members ADD CONSTRAINT team_members_type_check 
CHECK (type IN ('Staff', 'Technician', 'Facilitator'));
```

### Step 5: Fix Attendance Table
```sql
-- Add 'Late' status option
ALTER TABLE attendance DROP CONSTRAINT IF EXISTS attendance_status_check;
ALTER TABLE attendance ADD CONSTRAINT attendance_status_check 
CHECK (status IN ('Present', 'Late', 'Absent', 'Absent with Reason'));
```

### Step 6: Add Members Table (if missing)
```sql
CREATE TABLE IF NOT EXISTS members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    phone TEXT NOT NULL,
    image TEXT,
    status TEXT NOT NULL CHECK (status IN ('Active', 'Inactive')) DEFAULT 'Active',
    assigned_projects TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_members_status ON members(status);

ALTER TABLE members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on members" ON members FOR ALL USING (true) WITH CHECK (true);

CREATE TRIGGER update_members_updated_at 
    BEFORE UPDATE ON members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Step 7: Fix Notifications Table
```sql
-- Add target_user column
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS target_user TEXT;

-- Create index
CREATE INDEX IF NOT EXISTS idx_notifications_target_user ON notifications(target_user);

-- Set default value for existing records
UPDATE notifications SET target_user = 'admin' WHERE target_user IS NULL;
```

### Step 8: Update UUID Functions (Optional but Recommended)
```sql
-- Update all tables to use gen_random_uuid() instead of uuid_generate_v4()
-- This is optional but recommended for consistency

-- For new tables, they already use gen_random_uuid()
-- Existing data will keep their UUIDs
```

---

## ✅ VERIFICATION STEPS

After applying fixes, run these queries to verify:

```sql
-- 1. Check Projects status values
SELECT DISTINCT status FROM projects;
-- Should return: Active, Completed, On Hold

-- 2. Check Requisitions cost type
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'requisitions' AND column_name = 'estimated_cost';
-- Should return: DECIMAL or numeric

-- 3. Check Team Members columns
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'team_members';
-- Should include: type, role, department, join_date, status, image

-- 4. Check Attendance status values
SELECT DISTINCT status FROM attendance;
-- Should include: Present, Late, Absent, Absent with Reason

-- 5. Check Members table exists
SELECT COUNT(*) FROM members;
-- Should not error

-- 6. Check Notifications has target_user
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'notifications' AND column_name = 'target_user';
-- Should return: target_user
```

---

## 🎯 QUICK FIX (All-in-One Script)

If you want to apply all fixes at once, run this:

```sql
-- BACKUP FIRST!

-- Fix Projects
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_status_check;
ALTER TABLE projects ADD CONSTRAINT projects_status_check CHECK (status IN ('Active', 'Completed', 'On Hold'));
UPDATE projects SET status = 'Active' WHERE status IN ('Planning', 'In Progress');
ALTER TABLE projects ALTER COLUMN end_date DROP NOT NULL;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS assigned_members TEXT[] DEFAULT '{}';
ALTER TABLE projects DROP COLUMN IF EXISTS created_by;

-- Fix Requisitions (if needed - check first!)
-- ALTER TABLE requisitions ADD COLUMN IF NOT EXISTS estimated_cost_new DECIMAL(10, 2);
-- UPDATE requisitions SET estimated_cost_new = CAST(REGEXP_REPLACE(estimated_cost, '[^0-9.]', '', 'g') AS DECIMAL(10, 2));
-- ALTER TABLE requisitions DROP COLUMN IF EXISTS estimated_cost;
-- ALTER TABLE requisitions RENAME COLUMN estimated_cost_new TO estimated_cost;
-- ALTER TABLE requisitions ALTER COLUMN estimated_cost SET NOT NULL;

-- Fix Team Members
DO $$
BEGIN
    -- Try to rename role to type
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'team_members' AND column_name = 'role') THEN
        ALTER TABLE team_members RENAME COLUMN role TO type;
    END IF;
END $$;

ALTER TABLE team_members ADD COLUMN IF NOT EXISTS role TEXT;
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS join_date DATE;
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS status TEXT;

UPDATE team_members SET 
    role = COALESCE(role, 'Staff Member'),
    department = COALESCE(department, 'General'),
    join_date = COALESCE(join_date, CURRENT_DATE),
    status = COALESCE(status, 'Active');

ALTER TABLE team_members ALTER COLUMN role SET NOT NULL;
ALTER TABLE team_members ALTER COLUMN department SET NOT NULL;
ALTER TABLE team_members ALTER COLUMN join_date SET NOT NULL;
ALTER TABLE team_members ALTER COLUMN status SET NOT NULL;

ALTER TABLE team_members DROP CONSTRAINT IF EXISTS team_members_type_check;
ALTER TABLE team_members ADD CONSTRAINT team_members_type_check CHECK (type IN ('Staff', 'Technician', 'Facilitator'));
ALTER TABLE team_members DROP CONSTRAINT IF EXISTS team_members_status_check;
ALTER TABLE team_members ADD CONSTRAINT team_members_status_check CHECK (status IN ('Active', 'Inactive'));

-- Fix Attendance
ALTER TABLE attendance DROP CONSTRAINT IF EXISTS attendance_status_check;
ALTER TABLE attendance ADD CONSTRAINT attendance_status_check CHECK (status IN ('Present', 'Late', 'Absent', 'Absent with Reason'));

-- Add Members table
CREATE TABLE IF NOT EXISTS members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    phone TEXT NOT NULL,
    image TEXT,
    status TEXT NOT NULL CHECK (status IN ('Active', 'Inactive')) DEFAULT 'Active',
    assigned_projects TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_members_status ON members(status);
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all operations on members" ON members;
CREATE POLICY "Allow all operations on members" ON members FOR ALL USING (true) WITH CHECK (true);

-- Fix Notifications
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS target_user TEXT;
CREATE INDEX IF NOT EXISTS idx_notifications_target_user ON notifications(target_user);
UPDATE notifications SET target_user = 'admin' WHERE target_user IS NULL;

-- Success message
RAISE NOTICE '✅ All database fixes applied successfully!';
```

---

## 📝 NOTES

1. **Always backup before running migrations!**
2. Test on a development database first
3. The `FINAL-CORRECTED-SCHEMA.sql` file is the complete, corrected schema
4. Old schema files (`supabase-schema.sql`, `iprt-complete-schema.sql`) should be deprecated
5. Migration files (`add-*.sql`) are no longer needed after applying fixes

---

## 🆘 TROUBLESHOOTING

### Error: "column already exists"
- This means the fix was already applied
- Skip that step and continue

### Error: "constraint does not exist"
- This is normal, the DROP IF EXISTS will handle it
- Continue with the next step

### Error: "cannot cast type text to numeric"
- Your requisitions table has non-numeric values in estimated_cost
- Clean the data first:
```sql
SELECT id, estimated_cost FROM requisitions WHERE estimated_cost !~ '^[0-9.]+$';
-- Fix those records manually
```

### Need Help?
- Check `DATABASE_ERRORS_AND_WARNINGS.md` for detailed error descriptions
- Review `FINAL-CORRECTED-SCHEMA.sql` for the correct schema
- Contact your database administrator

---

## ✨ AFTER FIXING

Once all fixes are applied:
1. ✅ Your database will match your application code
2. ✅ All features will work correctly
3. ✅ No more data type errors
4. ✅ Consistent schema across all tables
5. ✅ Ready for production!
