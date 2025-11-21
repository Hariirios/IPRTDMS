-- ============================================
-- IPRT SAMPLE DATA - Run this AFTER creating tables
-- ============================================
-- This file contains 3 sample records for each table
-- Run this in Supabase SQL Editor after running iprt-complete-schema.sql

-- ============================================
-- 1. SAMPLE STUDENTS (3 examples)
-- ============================================
INSERT INTO students (full_name, email, phone, enrollment_date, status, added_by, added_by_email)
VALUES 
    ('Ahmed Hassan', 'ahmed.hassan@example.com', '+252-61-234-5678', '2024-01-10', 'Active', 'admin', 'admin@iprt.edu'),
    ('Fatima Ali', 'fatima.ali@example.com', '+252-61-234-5679', '2024-01-12', 'Active', 'admin', 'admin@iprt.edu'),
    ('Mohamed Omar', 'mohamed.omar@example.com', '+252-61-234-5680', '2024-01-15', 'Active', 'member', 'member@iprt.edu')
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- 2. SAMPLE PROJECTS (3 examples)
-- ============================================
INSERT INTO projects (name, description, start_date, end_date, status, assigned_members)
VALUES 
    ('Research Methods Training', 'Comprehensive training on research methodologies and data analysis', '2024-01-15', '2024-06-15', 'Active', ARRAY['Dr. Ahmed', 'Prof. Fatima']),
    ('Data Science Bootcamp', 'Intensive bootcamp covering Python, ML, and data visualization', '2024-02-01', '2024-05-01', 'Active', ARRAY['Dr. Mohamed']),
    ('Leadership Development Program', 'Building leadership skills and management capabilities', '2024-03-01', '2024-08-01', 'Active', ARRAY['Dr. Sarah', 'Prof. Ali'])
ON CONFLICT DO NOTHING;

-- ============================================
-- 3. SAMPLE TEAM MEMBERS (3 examples)
-- ============================================
INSERT INTO team_members (name, type, role, department, email, phone, join_date, status)
VALUES 
    ('Dr. Ahmed Ibrahim', 'Staff', 'Director', 'Administration', 'ahmed.ibrahim@iprt.edu', '+252-61-111-1111', '2023-01-01', 'Active'),
    ('Amina Hassan', 'Facilitator', 'Lead Facilitator', 'Training', 'amina.hassan@iprt.edu', '+252-61-222-2222', '2023-03-15', 'Active'),
    ('Omar Ali', 'Technician', 'Senior Technician', 'IT & Technology', 'omar.ali@iprt.edu', '+252-61-333-3333', '2023-06-01', 'Active')
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- 4. SAMPLE REQUISITIONS (3 examples)
-- ============================================
INSERT INTO requisitions (title, description, category, quantity, estimated_cost, priority, status, submitted_by, submitted_date)
VALUES 
    ('Laptop for Research', 'High-performance laptop for data analysis and research work', 'Equipment', 1, 1200.00, 'High', 'Pending', 'member@iprt.edu', '2024-01-20'),
    ('Office Supplies', 'Pens, papers, folders, and other office supplies for training sessions', 'Supplies', 50, 150.00, 'Medium', 'Approved', 'member@iprt.edu', '2024-01-18'),
    ('Internet Service Upgrade', 'Upgrade internet bandwidth for better online training delivery', 'Services', 1, 500.00, 'High', 'Pending', 'admin@iprt.edu', '2024-01-22')
ON CONFLICT DO NOTHING;

-- ============================================
-- 5. SAMPLE DELETION REQUESTS (3 examples)
-- ============================================
DO $$
DECLARE
    student1_id UUID;
    student2_id UUID;
    student3_id UUID;
BEGIN
    -- Get student IDs
    SELECT id INTO student1_id FROM students WHERE email = 'ahmed.hassan@example.com';
    SELECT id INTO student2_id FROM students WHERE email = 'fatima.ali@example.com';
    SELECT id INTO student3_id FROM students WHERE email = 'mohamed.omar@example.com';
    
    -- Insert deletion requests only if students exist
    IF student1_id IS NOT NULL THEN
        INSERT INTO deletion_requests (student_id, student_name, student_email, requested_by, requested_by_email, reason, request_date, status)
        VALUES 
            (student1_id, 'Ahmed Hassan', 'ahmed.hassan@example.com', 'member', 'member@iprt.edu', 'Student has withdrawn from the program', '2024-01-25', 'Pending')
        ON CONFLICT DO NOTHING;
    END IF;
    
    IF student2_id IS NOT NULL THEN
        INSERT INTO deletion_requests (student_id, student_name, student_email, requested_by, requested_by_email, reason, request_date, status, admin_response, admin_email, response_date)
        VALUES 
            (student2_id, 'Fatima Ali', 'fatima.ali@example.com', 'member', 'member@iprt.edu', 'Duplicate entry - student registered twice', '2024-01-23', 'Approved', 'Approved - duplicate confirmed', 'admin@iprt.edu', '2024-01-24')
        ON CONFLICT DO NOTHING;
    END IF;
    
    IF student3_id IS NOT NULL THEN
        INSERT INTO deletion_requests (student_id, student_name, student_email, requested_by, requested_by_email, reason, request_date, status, admin_response, admin_email, response_date)
        VALUES 
            (student3_id, 'Mohamed Omar', 'mohamed.omar@example.com', 'member', 'member@iprt.edu', 'Student requested to be removed', '2024-01-21', 'Rejected', 'Student is actively participating in projects. Please discuss with student first.', 'admin@iprt.edu', '2024-01-22')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- ============================================
