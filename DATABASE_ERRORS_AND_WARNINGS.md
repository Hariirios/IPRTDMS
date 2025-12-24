# DATABASE SCHEMA ERRORS & WARNINGS ANALYSIS

## 🔴 CRITICAL ERRORS

### 1. **PROJECTS TABLE - STATUS MISMATCH**
**Error:** Inconsistent status values across schema files

- `supabase-schema.sql`: `CHECK (status IN ('Planning', 'In Progress', 'Completed', 'On Hold'))`
- `iprt-complete-schema.sql`: `CHECK (status IN ('Active', 'Completed', 'On Hold'))`
- `add-projects-table.sql`: `CHECK (status IN ('Active', 'Completed', 'On Hold'))`
- **Application code**: Uses `'Active' | 'Completed' | 'On Hold'`

**Cause:** Schema files were created at different times with different requirements

**Impact:** Database will reject 'Active' status if using `supabase-schema.sql`

**Solution:** Use 'Active', 'Completed', 'On Hold' (remove 'Planning' and 'In Progress')

---

### 2. **REQUISITIONS TABLE - COST DATA TYPE MISMATCH**
**Error:** Different data types for `estimated_cost`

- `supabase-schema.sql`: `estimated_cost TEXT NOT NULL`
- `iprt-complete-schema.sql`: `estimated_cost DECIMAL(10, 2) NOT NULL`

**Cause:** Initial schema used TEXT, later changed to proper DECIMAL

**Impact:** 
- Cannot perform mathematical operations on TEXT type
- Data validation issues
- Sorting/aggregation problems

**Solution:** Use `DECIMAL(10, 2)` for proper currency handling

---

### 3. **TEAM_MEMBERS TABLE - COLUMN NAME MISMATCH**
**Error:** Different column names for member type

- `supabase-schema.sql`: `role TEXT NOT NULL CHECK (role IN ('Staff', 'Facilitator', 'Technician'))`
- `iprt-complete-schema.sql`: `type TEXT NOT NULL CHECK (type IN ('Staff', 'Technician', 'Facilitator'))`
- **Application code**: Uses `type` field

**Cause:** Schema evolution without migration

**Impact:** Application will fail to read/write team member data correctly

**Solution:** Use `type` column (matches application code)

---

### 4. **TEAM_MEMBERS TABLE - MISSING COLUMNS**
**Error:** `iprt-complete-schema.sql` has additional required columns not in `supabase-schema.sql`

**Missing in supabase-schema.sql:**
- `role` (job title/position)
- `department`
- `join_date`
- `status` (Active/Inactive)
- `image` vs `image_url` naming

**Cause:** Schema files out of sync

**Impact:** Application expects these fields but they don't exist

**Solution:** Add all missing columns to match application requirements

---

### 5. **MEMBERS TABLE - MISSING FROM MAIN SCHEMAS**
**Error:** Members table only exists in `add-members-table.sql`

- ❌ Not in `supabase-schema.sql`
- ❌ Not in `iprt-complete-schema.sql`
- ✅ Only in `add-members-table.sql`

**Cause:** Added later as a separate migration

**Impact:** Main schema files are incomplete, members table won't be created

**Solution:** Include members table in unified schema

---

### 6. **NOTIFICATIONS TABLE - MISSING TARGET_USER COLUMN**
**Error:** `target_user` column only added via migration script

- ❌ Not in main schema files
- ✅ Added via `add-notification-target-user.sql`

**Cause:** Feature added after initial schema

**Impact:** Main schemas are incomplete, notifications can't be filtered by recipient

**Solution:** Include `target_user` column in unified schema

---

### 7. **ATTENDANCE TABLE - MISSING 'Late' STATUS**
**Error:** 'Late' status only added via migration script

- **Original**: `CHECK (status IN ('Present', 'Absent', 'Absent with Reason'))`
- **Updated**: `CHECK (status IN ('Present', 'Late', 'Absent', 'Absent with Reason'))`
- ✅ Added via `add-late-attendance-status.sql`

**Cause:** Feature added after initial schema

**Impact:** Application can't mark students as late if using old schema

**Solution:** Include 'Late' status in unified schema

---

## ⚠️ WARNINGS

### 8. **UUID GENERATION FUNCTION MISMATCH**
**Warning:** Different UUID generation functions

- `supabase-schema.sql` & `iprt-complete-schema.sql`: `uuid_generate_v4()`
- `add-projects-table.sql` & `add-members-table.sql`: `gen_random_uuid()`

**Cause:** Different PostgreSQL versions/extensions

**Impact:** Both work but inconsistent. `gen_random_uuid()` is newer and doesn't require extension

**Solution:** Use `gen_random_uuid()` (built-in, no extension needed)

---

### 9. **DELETION_REQUESTS - STUDENT_ID NOT FOREIGN KEY**
**Warning:** `student_id` is not a foreign key in `iprt-complete-schema.sql`

- Comment says: "Not FK because student might be deleted"
- But `supabase-schema.sql` doesn't have this

**Cause:** Design decision not consistently applied

**Impact:** Referential integrity issues

**Solution:** Keep as non-FK (correct design for audit trail)

---

### 10. **DUPLICATE SCHEMA FILES**
**Warning:** Two main schema files with differences

- `supabase-schema.sql` (older, simpler)
- `iprt-complete-schema.sql` (newer, more complete)

**Cause:** Schema evolution without deprecating old file

**Impact:** Confusion about which to use

**Solution:** Create single unified schema, deprecate old files

---

### 11. **PROJECTS TABLE - CREATED_BY FIELD**
**Warning:** Inconsistent `created_by` field

- `supabase-schema.sql`: Has `created_by TEXT NOT NULL`
- `iprt-complete-schema.sql`: Doesn't have this field
- **Application**: Doesn't use it

**Cause:** Field removed in newer schema

**Impact:** Data loss if migrating

**Solution:** Remove `created_by` (not used by application)

---

### 12. **PROJECTS TABLE - END_DATE NULLABILITY**
**Warning:** Different nullability for `end_date`

- `supabase-schema.sql`: `end_date DATE NOT NULL`
- `iprt-complete-schema.sql`: `end_date DATE` (nullable)
- **Application**: Treats as optional

**Cause:** Schema evolution

**Impact:** Database will reject projects without end date if using old schema

**Solution:** Make `end_date` nullable (matches application)

---

### 13. **PROJECTS TABLE - ASSIGNED_MEMBERS TYPE**
**Warning:** Different storage for assigned members

- `supabase-schema.sql`: Doesn't have this field
- `iprt-complete-schema.sql`: `assigned_members TEXT[]` (array)
- **Application**: Uses array of member IDs

**Cause:** Feature added later

**Impact:** Can't assign members to projects if using old schema

**Solution:** Use `TEXT[]` array for member IDs

---

## 📊 SUMMARY

### Critical Errors: 7
1. Projects status mismatch
2. Requisitions cost data type
3. Team members column name mismatch
4. Team members missing columns
5. Members table missing
6. Notifications target_user missing
7. Attendance 'Late' status missing

### Warnings: 6
8. UUID function mismatch
9. Deletion requests FK design
10. Duplicate schema files
11. Projects created_by field
12. Projects end_date nullability
13. Projects assigned_members field

---

## ✅ RECOMMENDED SOLUTION

Create a **single unified schema** that:
1. Uses `gen_random_uuid()` for all tables
2. Includes all tables (students, projects, members, etc.)
3. Has correct data types (DECIMAL for cost)
4. Includes all columns (target_user, status, etc.)
5. Uses correct constraints (Active not Planning, Late status)
6. Matches application code exactly

This will be created in the next step.
