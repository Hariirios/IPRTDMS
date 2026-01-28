# Messaging System Setup Guide

## Quick Setup Steps

### Step 1: Create Messages Table
Run this SQL in your Supabase SQL Editor:

```sql
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
```

### Step 2: Create Indexes
```sql
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id, recipient_type);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id, sender_type);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
```

### Step 3: Enable Row Level Security
```sql
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
```

### Step 4: Create Policies
```sql
DROP POLICY IF EXISTS "Allow all operations on messages" ON messages;
CREATE POLICY "Allow all operations on messages" ON messages FOR ALL USING (true) WITH CHECK (true);
```

### Step 5: Test with Sample Data
```sql
INSERT INTO messages (sender_id, sender_type, sender_name, recipient_id, recipient_type, recipient_name, subject, message) 
VALUES
    ('admin-1', 'admin', 'Admin', 'member-1', 'member', 'John Doe', 'Welcome to IPRT', 'Welcome to the Institute for Practical Research & Training.'),
    ('member-1', 'member', 'John Doe', 'admin-1', 'admin', 'Admin', 'Question about Project', 'Hi, I have a question about the current project assignment.')
ON CONFLICT DO NOTHING;
```

## Alternative: Use the Basic SQL File

Instead of running individual commands, you can run the entire `create-messages-table-basic.sql` file in your Supabase SQL Editor.

## Troubleshooting

### If you get "relation messages does not exist" error:
1. Make sure you ran the CREATE TABLE command
2. Check that you're in the correct database/project in Supabase
3. Verify the table was created in the Tables section of Supabase dashboard

### If you get permission errors:
1. Make sure RLS is enabled: `ALTER TABLE messages ENABLE ROW LEVEL SECURITY;`
2. Make sure the policy allows operations: The policy above allows all operations for testing

### If messages aren't sending:
1. Check browser console for detailed error messages
2. Verify your Supabase connection in the Network tab
3. Make sure your .env file has correct SUPABASE_URL and SUPABASE_ANON_KEY

## Verification

After setup, you should be able to:
1. See the messages table in your Supabase dashboard
2. Open the messaging modal in your app
3. See sample messages in the inbox
4. Send new messages successfully

## Next Steps

Once the basic setup works:
1. You can add more sophisticated RLS policies for security
2. Add message attachments support
3. Implement real-time notifications
4. Add message search functionality