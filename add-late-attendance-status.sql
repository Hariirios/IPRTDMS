-- Add 'Late' option to attendance status
-- Run this in your Supabase SQL Editor

-- Drop the existing constraint
ALTER TABLE attendance DROP CONSTRAINT IF EXISTS attendance_status_check;

-- Add new constraint with 'Late' option
ALTER TABLE attendance ADD CONSTRAINT attendance_status_check 
CHECK (status IN ('Present', 'Late', 'Absent', 'Absent with Reason'));

-- Update any existing 'Present' records if needed (optional)
-- UPDATE attendance SET status = 'Late' WHERE status = 'Present' AND comment LIKE '%late%';

-- Verify the change
SELECT DISTINCT status FROM attendance;
