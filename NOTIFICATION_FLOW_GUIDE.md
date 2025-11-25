# Notification Flow Guide

## Visual Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    NOTIFICATION SYSTEM FLOW                      │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐                                    ┌──────────────┐
│   MEMBER 1   │                                    │    ADMIN     │
│              │                                    │              │
│ member1@     │                                    │ admin@       │
│ iprt.edu     │                                    │ iprt.edu     │
└──────┬───────┘                                    └──────┬───────┘
       │                                                   │
       │ 1. Submits Requisition                           │
       ├──────────────────────────────────────────────────>
       │   targetUser: 'admin'                            │
       │                                                   │ ✓ Sees notification
       │                                                   │
       │                                                   │ 2. Approves Requisition
       <──────────────────────────────────────────────────┤
       │   targetUser: 'member1@iprt.edu'                 │
       │                                                   │
       │ ✓ Sees notification                              │ ✗ Does NOT see
       │                                                   │
       │                                                   │
       │ 3. Requests Student Deletion                     │
       ├──────────────────────────────────────────────────>
       │   targetUser: 'admin'                            │
       │                                                   │ ✓ Sees notification
       │                                                   │
       │                                                   │ 4. Deletes Student
       <──────────────────────────────────────────────────┤
       │   targetUser: 'member1@iprt.edu'                 │
       │                                                   │
       │ ✓ Sees notification                              │ ✗ Does NOT see
       │                                                   │
```

## Notification Types & Targeting

### 1. Requisition Notifications

#### Member → Admin
```javascript
// When member submits requisition
{
  type: 'requisition',
  title: 'New Requisition Request',
  targetUser: 'admin',  // ← Only admin sees this
  createdBy: 'member1@iprt.edu'
}
```

#### Admin → Member
```javascript
// When admin approves/rejects
{
  type: 'requisition',
  title: '✅ Requisition Approved',
  targetUser: 'member1@iprt.edu',  // ← Only this member sees this
  createdBy: 'admin@iprt.edu'
}
```

### 2. Student Deletion Notifications

#### Admin → Member
```javascript
// When admin deletes student added by member
{
  type: 'student',
  title: '🗑️ Student Deleted by Admin',
  targetUser: 'member1@iprt.edu',  // ← Only member who added sees this
  createdBy: 'admin@iprt.edu'
}
```

### 3. Deletion Request Notifications

#### Member → Admin
```javascript
// When member requests deletion
{
  type: 'deletion_request',
  title: 'New Student Deletion Request',
  targetUser: 'admin',  // ← Only admin sees this
  createdBy: 'member1@iprt.edu'
}
```

## Filtering Logic

### Admin View
```typescript
// Admin sees EVERYTHING
const notifications = await notificationStore.getAll('admin', 'admin@iprt.edu');
// Returns ALL notifications regardless of targetUser
```

### Member View
```typescript
// Member sees only their notifications
const notifications = await notificationStore.getAll('member', 'member1@iprt.edu');
// Returns only where:
//   - targetUser = 'member1@iprt.edu' OR
//   - targetUser IS NULL (backwards compatibility)
```

## Real-World Scenarios

### Scenario 1: Multiple Members
```
Member 1 submits requisition
  → Admin sees notification ✓
  → Member 2 does NOT see ✗
  → Member 3 does NOT see ✗

Admin approves Member 1's requisition
  → Member 1 sees notification ✓
  → Member 2 does NOT see ✗
  → Member 3 does NOT see ✗
  → Admin does NOT see ✗
```

### Scenario 2: Student Management
```
Member 1 adds Student A
Member 2 adds Student B

Admin deletes Student A
  → Member 1 sees notification ✓
  → Member 2 does NOT see ✗

Admin deletes Student B
  → Member 1 does NOT see ✗
  → Member 2 sees notification ✓
```

### Scenario 3: Deletion Requests
```
Member 1 requests to delete Student A
  → Admin sees notification ✓
  → Member 2 does NOT see ✗
  → Member 3 does NOT see ✗

Member 2 requests to delete Student B
  → Admin sees notification ✓
  → Member 1 does NOT see ✗
  → Member 3 does NOT see ✗

Admin sees BOTH deletion requests ✓
```

## Implementation Details

### Database Schema
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  related_id TEXT,
  created_by TEXT,
  target_user TEXT,  -- ← NEW FIELD
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_target_user ON notifications(target_user);
```

### Query Examples

#### Get Admin Notifications
```sql
-- Admin sees ALL
SELECT * FROM notifications 
ORDER BY created_at DESC;
```

#### Get Member Notifications
```sql
-- Member sees only their own
SELECT * FROM notifications 
WHERE target_user = 'member1@iprt.edu' 
   OR target_user IS NULL
ORDER BY created_at DESC;
```

## Privacy & Security

✅ **Privacy Protected**: Members cannot see other members' notifications
✅ **Admin Oversight**: Admin can see all system activity
✅ **Targeted Delivery**: Each notification goes to the right person
✅ **No Leakage**: Sensitive information stays private

## Testing Commands

### Test as Admin
1. Login as admin
2. Check notification bell - should see all notifications
3. Submit requisition as member (in another browser/incognito)
4. Admin should immediately see the new requisition notification

### Test as Member
1. Login as member1@iprt.edu
2. Submit a requisition
3. Check notification bell - should NOT see your own submission
4. Have admin approve it
5. Check notification bell - should now see approval notification
6. Login as member2@iprt.edu in another browser
7. member2 should NOT see member1's notifications

## Troubleshooting

### Issue: Member sees all notifications
**Solution**: Check that `userRole` and `userEmail` props are passed to NotificationBell

### Issue: Admin sees no notifications
**Solution**: Verify SQL migration ran successfully and `target_user` column exists

### Issue: Old notifications not showing
**Solution**: Run update query to set `target_user = 'admin'` for existing notifications

### Issue: Notification not appearing
**Solution**: Check that `targetUser` is set when creating notification
