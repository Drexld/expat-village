// src/services/announcements.js
// Admin announcements service using Supabase

import { supabase } from '../lib/supabase'

const CACHE_KEY = 'expat_village_announcements_en_v4'
const CACHE_DURATION = 15 * 60 * 1000 // 15 minutes
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
const QUERY_TIMEOUT_MS = 3000

/**
 * Fetches active admin announcements from Supabase
 * Returns array of announcements sorted by priority (high to low) and created date
 */
export async function getAnnouncements() {
  // Check cache first
  const cached = getFromCache()
  if (cached) {
    console.log('Using cached announcements:', cached)
    return cached
  }

  try {
    console.log('Fetching announcements (supabase client)...')
    // Fetch active announcements from Supabase
    const queryPromise = supabase
      .from('announcements_en')
      .select('*')
      .eq('active', true)
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false })

    const { data, error } = await promiseWithTimeout(queryPromise, QUERY_TIMEOUT_MS)

    if (error) {
      console.error('Supabase error fetching announcements:', error)
      return await fetchAnnouncementsRest()
    }

    // Cache the results
    saveToCache(data || [])

    console.log('Fetched announcements:', data)
    return data || []
  } catch (error) {
    console.error('Failed to fetch announcements:', error)
    return await fetchAnnouncementsRest()
  }
}

async function fetchAnnouncementsRest() {
  try {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.warn('Supabase env not configured for REST fallback')
      return []
    }

    console.log('Fetching announcements (REST fallback)...')
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), QUERY_TIMEOUT_MS)

    const url = `${SUPABASE_URL}/rest/v1/announcements_en?select=*&active=eq.true&order=priority.desc,created_at.desc`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('REST fallback error:', response.status, errorText)
      return []
    }

    const data = await response.json()
    saveToCache(data || [])
    console.log('Fetched announcements (REST fallback):', data)
    return data || []
  } catch (error) {
    console.error('REST fallback failed:', error)
    return []
  }
}

function promiseWithTimeout(promise, timeoutMs) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Supabase query timed out')), timeoutMs)
    })
  ])
}

/**
 * Cache helpers
 */
function getFromCache() {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (!cached) return null

    const { data, timestamp } = JSON.parse(cached)
    const age = Date.now() - timestamp

    if (age < CACHE_DURATION) {
      return data
    }

    // Cache expired
    localStorage.removeItem(CACHE_KEY)
    return null
  } catch (error) {
    console.error('Cache read error:', error)
    return null
  }
}

function saveToCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data,
      timestamp: Date.now()
    }))
  } catch (error) {
    console.error('Cache write error:', error)
  }
}

/**
 * Clear announcements cache (useful for testing)
 */
export function clearAnnouncementsCache() {
  localStorage.removeItem(CACHE_KEY)
  console.log('Announcements cache cleared')
}

/**
 * Get announcement type icon
 */
export function getAnnouncementIcon(type) {
  const icons = {
    info: 'info',
    warning: 'warning',
    success: 'success',
    alert: 'alert',
    event: 'calendar',
    update: 'bell'
  }
  return icons[type] || 'info'
}

/**
 * Get announcement type color classes
 */
export function getAnnouncementColors(type) {
  const colors = {
    info: {
      bg: 'rgba(59, 130, 246, 0.1)',
      border: 'rgba(59, 130, 246, 0.3)',
      text: 'rgb(147, 197, 253)'
    },
    warning: {
      bg: 'rgba(245, 158, 11, 0.1)',
      border: 'rgba(245, 158, 11, 0.3)',
      text: 'rgb(253, 224, 71)'
    },
    success: {
      bg: 'rgba(34, 197, 94, 0.1)',
      border: 'rgba(34, 197, 94, 0.3)',
      text: 'rgb(134, 239, 172)'
    },
    alert: {
      bg: 'rgba(239, 68, 68, 0.1)',
      border: 'rgba(239, 68, 68, 0.3)',
      text: 'rgb(252, 165, 165)'
    },
    event: {
      bg: 'rgba(168, 85, 247, 0.1)',
      border: 'rgba(168, 85, 247, 0.3)',
      text: 'rgb(216, 180, 254)'
    },
    update: {
      bg: 'rgba(139, 92, 246, 0.1)',
      border: 'rgba(139, 92, 246, 0.3)',
      text: 'rgb(196, 181, 253)'
    }
  }
  return colors[type] || colors.info
}
