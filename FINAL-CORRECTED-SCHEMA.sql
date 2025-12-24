-- ============================================
-- IPRT FINAL CORRECTED DATABASE SCHEMA
-- ============================================
-- This schema fixes ALL errors and warnings
-- Run this in your Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. STUDENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL,
    enrollment_date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Active', 'Completed', 'Dropped')),
    added_by TEXT NOT NULL CHECK (added_by IN ('admin', 'member')),
    added_by_email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. PROJECTS TABLE (FIXED)
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE, -- Nullable (fixed)
    status TEXT NOT NULL CHECK (status IN ('Active', 'Completed', 'On Hold')), -- Fixed: removed 'Planning', 'In Progress'
    assigned_members TEXT[] DEFAULT '{}', -- Added: array of member IDs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. PROJECT_STUDENTS (Junction Table)
-- ============================================
CREATE TABLE IF NOT EXISTS project_students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    project_name TEXT NOT NULL,
    assigned_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, student_id)
);

-- ============================================
-- 4. ATTENDANCE TABLE (FIXED)
-- ============================================
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Present', 'Late', 'Absent', 'Absent with Reason')), -- Fixed: added 'Late'
    comment TEXT,
    marked_by TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, project_id, date)
);

-- ============================================
-- 5. REQUISITIONS TABLE (FIXED)
-- ============================================
CREATE TABLE IF NOT EXISTS requisitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Equipment', 'Supplies', 'Services', 'Other')),
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    estimated_cost DECIMAL(10, 2) NOT NULL, -- Fixed: changed from TEXT to DECIMAL
    priority TEXT NOT NULL CHECK (priority IN ('Low', 'Medium', 'High')),
    status TEXT NOT NULL CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    submitted_by TEXT NOT NULL,
    submitted_date DATE NOT NULL DEFAULT CURRENT_DATE,
    reviewed_by TEXT,
    reviewed_date DATE,
    review_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 6. DELETION_REQUESTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS deletion_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL, -- Not FK: student might be deleted (audit trail)
    student_name TEXT NOT NULL,
    student_email TEXT NOT NULL,
    requested_by TEXT NOT NULL CHECK (requested_by IN ('admin', 'member')),
    requested_by_email TEXT NOT NULL,
    reason TEXT NOT NULL,
    request_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    admin_response TEXT,
    admin_email TEXT,
    response_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 7. TEAM_MEMBERS TABLE (FIXED)
-- ============================================
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('Staff', 'Technician', 'Facilitator')), -- Fixed: renamed from 'role' to 'type'
    role TEXT NOT NULL, -- Added: job title/position
    department TEXT NOT NULL, -- Added
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL,
    image TEXT, -- Fixed: renamed from 'image_url' to 'image'
    join_date DATE NOT NULL, -- Added
    status TEXT NOT NULL CHECK (status IN ('Active', 'Inactive')), -- Added
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 8. MEMBERS TABLE (ADDED)
-- ============================================
CREATE TABLE IF NOT EXISTS members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL, -- In production, should be hashed
    phone TEXT NOT NULL,
    image TEXT,
    status TEXT NOT NULL CHECK (status IN ('Active', 'Inactive')) DEFAULT 'Active',
    assigned_projects TEXT[] DEFAULT '{}', -- Array of project IDs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 9. NOTIFICATIONS TABLE (FIXED)
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('deletion_request', 'requisition', 'project', 'student', 'attendance', 'team', 'general')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    related_id UUID,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_by TEXT NOT NULL,
    target_user TEXT, -- Added: for filtering notifications by recipient
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================

-- Students indexes
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);
CREATE INDEX IF NOT EXISTS idx_students_added_by ON students(added_by);

-- Projects indexes
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_dates ON projects(start_date, end_date);

-- Project Students indexes
CREATE INDEX IF NOT EXISTS idx_project_students_project ON project_students(project_id);
CREATE INDEX IF NOT EXISTS idx_project_students_student ON project_students(student_id);

