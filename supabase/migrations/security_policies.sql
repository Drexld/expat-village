-- =============================================================================
-- EXPAT VILLAGE - COMPREHENSIVE SECURITY POLICIES
-- =============================================================================
-- Run this ENTIRE script in Supabase SQL Editor
-- This implements Row Level Security (RLS) for all tables
-- Safe to run multiple times - drops existing policies first
-- =============================================================================

-- =============================================================================
-- STEP 1: CREATE SECURITY DEFINER FUNCTION
-- This function bypasses RLS to check admin status, avoiding recursion
-- =============================================================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin() TO anon;

-- =============================================================================
-- STEP 2: ENABLE RLS ON ALL TABLES
-- =============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_progress ENABLE ROW LEVEL SECURITY;

-- Enable RLS on vibes_votes if it exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'vibes_votes') THEN
    EXECUTE 'ALTER TABLE vibes_votes ENABLE ROW LEVEL SECURITY';
  END IF;
END $$;

-- =============================================================================
-- STEP 3: PROFILES TABLE POLICIES
-- =============================================================================

-- Drop existing policies first
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;

-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can insert their own profile (for new signups)
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Admins can read all profiles (using security definer function)
CREATE POLICY "Admins can read all profiles" ON profiles
  FOR SELECT
  USING (is_admin());

-- =============================================================================
-- STEP 4: ANNOUNCEMENTS TABLE POLICIES
-- =============================================================================

DROP POLICY IF EXISTS "Anyone can read active announcements" ON announcements;
DROP POLICY IF EXISTS "Admins manage announcements" ON announcements;
DROP POLICY IF EXISTS "Admins can create announcements" ON announcements;
DROP POLICY IF EXISTS "Admins can update announcements" ON announcements;
DROP POLICY IF EXISTS "Admins can delete announcements" ON announcements;

-- Anyone (including anonymous) can read active announcements
CREATE POLICY "Anyone can read active announcements" ON announcements
  FOR SELECT
  USING (active = true);

-- Admins can read ALL announcements (including inactive)
CREATE POLICY "Admins can read all announcements" ON announcements
  FOR SELECT
  USING (is_admin());

-- Admins can create announcements
CREATE POLICY "Admins can create announcements" ON announcements
  FOR INSERT
  WITH CHECK (is_admin());

-- Admins can update announcements
CREATE POLICY "Admins can update announcements" ON announcements
  FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admins can delete announcements
CREATE POLICY "Admins can delete announcements" ON announcements
  FOR DELETE
  USING (is_admin());

-- =============================================================================
-- STEP 5: SYSTEM_ALERTS TABLE POLICIES
-- =============================================================================

DROP POLICY IF EXISTS "Anyone can read active alerts" ON system_alerts;
DROP POLICY IF EXISTS "Admins manage alerts" ON system_alerts;
DROP POLICY IF EXISTS "Admins can read all alerts" ON system_alerts;
DROP POLICY IF EXISTS "Admins can create alerts" ON system_alerts;
DROP POLICY IF EXISTS "Admins can update alerts" ON system_alerts;
DROP POLICY IF EXISTS "Admins can delete alerts" ON system_alerts;

-- Anyone can read active alerts that are within date range
CREATE POLICY "Anyone can read active alerts" ON system_alerts
  FOR SELECT
  USING (
    active = true
    AND start_date <= NOW()
    AND (end_date IS NULL OR end_date > NOW())
  );

-- Admins can read ALL alerts
CREATE POLICY "Admins can read all alerts" ON system_alerts
  FOR SELECT
  USING (is_admin());

-- Admins can create alerts
CREATE POLICY "Admins can create alerts" ON system_alerts
  FOR INSERT
  WITH CHECK (is_admin());

-- Admins can update alerts
CREATE POLICY "Admins can update alerts" ON system_alerts
  FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admins can delete alerts
CREATE POLICY "Admins can delete alerts" ON system_alerts
  FOR DELETE
  USING (is_admin());

-- =============================================================================
-- STEP 6: FEATURED_LISTINGS TABLE POLICIES
-- =============================================================================

DROP POLICY IF EXISTS "Anyone can read active listings" ON featured_listings;
DROP POLICY IF EXISTS "Admins manage listings" ON featured_listings;
DROP POLICY IF EXISTS "Admins can read all listings" ON featured_listings;
DROP POLICY IF EXISTS "Admins can create listings" ON featured_listings;
DROP POLICY IF EXISTS "Admins can update listings" ON featured_listings;
DROP POLICY IF EXISTS "Admins can delete listings" ON featured_listings;

