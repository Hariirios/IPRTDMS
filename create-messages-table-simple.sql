-- ============================================
-- CREATE MESSAGES TABLE - SIMPLE VERSION
-- ============================================
-- Run this in Supabase SQL Editor if messages table doesn't exist

-- Drop existing table if you want to recreate it
-- DROP TABLE IF EXISTS messages;

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
CREATE INDEX IF NOT EXISTS idx_messages_unread ON messages(recipient_id, is_read) WHERE is_read = false;

-- Enable RLS (Row Level Security)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create simple policies that allow all operations for now
DROP POLICY IF EXISTS "Allow all operations on messages" ON messages;
CREATE POLICY "Allow all operations on messages" ON messages FOR ALL USING (true) WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS trigger_update_messages_updated_at ON messages;
CREATE TRIGGER trigger_update_messages_updated_at
    BEFORE UPDATE ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_messages_updated_at();

-- Insert sample messages for testing
INSERT INTO messages (sender_id, sender_type, sender_name, recipient_id, recipient_type, recipient_name, subject, message) 
VALUES
    ('admin-1', 'admin', 'Admin', 'member-1', 'member', 'John Doe', 'Welcome to IPRT', 'Welcome to the Institute for Practical Research & Training. We are excited to have you as part of our community.'),
    ('member-1', 'member', 'John Doe', 'admin-1', 'admin', 'Admin', 'Question about Project', 'Hi, I have a question about the current project assignment. Could you please clarify the requirements?')
ON CONFLICT DO NOTHING;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Messages table created successfully!';
    RAISE NOTICE 'You can now use the internal messaging system.';
END $$;