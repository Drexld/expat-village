# Expat Village - Comprehensive Security Infrastructure

## Table of Contents

1. [Overview](#1-overview)
2. [Row Level Security (RLS)](#2-row-level-security-rls)
3. [File Upload Security](#3-file-upload-security)
4. [Payment Security (Stripe)](#4-payment-security-stripe)
5. [Chat & Messaging Security](#5-chat--messaging-security)
6. [User Connections & Social Security](#6-user-connections--social-security)
7. [Location & Proximity Security](#7-location--proximity-security)
8. [Game Security](#8-game-security)
9. [Authentication Security](#9-authentication-security)
10. [API Security](#10-api-security)
11. [Data Privacy (GDPR)](#11-data-privacy-gdpr)
12. [Security Checklist](#12-security-checklist)

---

## 1. Overview

Expat Village handles sensitive user data including:
- Personal profiles and documents (PDFs)
- Payment information (via Stripe)
- Private messages
- Location data
- Social connections
- Game activity

This document outlines all security measures required to protect users.

---

## 2. Row Level Security (RLS)

### Core Tables

| Table | RLS | Policies |
|-------|-----|----------|
| `profiles` | Yes | Users own data, admins read all |
| `announcements` | Yes | Public read, admin manage |
| `system_alerts` | Yes | Public read active, admin manage |
| `featured_listings` | Yes | Public read active, admin manage |
| `checklist_progress` | Yes | Users own data |
| `vibes_votes` | Yes | Users own votes |

### New Tables Required

| Table | Purpose | Policies Needed |
|-------|---------|-----------------|
| `user_documents` | PDF uploads | Owner only, admin audit |
| `payments` | Payment records | Owner only, admin read |
| `subscriptions` | User subscriptions | Owner only |
| `messages` | Chat messages | Sender/recipient only |
| `conversations` | Chat threads | Participants only |
| `connections` | Friend/connections | Both users involved |
| `connection_requests` | Pending requests | Sender/recipient |
| `blocks` | Blocked users | Blocker only |
| `user_locations` | Location data | Owner only, proximity opt-in |
| `game_sessions` | Game matches | Participants only |
| `game_scores` | Leaderboards | Public scores, owner details |
| `reports` | User reports | Reporter + admins |

---

## 3. File Upload Security

### PDF Upload Requirements

```sql
-- Storage bucket policy for documents
CREATE POLICY "Users can upload own documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can read own documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### File Validation (Frontend)

```javascript
// src/utils/fileValidation.js
export const validatePDF = (file) => {
  const errors = []

  // Check file type
  if (file.type !== 'application/pdf') {
    errors.push('Only PDF files are allowed')
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024
  if (file.size > maxSize) {
    errors.push('File size must be under 10MB')
  }

  // Check file name for malicious patterns
  const dangerousPatterns = /[<>:"/\\|?*\x00-\x1f]/
  if (dangerousPatterns.test(file.name)) {
    errors.push('Invalid file name')
  }

  return { valid: errors.length === 0, errors }
}
```

### Server-side Validation (Edge Function)

```javascript
// supabase/functions/validate-upload/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  // Verify file magic bytes (PDF starts with %PDF)
  const buffer = await req.arrayBuffer()
  const header = new Uint8Array(buffer.slice(0, 4))
  const isPDF = header[0] === 0x25 && header[1] === 0x50 &&
                header[2] === 0x44 && header[3] === 0x46

  if (!isPDF) {
    return new Response('Invalid PDF file', { status: 400 })
  }

  // Scan for embedded scripts/malware (basic check)
  const content = new TextDecoder().decode(buffer)
  const dangerousPatterns = ['/JavaScript', '/JS', '/Launch', '/OpenAction']
  for (const pattern of dangerousPatterns) {
    if (content.includes(pattern)) {
      return new Response('PDF contains potentially dangerous content', { status: 400 })
    }
  }

  return new Response('Valid', { status: 200 })
})
```

---

## 4. Payment Security (Stripe)

### PCI Compliance

- **NEVER** store raw credit card numbers
- Use Stripe Elements for card input (PCI-compliant iframe)
- Only store Stripe customer IDs and subscription IDs

### Webhook Security

```javascript
// api/webhooks/stripe.js
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const sig = req.headers['stripe-signature']
  let event

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      webhookSecret
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).json({ error: 'Invalid signature' })
  }

  // Handle event types
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutComplete(event.data.object)
      break
    case 'customer.subscription.updated':
      await handleSubscriptionUpdate(event.data.object)
      break
    case 'customer.subscription.deleted':
      await handleSubscriptionCancel(event.data.object)
      break
    case 'invoice.payment_failed':
      await handlePaymentFailed(event.data.object)
      break
  }

  res.json({ received: true })
}
```

### Payment Database Schema

```sql
-- Payments table (store only references, not card data)
CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  stripe_payment_intent_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  amount INTEGER NOT NULL, -- in cents
  currency TEXT DEFAULT 'pln',
  status TEXT CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments"
ON payments FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can insert payments"
ON payments FOR INSERT
WITH CHECK (true); -- Only via server/webhook

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) UNIQUE NOT NULL,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  plan TEXT NOT NULL,
  status TEXT CHECK (status IN ('active', 'past_due', 'canceled', 'trialing')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription"
ON subscriptions FOR SELECT
USING (auth.uid() = user_id);
```

---

## 5. Chat & Messaging Security

### Database Schema

```sql
-- Conversations (chat threads)
CREATE TABLE conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT CHECK (type IN ('direct', 'group')) DEFAULT 'direct',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversation participants
CREATE TABLE conversation_participants (
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_read_at TIMESTAMP WITH TIME ZONE,
  PRIMARY KEY (conversation_id, user_id)
);

-- Messages
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  content_type TEXT CHECK (content_type IN ('text', 'image', 'file')) DEFAULT 'text',
  is_edited BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users can only see conversations they're part of
CREATE POLICY "Users can view own conversations"
ON conversations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_id = id AND user_id = auth.uid()
  )
);

-- Users can only see messages in their conversations
CREATE POLICY "Users can view messages in their conversations"
ON messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_id = messages.conversation_id
    AND user_id = auth.uid()
  )
);

-- Users can send messages to their conversations
CREATE POLICY "Users can send messages"
ON messages FOR INSERT
WITH CHECK (
  auth.uid() = sender_id
  AND EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_id = messages.conversation_id
    AND user_id = auth.uid()
  )
);

-- Users can only edit/delete their own messages
CREATE POLICY "Users can update own messages"
ON messages FOR UPDATE
USING (auth.uid() = sender_id)
WITH CHECK (auth.uid() = sender_id);
```

### Message Content Security

```javascript
// src/utils/messageSanitizer.js
import DOMPurify from 'dompurify'

export const sanitizeMessage = (content) => {
  // Remove HTML/script tags
  const clean = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [], // No HTML allowed
    ALLOWED_ATTR: []
  })

  // Limit length
  const maxLength = 2000
  if (clean.length > maxLength) {
    return clean.substring(0, maxLength)
  }

  return clean
}

// Rate limiting for messages
export const messageRateLimiter = {
  messages: new Map(),

  canSend(userId) {
    const now = Date.now()
    const userMessages = this.messages.get(userId) || []

    // Filter to last minute
    const recentMessages = userMessages.filter(t => now - t < 60000)

    // Max 30 messages per minute
    if (recentMessages.length >= 30) {
      return false
    }

    recentMessages.push(now)
    this.messages.set(userId, recentMessages)
    return true
  }
}
```

### Block System

```sql
-- User blocks
CREATE TABLE blocks (
  blocker_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  blocked_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (blocker_id, blocked_id)
);

ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own blocks"
ON blocks FOR ALL
USING (auth.uid() = blocker_id);

-- Function to check if blocked
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
```

---

## 6. User Connections & Social Security

### Database Schema

```sql
-- Connection requests
CREATE TABLE connection_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(sender_id, receiver_id)
);

