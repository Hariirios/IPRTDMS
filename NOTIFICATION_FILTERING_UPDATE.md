# Notification Filtering System Update

## Overview
Updated the notification system to properly filter notifications based on user roles:
- **Admin**: Receives ALL notifications from all members
- **Members**: Only receive notifications related to their own actions

## Changes Made

### 1. Database Schema Update
**File**: `add-notification-target-user.sql`
- Added `target_user` column to `notifications` table
- Created index for better query performance
- Set existing notifications to target 'admin'

**To apply**: Run this SQL in your Supabase SQL Editor

### 2. Notification Store Updates
**File**: `lib/notificationStore.ts`
- Added `targetUser` field to `Notification` interface
- Updated `getAll()` method to accept optional `userRole` and `userEmail` parameters
- Implemented filtering logic:
  - Admin sees all notifications
  - Members only see notifications where `target_user` matches their email
- Updated `add()` method to include `targetUser` field

### 3. NotificationBell Component Updates
**File**: `components/admin/NotificationBell.tsx`
- Added `userRole` and `userEmail` props
- Passes these props to `notificationStore.getAll()` for filtering
- Defaults to admin role if not specified

### 4. Admin Page Integration
**File**: `pages/Admin.tsx`
- Admin dashboard: Passes `userRole="admin"` and `userEmail="admin@iprt.edu"`
- Member dashboard: Passes `userRole="member"` and current member's email

### 5. Notification Creation Updates
Updated all notification creation calls to include `targetUser`:

**File**: `components/admin/RequisitionsAdmin.tsx`
- New requisition from member → `targetUser: 'admin'`
- Requisition approved → `targetUser: requisition.submitted_by`
- Requisition rejected → `targetUser: requisition.submitted_by`
- Requisition under review → `targetUser: requisition.submitted_by`

**File**: `components/admin/StudentsAdmin.tsx`
- Student deleted by admin → `targetUser: studentToDelete.addedByEmail`

**File**: `lib/deletionRequestStore.ts`
- New deletion request → `targetUser: 'admin'`

## How It Works

### For Admin
```typescript
// Admin sees ALL notifications
notificationStore.getAll('admin', 'admin@iprt.edu')
// Returns all notifications regardless of target_user
```

### For Members
```typescript
// Member only sees their own notifications
notificationStore.getAll('member', 'member1@iprt.edu')
// Returns only notifications where:
// - target_user = 'member1@iprt.edu' OR
// - target_user IS NULL (for backwards compatibility)
```

## Notification Flow Examples

### Example 1: Member Submits Requisition
1. Member submits requisition
2. Notification created with `targetUser: 'admin'`
3. **Result**: Only admin sees this notification

### Example 2: Admin Approves Requisition
1. Admin approves requisition
2. Notification created with `targetUser: requisition.submitted_by` (e.g., 'member1@iprt.edu')
3. **Result**: Only the member who submitted sees this notification

### Example 3: Admin Deletes Student
1. Admin deletes student added by member
2. Notification created with `targetUser: studentToDelete.addedByEmail`
3. **Result**: Only the member who added the student sees this notification

## Testing Checklist

- [ ] Run SQL migration in Supabase
- [ ] Test admin login - should see all notifications
- [ ] Test member login - should only see their own notifications
- [ ] Submit requisition as member - admin should receive notification
- [ ] Approve requisition as admin - only submitting member should receive notification
- [ ] Delete student as admin - only member who added it should receive notification
- [ ] Verify notification bell badge counts are correct for each role

## Database Migration

Run this SQL in your Supabase SQL Editor:

```sql
-- Add target_user field to notifications table
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS target_user TEXT;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_target_user ON notifications(target_user);

-- Update existing notifications to target admin
UPDATE notifications SET target_user = 'admin' WHERE target_user IS NULL;
```

## Notes

- Existing notifications without `target_user` will be visible to all users for backwards compatibility
- The system uses email addresses for member targeting (e.g., 'member1@iprt.edu')
- Admin notifications use the special value 'admin' as the target
- All notification creation points have been updated to include proper targeting
