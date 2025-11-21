# 🧪 Complete Testing Guide - Admin & Member Connection

## 📋 Prerequisites:

1. ✅ Run `add-members-table.sql` in Supabase
2. ✅ Run `add-projects-table.sql` in Supabase
3. ✅ Enable real-time for `members` table
4. ✅ Enable real-time for `projects` table
5. ✅ Run `npm run dev`

## 🎯 Test Scenario 1: Assign Project to Member

### Step 1: Login as Admin
```
URL: http://localhost:5173/admin
Email: admin@iprt.edu
Password: admin123
```

### Step 2: View Projects
1. Click on "Projects" tab
2. You should see 5 sample projects:
   - Mental Health Awareness Campaign (Active)
   - Youth Counseling Program (Active)
   - Stress Management Workshop Series (On Hold)
   - Community Support Groups (Active)
   - Parenting Skills Training (Completed)

### Step 3: Assign Member to Project
1. Find "Mental Health Awareness Campaign"
2. Click the "Assign" button
3. Modal opens showing all members
4. Check the box next to "John Doe"
5. Notice:
   - ✅ Toast notification: "Member assigned to project!"
   - ✅ John Doe's name appears in purple badge on project card
   - ✅ Modal updates immediately

### Step 4: Verify in Members Tab
1. Click on "Members" tab
2. Find John Doe's card
3. Should show: "📁 1 Project" (updated from 0)

### Step 5: Logout
1. Click "Logout" button

## 🎯 Test Scenario 2: Member Views Assigned Project

### Step 1: Login as Member
```
URL: http://localhost:5173/admin
Click "Member" tab
Email: john.doe@iprt.edu
Password: member123
```

### Step 2: Check Dashboard
1. Should see welcome message: "Welcome back, John Doe!"
2. Check statistics:
   - My Projects: **1** (not 0!)
   - 1 Active
3. This confirms the connection works!

### Step 3: View Projects Tab
1. Click on "My Projects" tab (or the Projects icon in sidebar)
2. Should see: "Mental Health Awareness Campaign"
3. Project details should match what admin assigned
4. Should show:
   - Status: Active
   - Description
   - Start/End dates
   - 0 Students (initially)

### Step 4: Add Student to Project
1. Click "Add Student" button
2. Select "Select Existing Student" tab
3. Choose a student or add new one
4. Click "Add Selected Student"
5. Student is now in the project!

## 🎯 Test Scenario 3: Real-Time Updates

### Setup: Two Browser Windows
- **Window 1**: Admin logged in
- **Window 2**: Member (John Doe) logged in

### Test Real-Time Sync:

#### Action 1: Admin Assigns Another Project
1. In Window 1 (Admin):
   - Go to Projects tab
   - Click "Assign" on "Youth Counseling Program"
   - Check "John Doe"
   
2. In Window 2 (Member):
   - Watch the dashboard
   - **Should automatically update to "2 Projects"**
   - Go to "My Projects" tab
   - **New project appears without refresh!**

#### Action 2: Admin Removes Member from Project
1. In Window 1 (Admin):
   - Click "Assign" on "Mental Health Awareness Campaign"
   - Uncheck "John Doe"
   
2. In Window 2 (Member):
   - Dashboard updates to "1 Project"
   - Project disappears from "My Projects" tab
   - **All happens in real-time!**

## 🎯 Test Scenario 4: Multiple Members

### Step 1: Assign Same Project to Multiple Members
1. Login as admin
2. Go to Projects tab
3. Click "Assign" on "Community Support Groups"
4. Check multiple members:
   - ✅ John Doe
   - ✅ Sarah Ahmed
5. Both members' names appear on project card

### Step 2: Verify Each Member Sees It
1. Login as John Doe → Should see "Community Support Groups"
2. Logout
3. Login as Sarah Ahmed → Should also see "Community Support Groups"
4. Both members can independently add students to the project

## 🎯 Test Scenario 5: Project Status Filtering

### Admin Side:
1. Login as admin
2. Go to Projects tab
3. Test filters:
   - Click "Active" → Shows only active projects
   - Click "Completed" → Shows only completed projects
   - Click "On Hold" → Shows only on-hold projects
   - Click "All" → Shows all projects

