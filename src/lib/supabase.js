// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Custom storage that explicitly uses localStorage
const customStorage = {
  getItem: (key) => {
    if (typeof window === 'undefined') return null
    const value = window.localStorage.getItem(key)
    console.log('Storage GET:', key, value ? 'found' : 'not found')
    return value
  },
  setItem: (key, value) => {
    if (typeof window === 'undefined') return
    console.log('Storage SET:', key)
    window.localStorage.setItem(key, value)
  },
  removeItem: (key) => {
    if (typeof window === 'undefined') return
    console.log('Storage REMOVE:', key)
    window.localStorage.removeItem(key)
  },
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: customStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
})
