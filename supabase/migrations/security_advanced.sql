-- =============================================================================
-- EXPAT VILLAGE - ADVANCED SECURITY TABLES & POLICIES
-- =============================================================================
-- Run this AFTER security_policies.sql
-- This creates tables for: Payments, Chat, Connections, Location, Games
-- =============================================================================

-- =============================================================================
-- PREREQUISITE: Create is_blocked function if not exists
-- =============================================================================

CREATE OR REPLACE FUNCTION is_blocked(user1 UUID, user2 UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM blocks
    WHERE (blocker_id = user1 AND blocked_id = user2)
       OR (blocker_id = user2 AND blocked_id = user1)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- SECTION 1: PAYMENTS & SUBSCRIPTIONS
-- =============================================================================

-- Payments table (Stripe references only - NO card data)
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_customer_id TEXT NOT NULL,
  amount INTEGER NOT NULL, -- in cents
  currency TEXT DEFAULT 'pln',
  status TEXT CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')) DEFAULT 'pending',
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own payments" ON payments;
DROP POLICY IF EXISTS "Admins can view all payments" ON payments;

CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all payments" ON payments
  FOR SELECT USING (is_admin());

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  plan TEXT NOT NULL, -- 'free', 'basic', 'premium', 'pro'
  status TEXT CHECK (status IN ('active', 'past_due', 'canceled', 'trialing', 'incomplete')) DEFAULT 'incomplete',
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own subscription" ON subscriptions;
DROP POLICY IF EXISTS "Admins can view all subscriptions" ON subscriptions;

CREATE POLICY "Users can view own subscription" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all subscriptions" ON subscriptions
  FOR SELECT USING (is_admin());

-- =============================================================================
-- SECTION 2: USER BLOCKS
-- =============================================================================

CREATE TABLE IF NOT EXISTS blocks (
  blocker_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  blocked_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (blocker_id, blocked_id)
);

ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own blocks" ON blocks;
DROP POLICY IF EXISTS "Users can create blocks" ON blocks;
DROP POLICY IF EXISTS "Users can delete own blocks" ON blocks;

CREATE POLICY "Users can view own blocks" ON blocks
  FOR SELECT USING (auth.uid() = blocker_id);

CREATE POLICY "Users can create blocks" ON blocks
  FOR INSERT WITH CHECK (auth.uid() = blocker_id);

CREATE POLICY "Users can delete own blocks" ON blocks
  FOR DELETE USING (auth.uid() = blocker_id);

-- =============================================================================
-- SECTION 3: CONNECTIONS (FRIENDS)
-- =============================================================================

-- Connection requests
CREATE TABLE IF NOT EXISTS connection_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled')) DEFAULT 'pending',
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(sender_id, receiver_id)
);

ALTER TABLE connection_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own requests" ON connection_requests;
DROP POLICY IF EXISTS "Users can send requests" ON connection_requests;
DROP POLICY IF EXISTS "Sender can cancel request" ON connection_requests;
DROP POLICY IF EXISTS "Receiver can respond to request" ON connection_requests;
DROP POLICY IF EXISTS "Users can delete own sent requests" ON connection_requests;

CREATE POLICY "Users can view own requests" ON connection_requests
  FOR SELECT USING (auth.uid() IN (sender_id, receiver_id));

CREATE POLICY "Users can send requests" ON connection_requests
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id
    AND sender_id != receiver_id
    AND NOT is_blocked(sender_id, receiver_id)
  );

CREATE POLICY "Sender can cancel request" ON connection_requests
  FOR UPDATE USING (auth.uid() = sender_id AND status = 'pending');

CREATE POLICY "Receiver can respond to request" ON connection_requests
  FOR UPDATE USING (auth.uid() = receiver_id AND status = 'pending');

CREATE POLICY "Users can delete own sent requests" ON connection_requests
  FOR DELETE USING (auth.uid() = sender_id);

-- Established connections
CREATE TABLE IF NOT EXISTS connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user1_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  user2_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user1_id, user2_id),
  CHECK (user1_id < user2_id) -- Ensure consistent ordering
);

ALTER TABLE connections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own connections" ON connections;
DROP POLICY IF EXISTS "Users can remove connections" ON connections;

CREATE POLICY "Users can view own connections" ON connections
  FOR SELECT USING (auth.uid() IN (user1_id, user2_id));

CREATE POLICY "Users can remove connections" ON connections
  FOR DELETE USING (auth.uid() IN (user1_id, user2_id));

-- Function to check if connected
CREATE OR REPLACE FUNCTION are_connected(user1 UUID, user2 UUID)
RETURNS BOOLEAN AS $$
DECLARE
  u1 UUID;
  u2 UUID;
