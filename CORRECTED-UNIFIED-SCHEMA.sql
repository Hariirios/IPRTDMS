-- ============================================
-- IPRT UNIFIED DATABASE SCHEMA (CORRECTED)
-- ============================================
-- This schema fixes all errors and warnings
-- Run this in your Supabase SQL Editor
-- URL: https://app.supabase.com/project/YOUR_PROJECT/sql
-- ============================================

-- Enable UUID extension (for older PostgreSQL versions)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. STUDENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL,
    enrollment_date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Active', 'Completed', 'Dropped')),
    added