-- Established connections
CREATE TABLE connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user1_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user1_id, user2_id),
  CHECK (user1_id < user2_id) -- Ensure consistent ordering
);

-- RLS Policies
ALTER TABLE connection_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;

-- Users can see requests involving them
CREATE POLICY "Users can view own requests"
ON connection_requests FOR SELECT
USING (auth.uid() IN (sender_id, receiver_id));

-- Users can send requests (if not blocked)
CREATE POLICY "Users can send requests"
ON connection_requests FOR INSERT
WITH CHECK (
  auth.uid() = sender_id
  AND NOT is_blocked(sender_id, receiver_id)
);

-- Only receiver can update request status
CREATE POLICY "Receivers can respond to requests"
ON connection_requests FOR UPDATE
USING (auth.uid() = receiver_id);

-- Users can see their connections
CREATE POLICY "Users can view own connections"
ON connections FOR SELECT
USING (auth.uid() IN (user1_id, user2_id));
```

---

## 7. Location & Proximity Security

### Privacy-First Design

```sql
-- User location (privacy-controlled)
CREATE TABLE user_locations (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  -- Store approximate location only (grid-based, not exact)
  grid_lat INTEGER, -- Latitude divided into ~1km grid
  grid_lng INTEGER, -- Longitude divided into ~1km grid
  city TEXT,
  country TEXT DEFAULT 'Poland',
  -- Privacy controls
  share_location BOOLEAN DEFAULT false,
  share_with TEXT CHECK (share_with IN ('none', 'connections', 'all')) DEFAULT 'none',
  -- Never store exact coordinates in main table
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE user_locations ENABLE ROW LEVEL SECURITY;

-- Users can manage own location
CREATE POLICY "Users can manage own location"
ON user_locations FOR ALL
USING (auth.uid() = user_id);

-- Users can see others based on privacy settings
CREATE POLICY "Users can see shared locations"
ON user_locations FOR SELECT
USING (
  auth.uid() = user_id -- Own location
  OR (
    share_location = true
    AND share_with = 'all'
    AND NOT is_blocked(auth.uid(), user_id)
  )
  OR (
    share_location = true
    AND share_with = 'connections'
    AND EXISTS (
      SELECT 1 FROM connections
      WHERE (user1_id = auth.uid() AND user2_id = user_id)
         OR (user1_id = user_id AND user2_id = auth.uid())
    )
    AND NOT is_blocked(auth.uid(), user_id)
  )
);
```

### Location Anonymization

```javascript
// src/utils/locationPrivacy.js

// Convert exact coordinates to grid (approx 1km squares)
export const toGridLocation = (lat, lng) => {
  // Each grid unit is approximately 0.01 degrees (~1km)
  const gridLat = Math.floor(lat * 100)
  const gridLng = Math.floor(lng * 100)
  return { gridLat, gridLng }
}

// Calculate approximate distance without revealing exact location
export const getApproximateDistance = (grid1, grid2) => {
  const latDiff = Math.abs(grid1.gridLat - grid2.gridLat)
  const lngDiff = Math.abs(grid1.gridLng - grid2.gridLng)

  // Approximate distance in km
  const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff)

  // Return fuzzy distance ranges
  if (distance <= 1) return 'Less than 1km'
  if (distance <= 5) return '1-5km'
  if (distance <= 10) return '5-10km'
  if (distance <= 25) return '10-25km'
  return 'Over 25km'
}