-- 6. SAMPLE PROJECT-STUDENT ASSIGNMENTS (3 examples)
-- ============================================
DO $$
DECLARE
    project1_id UUID;
    project2_id UUID;
    project3_id UUID;
    student1_id UUID;
    student2_id UUID;
    student3_id UUID;
BEGIN
    -- Get project IDs
    SELECT id INTO project1_id FROM projects WHERE name = 'Research Methods Training';
    SELECT id INTO project2_id FROM projects WHERE name = 'Data Science Bootcamp';
    SELECT id INTO project3_id FROM projects WHERE name = 'Leadership Development Program';
    
    -- Get student IDs
    SELECT id INTO student1_id FROM students WHERE email = 'ahmed.hassan@example.com';
    SELECT id INTO student2_id FROM students WHERE email = 'fatima.ali@example.com';
    SELECT id INTO student3_id FROM students WHERE email = 'mohamed.omar@example.com';
    
    -- Assign students to projects
    IF project1_id IS NOT NULL AND student1_id IS NOT NULL THEN
        INSERT INTO project_students (project_id, student_id, project_name, assigned_date)
        VALUES (project1_id, student1_id, 'Research Methods Training', '2024-01-15')
        ON CONFLICT DO NOTHING;
    END IF;
    
    IF project2_id IS NOT NULL AND student2_id IS NOT NULL THEN
        INSERT INTO project_students (project_id, student_id, project_name, assigned_date)
        VALUES (project2_id, student2_id, 'Data Science Bootcamp', '2024-02-01')
        ON CONFLICT DO NOTHING;
    END IF;
    
    IF project3_id IS NOT NULL AND student3_id IS NOT NULL THEN
        INSERT INTO project_students (project_id, student_id, project_name, assigned_date)
        VALUES (project3_id, student3_id, 'Leadership Development Program', '2024-03-01')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- ============================================
-- 7. SAMPLE ATTENDANCE RECORDS (3 examples)
-- ============================================
DO $$
DECLARE
    project1_id UUID;
    project2_id UUID;
    student1_id UUID;
    student2_id UUID;
    student3_id UUID;
BEGIN
    -- Get IDs
    SELECT id INTO project1_id FROM projects WHERE name = 'Research Methods Training';
    SELECT id INTO project2_id FROM projects WHERE name = 'Data Science Bootcamp';
    SELECT id INTO student1_id FROM students WHERE email = 'ahmed.hassan@example.com';
    SELECT id INTO student2_id FROM students WHERE email = 'fatima.ali@example.com';
    SELECT id INTO student3_id FROM students WHERE email = 'mohamed.omar@example.com';
    
    -- Insert attendance records
    IF project1_id IS NOT NULL AND student1_id IS NOT NULL THEN
        INSERT INTO attendance (student_id, project_id, date, status, comment, marked_by)
        VALUES 
            (student1_id, project1_id, '2024-01-16', 'Present', NULL, 'member@iprt.edu')
        ON CONFLICT DO NOTHING;
    END IF;
    
    IF project2_id IS NOT NULL AND student2_id IS NOT NULL THEN
        INSERT INTO attendance (student_id, project_id, date, status, comment, marked_by)
        VALUES 
            (student2_id, project2_id, '2024-02-02', 'Absent with Reason', 'Medical appointment', 'member@iprt.edu')
        ON CONFLICT DO NOTHING;
    END IF;
    
    IF project1_id IS NOT NULL AND student3_id IS NOT NULL THEN
        INSERT INTO attendance (student_id, project_id, date, status, comment, marked_by)
        VALUES 
            (student3_id, project1_id, '2024-01-17', 'Present', NULL, 'admin@iprt.edu')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- ============================================
-- 8. SAMPLE NOTIFICATIONS (3 examples)
-- ============================================
INSERT INTO notifications (type, title, message, is_read, created_by)
VALUES 
    ('deletion_request', 'New Student Deletion Request', 'member@iprt.edu requested to delete student: Ahmed Hassan', false, 'member@iprt.edu'),
    ('requisition', 'New Requisition Request', 'member@iprt.edu submitted a requisition for Laptop for Research', false, 'member@iprt.edu'),
    ('general', 'System Update', 'Database backup completed successfully', true, 'system@iprt.edu')
ON CONFLICT DO NOTHING;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
DO $$
BEGIN
    RAISE NOTICE '✅ Sample data inserted successfully!';
    RAISE NOTICE '📊 3 records added to each table';
    RAISE NOTICE '🎉 Your database is ready to test!';
END $$;
