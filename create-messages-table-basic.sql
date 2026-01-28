-- ============================================
-- CREATE MESSAGES TABLE - BASIC VERSION
-- ============================================
-- Run this in Supabase SQL Editor

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id TEXT NOT NULL,
    sender_type TEXT NOT NULL CHECK (sender_type IN ('admin', 'member')),
    sender_name TEXT NOT NULL,
    recipient_id TEXT NOT NULL,
    recipient_type TEXT NOT NULL CHECK (recipient_type IN ('admin', 'member')),
    recipient_name TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id, recipient_type);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id, sender_type);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create simple policies that allow all operations for now
DROP POLICY IF EXISTS "Allow all operations on messages" ON messages;
CREATE POLICY "Allow all operations on messages" ON messages FOR ALL USING (true) WITH CHECK (true);

-- Insert sample messages for testing
INSERT INTO messages (sender_id, sender_type, sender_name, recipient_id, recipient_type, recipient_name, subject, message) 
VALUES
    ('admin-1', 'admin', 'Admin', 'member-1', 'member', 'John Doe', 'Welcome to IPRT', 'Welcome to the Institute for Practical Research & Training. We are excited to have you as part of our community.'),
    ('member-1', 'member', 'John Doe', 'admin-1', 'admin', 'Admin', 'Question about Project', 'Hi, I have a question about the current project assignment. Could you please clarify the requirements?')
ON CONFLICT DO NOTHING;