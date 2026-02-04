// src/services/townhall.js
// Town Hall realtime chat and rooms service

import { supabase } from '../lib/supabase'

// Rooms
export async function getTownHallRooms() {
  try {
    const { data, error } = await supabase
      .from('townhall_rooms')
      .select('*')
      .eq('is_public', true)
      .order('title', { ascending: true })

    if (error) {
      console.error('TownHall rooms fetch error:', error)
      return { data: [], error }
    }

    return { data: data || [], error: null }
  } catch (error) {
    console.error('TownHall rooms fetch error:', error)
    return { data: [], error }
  }
}

export async function joinRoomConversation(conversationId, userId) {
  try {
    let resolvedUserId = userId
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) {
      console.error('Join room auth error:', authError)
    }
    if (authData?.user?.id) {
      if (resolvedUserId && resolvedUserId !== authData.user.id) {
        console.warn('Join room user mismatch; using auth user id.')
      }
      resolvedUserId = authData.user.id
    }

    if (!resolvedUserId) {
      return { data: null, error: new Error('Not authenticated') }
    }

    const { data, error } = await supabase
      .from('conversation_participants')
      .upsert(
        { conversation_id: conversationId, user_id: resolvedUserId },
        { onConflict: 'conversation_id,user_id' }
      )

    if (error) {
      console.error('Join room error:', error)
      return { data: null, error }
    }

    return { data: data || null, error: null }
  } catch (error) {
    console.error('Join room error:', error)
    return { data: null, error }
  }
}

// Messages
export async function getConversationMessages(conversationId, limit = 50) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('id, conversation_id, sender_id, content, content_type, created_at, profiles:sender_id (id, display_name, email)')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(limit)

    if (error) {
      console.error('Messages fetch error:', error)
      return { data: [], error }
    }

    return { data: data || [], error: null }
  } catch (error) {
    console.error('Messages fetch error:', error)
    return { data: [], error }
  }
}

export async function sendMessage(conversationId, userId, content) {
  try {
    const payload = {
      conversation_id: conversationId,
      sender_id: userId,
      content: content.trim(),
      content_type: 'text',
    }

    const { data, error } = await supabase
      .from('messages')
      .insert(payload)
      .select('id, conversation_id, sender_id, content, content_type, created_at')
      .single()

    if (error) {
      console.error('Send message error:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Send message error:', error)
    return { data: null, error }
  }
}

// Realtime subscription (messages only)
export function subscribeToMessages(conversationId, onInsert) {
  return supabase
    .channel(`messages:${conversationId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` },
      (payload) => onInsert?.(payload.new)
    )
    .subscribe()
}

export function unsubscribeFromChannel(channel) {
  if (channel) {
    supabase.removeChannel(channel)
  }
}
