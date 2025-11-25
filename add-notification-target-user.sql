-- Add target_user field to notifications table
-- This allows filtering notifications by recipient
-- Run this in your Supabase SQL Editor

-- Add target_user column
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS target_user TEXT;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_target_user ON notifications(target_user);

-- Update existing notifications to target admin
UPDATE notifications SET target_user = 'admin' WHERE target_user IS NULL;

-- Verify the change
SELECT id, title, created_by, target_user FROM notifications LIMIT 5;