### Member Side:
1. Login as member
2. Go to "My Projects" tab
3. Should only see projects assigned to them
4. Can search by project name

## 🎯 Test Scenario 6: Statistics Accuracy

### Test Dashboard Stats:

#### Admin Dashboard:
1. Login as admin
2. Dashboard should show:
   - Total Projects: 5
   - Active: 3
   - Completed: 1
   - On Hold: 1
   - Total Members: 3
   - Active Members: 2
   - Inactive Members: 1

#### Member Dashboard:
1. Login as member (after assigning 2 projects)
2. Dashboard should show:
   - My Projects: 2
   - X Active (depends on project status)
   - Students Managed: (count of students in their projects)

## 🎯 Test Scenario 7: Edge Cases

### Test 1: Member with No Projects
1. Login as Ali Mohamed (ali.mohamed@iprt.edu / member123)
2. Dashboard shows: "0 Projects"
3. "My Projects" tab shows: "No projects assigned yet"
4. Helpful message: "Contact your admin to get assigned to projects"

### Test 2: Inactive Member
1. Admin sets Ali Mohamed to "Inactive"
2. Try to login as Ali Mohamed
3. Should fail with: "Invalid member credentials or account is inactive"

### Test 3: Project with No Members
1. Admin creates new project
2. Doesn't assign any members
3. Project shows: "0 Members"
4. Can still assign members later

### Test 4: Remove All Members from Project
1. Admin assigns members to project
2. Admin removes all members
3. Project shows: "0 Members"
4. Members no longer see the project

### Test 5: Cannot Assign Inactive Member
1. Admin goes to Members tab
2. Sets Ali Mohamed to "Inactive"
3. Goes to Projects tab
4. Clicks "Assign" on any project
5. Ali Mohamed appears grayed out
6. Checkbox is disabled
7. Shows "(Cannot assign)" label
8. Warning banner appears at top
9. Trying to click does nothing
10. ✅ Cannot assign inactive member

### Test 6: Can Remove Inactive Member
1. First assign member while Active
2. Then set member to Inactive
3. Go to Projects → Assign
4. Member is still checked (assigned)
5. Can uncheck to remove
6. ✅ Removal works even when inactive

## ✅ Expected Results Checklist:

### Admin Dashboard:
- [ ] Can create projects
- [ ] Can edit projects
- [ ] Can delete projects
- [ ] Can assign members to projects
- [ ] Can remove members from projects
- [ ] Can see member count on project cards
- [ ] Can see member names in purple badges
- [ ] Statistics update in real-time
- [ ] Filters work correctly

### Member Dashboard:
- [ ] Shows personalized greeting with member name
- [ ] Shows accurate project count
- [ ] Shows accurate student count
- [ ] "My Projects" tab shows only assigned projects
- [ ] Can add students to assigned projects
- [ ] Can view students in projects
- [ ] Can remove students from projects
- [ ] Real-time updates work
- [ ] Loading states appear
- [ ] Empty states show helpful messages

### Real-Time Sync:
- [ ] Admin assigns project → Member sees it immediately
- [ ] Admin removes project → Member loses access immediately
- [ ] Member adds student → Admin can see it
- [ ] All changes sync without refresh

## 🐛 Troubleshooting:

### Issue: Member doesn't see assigned projects
**Solution:**
1. Check if member is logged in (check localStorage for currentMemberId)
2. Verify project was assigned in Supabase database
3. Check browser console for errors
4. Refresh the page

### Issue: Real-time not working
**Solution:**
1. Verify real-time is enabled in Supabase for both tables
2. Check network tab for WebSocket connection
3. Restart dev server

### Issue: Statistics showing 0
**Solution:**
1. Wait a moment for data to load
2. Check if member has assigned projects in database
3. Verify member ID is stored in localStorage

### Issue: Cannot assign member to project
**Solution:**
1. Check if member is "Inactive"
2. Go to Members tab
3. Edit member and set status to "Active"
4. Now you can assign them

## 🎉 Success Criteria:

Your system is working correctly if:
1. ✅ Admin can assign projects to members
2. ✅ Members see their assigned projects
3. ✅ Statistics are accurate on both dashboards
4. ✅ Real-time updates work without refresh
5. ✅ Members can manage students in their projects
6. ✅ All CRUD operations work smoothly

---

**Happy Testing! 🚀**
