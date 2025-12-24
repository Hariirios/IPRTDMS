# DATABASE SCHEMA ERRORS & WARNINGS - COMPLETE ANALYSIS

## 🔴 CRITICAL ERRORS (Must Fix Immediately)

### 1. PROJECTS TABLE - STATUS VALUES MISMATCH
**Error:** Inconsistent status check constraints
- **supabase-schema.sql**: `('Planning', 'In Progress', 'Completed', 'On Hold')`
- **iprt-complete-schema.sql**: `('Active', 'Completed', 'On Hold')`
- **Application**: Uses `'Active' | 'Completed' | 'On Hold'`

**Cause:** Schema files created at different times
**Impact:** Database rejects 'Active' status, application breaks
**Fix:** Use `('Active', 'Completed', 'On Hold')` everywhere

---

### 2. REQUISITIONS TABLE - COST DATA TYPE MISMATCH
**Error:** Different data types for estimated_cost
- **supabase-schema.sql**: `TEXT`
- **iprt-complete-schema.sql**: `DECIMAL(10, 2)`

**Cause:** Initial schema used TEXT, later changed to DECIMAL
**Impact:** Cannot perform calculations, validation fails
**Fix:** Use `DECIMAL(10, 2)` for proper monetary values

---

### 3. TEAM_MEMBERS TABLE - COLUMN NAME CONFLICT
**Error:** Field naming inconsistency
- **supabase-schema.sql**: Uses `role` for member type
- **iprt-complete-schema.sql**: Uses `type` for member type
- **Application**: Expects `type` field

**Cause:** Schema evolution without proper migration
**Impact:** Application cannot read/write team member data
**Fix:** Use `type` as primary field, add `role` as separate field

---

### 4. TEAM_MEMBERS TABLE - MISSING REQUIRED COLUMNS
**Error:** iprt-complete-schema.sql has columns missing in supabase-schema.sql
- Missing: `role` (job title)
- Missing: `department`
- Missing: `join_date`
- Naming: `image_url` vs `image`

**Cause:** Incomplete schema synchronization
**Impact:** Application expects fields that don't exist
**Fix:** Add all required columns to match application

---

### 5. MEMBERS TABLE - NOT IN MAIN SCHEMAS
**Error:** Members table only in add-members-table.sql
- Missing from supabase-schema.sql
- Missing from iprt-complete-schema.sql

**Cause:** Added as separate migration, never integrated
**Impact:** Fresh database setup missing critical table
**Fix:** Include members table in main schema

---

### 6. NOTIFICATIONS TABLE - MISSING TARGET_USER
**Error:** target_user column only in migration script
- Not in main schemas
- Added via add-notification-target-user.sql

**Cause:** Feature added after initial schema
**Impact:** Notifications cannot be filtered by recipient
**Fix:** Add target_user to main schema

---

### 7. ATTENDANCE TABLE - MISSING 'Late' STATUS
**Error:** Late status only in migration script
- Original: `('Present', 'Absent', 'Absent with Reason')`
- Updated: `('Present', 'Late', 'Absent', 'Absent with Reason')`

**Cause:** Feature added after deployment
**Impact:** Cannot mark students as late
**Fix:** Include 'Late' in main schema

---

## ⚠️ WARNINGS (Should Fix)

### 8. UUID GENERATION FUNCTION INCONSISTENCY
**Warning:** Different UUID functions used
- Most files: `uuid_generate_v4()` (requires extension)
- add-projects-table.sql: `gen_random_uuid()` (built-in)

**Cause:** Different PostgreSQL versions
**Impact:** Minor, both work but inconsistent
**Recommendation:** Use `gen_random_uuid()` (newer, no extension needed)

---

### 9. DELETION_REQUESTS - REFERENTIAL INTEGRITY
**Warning:** student_id not a foreign key in iprt-complete-schema.sql
- Comment: "Not FK because student might be deleted"
- supabase-schema.sql doesn't have this design

**Cause:** Design decision not consistently applied
**Impact:** Potential orphaned records
**Recommendation:** Keep as non-FK but document clearly

---

### 10. DUPLICATE SCHEMA FILES
**Warning:** Two main schema files with differences
- supabase-schema.sql (older, simpler)
- iprt-complete-schema.sql (newer, more complete)

**Cause:** Schema evolution without deprecating old file
**Impact:** Confusion about which to use
**Recommendation:** Deprecate supabase-schema.sql, use iprt-complete-schema.sql

---

### 11. PROJECTS TABLE - CREATED_BY FIELD
**Warning:** Field exists in old schema but not new
- supabase-schema.sql: Has `created_by TEXT NOT NULL`
- iprt-complete-schema.sql: Doesn't have this
- Application: Doesn't use it

**Cause:** Field removed in newer version
**Impact:** Data loss if migrating
**Recommendation:** Remove from old schema or add to new

---

## 📊 SUMMARY

**Critical Errors:** 7
**Warnings:** 4
**Total Issues:** 11

**Recommended Action:**
1. Create unified schema file (fix all errors)
2. Deprecate old schema files
3. Create migration script for existing databases
4. Update documentation

---

## ✅ SOLUTION

I will create a corrected, unified schema file that:
- Fixes all critical errors
- Resolves all warnings
- Includes all tables and columns
- Matches application expectations
- Is production-ready
