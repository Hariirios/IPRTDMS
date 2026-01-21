# IPRT System Architecture Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture Layers](#architecture-layers)
4. [Database Design](#database-design)
5. [Authentication & Authorization](#authentication--authorization)
6. [Component Architecture](#component-architecture)
7. [Data Flow](#data-flow)
8. [API Integration](#api-integration)
9. [Security Architecture](#security-architecture)
10. [Deployment Architecture](#deployment-architecture)

---

## 1. System Overview

### Purpose
IPRT (Institute for Practical Research & Training) is a comprehensive web-based management system designed to manage:
- Student enrollment and tracking
- Project management and assignments
- Attendance monitoring
- Requisition management
- Team member administration
- Notification system
- Multi-user access (Admin and Member roles)

### System Type
- **Architecture Pattern**: Single Page Application (SPA)
- **Deployment Model**: Cloud-based (Vercel + Supabase)
- **Access Model**: Web-based, responsive design
- **User Roles**: Admin, Member, Public

---

## 2. Technology Stack

### Frontend Technologies
```
Core Framework:
├── React 18.3.1          - UI library
├── TypeScript 5.7.2      - Type safety
├── Vite 6.0.7            - Build tool & dev server
└── React Router 7.1.3    - Client-side routing
```

### UI & Styling
```
UI Components:
├── Radix UI              - Accessible component primitives
├── Tailwind CSS 4.0      - Utility-first CSS framework
├── Motion (Framer) 11.15 - Animation library
├── Lucide React          - Icon library
└── Sonner                - Toast notifications

Design System:
├── Custom theme system (Dark/Light mode)
├── Responsive breakpoints
├── Accessibility (WCAG compliant)
└── Multilingual support (English, Somali, Arabic)
```

### Backend & Database
```
Backend as a Service:
├── Supabase              - PostgreSQL database
├── Supabase Auth         - Authentication service
├── Supabase Realtime     - Real-time subscriptions
└── Row Level Security    - Data access control

Database:
└── PostgreSQL 15+        - Relational database
```

### State Management
```
State Architecture:
├── React Context API     - Global state (Theme, Language)
├── Custom Stores         - Domain-specific state management
├── Local Storage         - Client-side persistence
└── Supabase Realtime     - Server state synchronization
```

### Development Tools
```
Build & Development:
├── Vite                  - Fast build tool
├── TypeScript            - Static typing
├── ESLint                - Code linting
└── PostCSS               - CSS processing

Version Control:
├── Git                   - Source control
└── GitHub                - Repository hosting
```

---

## 3. Architecture Layers

### 3.1 Presentation Layer (Frontend)
```
┌─────────────────────────────────────────────┐
│         Presentation Layer                   │
├─────────────────────────────────────────────┤
│  Pages/                                      │
│  ├── Public Pages (Home, About, Services)   │
│  ├── Admin Dashboard                         │
│  └── Member Portal                           │
│                                              │
│  Components/                                 │
│  ├── UI Components (Buttons, Forms, etc.)   │
│  ├── Admin Components                        │
│  ├── Member Components                       │
│  └── Shared Components (Navbar, Footer)     │
│                                              │
│  Contexts/                                   │
│  ├── ThemeContext (Dark/Light mode)         │
│  └── LanguageContext (i18n)                 │
└─────────────────────────────────────────────┘
```

### 3.2 Business Logic Layer
```
┌─────────────────────────────────────────────┐
│         Business Logic Layer                 │
├─────────────────────────────────────────────┤
│  Stores (State Management):                  │
│  ├── studentStore.ts     - Student CRUD      │
│  ├── projectStore.ts     - Project CRUD      │
│  ├── attendanceStore.ts  - Attendance logic  │
│  ├── requisitionStore.ts - Requisition mgmt  │
│  ├── memberStore.ts      - Member management │
│  ├── teamStore.ts        - Team member CRUD  │
│  ├── notificationStore.ts- Notification sys  │
│  └── deletionRequestStore- Deletion workflow │
│                                              │
│  Utilities:                                  │
│  ├── auth.ts            - Authentication     │
│  ├── permissions.ts     - Authorization      │
│  ├── cache.ts           - Caching logic      │
│  ├── imageUtils.ts      - Image processing   │
│  ├── passwordValidator  - Password rules     │
│  └── translations.ts    - i18n translations  │
└─────────────────────────────────────────────┘
```

### 3.3 Data Access Layer
```
┌─────────────────────────────────────────────┐
│         Data Access Layer                    │
├─────────────────────────────────────────────┤
│  Supabase Client:                            │
│  ├── supabase.ts        - Client config      │
│  ├── Database queries   - CRUD operations    │
│  ├── Real-time subs     - Live updates       │
│  └── Storage API        - File uploads       │
│                                              │
│  Local Storage:                              │
│  ├── storage.ts         - Browser storage    │
│  └── Cache management   - Performance opt    │
└─────────────────────────────────────────────┘
```

### 3.4 Database Layer
```
┌─────────────────────────────────────────────┐
│         Database Layer (Supabase)            │
├─────────────────────────────────────────────┤
│  PostgreSQL Database:                        │
│  ├── students           - Student records    │
│  ├── projects           - Project data       │
│  ├── project_students   - Project assignments│
│  ├── attendance         - Attendance records │
│  ├── requisitions       - Purchase requests  │
│  ├── deletion_requests  - Deletion workflow  │
│  ├── team_members       - Staff/team data    │
│  ├── notifications      - System alerts      │
│  ├── admin_users        - Admin accounts     │
│  └── auth.users         - Supabase Auth      │
│                                              │
│  Security:                                   │
│  ├── Row Level Security (RLS)               │
│  ├── Policies & Permissions                 │
│  └── Encrypted connections                  │
└─────────────────────────────────────────────┘
```

---

## 4. Database Design

### 4.1 Entity Relationship Diagram (ERD)
```
┌──────────────┐         ┌──────────────┐
│   students   │         │   projects   │
├──────────────┤         ├──────────────┤
│ id (PK)      │         │ id (PK)      │
│ full_name    │         │ name         │
│ email        │◄───┐    │ description  │
│ phone        │    │    │ start_date   │
│ status       │    │    │ end_date     │
│ added_by     │    │    │ status       │
└──────────────┘    │    └──────────────┘
                    │            ▲
                    │            │
            ┌───────┴────────────┴───────┐
            │   project_students         │
            ├────────────────────────────┤
            │ id (PK)                    │
            │ project_id (FK)            │
            │ student_id (FK)            │
            │ assigned_date              │
            └────────────────────────────┘
                    │            │
                    ▼            ▼
            ┌──────────────────────────┐
            │      attendance          │
            ├──────────────────────────┤
            │ id (PK)                  │
            │ student_id (FK)          │
            │ project_id (FK)          │
            │ date                     │
            │ status                   │
            │ comment                  │
            └──────────────────────────┘
```

### 4.2 Database Tables

#### Core Tables

**students**
- Stores student information and enrollment data
- Fields: id, full_name, email, phone, enrollment_date, status, added_by, added_by_email
- Constraints: Unique email, status enum validation

**projects**
- Manages training projects and programs
- Fields: id, name, description, start_date, end_date, status, created_by
- Constraints: Status enum validation

**project_students**
- Junction table linking students to projects
- Fields: id, project_id, student_id, assigned_date
- Constraints: Unique (project_id, student_id) pair

**attendance**
- Tracks daily student attendance
- Fields: id, student_id, project_id, date, status, comment, marked_by
- Constraints: Unique (student_id, project_id, date)

**requisitions**
- Manages purchase and resource requests
- Fields: id, title, description, category, quantity, estimated_cost, priority, status
- Constraints: Status, category, priority enum validation

**deletion_requests**
- Workflow for student deletion approval
- Fields: id, student_id, student_name, reason, status, admin_response
- Constraints: Status enum validation

**team_members**
- Staff, facilitators, and technicians
- Fields: id, name, role, email, phone, bio, image_url
- Constraints: Unique email, role enum validation

**notifications**
- System-wide notification management
- Fields: id, type, title, message, related_id, is_read, created_by
- Constraints: Type enum validation

**admin_users**
- Admin account management
- Fields: id, email, username, password_hash, role, is_active
- Constraints: Unique email and username, role enum validation

### 4.3 Database Indexes
```sql
-- Performance optimization indexes
idx_students_email          ON students(email)
idx_students_status         ON students(status)
idx_projects_status         ON projects(status)
idx_project_students_project ON project_students(project_id)
idx_project_students_student ON project_students(student_id)
idx_attendance_student      ON attendance(student_id)
idx_attendance_project      ON attendance(project_id)
idx_attendance_date         ON attendance(date)
idx_requisitions_status     ON requisitions(status)
idx_deletion_requests_status ON deletion_requests(status)
idx_notifications_is_read   ON notifications(is_read)
idx_notifications_type      ON notifications(type)
```

### 4.4 Database Triggers
```sql
-- Automatic timestamp updates
update_students_updated_at
update_projects_updated_at
update_attendance_updated_at
update_requisitions_updated_at
update_deletion_requests_updated_at
update_team_members_updated_at
```

---

## 5. Authentication & Authorization

### 5.1 Authentication Flow
```
┌─────────────────────────────────────────────┐
│         Authentication Process               │
└─────────────────────────────────────────────┘

User Login
    │
    ├─► Admin Login
    │   ├─► Enter email/username + password
    │   ├─► loginAdmin() in lib/auth.ts
    │   ├─► Supabase Auth: signInWithPassword()
    │   ├─► Verify in admin_users table
    │   ├─► Check is_active status
    │   ├─► Update last_login timestamp
    │   └─► Store session in localStorage
    │
    └─► Member Login
        ├─► Enter email + password
        ├─► memberStore.authenticate()
        ├─► Verify in members table
        ├─► Check is_active status
        └─► Store session in localStorage
```

### 5.2 Authorization Model

**Role-Based Access Control (RBAC)**

```
┌─────────────────────────────────────────────┐
│              User Roles                      │
├─────────────────────────────────────────────┤
│  Super Admin                                 │
│  ├── Full system access                     │
│  ├── User management                        │
│  ├── All CRUD operations                    │
│  └── System configuration                   │
│                                              │
│  Admin                                       │
│  ├── Dashboard access                       │
│  ├── Manage students, projects              │
│  ├── Approve requisitions                   │
│  └── View reports                           │
│                                              │
│  Member                                      │
│  ├── Limited dashboard access               │
│  ├── Add students (requires approval)       │
│  ├── Mark attendance                        │
│  ├── Submit requisitions                    │
│  └── View assigned projects                 │
│                                              │
│  Public                                      │
│  ├── View public pages                      │
│  ├── Contact form                           │
│  └── Service information                    │
└─────────────────────────────────────────────┘
```

### 5.3 Security Features

**Password Security**
- Bcrypt hashing (10 salt rounds)
- Minimum 8 characters
- Password strength validation
- Secure password reset flow

**Session Management**
- JWT tokens (Supabase Auth)
- Automatic token refresh
- Persistent sessions (localStorage)
- Secure logout

**Data Protection**
- Row Level Security (RLS)
- HTTPS encryption
- Input sanitization
- XSS protection

---

## 6. Component Architecture

### 6.1 Component Hierarchy
```
App.tsx
├── ThemeProvider
│   └── LanguageProvider
│       ├── Navbar
│       ├── Routes
│       │   ├── Public Pages
│       │   │   ├── Home
│       │   │   ├── About
│       │   │   ├── Services
│       │   │   ├── Events
│       │   │   └── Contact
│       │   │
│       │   ├── Admin Dashboard
│       │   │   ├── DashboardHome
│       │   │   ├── ProjectsAdmin
│       │   │   ├── StudentsAdmin
│       │   │   ├── AttendanceAdmin
│       │   │   ├── RequisitionsAdmin
│       │   │   ├── MembersAdmin
│       │   │   ├── TeamMembersAdmin
│       │   │   └── DeletionRequestsAdmin
│       │   │
│       │   └── Member Portal
│       │       ├── MemberDashboardHome
│       │       ├── MemberProjects
│       │       ├── MemberStudents
│       │       ├── MemberAttendance
│       │       └── MemberProfile
│       │
│       ├── Footer
│       ├── WhatsAppButton
│       └── Toaster (Notifications)
```

### 6.2 Component Types

**Page Components** (`pages/`)
- Route-level components
- Handle page-specific logic
- Compose smaller components

**Feature Components** (`components/admin/`, `components/member/`)
- Domain-specific functionality
- Business logic integration
- State management

**UI Components** (`components/ui/`)
- Reusable, presentational
- No business logic
- Radix UI based
- Fully accessible

**Layout Components**
- Navbar, Footer
- Consistent across pages
- Responsive design

### 6.3 State Management Pattern

**Context API (Global State)**
```typescript
ThemeContext
├── isDark: boolean
├── toggleTheme: () => void
└── Used by: All components

LanguageContext
├── language: 'en' | 'so' | 'ar'
├── setLanguage: (lang) => void
├── t: (key) => string
└── Used by: All components
```

**Store Pattern (Domain State)**
```typescript
studentStore
├── getAll(): Promise<Student[]>
├── getById(id): Promise<Student>
├── create(data): Promise<Student>
├── update(id, data): Promise<void>
├── delete(id): Promise<void>
└── Cache management

projectStore
├── Similar CRUD operations
├── assignStudents(projectId, studentIds)
└── getProjectStudents(projectId)

attendanceStore
├── markAttendance(data)
├── getByDate(date)
├── getByStudent(studentId)
└── getByProject(projectId)
```

**Local State (Component State)**
- Form inputs
- UI toggles
- Temporary data
- Loading states

---

## 7. Data Flow

### 7.1 Read Operation Flow
```
Component
    │
    ├─► Call Store Method (e.g., studentStore.getAll())
    │
    ├─► Check Cache (cache.ts)
    │   ├─► Cache Hit: Return cached data
    │   └─► Cache Miss: Continue to database
    │
    ├─► Query Supabase (supabase.ts)
    │   ├─► Execute SQL query
    │   ├─► Apply RLS policies
    │   └─► Return data
    │
    ├─► Update Cache
    │
    └─► Update Component State
```

### 7.2 Write Operation Flow
```
Component (User Action)
    │
    ├─► Validate Input (Client-side)
    │
    ├─► Call Store Method (e.g., studentStore.create())
    │
    ├─► Send to Supabase
    │   ├─► Validate (Server-side)
    │   ├─► Check permissions (RLS)
    │   ├─► Execute INSERT/UPDATE/DELETE
    │   └─► Trigger database triggers
    │
    ├─► Invalidate Cache
    │
    ├─► Create Notification (if applicable)
    │
    ├─► Broadcast Real-time Update
    │
    └─► Update Component State
        ├─► Show success message (Toast)
        └─► Refresh data
```

### 7.3 Real-time Data Flow
```
Supabase Database Change
    │
    ├─► Trigger Real-time Event
    │
    ├─► Broadcast to Subscribed Clients
    │
    ├─► useRealtimeSubscription Hook
    │
    ├─► Update Local State
    │
    └─► Re-render Components
```

---

## 8. API Integration

### 8.1 Supabase Client Configuration
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});
```

### 8.2 API Operations

**CRUD Operations Example**
```typescript
// Create
const { data, error } = await supabase
  .from('students')
  .insert([{ full_name, email, phone, ... }])
  .select()
  .single();

// Read
const { data, error } = await supabase
  .from('students')
  .select('*')
  .eq('status', 'Active')
  .order('created_at', { ascending: false });

// Update
const { error } = await supabase
  .from('students')
  .update({ status: 'Completed' })
  .eq('id', studentId);

// Delete
const { error } = await supabase
  .from('students')
  .delete()
  .eq('id', studentId);
```

**Real-time Subscriptions**
```typescript
const subscription = supabase
  .channel('students-changes')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'students' },
    (payload) => {
      // Handle real-time updates
      handleRealtimeUpdate(payload);
    }
  )
  .subscribe();
```

**Authentication API**
```typescript
// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});

// Sign out
await supabase.auth.signOut();

// Get current user
const { data: { user } } = await supabase.auth.getUser();
```

---

## 9. Security Architecture

### 9.1 Security Layers
```
┌─────────────────────────────────────────────┐
│         Security Architecture                │
├─────────────────────────────────────────────┤
│  Layer 1: Network Security                   │
│  ├── HTTPS/TLS encryption                   │
│  ├── CORS configuration                     │
│  └── DDoS protection (Vercel)              │
│                                              │
│  Layer 2: Authentication                     │
│  ├── Supabase Auth (JWT)                    │
│  ├── Password hashing (bcrypt)              │
│  ├── Session management                     │
│  └── Token refresh                          │
│                                              │
│  Layer 3: Authorization                      │
│  ├── Role-based access control              │
│  ├── Row Level Security (RLS)               │
│  ├── Permission checks                      │
│  └── API key protection                     │
│                                              │
│  Layer 4: Data Security                      │
│  ├── Input validation                       │
│  ├── SQL injection prevention               │
│  ├── XSS protection                         │
│  └── CSRF protection                        │
│                                              │
│  Layer 5: Application Security               │
│  ├── Environment variables                  │
│  ├── Secure storage                         │
│  ├── Error handling                         │
│  └── Audit logging                          │
└─────────────────────────────────────────────┘
```

### 9.2 Row Level Security (RLS) Policies
```sql
-- Example: Students table policy
CREATE POLICY "Allow all for authenticated users" 
ON students 
FOR ALL 
USING (auth.role() = 'authenticated');

-- Example: Admin-only policy
CREATE POLICY "Admin full access" 
ON admin_users 
FOR ALL 
USING (
  auth.uid() IN (
    SELECT id FROM admin_users WHERE is_active = true
  )
);
```

### 9.3 Security Best Practices Implemented

**Environment Variables**
- ✅ Sensitive data in `.env` (not committed)
- ✅ Only anon key exposed in frontend
- ✅ Service role key kept server-side only

**Input Validation**
- ✅ Client-side validation (React Hook Form)
- ✅ Server-side validation (Supabase)
- ✅ Type checking (TypeScript)
- ✅ Sanitization of user inputs

**Authentication**
- ✅ Secure password hashing (bcrypt)
- ✅ JWT token-based auth
- ✅ Automatic token refresh
- ✅ Secure session storage

**Authorization**
- ✅ Role-based access control
- ✅ Row Level Security policies
- ✅ Permission checks before operations
- ✅ Audit trail (created_by, updated_at)

---

## 10. Deployment Architecture

### 10.1 Deployment Diagram
```
┌─────────────────────────────────────────────┐
│            Production Environment            │
└─────────────────────────────────────────────┘

Internet
    │
    ├─► Vercel Edge Network (CDN)
    │   ├── Static Assets (HTML, CSS, JS)
    │   ├── Image Optimization
    │   ├── Automatic HTTPS
    │   └── Global Distribution
    │
    └─► Supabase Cloud
        ├── PostgreSQL Database
        ├── Authentication Service
        ├── Real-time Engine
        ├── Storage Service
        └── Edge Functions
```

### 10.2 Build & Deployment Process
```
Developer Workflow
    │
    ├─► Local Development
    │   ├── npm run dev (Vite dev server)
    │   ├── Hot Module Replacement (HMR)
    │   └── Local testing
    │
    ├─► Git Commit & Push
    │   ├── git add .
    │   ├── git commit -m "message"
    │   └── git push origin main
    │
    ├─► Vercel Automatic Deployment
    │   ├── Detect push to main branch
    │   ├── Install dependencies (npm install)
    │   ├── Build project (npm run build)
    │   │   ├── TypeScript compilation
    │   │   ├── Vite bundling
    │   │   ├── CSS processing
    │   │   └── Asset optimization
    │   ├── Deploy to Edge Network
    │   └── Assign production URL
    │
    └─► Production Live
        ├── https://your-project.vercel.app
        └── Custom domain (optional)
```

### 10.3 Environment Configuration

**Development Environment**
```env
VITE_APP_URL=http://localhost:5173
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx
```

**Production Environment (Vercel)**
```env
VITE_APP_URL=https://your-project.vercel.app
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx
```

### 10.4 Hosting Infrastructure

**Frontend Hosting: Vercel**
- Global CDN distribution
- Automatic HTTPS/SSL
- Serverless functions
- Edge caching
- Automatic scaling
- Zero-downtime deployments

**Backend Hosting: Supabase**
- Managed PostgreSQL
- Automatic backups
- Point-in-time recovery
- Connection pooling
- Read replicas
- 99.9% uptime SLA

---

## 11. Performance Optimization

### 11.1 Frontend Optimization
```
Performance Strategies:
├── Code Splitting
│   ├── Route-based splitting (React Router)
│   ├── Dynamic imports
│   └── Lazy loading components
│
├── Asset Optimization
│   ├── Image optimization (Vercel)
│   ├── CSS minification
│   ├── JavaScript bundling (Vite)
│   └── Tree shaking
│
├── Caching Strategy
│   ├── Browser caching (cache.ts)
│   ├── Service worker (optional)
│   ├── CDN caching (Vercel)
│   └── API response caching
│
└── Rendering Optimization
    ├── Virtual scrolling (large lists)
    ├── Memoization (React.memo)
    ├── Debouncing (search inputs)
    └── Throttling (scroll events)
```

### 11.2 Database Optimization
```
Database Performance:
├── Indexes on frequently queried columns
├── Query optimization (select specific fields)
├── Connection pooling (Supabase)
├── Pagination for large datasets
└── Efficient JOIN operations
```

### 11.3 Network Optimization
```
Network Performance:
├── HTTP/2 (Vercel)
├── Compression (gzip/brotli)
├── Reduced payload size
├── Batch API requests
└── Real-time subscriptions (WebSocket)
```

---

## 12. Monitoring & Logging

### 12.1 Application Monitoring
```
Monitoring Stack:
├── Vercel Analytics
│   ├── Page views
│   ├── Performance metrics
│   └── Error tracking
│
├── Supabase Dashboard
│   ├── Database queries
│   ├── API usage
│   └── Authentication logs
│
└── Browser Console
    ├── Client-side errors
    ├── Network requests
    └── Performance profiling
```

### 12.2 Error Handling
```typescript
// Global error boundary
try {
  // Operation
} catch (error) {
  console.error('Error:', error);
  toast.error('Operation failed. Please try again.');
  // Log to monitoring service (optional)
}

// Supabase error handling
const { data, error } = await supabase.from('table').select();
if (error) {
  console.error('Database error:', error);
  // Handle specific error types
}
```

---

## 13. Scalability Considerations

### 13.1 Horizontal Scaling
```
Scalability Features:
├── Stateless frontend (scales automatically on Vercel)
├── Database connection pooling (Supabase)
├── CDN distribution (global edge network)
├── Serverless architecture (no server management)
└── Auto-scaling (Vercel + Supabase)
```

### 13.2 Vertical Scaling
```
Database Scaling:
├── Upgrade Supabase plan (more resources)
├── Read replicas (for read-heavy workloads)
├── Database optimization (indexes, queries)
└── Caching layer (reduce database load)
```

### 13.3 Future Scalability
```
Potential Enhancements:
├── Redis caching layer
├── Message queue (for async operations)
├── Microservices architecture (if needed)
├── Load balancing (multiple regions)
└── Database sharding (for massive scale)
```

---

## 14. System Integrations

### 14.1 Current Integrations
```
External Services:
├── Supabase
│   ├── Database (PostgreSQL)
│   ├── Authentication
│   ├── Real-time
│   └── Storage
│
├── Vercel
│   ├── Hosting
│   ├── CDN
│   └── Analytics
│
└── Email (Future)
    └── Nodemailer (configured, not active)
```

### 14.2 Integration Points
```
API Endpoints:
├── Supabase REST API
│   ├── https://xxx.supabase.co/rest/v1/
│   └── Automatic from database schema
│
├── Supabase Auth API
│   ├── https://xxx.supabase.co/auth/v1/
│   └── User authentication endpoints
│
└── Supabase Realtime
    ├── wss://xxx.supabase.co/realtime/v1/
    └── WebSocket connections
```

---

## 15. Development Workflow

### 15.1 Local Development Setup
```bash
# 1. Clone repository
git clone https://github.com/Hariirios/IPRTDMS.git
cd IPRTDMS

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with Supabase credentials

# 4. Start development server
npm run dev

# 5. Access application
# http://localhost:5173
```

### 15.2 Development Tools
```
IDE Setup:
├── VS Code (recommended)
├── ESLint extension
├── Prettier extension
├── TypeScript support
└── Git integration

Browser Tools:
├── React Developer Tools
├── Redux DevTools (if needed)
├── Network inspector
└── Performance profiler
```

### 15.3 Code Organization
```
Project Structure:
IPRTDMS/
├── components/          # React components
│   ├── admin/          # Admin-specific
│   ├── member/         # Member-specific
│   ├── home/           # Home page sections
│   └── ui/             # Reusable UI
├── contexts/           # React contexts
├── lib/                # Business logic
│   ├── stores/         # State management
│   ├── utils/          # Utilities
│   └── supabase.ts     # DB client
├── pages/              # Route pages
├── public/             # Static assets
├── styles/             # Global styles
└── ...config files
```

---

## 16. Testing Strategy

### 16.1 Testing Levels
```
Testing Pyramid:
├── Unit Tests (Future)
│   ├── Utility functions
│   ├── Store methods
│   └── Component logic
│
├── Integration Tests (Future)
│   ├── API integration
│   ├── Database operations
│   └── Authentication flow
│
└── Manual Testing (Current)
    ├── User acceptance testing
    ├── Browser compatibility
    └── Responsive design
```

### 16.2 Testing Checklist
```
Manual Testing:
✓ Authentication (Admin/Member login)
✓ CRUD operations (Create, Read, Update, Delete)
✓ Real-time updates
✓ Notifications
✓ Form validation
✓ Error handling
✓ Responsive design (mobile, tablet, desktop)
✓ Dark/Light mode
✓ Multilingual support
✓ Browser compatibility (Chrome, Firefox, Safari, Edge)
```

---

## 17. Backup & Recovery

### 17.1 Backup Strategy
```
Supabase Automatic Backups:
├── Daily automated backups
├── Point-in-time recovery (PITR)
├── 7-day retention (free tier)
├── 30-day retention (paid tiers)
└── Manual backup option
```

### 17.2 Disaster Recovery
```
Recovery Procedures:
├── Database restore from backup
├── Redeploy frontend (Vercel)
├── Restore environment variables
└── Verify system functionality
```

---

## 18. Maintenance & Updates

### 18.1 Regular Maintenance
```
Maintenance Tasks:
├── Weekly
│   ├── Monitor error logs
│   ├── Check performance metrics
│   └── Review user feedback
│
├── Monthly
│   ├── Update dependencies
│   ├── Security patches
│   ├── Database optimization
│   └── Backup verification
│
└── Quarterly
    ├── Major version updates
    ├── Feature enhancements
    ├── Performance audit
    └── Security audit
```

### 18.2 Update Process
```bash
# 1. Update dependencies
npm update

# 2. Check for breaking changes
npm outdated

# 3. Test locally
npm run dev

# 4. Build and verify
npm run build
npm run preview

# 5. Deploy to production
git push origin main
```

---

## 19. System Limitations & Constraints

### 19.1 Current Limitations
```
Technical Constraints:
├── Supabase Free Tier
│   ├── 500 MB database storage
│   ├── 1 GB file storage
│   ├── 2 GB bandwidth/month
│   └── 50,000 monthly active users
│
├── Vercel Free Tier
│   ├── 100 GB bandwidth/month
│   ├── 100 deployments/day
│   └── Serverless function limits
│
└── Browser Limitations
    ├── LocalStorage (5-10 MB)
    ├── Session storage
    └── Cookie size limits
```

### 19.2 Performance Constraints
```
Performance Limits:
├── Database query timeout (30 seconds)
├── API request size (1 MB)
├── File upload size (50 MB)
├── Concurrent connections (limited by plan)
└── Real-time subscriptions (limited by plan)
```

---

## 20. Future Enhancements

### 20.1 Planned Features
```
Roadmap:
├── Phase 1 (Current)
│   ✓ Core CRUD operations
│   ✓ Authentication system
│   ✓ Real-time updates
│   ✓ Notification system
│
├── Phase 2 (Next)
│   ○ Email notifications
│   ○ Advanced reporting
│   ○ Data export (PDF, Excel)
│   ○ Bulk operations
│
├── Phase 3 (Future)
│   ○ Mobile app (React Native)
│   ○ Advanced analytics
│   ○ AI-powered insights
│   ○ Integration with external systems
│
└── Phase 4 (Long-term)
    ○ Multi-tenancy support
    ○ White-label solution
    ○ API for third-party integrations
    ○ Advanced workflow automation
```

### 20.2 Technical Improvements
```
Optimization Opportunities:
├── Performance
│   ○ Implement service worker (PWA)
│   ○ Add Redis caching layer
│   ○ Optimize bundle size
│   ○ Lazy load images
│
├── Testing
│   ○ Unit test coverage
│   ○ Integration tests
│   ○ E2E testing (Playwright/Cypress)
│   ○ Performance testing
│
├── DevOps
│   ○ CI/CD pipeline
│   ○ Automated testing
│   ○ Staging environment
│   ○ Blue-green deployments
│
└── Monitoring
    ○ Error tracking (Sentry)
    ○ Performance monitoring (New Relic)
    ○ User analytics (Google Analytics)
    ○ Custom dashboards
```

---

## 21. Documentation & Resources

### 21.1 Project Documentation
```
Documentation Files:
├── README.md                          - Project overview
├── SYSTEM_ARCHITECTURE.md             - This document
├── ADMIN_LOGIN_FIX_COMPLETE.md        - Auth documentation
├── SUPABASE_SETUP_GUIDE.md            - Database setup
├── SHARE_WITH_FRIEND_GUIDE.md         - Sharing guide
├── TEST_ADMIN_LOGIN.md                - Testing guide
└── FOR_YOUR_FRIEND.md                 - Setup for collaborators
```

### 21.2 External Resources
```
Technology Documentation:
├── React: https://react.dev
├── TypeScript: https://www.typescriptlang.org
├── Vite: https://vitejs.dev
├── Tailwind CSS: https://tailwindcss.com
├── Supabase: https://supabase.com/docs
├── Vercel: https://vercel.com/docs
└── Radix UI: https://www.radix-ui.com
```

### 21.3 Support & Contact
```
Project Information:
├── Repository: https://github.com/Hariirios/IPRTDMS
├── Author: Mowlid Haibe
├── GitHub: @mawlid1431
└── Organization: IPRT (Institute for Practical Research & Training)
```

---

## 22. Glossary

**SPA** - Single Page Application
**CRUD** - Create, Read, Update, Delete
**RLS** - Row Level Security
**JWT** - JSON Web Token
**CDN** - Content Delivery Network
**API** - Application Programming Interface
**REST** - Representational State Transfer
**HTTPS** - Hypertext Transfer Protocol Secure
**SSL/TLS** - Secure Sockets Layer / Transport Layer Security
**CORS** - Cross-Origin Resource Sharing
**XSS** - Cross-Site Scripting
**CSRF** - Cross-Site Request Forgery
**PWA** - Progressive Web App
**CI/CD** - Continuous Integration / Continuous Deployment
**ERD** - Entity Relationship Diagram
**RBAC** - Role-Based Access Control
**HMR** - Hot Module Replacement
**UUID** - Universally Unique Identifier

---

## Appendix A: System Requirements

### Client Requirements
```
Minimum:
├── Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
├── JavaScript enabled
├── Internet connection (1 Mbps+)
└── Screen resolution: 320px+ width

Recommended:
├── Latest browser version
├── Broadband internet (5 Mbps+)
├── Screen resolution: 1920x1080
└── 4 GB RAM
```

### Server Requirements
```
Managed by Vercel & Supabase:
├── No server management required
├── Automatic scaling
├── Global distribution
└── 99.9% uptime SLA
```

---

## Appendix B: API Reference

### Supabase Tables
```
students
projects
project_students
attendance
requisitions
deletion_requests
team_members
notifications
admin_users
```

### Authentication Endpoints
```
POST /auth/v1/signup
POST /auth/v1/token
POST /auth/v1/logout
POST /auth/v1/recover
GET  /auth/v1/user
```

---

**Document Version:** 1.0
**Last Updated:** January 21, 2026
**Status:** Complete
**Maintained By:** Development Team

---

*This document provides a comprehensive overview of the IPRT system architecture. For specific implementation details, refer to the codebase and related documentation files.*
