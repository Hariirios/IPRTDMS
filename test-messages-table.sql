-- Test if messages table exists and create if needed
-- Run this in Supabase SQL Editor

-- Check if messages table exists
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'messages'
);

-- If the above returns false, run the basic table creation:
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

-- Enable RLS and create policy
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all operations on messages" ON messages;
CREATE POLICY "Allow all operations on messages" ON messages FOR ALL USING (true) WITH CHECK (true);

-- Test insert
INSERT INTO messages (sender_id, sender_type, sender_name, recipient_id, recipient_type, recipient_name, subject, message) 
VALUES ('test-admin', 'admin', 'Test Admin', 'test-member', 'member', 'Test Member', 'Test Message', 'This is a test message.')
ON CONFLICT DO NOTHING;

-- Verify
SELECT COUNT(*) as message_count FROM messages;