// Never expose exact coordinates to frontend
export const sanitizeLocationForClient = (location) => ({
  city: location.city,
  approximateDistance: location.distance,
  // Exclude: exact lat/lng, grid coordinates
})
```

---

## 8. Game Security

### Database Schema

```sql
-- Game sessions
CREATE TABLE game_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  game_type TEXT NOT NULL, -- 'city_duel', 'nearby_challenge', etc.
  status TEXT CHECK (status IN ('waiting', 'active', 'completed', 'cancelled')) DEFAULT 'waiting',
  player1_id UUID REFERENCES profiles(id),
  player2_id UUID REFERENCES profiles(id),
  winner_id UUID REFERENCES profiles(id),
  player1_score INTEGER DEFAULT 0,
  player2_score INTEGER DEFAULT 0,
  game_data JSONB, -- Game-specific data
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Game scores/leaderboard
CREATE TABLE game_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  game_type TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  draws INTEGER DEFAULT 0,
  ranking INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, game_type)
);

-- RLS Policies
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_scores ENABLE ROW LEVEL SECURITY;

-- Players can see their own games
CREATE POLICY "Players can view own games"
ON game_sessions FOR SELECT
USING (auth.uid() IN (player1_id, player2_id));

-- Public leaderboard (scores only)
CREATE POLICY "Anyone can view leaderboard"
ON game_scores FOR SELECT
USING (true);

