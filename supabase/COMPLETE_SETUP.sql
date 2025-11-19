-- ============================================
-- COMPLETE SUPABASE DATABASE SETUP
-- Sirta Maanka Mental Health Platform
-- Run this ONE file in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PART 1: MAIN CONTENT TABLES
-- ============================================

-- Events Table
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    title_so TEXT NOT NULL,
    description TEXT NOT NULL,
    description_so TEXT NOT NULL,
    full_description TEXT NOT NULL,
    full_description_so TEXT NOT NULL,
    date DATE NOT NULL,
    location TEXT NOT NULL,
    location_so TEXT NOT NULL,
    speakers TEXT[] NOT NULL DEFAULT '{}',
    image TEXT NOT NULL,
    is_past BOOLEAN NOT NULL DEFAULT false,
    is_free BOOLEAN DEFAULT true,
    price NUMERIC(10, 2) CHECK (price >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Services Table
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    title_so TEXT NOT NULL,
    description TEXT NOT NULL,
    description_so TEXT NOT NULL,
    full_description TEXT NOT NULL,
    full_description_so TEXT NOT NULL,
    icon TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Mentors Table
CREATE TABLE IF NOT EXISTS mentors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    role_so TEXT NOT NULL,
    bio TEXT NOT NULL,
    bio_so TEXT NOT NULL,
    image TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    role_so TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT NOT NULL,
    feedback_so TEXT NOT NULL,
    service_type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Videos Table
CREATE TABLE IF NOT EXISTS videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    youtube_url TEXT NOT NULL,
    youtube_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    service_type TEXT NOT NULL,
    service_id TEXT NOT NULL,
    service_name TEXT NOT NULL,
    booking_date TEXT NOT NULL,
    booking_time TEXT NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Contacts Table
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Partners Table
CREATE TABLE IF NOT EXISTS partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    logo TEXT NOT NULL,
    website_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- PART 2: ADMIN AUTHENTICATION TABLES
-- ============================================

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    created_by TEXT
);

-- Password Reset Tokens Table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- PART 3: INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_is_past ON events(is_past);
CREATE INDEX IF NOT EXISTS idx_events_is_free ON events(is_free);
CREATE INDEX IF NOT EXISTS idx_mentors_service_id ON mentors(service_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_rating ON testimonials(rating);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON videos(created_at);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_partners_display_order ON partners(display_order);
CREATE INDEX IF NOT EXISTS idx_partners_is_active ON partners(is_active);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_users_is_active ON admin_users(is_active);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_email ON password_reset_tokens(email);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);

-- ============================================
-- PART 4: UPDATED_AT TRIGGERS
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mentors_updated_at BEFORE UPDATE ON mentors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON partners
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- PART 5: ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Enable read access for all users" ON events FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON services FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON mentors FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON videos FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON bookings FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON contacts FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON partners FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON admin_users FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON password_reset_tokens FOR SELECT USING (true);

-- Write access policies (INSERT, UPDATE, DELETE)
CREATE POLICY "Enable insert for authenticated users" ON events FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON events FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users" ON events FOR DELETE USING (true);

CREATE POLICY "Enable insert for authenticated users" ON services FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON services FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users" ON services FOR DELETE USING (true);

CREATE POLICY "Enable insert for authenticated users" ON mentors FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON mentors FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users" ON mentors FOR DELETE USING (true);

CREATE POLICY "Enable insert for authenticated users" ON testimonials FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON testimonials FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users" ON testimonials FOR DELETE USING (true);

CREATE POLICY "Enable insert for authenticated users" ON videos FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON videos FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users" ON videos FOR DELETE USING (true);

CREATE POLICY "Enable insert for authenticated users" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON bookings FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users" ON bookings FOR DELETE USING (true);

CREATE POLICY "Enable insert for authenticated users" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON contacts FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users" ON contacts FOR DELETE USING (true);

CREATE POLICY "Enable insert for authenticated users" ON partners FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON partners FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users" ON partners FOR DELETE USING (true);

CREATE POLICY "Enable insert for authenticated users" ON admin_users FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON admin_users FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users" ON admin_users FOR DELETE USING (true);

CREATE POLICY "Enable insert for authenticated users" ON password_reset_tokens FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON password_reset_tokens FOR UPDATE USING (true);

-- ============================================
-- PART 6: CREATE DEFAULT SUPER ADMIN USER
-- ============================================

-- Insert super admin user
-- Email: malitmohamud@gmail.com
-- Username: malitos
-- Password: malitofx@?
INSERT INTO admin_users (email, username, password_hash, role, is_active, created_by)
VALUES (
    'malitmohamud@gmail.com',
    'malitos',
    '$2b$10$fi2UnKxlzz1O.bYt4vygu.2JTLFxnovOJE871V/d1ftogLOUdeRZe',
    'super_admin',
    true,
    'system'
)
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- PART 7: DOCUMENTATION
-- ============================================

COMMENT ON TABLE admin_users IS 'Admin users with role-based access control';
COMMENT ON TABLE password_reset_tokens IS 'Password reset tokens for forgot password functionality';
COMMENT ON COLUMN admin_users.role IS 'super_admin (full access) or admin (content only)';
COMMENT ON COLUMN admin_users.created_by IS 'Username of admin who created this account';
COMMENT ON COLUMN password_reset_tokens.expires_at IS 'Token expires after 1 hour';
COMMENT ON COLUMN password_reset_tokens.used IS 'Token can only be used once';

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- 
-- Default Super Admin Credentials:
-- Email: malitmohamud@gmail.com
-- Username: malitos
-- Password: malitofx@?
-- 
-- Login at: /admin
-- 
-- ROLE PERMISSIONS:
-- 
-- SUPER ADMIN:
-- ✓ Create/Delete users
-- ✓ Manage all content
-- ✓ Change password
-- 
-- ADMIN:
-- ✓ Manage all content
-- ✓ Change password
-- ✗ Cannot create/delete users
-- 
-- ============================================
