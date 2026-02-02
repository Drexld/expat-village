-- Migration: Add personalization fields to profiles and announcements tables
-- Run this in your Supabase SQL Editor

-- ================================================
-- PROFILES TABLE - Add personalization fields
-- ================================================

-- TRC (Temporary Residence Card) expiry date for smart reminders
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS trc_expiry_date DATE;

-- How long they've been in Poland (for filtering content)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS years_in_poland INTEGER;

-- User's interests (for personalized content)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS interests TEXT[] DEFAULT '{}';

-- Notification preferences
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS reminder_trc BOOLEAN DEFAULT true;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS reminder_events BOOLEAN DEFAULT true;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS reminder_weekly BOOLEAN DEFAULT false;

-- ================================================
-- ANNOUNCEMENTS TABLE - Add targeting fields
-- ================================================

-- Target audience: 'all', 'newcomers' (< 2 years), 'experienced' (2+ years)
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS target_audience VARCHAR(20) DEFAULT 'all';

-- Category for interest-based filtering (e.g., 'housing', 'legal', 'events')
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS category VARCHAR(50);

-- ================================================
-- COMMENTS
-- ================================================

COMMENT ON COLUMN profiles.trc_expiry_date IS 'User''s TRC expiry date for smart reminders';
COMMENT ON COLUMN profiles.years_in_poland IS 'How long user has been in Poland (years)';
COMMENT ON COLUMN profiles.interests IS 'Array of interest categories for personalized content';
COMMENT ON COLUMN profiles.reminder_trc IS 'Whether to send TRC expiry reminders';
COMMENT ON COLUMN profiles.reminder_events IS 'Whether to send event reminders';
COMMENT ON COLUMN profiles.reminder_weekly IS 'Whether to send weekly digest';

COMMENT ON COLUMN announcements.target_audience IS 'Who should see this: all, newcomers, experienced';
COMMENT ON COLUMN announcements.category IS 'Category for interest-based filtering';

-- ================================================
-- EXAMPLE: Update existing announcements with targeting
-- ================================================

-- Example: Mark "Welcome to Expat Village" as newcomers-only
-- UPDATE announcements
-- SET target_audience = 'newcomers'
-- WHERE title ILIKE '%welcome%' OR title ILIKE '%getting started%';

-- Example: Mark visa deadline as legal category (shows to users interested in legal)
-- UPDATE announcements
-- SET category = 'legal'
-- WHERE title ILIKE '%visa%' OR title ILIKE '%trc%' OR title ILIKE '%permit%';