-- Users can only update own scores via server
CREATE POLICY "System updates scores"
ON game_scores FOR UPDATE
USING (false); -- Only server can update
```

### Anti-Cheat Measures

```javascript
// Server-side game validation (Edge Function)
// supabase/functions/validate-game-action/index.ts

const validateGameAction = (session, action, userId) => {
  // Verify it's the player's turn
  if (session.current_turn !== userId) {
    return { valid: false, error: 'Not your turn' }
  }

  // Verify action timing (prevent speedhacks)
  const timeSinceLastAction = Date.now() - session.last_action_at
  if (timeSinceLastAction < 500) { // Min 500ms between actions
    return { valid: false, error: 'Too fast' }
  }

  // Verify action is legal for current game state
  const isValidMove = validateMoveForGameType(session.game_type, session.game_data, action)
  if (!isValidMove) {
    return { valid: false, error: 'Invalid move' }
  }

  // Log for audit
  await logGameAction(session.id, userId, action)

  return { valid: true }
}

// Rate limit game actions
const gameRateLimiter = {
  actions: new Map(),

  canAct(userId, gameId) {
    const key = `${userId}:${gameId}`
    const now = Date.now()
    const lastAction = this.actions.get(key) || 0

    if (now - lastAction < 100) { // Max 10 actions per second
      return false
    }

    this.actions.set(key, now)
    return true
  }
}
```

### Matchmaking Security

```javascript
// Prevent manipulation of matchmaking
const secureMatchmaking = {
  // Use server-side random selection
  findOpponent: async (userId, gameType) => {
    // Query from waiting players (server-side only)
    const { data: waitingPlayers } = await supabaseAdmin
      .from('game_sessions')
      .select('id, player1_id')
      .eq('game_type', gameType)
      .eq('status', 'waiting')
      .neq('player1_id', userId)
      .limit(10)

    if (waitingPlayers.length === 0) return null

    // Random selection (not first-come-first-serve to prevent gaming)
    const randomIndex = Math.floor(Math.random() * waitingPlayers.length)
    return waitingPlayers[randomIndex]
  },

  // Prevent players from choosing specific opponents
  // (unless it's a friend challenge with invite code)
}
```

---

## 9. Authentication Security

### Supabase Auth Configuration

```javascript
// src/lib/supabase.js
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce', // More secure auth flow
  }
})
```

### Session Management

```javascript
// src/contexts/AuthContext.jsx
// Auto-refresh session before expiry
useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (event === 'TOKEN_REFRESHED') {
        // Session refreshed successfully
      }
      if (event === 'SIGNED_OUT') {
        // Clear all local data
        localStorage.clear()
        sessionStorage.clear()
      }
    }
  )

  return () => subscription.unsubscribe()
}, [])
```

### Password Requirements

- Minimum 8 characters
- At least one uppercase, lowercase, number
- Check against common password lists
- Rate limit login attempts

---

## 10. API Security

### Rate Limiting

```javascript
// api/middleware/rateLimit.js
const rateLimit = new Map()