BEGIN
  -- Ensure consistent ordering
  IF user1 < user2 THEN
    u1 := user1;
    u2 := user2;
  ELSE
    u1 := user2;
    u2 := user1;
  END IF;

  RETURN EXISTS (
    SELECT 1 FROM connections
    WHERE user1_id = u1 AND user2_id = u2
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if current user is a participant in a conversation
CREATE OR REPLACE FUNCTION is_conversation_participant(p_conversation_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
SET row_security = off
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM conversation_participants
    WHERE conversation_id = p_conversation_id
      AND user_id = auth.uid()
  );
END;
$$;

GRANT EXECUTE ON FUNCTION is_conversation_participant(UUID) TO authenticated, anon;

-- Function to join a conversation as the current user (avoids RLS insert mismatch)
CREATE OR REPLACE FUNCTION join_conversation_participant(p_conversation_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
SET row_security = off
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated' USING ERRCODE = '28000';
  END IF;

  INSERT INTO conversation_participants (conversation_id, user_id)
  VALUES (p_conversation_id, auth.uid())
  ON CONFLICT (conversation_id, user_id) DO NOTHING;

  RETURN TRUE;
END;
$$;

GRANT EXECUTE ON FUNCTION join_conversation_participant(UUID) TO authenticated, anon;

-- =============================================================================
-- SECTION 4: CHAT & MESSAGING
-- =============================================================================

-- Conversations
CREATE TABLE IF NOT EXISTS conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT CHECK (type IN ('direct', 'group')) DEFAULT 'direct',
  name TEXT, -- For group chats
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can create conversations" ON conversations;

-- Conversation participants
CREATE TABLE IF NOT EXISTS conversation_participants (
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('member', 'admin')) DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_read_at TIMESTAMP WITH TIME ZONE,
  is_muted BOOLEAN DEFAULT false,
  PRIMARY KEY (conversation_id, user_id)
);

ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Participants can view conversation members" ON conversation_participants;
DROP POLICY IF EXISTS "Participants can view members" ON conversation_participants;
DROP POLICY IF EXISTS "Users can join conversations" ON conversation_participants;
DROP POLICY IF EXISTS "Users can update own participation" ON conversation_participants;
DROP POLICY IF EXISTS "Users can leave conversations" ON conversation_participants;

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  content_type TEXT CHECK (content_type IN ('text', 'image', 'file', 'system')) DEFAULT 'text',
  metadata JSONB, -- For file URLs, image dimensions, etc.
  is_edited BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  reply_to_id UUID REFERENCES messages(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view messages in their conversations" ON messages;
DROP POLICY IF EXISTS "Users can send messages" ON messages;
DROP POLICY IF EXISTS "Users can edit own messages" ON messages;
DROP POLICY IF EXISTS "Users can soft-delete own messages" ON messages;

-- Conversation policies
CREATE POLICY "Users can view own conversations" ON conversations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_id = id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create conversations" ON conversations
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Participant policies
CREATE POLICY "Participants can view conversation members" ON conversation_participants
  FOR SELECT USING (is_conversation_participant(conversation_id));

CREATE POLICY "Users can join conversations" ON conversation_participants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own participation" ON conversation_participants
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can leave conversations" ON conversation_participants
  FOR DELETE USING (auth.uid() = user_id);

-- Message policies
CREATE POLICY "Users can view messages in their conversations" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_id = messages.conversation_id
      AND user_id = auth.uid()
    )
    AND NOT is_deleted
  );

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_id = messages.conversation_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can edit own messages" ON messages
  FOR UPDATE USING (auth.uid() = sender_id)
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can soft-delete own messages" ON messages
  FOR UPDATE USING (auth.uid() = sender_id);

-- =============================================================================
-- SECTION 5: LOCATION & PROXIMITY
-- =============================================================================

