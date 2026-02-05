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
      bg: 'rgba(117, 153, 124, 0.12)',
      border: 'rgba(117, 153, 124, 0.4)',
      text: 'rgb(94, 120, 104)',
      glow: 'rgba(117, 153, 124, 0.22)',
    },
    warning: {
      bg: 'rgba(199, 107, 85, 0.12)',
      border: 'rgba(199, 107, 85, 0.4)',
      text: 'rgb(167, 86, 66)',
      glow: 'rgba(199, 107, 85, 0.22)',
    },
    success: {
      bg: 'rgba(117, 153, 124, 0.14)',
      border: 'rgba(117, 153, 124, 0.45)',
      text: 'rgb(96, 122, 106)',
      glow: 'rgba(117, 153, 124, 0.24)',
    },
    alert: {
      bg: 'rgba(176, 73, 63, 0.14)',
      border: 'rgba(176, 73, 63, 0.4)',
      text: 'rgb(152, 64, 55)',
      glow: 'rgba(176, 73, 63, 0.22)',
    },
    event: {
      bg: 'rgba(210, 160, 115, 0.16)',
      border: 'rgba(210, 160, 115, 0.4)',
      text: 'rgb(170, 119, 78)',
      glow: 'rgba(210, 160, 115, 0.24)',
    },
    update: {
      bg: 'rgba(168, 154, 143, 0.14)',
      border: 'rgba(168, 154, 143, 0.45)',
      text: 'rgb(130, 116, 106)',
      glow: 'rgba(168, 154, 143, 0.24)',
    }
  }
  return colors[type] || colors.info
}