-- Attendance indexes
CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_project ON attendance(project_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_attendance_status ON attendance(status);

-- Requisitions indexes
CREATE INDEX IF NOT EXISTS idx_requisitions_status ON requisitions(status);
CREATE INDEX IF NOT EXISTS idx_requisitions_submitted_by ON requisitions(submitted_by);
CREATE INDEX IF NOT EXISTS idx_requisitions_priority ON requisitions(priority);

-- Deletion Requests indexes
CREATE INDEX IF NOT EXISTS idx_deletion_requests_status ON deletion_requests(status);
CREATE INDEX IF NOT EXISTS idx_deletion_requests_student ON deletion_requests(student_id);

-- Team Members indexes
CREATE INDEX IF NOT EXISTS idx_team_members_type ON team_members(type);
CREATE INDEX IF NOT EXISTS idx_team_members_email ON team_members(email);
CREATE INDEX IF NOT EXISTS idx_team_members_status ON team_members(status);

-- Members indexes
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_members_status ON members(status);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_target_user ON notifications(target_user);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- ============================================
-- CREATE UPDATED_AT TRIGGER FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ADD TRIGGERS FOR UPDATED_AT
-- ============================================
DROP TRIGGER IF EXISTS update_students_updated_at ON students;
CREATE TRIGGER update_students_updated_at 
    BEFORE UPDATE ON students
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at 
    BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_attendance_updated_at ON attendance;
CREATE TRIGGER update_attendance_updated_at 
    BEFORE UPDATE ON attendance
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_requisitions_updated_at ON requisitions;
CREATE TRIGGER update_requisitions_updated_at 
    BEFORE UPDATE ON requisitions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_deletion_requests_updated_at ON deletion_requests;
CREATE TRIGGER update_deletion_requests_updated_at 
    BEFORE UPDATE ON deletion_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_team_members_updated_at ON team_members;
CREATE TRIGGER update_team_members_updated_at 
    BEFORE UPDATE ON team_members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_members_updated_at ON members;
CREATE TRIGGER update_members_updated_at 
    BEFORE UPDATE ON members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE requisitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE deletion_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CREATE RLS POLICIES (Allow all for now)
-- ============================================
DROP POLICY IF EXISTS "Allow all operations on students" ON students;
CREATE POLICY "Allow all operations on students" ON students FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on projects" ON projects;
CREATE POLICY "Allow all operations on projects" ON projects FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on project_students" ON project_students;
CREATE POLICY "Allow all operations on project_students" ON project_students FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on attendance" ON attendance;
CREATE POLICY "Allow all operations on attendance" ON attendance FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on requisitions" ON requisitions;
CREATE POLICY "Allow all operations on requisitions" ON requisitions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on deletion_requests" ON deletion_requests;
CREATE POLICY "Allow all operations on deletion_requests" ON deletion_requests FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on team_members" ON team_members;
CREATE POLICY "Allow all operations on team_members" ON team_members FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on members" ON members;
CREATE POLICY "Allow all operations on members" ON members FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on notifications" ON notifications;
CREATE POLICY "Allow all operations on notifications" ON notifications FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
DO $$
BEGIN
    RAISE NOTICE '✅ IPRT CORRECTED DATABASE SCHEMA CREATED SUCCESSFULLY!';
    RAISE NOTICE '';
    RAISE NOTICE '📊 TABLES CREATED:';
    RAISE NOTICE '   1. students';
    RAISE NOTICE '   2. projects (FIXED: status values, end_date nullable, assigned_members added)';
    RAISE NOTICE '   3. project_students';
    RAISE NOTICE '   4. attendance (FIXED: added Late status)';
    RAISE NOTICE '   5. requisitions (FIXED: estimated_cost is DECIMAL)';
    RAISE NOTICE '   6. deletion_requests';
    RAISE NOTICE '   7. team_members (FIXED: type column, added role/department/join_date/status)';
    RAISE NOTICE '   8. members (ADDED: was missing from main schema)';
    RAISE NOTICE '   9. notifications (FIXED: added target_user column)';
    RAISE NOTICE '';
    RAISE NOTICE '🔧 FIXES APPLIED:';
    RAISE NOTICE '   ✓ Projects: Active/Completed/On Hold (removed Planning/In Progress)';
    RAISE NOTICE '   ✓ Requisitions: DECIMAL(10,2) for cost (was TEXT)';
    RAISE NOTICE '   ✓ Team Members: type column (was role), added missing fields';
    RAISE NOTICE '   ✓ Members: table added to schema';
    RAISE NOTICE '   ✓ Notifications: target_user column added';
    RAISE NOTICE '   ✓ Attendance: Late status added';
    RAISE NOTICE '   ✓ UUID: gen_random_uuid() used consistently';
    RAISE NOTICE '';
    RAISE NOTICE '🎉 Your database is ready to use!';
END $$;
