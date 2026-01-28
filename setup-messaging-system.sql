-- ============================================
-- SETUP INTERNAL MESSAGING SYSTEM
-- ============================================
-- Run this in Supabase SQL Editor to ensure messaging system is ready

-- Check if messages table exists
DO $
DECLARE
    table_exists boolean;
BEGIN
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'messages'
    ) INTO table_exists;
    
    IF table_exists THEN
        RAISE NOTICE '✅ Messages table already exists';
    ELSE
        RAISE NOTICE '❌ Messages table does not exist - creating now...';
        
        -- Create messages table
        CREATE TABLE messages (
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
        CREATE INDEX idx_messages_recipient ON messages(recipient_id, recipient_type);
        CREATE INDEX idx_messages_sender ON messages(sender_id, sender_type);
        CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
        CREATE INDEX idx_messages_unread ON messages(recipient_id, is_read) WHERE is_read = false;

        -- Enable RLS
        ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

        -- Create policies
        CREATE POLICY "Users can view their own messages" ON messages 
        FOR SELECT USING (
            (sender_id = auth.uid()::text) OR 
            (recipient_id = auth.uid()::text)
        );

        CREATE POLICY "Users can send messages" ON messages 
        FOR INSERT WITH CHECK (sender_id = auth.uid()::text);

        CREATE POLICY "Users can update their received messages" ON messages 
        FOR UPDATE USING (recipient_id = auth.uid()::text);

        -- Create function to update updated_at timestamp
        CREATE OR REPLACE FUNCTION update_messages_updated_at()
        RETURNS TRIGGER AS $
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $ LANGUAGE plpgsql;

        -- Create trigger for updated_at
        CREATE TRIGGER trigger_update_messages_updated_at
            BEFORE UPDATE ON messages
            FOR EACH ROW
            EXECUTE FUNCTION update_messages_updated_at();

        RAISE NOTICE '✅ Messages table created successfully!';
    END IF;
END $;

-- Check if admin_users table exists and has required fields
DO $
DECLARE
    admin_table_exists boolean;
    username_column_exists boolean;
BEGIN
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'admin_users'
    ) INTO admin_table_exists;
    
    IF admin_table_exists THEN
        SELECT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'admin_users'
            AND column_name = 'username'
        ) INTO username_column_exists;
        
        IF username_column_exists THEN
            RAISE NOTICE '✅ admin_users table exists with username field';
        ELSE
            RAISE NOTICE '❌ admin_users table missing username field';
        END IF;
    ELSE
        RAISE NOTICE '❌ admin_users table does not exist';
    END IF;
END $;

-- Check if members table exists and has required fields
DO $
DECLARE
    members_table_exists boolean;
    name_column_exists boolean;
BEGIN
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'members'
    ) INTO members_table_exists;
    
    IF members_table_exists THEN
        SELECT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'members'
            AND column_name = 'name'
        ) INTO name_column_exists;
        
        IF name_column_exists THEN
            RAISE NOTICE '✅ members table exists with name field';
        ELSE
            RAISE NOTICE '❌ members table missing name field';
        END IF;
    ELSE
        RAISE NOTICE '❌ members table does not exist';
    END IF;
END $;

-- Insert sample messages for testing (optional)
INSERT INTO messages (sender_id, sender_type, sender_name, recipient_id, recipient_type, recipient_name, subject, message) 
VALUES
    ('admin-1', 'admin', 'Admin', 'member-1', 'member', 'John Doe', 'Welcome to IPRT', 'Welcome to the Institute for Practical Research & Training. We are excited to have you as part of our community.'),
    ('member-1', 'member', 'John Doe', 'admin-1', 'admin', 'Admin', 'Question about Project', 'Hi, I have a question about the current project assignment. Could you please clarify the requirements?')
ON CONFLICT DO NOTHING;

-- Final status check
DO $
DECLARE
    message_count INTEGER;
    admin_count INTEGER;
    member_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO message_count FROM messages;
    SELECT COUNT(*) INTO admin_count FROM admin_users WHERE is_active = true;
    SELECT COUNT(*) INTO member_count FROM members WHERE status = 'Active';
    
    RAISE NOTICE '';
    RAISE NOTICE '🎉 MESSAGING SYSTEM SETUP COMPLETE!';
    RAISE NOTICE '';
    RAISE NOTICE '📊 CURRENT STATUS:';
    RAISE NOTICE '   Messages: % total', message_count;
    RAISE NOTICE '   Active Admins: %', admin_count;
    RAISE NOTICE '   Active Members: %', member_count;
    RAISE NOTICE '';
    RAISE NOTICE '✨ The messaging system is ready to use!';
    RAISE NOTICE '   - Admins can message members';
    RAISE NOTICE '   - Members can message admins';
    RAISE NOTICE '   - Message button appears in bottom-right corner';
    RAISE NOTICE '   - Real-time unread count updates';
END $;