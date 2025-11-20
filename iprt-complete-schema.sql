-- ============================================
-- IPRT Complete Database Schema for Supabase
-- Based on Admin Dashboard Forms Analysis
-- ============================================
-- Run this script in your Supabase SQL Editor
-- URL: https://app.supabase.com/project/wozvgekvgdggjwayamxn/sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. STUDENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
-- 2. PROJECTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    status TEXT NOT NULL CHECK (status IN ('Active', 'Completed', 'On Hold')),
    assigned_members TEXT[], -- Array of member names/emails
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. PROJECT_STUDENTS (Junction Table)
-- ============================================
CREATE TABLE IF NOT EXISTS project_students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    project_name TEXT NOT NULL, -- Denormalized for easier queries
    assigned_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, student_id)
);

-- ============================================
-- 4. ATTENDANCE TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Present', 'Absent', 'Absent with Reason')),
    comment TEXT,
    marked_by TEXT NOT NULL, -- Email of person who marked attendance
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, project_id, date)
);

-- ============================================
-- 5. REQUISITIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS requisitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Equipment', 'Supplies', 'Services', 'Other')),
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    estimated_cost DECIMAL(10, 2) NOT NULL,
    priority TEXT NOT NULL CHECK (priority IN ('Low', 'Medium', 'High')),
    status TEXT NOT NULL CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    submitted_by TEXT NOT NULL, -- Email of submitter
    submitted_date DATE NOT NULL DEFAULT CURRENT_DATE,
    reviewed_by TEXT, -- Email of reviewer
    reviewed_date DATE,
    review_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 6. DELETION_REQUESTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS deletion_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL, -- Not FK because student might be deleted
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
-- 7. TEAM_MEMBERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('Staff', 'Technician', 'Facilitator')),
    role TEXT NOT NULL,
    department TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL,
    image TEXT, -- Base64 or URL
    join_date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Active', 'Inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 8. NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL CHECK (type IN ('deletion_request', 'requisition', 'project', 'student', 'attendance', 'team', 'general')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    related_id UUID, -- ID of related item
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_by TEXT NOT NULL, -- Email of creator
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

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
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
CREATE TRIGGER update_students_updated_at 
    BEFORE UPDATE ON students
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at 
    BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attendance_updated_at 
    BEFORE UPDATE ON attendance
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_requisitions_updated_at 
    BEFORE UPDATE ON requisitions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deletion_requests_updated_at 
    BEFORE UPDATE ON deletion_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at 
    BEFORE UPDATE ON team_members
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
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CREATE RLS POLICIES (Allow all for now - adjust for production)
-- ============================================

-- Students policies
CREATE POLICY "Allow all operations on students" ON students FOR ALL USING (true) WITH CHECK (true);

-- Projects policies
CREATE POLICY "Allow all operations on projects" ON projects FOR ALL USING (true) WITH CHECK (true);

-- Project Students policies
CREATE POLICY "Allow all operations on project_students" ON project_students FOR ALL USING (true) WITH CHECK (true);

-- Attendance policies
CREATE POLICY "Allow all operations on attendance" ON attendance FOR ALL USING (true) WITH CHECK (true);

-- Requisitions policies
CREATE POLICY "Allow all operations on requisitions" ON requisitions FOR ALL USING (true) WITH CHECK (true);

-- Deletion Requests policies
CREATE POLICY "Allow all operations on deletion_requests" ON deletion_requests FOR ALL USING (true) WITH CHECK (true);

-- Team Members policies
CREATE POLICY "Allow all operations on team_members" ON team_members FOR ALL USING (true) WITH CHECK (true);

-- Notifications policies
CREATE POLICY "Allow all operations on notifications" ON notifications FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- INSERT SAMPLE DATA
-- ============================================

-- Sample Students
INSERT INTO students (full_name, email, phone, enrollment_date, status, added_by, added_by_email)
VALUES 
    ('Ahmed Hassan', 'ahmed.hassan@example.com', '+252-61-234-5678', '2024-01-10', 'Active', 'admin', 'admin@iprt.edu'),
    ('Fatima Ali', 'fatima.ali@example.com', '+252-61-234-5679', '2024-01-12', 'Active', 'admin', 'admin@iprt.edu'),
    ('Mohamed Omar', 'mohamed.omar@example.com', '+252-61-234-5680', '2024-01-15', 'Active', 'member', 'member@iprt.edu')
ON CONFLICT (email) DO NOTHING;

-- Sample Projects
INSERT INTO projects (name, description, start_date, end_date, status, assigned_members)
VALUES 
    ('Research Methods Training', 'Comprehensive training on research methodologies and data analysis', '2024-01-15', '2024-06-15', 'Active', ARRAY['Dr. Ahmed', 'Prof. Fatima']),
    ('Data Science Bootcamp', 'Intensive bootcamp covering Python, ML, and data visualization', '2024-02-01', '2024-05-01', 'Active', ARRAY['Dr. Mohamed'])
ON CONFLICT DO NOTHING;

-- Sample Team Members
INSERT INTO team_members (name, type, role, department, email, phone, join_date, status)
VALUES 
    ('Dr. Ahmed Ibrahim', 'Staff', 'Director', 'Administration', 'ahmed.ibrahim@iprt.edu', '+252-61-111-1111', '2023-01-01', 'Active'),
    ('Amina Hassan', 'Facilitator', 'Lead Facilitator', 'Training', 'amina.hassan@iprt.edu', '+252-61-222-2222', '2023-03-15', 'Active'),
    ('Omar Ali', 'Technician', 'Senior Technician', 'IT & Technology', 'omar.ali@iprt.edu', '+252-61-333-3333', '2023-06-01', 'Active')
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- CREATE VIEWS FOR COMMON QUERIES
-- ============================================

-- View: Students with project count
CREATE OR REPLACE VIEW students_with_projects AS
SELECT 
    s.*,
    COUNT(ps.project_id) as project_count
FROM students s
LEFT JOIN project_students ps ON s.id = ps.student_id
GROUP BY s.id;

-- View: Projects with student count
CREATE OR REPLACE VIEW projects_with_students AS
SELECT 
    p.*,
    COUNT(ps.student_id) as student_count
FROM projects p
LEFT JOIN project_students ps ON p.id = ps.project_id
GROUP BY p.id;

-- View: Attendance summary by student
CREATE OR REPLACE VIEW attendance_summary AS
SELECT 
    s.id as student_id,
    s.full_name,
    s.email,
    COUNT(a.id) as total_records,
    COUNT(CASE WHEN a.status = 'Present' THEN 1 END) as present_count,
    COUNT(CASE WHEN a.status = 'Absent' THEN 1 END) as absent_count,
    COUNT(CASE WHEN a.status = 'Absent with Reason' THEN 1 END) as absent_with_reason_count,
    ROUND(
        (COUNT(CASE WHEN a.status = 'Present' THEN 1 END)::DECIMAL / 
        NULLIF(COUNT(a.id), 0) * 100), 2
    ) as attendance_percentage
FROM students s
LEFT JOIN attendance a ON s.id = a.student_id
GROUP BY s.id, s.full_name, s.email;

-- View: Requisitions summary
CREATE OR REPLACE VIEW requisitions_summary AS
SELECT 
    status,
    COUNT(*) as count,
    SUM(estimated_cost) as total_cost,
    AVG(estimated_cost) as avg_cost
FROM requisitions
GROUP BY status;

-- ============================================
-- CREATE HELPER FUNCTIONS
-- ============================================

-- Function: Get student attendance percentage
CREATE OR REPLACE FUNCTION get_student_attendance_percentage(student_uuid UUID)
RETURNS DECIMAL AS $$
DECLARE
    attendance_pct DECIMAL;
BEGIN
    SELECT 
        ROUND(
            (COUNT(CASE WHEN status = 'Present' THEN 1 END)::DECIMAL / 
            NULLIF(COUNT(*), 0) * 100), 2
        )
    INTO attendance_pct
    FROM attendance
    WHERE student_id = student_uuid;
    
    RETURN COALESCE(attendance_pct, 0);
END;
$$ LANGUAGE plpgsql;

-- Function: Get pending notifications count
CREATE OR REPLACE FUNCTION get_unread_notifications_count()
RETURNS INTEGER AS $$
BEGIN
    RETURN (SELECT COUNT(*) FROM notifications WHERE is_read = FALSE);
END;
$$ LANGUAGE plpgsql;

-- Function: Get pending deletion requests count
CREATE OR REPLACE FUNCTION get_pending_deletion_requests_count()
RETURNS INTEGER AS $$
BEGIN
    RETURN (SELECT COUNT(*) FROM deletion_requests WHERE status = 'Pending');
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
DO $$
BEGIN
    RAISE NOTICE '✅ IPRT Database Schema Created Successfully!';
    RAISE NOTICE '📊 Tables: students, projects, project_students, attendance, requisitions, deletion_requests, team_members, notifications';
    RAISE NOTICE '🔍 Views: students_with_projects, projects_with_students, attendance_summary, requisitions_summary';
    RAISE NOTICE '⚡ Functions: get_student_attendance_percentage, get_unread_notifications_count, get_pending_deletion_requests_count';
    RAISE NOTICE '🎉 Your database is ready to use!';
END $$;