CREATE TABLE IF NOT EXISTS user_locations (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  -- Approximate location (grid-based for privacy)
  grid_lat INTEGER, -- ~1km precision
  grid_lng INTEGER,
  city TEXT,
  district TEXT,
  country TEXT DEFAULT 'Poland',
  -- Privacy settings
  share_location BOOLEAN DEFAULT false,
  share_with TEXT CHECK (share_with IN ('none', 'connections', 'all')) DEFAULT 'none',
  show_on_map BOOLEAN DEFAULT false,
  -- Timestamps
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE user_locations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own location" ON user_locations;
DROP POLICY IF EXISTS "Users can see public locations" ON user_locations;
DROP POLICY IF EXISTS "Users can see connected users locations" ON user_locations;

CREATE POLICY "Users can manage own location" ON user_locations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can see public locations" ON user_locations
  FOR SELECT USING (
    share_location = true
    AND share_with = 'all'
    AND NOT is_blocked(auth.uid(), user_id)
  );

CREATE POLICY "Users can see connected users locations" ON user_locations
  FOR SELECT USING (
    share_location = true
    AND share_with = 'connections'
    AND are_connected(auth.uid(), user_id)
    AND NOT is_blocked(auth.uid(), user_id)
  );

-- =============================================================================
-- SECTION 6: GAMES
-- =============================================================================

-- Game sessions
CREATE TABLE IF NOT EXISTS game_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  game_type TEXT NOT NULL, -- 'city_duel', 'nearby_expat', 'quiz', etc.
  status TEXT CHECK (status IN ('waiting', 'active', 'completed', 'cancelled', 'abandoned')) DEFAULT 'waiting',
  player1_id UUID REFERENCES profiles(id),
  player2_id UUID REFERENCES profiles(id),
  winner_id UUID REFERENCES profiles(id),
  player1_score INTEGER DEFAULT 0,
  player2_score INTEGER DEFAULT 0,
  current_round INTEGER DEFAULT 1,
  total_rounds INTEGER DEFAULT 5,
  current_turn UUID REFERENCES profiles(id),
  game_data JSONB, -- Game-specific data (questions, answers, etc.)
  invite_code TEXT UNIQUE, -- For friend challenges
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  last_action_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Players can view own games" ON game_sessions;
DROP POLICY IF EXISTS "Users can see waiting games" ON game_sessions;
DROP POLICY IF EXISTS "Users can create games" ON game_sessions;
DROP POLICY IF EXISTS "Players can update games" ON game_sessions;

-- Players can see their own games
CREATE POLICY "Players can view own games" ON game_sessions
  FOR SELECT USING (auth.uid() IN (player1_id, player2_id));

-- Players can see waiting games for matchmaking
CREATE POLICY "Users can see waiting games" ON game_sessions
  FOR SELECT USING (
    status = 'waiting'
    AND player2_id IS NULL
    AND player1_id != auth.uid()
    AND NOT is_blocked(auth.uid(), player1_id)
  );

-- Users can create games
CREATE POLICY "Users can create games" ON game_sessions
  FOR INSERT WITH CHECK (auth.uid() = player1_id);

-- Players can update their games
CREATE POLICY "Players can update games" ON game_sessions
  FOR UPDATE USING (auth.uid() IN (player1_id, player2_id));

-- Game scores / Leaderboard
CREATE TABLE IF NOT EXISTS game_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  game_type TEXT NOT NULL,
  total_score INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  draws INTEGER DEFAULT 0,
  games_played INTEGER DEFAULT 0,
  win_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  ranking INTEGER,
  tier TEXT CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum', 'diamond')) DEFAULT 'bronze',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, game_type)
);

ALTER TABLE game_scores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view leaderboard" ON game_scores;

-- Public leaderboard
CREATE POLICY "Anyone can view leaderboard" ON game_scores
  FOR SELECT USING (true);

-- Only server can update scores (via service role)
-- Frontend cannot directly modify scores

-- =============================================================================
-- SECTION 7: USER DOCUMENTS (PDF Uploads)
-- =============================================================================

CREATE TABLE IF NOT EXISTS user_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL, -- Storage path
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  document_type TEXT, -- 'contract', 'id', 'other'
  is_analyzed BOOLEAN DEFAULT false,
  analysis_result JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE user_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own documents" ON user_documents;
DROP POLICY IF EXISTS "Admins can view documents for support" ON user_documents;

CREATE POLICY "Users can manage own documents" ON user_documents
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view documents for support" ON user_documents
  FOR SELECT USING (is_admin());

-- =============================================================================
-- SECTION 8: REPORTS (User Reports)
-- =============================================================================

CREATE TABLE IF NOT EXISTS reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reported_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reported_content_type TEXT, -- 'message', 'profile', 'game', etc.
  reported_content_id UUID,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('pending', 'reviewing', 'resolved', 'dismissed')) DEFAULT 'pending',
  admin_notes TEXT,
  resolved_by UUID REFERENCES profiles(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can create reports" ON reports;
DROP POLICY IF EXISTS "Users can view own reports" ON reports;
DROP POLICY IF EXISTS "Admins can manage all reports" ON reports;

CREATE POLICY "Users can create reports" ON reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view own reports" ON reports
  FOR SELECT USING (auth.uid() = reporter_id);

CREATE POLICY "Admins can manage all reports" ON reports
  FOR ALL USING (is_admin());

-- =============================================================================
-- SECTION 9: AUDIT LOG
-- =============================================================================

CREATE TABLE IF NOT EXISTS audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view audit logs" ON audit_log;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs" ON audit_log
  FOR SELECT USING (is_admin());

-- System can insert audit logs (no user can directly)

-- =============================================================================
-- SECTION 10: STORAGE BUCKET POLICIES
-- =============================================================================

-- Note: Run these in Supabase Dashboard -> Storage -> Policies

-- For 'documents' bucket:
-- INSERT: auth.uid()::text = (storage.foldername(name))[1]
-- SELECT: auth.uid()::text = (storage.foldername(name))[1]
-- DELETE: auth.uid()::text = (storage.foldername(name))[1]

-- For 'avatars' bucket:
-- INSERT: auth.uid()::text = (storage.foldername(name))[1]
-- SELECT: true (public avatars)
-- UPDATE: auth.uid()::text = (storage.foldername(name))[1]
-- DELETE: auth.uid()::text = (storage.foldername(name))[1]

-- =============================================================================
-- VERIFICATION
-- =============================================================================

SELECT 'New tables created:' as info;
SELECT tablename FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN (
  'payments', 'subscriptions', 'blocks', 'connection_requests', 'connections',
  'conversations', 'conversation_participants', 'messages',
  'user_locations', 'game_sessions', 'game_scores',
  'user_documents', 'reports', 'audit_log'
);

SELECT 'RLS enabled on all tables:' as info;
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public'
AND rowsecurity = true;
