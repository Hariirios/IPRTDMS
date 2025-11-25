# 🚀 Quick Start: Notification System

## 1️⃣ Run SQL Migration (REQUIRED)

Open Supabase SQL Editor and run:

```sql
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS target_user TEXT;
CREATE INDEX IF NOT EXISTS idx_notifications_target_user ON notifications(target_user);
UPDATE notifications SET target_user = 'admin' WHERE target_user IS NULL;
```

## 2️⃣ How It Works Now

### Admin 👨‍💼
- Sees **ALL** notifications from all members
- No filtering applied

### Members 👥
- See **ONLY** their own notifications
- Filtered by their email address

## 3️⃣ Creating Notifications

### Send to Admin
```typescript
await notificationStore.add({
  type: 'requisition',
  title: 'New Requisition',
  message: 'Member submitted a requisition',
  targetUser: 'admin'  // ← Goes to admin only
});
```

### Send to Specific Member
```typescript
await notificationStore.add({
  type: 'requisition',
  title: 'Requisition Approved',
  message: 'Your requisition was approved',
  targetUser: 'member1@iprt.edu'  // ← Goes to this member only
});
```

## 4️⃣ Testing Checklist

- [ ] SQL migration completed
- [ ] Admin login → sees all notifications
- [ ] Member login → sees only their notifications
- [ ] Submit requisition as member → admin receives notification
- [ ] Approve requisition as admin → member receives notification
- [ ] Member A cannot see Member B's notifications

## 5️⃣ Common Patterns

| Action | targetUser Value |
|--------|------------------|
| Member → Admin | `'admin'` |
| Admin → Specific Member | `member.email` |
| System → Admin | `'admin'` |

## 6️⃣ Troubleshooting

**Problem**: Member sees all notifications
**Fix**: Check NotificationBell has `userRole="member"` prop

**Problem**: Admin sees no notifications  
**Fix**: Verify SQL migration ran successfully

**Problem**: Notifications not appearing
**Fix**: Ensure `targetUser` is set when creating notification

## That's It! 🎉

The system is now configured for role-based notification filtering.
