// src/services/admin.js
// Admin service for dashboard data and CRUD operations

import { supabase } from '../lib/supabase'

// ============================================
// USER STATISTICS
// ============================================

export async function getAdminStats() {
  try {
    // Get total users count
    const { count: totalUsers, error: countError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    if (countError) throw countError

    // Get users created in last 24 hours
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    const { count: signupsToday, error: todayError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', yesterday.toISOString())

    if (todayError) throw todayError

    // Get users created in last 7 days
    const lastWeek = new Date()
    lastWeek.setDate(lastWeek.getDate() - 7)

    const { count: signupsWeek, error: weekError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', lastWeek.toISOString())

    if (weekError) throw weekError

    // Get users created in last 30 days
    const lastMonth = new Date()
    lastMonth.setDate(lastMonth.getDate() - 30)

    const { count: signupsMonth, error: monthError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', lastMonth.toISOString())

    if (monthError) throw monthError

    return {
      totalUsers: totalUsers || 0,
      signupsToday: signupsToday || 0,
      signupsWeek: signupsWeek || 0,
      signupsMonth: signupsMonth || 0
    }
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return {
      totalUsers: 0,
      signupsToday: 0,
      signupsWeek: 0,
      signupsMonth: 0
    }
  }
}

export async function getUsers(page = 1, limit = 20, search = '') {
  try {
    const offset = (page - 1) * limit

    let query = supabase
      .from('profiles')
      .select('id, display_name, email, years_in_poland, interests, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (search) {
      query = query.or(`display_name.ilike.%${search}%,email.ilike.%${search}%`)
    }

    const { data, count, error } = await query

    if (error) throw error

    return {
      users: data || [],
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit)
    }
  } catch (error) {
    console.error('Error fetching users:', error)
    return { users: [], total: 0, page: 1, totalPages: 0 }
  }
}

// ============================================
// ANNOUNCEMENTS CRUD
// ============================================

export async function getAllAnnouncements() {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching announcements:', error)
    return []
  }
}

export async function createAnnouncement(announcement) {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .insert([announcement])
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error creating announcement:', error)
    return { data: null, error }
  }
}

export async function updateAnnouncement(id, updates) {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error updating announcement:', error)
    return { data: null, error }
  }
}

export async function deleteAnnouncement(id) {
  try {
    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', id)

    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('Error deleting announcement:', error)
    return { error }
  }
}

// ============================================
// SYSTEM ALERTS CRUD
// ============================================

export async function getAllAlerts() {
  try {
    const { data, error } = await supabase
      .from('system_alerts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching alerts:', error)
    return []
  }
}

export async function createAlert(alert) {
  try {
    const { data, error } = await supabase
      .from('system_alerts')
      .insert([alert])
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error creating alert:', error)
    return { data: null, error }
  }
}

export async function updateAlert(id, updates) {
  try {
    const { data, error } = await supabase
      .from('system_alerts')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error updating alert:', error)
    return { data: null, error }
  }
}

export async function deleteAlert(id) {
  try {
    const { error } = await supabase
      .from('system_alerts')
      .delete()
      .eq('id', id)

    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('Error deleting alert:', error)
    return { error }
  }
}

// ============================================
// FEATURED LISTINGS CRUD
// ============================================

export async function getAllListings() {
  try {
    const { data, error } = await supabase
      .from('featured_listings')
      .select('*')
      .order('display_order', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching listings:', error)
    return []
  }
}

export async function createListing(listing) {
  try {
    const { data, error } = await supabase
      .from('featured_listings')
      .insert([listing])
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error creating listing:', error)
    return { data: null, error }
  }
}

export async function updateListing(id, updates) {
  try {
    const { data, error } = await supabase
      .from('featured_listings')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error updating listing:', error)
    return { data: null, error }
  }
}

export async function deleteListing(id) {
  try {
    const { error } = await supabase
      .from('featured_listings')
      .delete()
      .eq('id', id)

    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('Error deleting listing:', error)
    return { error }
  }
}

export async function reorderListings(orderedIds) {
  try {
    const updates = orderedIds.map((id, index) => ({
      id,
      display_order: index
    }))

    for (const update of updates) {
      const { error } = await supabase
        .from('featured_listings')
        .update({ display_order: update.display_order })
        .eq('id', update.id)

      if (error) throw error
    }

    return { error: null }
  } catch (error) {
    console.error('Error reordering listings:', error)
    return { error }
  }
}
