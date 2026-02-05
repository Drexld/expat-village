-- =============================================================================
-- EXPAT VILLAGE - TOWN HALL ROOMS (PUBLIC INDEX)
-- =============================================================================
-- Public-facing rooms list for discovery. Each room maps to a chat conversation.
-- Run this in Supabase SQL Editor or via migrations.
-- =============================================================================

-- Rooms index table
CREATE TABLE IF NOT EXISTS townhall_rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  activity_level TEXT CHECK (activity_level IN ('very_active', 'active', 'moderate', 'quiet')) DEFAULT 'active',
  is_public BOOLEAN DEFAULT true,
  conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE townhall_rooms ENABLE ROW LEVEL SECURITY;

-- Public can read public rooms
DROP POLICY IF EXISTS "Public can read rooms" ON townhall_rooms;
CREATE POLICY "Public can read rooms" ON townhall_rooms
  FOR SELECT USING (is_public = true);

-- Admins manage rooms
DROP POLICY IF EXISTS "Admins manage rooms" ON townhall_rooms;
CREATE POLICY "Admins manage rooms" ON townhall_rooms
  FOR ALL USING (is_admin());

-- Seed rooms (idempotent by slug)
INSERT INTO townhall_rooms (slug, title, description, icon, activity_level, is_public)
VALUES
  ('newcomers', 'Newcomers Corner', 'Just arrived? Start here. Ask anything.', '', 'very_active', true),
  ('housing', 'Housing & Rentals', 'Apartment hunting, roommates, landlord issues', '', 'very_active', true),
  ('jobs', 'Jobs & Networking', 'Career chat, job leads, professional connections', '', 'active', true),
  ('social', 'Social & Events', 'Meetups, activities, and making friends', '', 'very_active', true),
  ('daily-life', 'Daily Life', 'Shopping, services, and everyday questions', '', 'active', true),
  ('parents', 'Parents & Families', 'Kids, schools, and family life in Poland', '', 'active', true),
  ('polish', 'Polish Language', 'Learning Polish, translation help, language wins', '', 'active', true),
  ('buy-sell', 'Buy, Sell, Give', 'Marketplace for expats - furniture, items, freebies', '', 'moderate', true)
ON CONFLICT (slug) DO NOTHING;

-- Helper: create conversation for rooms that don't yet have one
DO $$
DECLARE
  room RECORD;
  convo_id UUID;
BEGIN
  FOR room IN SELECT * FROM townhall_rooms WHERE conversation_id IS NULL LOOP
    INSERT INTO conversations (type, name, created_by)
    VALUES ('group', room.title, NULL)
    RETURNING id INTO convo_id;

    UPDATE townhall_rooms
    SET conversation_id = convo_id, updated_at = NOW()
    WHERE id = room.id;
  END LOOP;
END $$;

-- Verify
-- SELECT * FROM townhall_rooms ORDER BY title;