export const rateLimiter = (maxRequests = 100, windowMs = 60000) => {
  return (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    const key = `${ip}:${req.path}`
    const now = Date.now()

    const windowData = rateLimit.get(key) || { count: 0, resetTime: now + windowMs }

    if (now > windowData.resetTime) {
      windowData.count = 0
      windowData.resetTime = now + windowMs
    }

    windowData.count++
    rateLimit.set(key, windowData)

    if (windowData.count > maxRequests) {
      return res.status(429).json({ error: 'Too many requests' })
    }

    next()
  }
}
```

### Input Validation

```javascript
// src/utils/validation.js
import { z } from 'zod'

export const schemas = {
  message: z.object({
    content: z.string().min(1).max(2000),
    conversationId: z.string().uuid()
  }),

  profile: z.object({
    display_name: z.string().min(2).max(50),
    bio: z.string().max(500).optional(),
    interests: z.array(z.string()).max(10).optional()
  }),

  location: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
    share_location: z.boolean(),
    share_with: z.enum(['none', 'connections', 'all'])
  })
}

export const validate = (schema, data) => {
  try {
    return { success: true, data: schema.parse(data) }
  } catch (error) {
    return { success: false, errors: error.errors }
  }
}
```

---

## 11. Data Privacy (GDPR)

### User Rights Implementation

```sql
-- Data export function
CREATE OR REPLACE FUNCTION export_user_data(target_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  -- Only allow users to export their own data
  IF auth.uid() != target_user_id THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT jsonb_build_object(
    'profile', (SELECT row_to_json(p) FROM profiles p WHERE id = target_user_id),
    'messages_sent', (SELECT json_agg(m) FROM messages m WHERE sender_id = target_user_id),
    'checklist_progress', (SELECT json_agg(c) FROM checklist_progress c WHERE user_id = target_user_id),
    'payments', (SELECT json_agg(p) FROM payments p WHERE user_id = target_user_id),
    'exported_at', NOW()
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Account deletion function
CREATE OR REPLACE FUNCTION delete_user_account(target_user_id UUID)
RETURNS VOID AS $$
BEGIN
  IF auth.uid() != target_user_id THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Delete all user data (cascade will handle related tables)
  DELETE FROM profiles WHERE id = target_user_id;

  -- Log deletion for compliance
  INSERT INTO audit_log (action, user_id, timestamp)
  VALUES ('account_deleted', target_user_id, NOW());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Data Retention

- Chat messages: 1 year (then anonymized)
- Location data: 30 days
- Payment records: 7 years (legal requirement)
- Game history: 1 year
- Deleted accounts: Data removed within 30 days

---

## 12. Security Checklist

### Implemented

- [x] Row Level Security on core tables
- [x] is_admin() security function
- [x] Protected admin routes
- [x] Session management
- [x] Supabase auth configuration

### To Implement

- [ ] File upload validation (PDF)
- [ ] Storage bucket policies
- [ ] Stripe webhook verification
- [ ] Payment tables & RLS
- [ ] Chat tables & RLS
- [ ] Message sanitization
- [ ] Block system
- [ ] Connection request system
- [ ] Location privacy controls
- [ ] Game session tables & RLS
- [ ] Anti-cheat measures
- [ ] Rate limiting middleware
- [ ] Input validation (Zod)
- [ ] GDPR data export
- [ ] Account deletion
- [ ] Audit logging

### Run Security SQL

Execute the full migration:
```bash
# In Supabase SQL Editor, run:
# supabase/migrations/security_policies.sql
# supabase/migrations/security_advanced.sql (create this next)
```

---

## Contact

Security issues: security@expatvillage.pl