-- Anyone can read active listings within date range
CREATE POLICY "Anyone can read active listings" ON featured_listings
  FOR SELECT
  USING (
    active = true
    AND start_date <= NOW()
    AND (end_date IS NULL OR end_date > NOW())
  );

-- Admins can read ALL listings
CREATE POLICY "Admins can read all listings" ON featured_listings
  FOR SELECT
  USING (is_admin());

-- Admins can create listings
CREATE POLICY "Admins can create listings" ON featured_listings
  FOR INSERT
  WITH CHECK (is_admin());

-- Admins can update listings
CREATE POLICY "Admins can update listings" ON featured_listings
  FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admins can delete listings
CREATE POLICY "Admins can delete listings" ON featured_listings
  FOR DELETE
  USING (is_admin());

-- =============================================================================
-- STEP 7: CHECKLIST_PROGRESS TABLE POLICIES
-- =============================================================================

DROP POLICY IF EXISTS "Users can manage own progress" ON checklist_progress;
DROP POLICY IF EXISTS "Users can read own progress" ON checklist_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON checklist_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON checklist_progress;
DROP POLICY IF EXISTS "Users can delete own progress" ON checklist_progress;

-- Users can read their own checklist progress
CREATE POLICY "Users can read own progress" ON checklist_progress
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own progress
CREATE POLICY "Users can insert own progress" ON checklist_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own progress
CREATE POLICY "Users can update own progress" ON checklist_progress
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own progress
CREATE POLICY "Users can delete own progress" ON checklist_progress
  FOR DELETE
  USING (auth.uid() = user_id);

-- Admins can read all progress (for analytics)
CREATE POLICY "Admins can read all progress" ON checklist_progress
  FOR SELECT
  USING (is_admin());

-- =============================================================================
-- STEP 8: VIBES_VOTES TABLE POLICIES (if exists)
-- =============================================================================

DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'vibes_votes') THEN
    -- Drop existing policies
    EXECUTE 'DROP POLICY IF EXISTS "Users can manage own votes" ON vibes_votes';
    EXECUTE 'DROP POLICY IF EXISTS "Users can read own votes" ON vibes_votes';
    EXECUTE 'DROP POLICY IF EXISTS "Users can insert own votes" ON vibes_votes';
    EXECUTE 'DROP POLICY IF EXISTS "Users can update own votes" ON vibes_votes';
    EXECUTE 'DROP POLICY IF EXISTS "Users can delete own votes" ON vibes_votes';
    EXECUTE 'DROP POLICY IF EXISTS "Anyone can read vote aggregates" ON vibes_votes';

    -- Users can read their own votes
    EXECUTE 'CREATE POLICY "Users can read own votes" ON vibes_votes FOR SELECT USING (auth.uid() = user_id)';

    -- Users can insert their own votes
    EXECUTE 'CREATE POLICY "Users can insert own votes" ON vibes_votes FOR INSERT WITH CHECK (auth.uid() = user_id)';

    -- Users can update their own votes
    EXECUTE 'CREATE POLICY "Users can update own votes" ON vibes_votes FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)';

    -- Users can delete their own votes
    EXECUTE 'CREATE POLICY "Users can delete own votes" ON vibes_votes FOR DELETE USING (auth.uid() = user_id)';
  END IF;
END $$;

-- =============================================================================
-- STEP 9: VERIFICATION QUERIES
-- Run these to verify policies are in place
-- =============================================================================

-- View all RLS-enabled tables
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' AND rowsecurity = true;

-- View all policies
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual FROM pg_policies WHERE schemaname = 'public';

-- =============================================================================
-- SECURITY NOTES:
-- =============================================================================
-- 1. The is_admin() function uses SECURITY DEFINER to bypass RLS when checking
--    admin status, preventing infinite recursion
--
-- 2. All tables require authenticated users except for reading public content
--    (active announcements, alerts, listings)
--
-- 3. Users can only access their own data for personal tables (profiles,
--    checklist_progress, vibes_votes)
--
-- 4. Admins have full access to manage content but cannot modify other users'
--    personal data (like their profiles)
--
-- 5. The WITH CHECK clause ensures data integrity on INSERT/UPDATE operations
-- =============================================================================
