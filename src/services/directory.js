// src/services/directory.js
// Directory listings and reviews service

import { supabase } from '../lib/supabase'

// Categories for directory
export const DIRECTORY_CATEGORIES = [
  { id: 'all', label: 'All', icon: '📍' },
  { id: 'bank', label: 'Banks', icon: '🏦' },
  { id: 'restaurant', label: 'Restaurants', icon: '🍽️' },
  { id: 'doctor', label: 'Healthcare', icon: '🏥' },
  { id: 'gym', label: 'Gyms', icon: '💪' },
  { id: 'services', label: 'Services', icon: '🛠️' },
  { id: 'shopping', label: 'Shopping', icon: '🛒' },
]

/**
 * Fetch all active directory listings
 * @param {string} category - Optional category filter
 * @returns {Promise<{data: Array, error: Object|null}>}
 */
export async function getDirectoryListings(category = null) {
  try {
    let query = supabase
      .from('directory_listings')
      .select('*')
      .eq('active', true)
      .order('expat_approved', { ascending: false })
      .order('rating_average', { ascending: false })

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching directory listings:', error)
      return { data: [], error }
    }

    return { data: data || [], error: null }
  } catch (error) {
    console.error('Directory service error:', error)
    return { data: [], error }
  }
}

/**
 * Fetch a single listing by ID
 * @param {string} id - Listing ID
 * @returns {Promise<{data: Object|null, error: Object|null}>}
 */
export async function getListingById(id) {
  try {
    const { data, error } = await supabase
      .from('directory_listings')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching listing:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Directory service error:', error)
    return { data: null, error }
  }
}

/**
 * Fetch reviews for a listing
 * @param {string} listingId - Listing ID
 * @returns {Promise<{data: Array, error: Object|null}>}
 */
export async function getListingReviews(listingId) {
  try {
    const { data, error } = await supabase
      .from('directory_reviews')
      .select('*')
      .eq('listing_id', listingId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching reviews:', error)
      return { data: [], error }
    }

    return { data: data || [], error: null }
  } catch (error) {
    console.error('Review service error:', error)
    return { data: [], error }
  }
}

/**
 * Create a new review
 * @param {Object} review - Review data
 * @returns {Promise<{data: Object|null, error: Object|null}>}
 */
export async function createReview(review) {
  try {
    const { data, error } = await supabase
      .from('directory_reviews')
      .insert(review)
      .select()
      .single()

    if (error) {
      console.error('Error creating review:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Review service error:', error)
    return { data: null, error }
  }
}

/**
 * Delete a review (user can only delete their own)
 * @param {string} reviewId - Review ID
 * @returns {Promise<{error: Object|null}>}
 */
export async function deleteReview(reviewId) {
  try {
    const { error } = await supabase
      .from('directory_reviews')
      .delete()
      .eq('id', reviewId)

    if (error) {
      console.error('Error deleting review:', error)
      return { error }
    }

    return { error: null }
  } catch (error) {
    console.error('Review service error:', error)
    return { error }
  }
}

// Admin functions

/**
 * Create a new listing (admin only)
 * @param {Object} listing - Listing data
 * @returns {Promise<{data: Object|null, error: Object|null}>}
 */
export async function createListing(listing) {
  try {
    const { data, error } = await supabase
      .from('directory_listings')
      .insert(listing)
      .select()
      .single()

    if (error) {
      console.error('Error creating listing:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Directory service error:', error)
    return { data: null, error }
  }
}

/**
 * Update a listing (admin only)
 * @param {string} id - Listing ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<{data: Object|null, error: Object|null}>}
 */
export async function updateListing(id, updates) {
  try {
    const { data, error } = await supabase
      .from('directory_listings')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating listing:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Directory service error:', error)
    return { data: null, error }
  }
}

/**
 * Delete a listing (admin only)
 * @param {string} id - Listing ID
 * @returns {Promise<{error: Object|null}>}
 */
export async function deleteListing(id) {
  try {
    const { error } = await supabase
      .from('directory_listings')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting listing:', error)
      return { error }
    }

    return { error: null }
  } catch (error) {
    console.error('Directory service error:', error)
    return { error }
  }
}

/**
 * Get all listings including inactive (admin only)
 * @returns {Promise<{data: Array, error: Object|null}>}
 */
export async function getAllListingsAdmin() {
  try {
    const { data, error } = await supabase
      .from('directory_listings')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching all listings:', error)
      return { data: [], error }
    }

    return { data: data || [], error: null }
  } catch (error) {
    console.error('Directory service error:', error)
    return { data: [], error }
  }
}

/**
 * Submit a business suggestion
 * @param {Object} suggestion - Suggestion data
 * @returns {Promise<{data: Object|null, error: Object|null}>}
 */
export async function submitBusinessSuggestion(suggestion) {
  try {
    const { data, error } = await supabase
      .from('business_suggestions')
      .insert(suggestion)
      .select()
      .single()

    if (error) {
      console.error('Error submitting suggestion:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Suggestion service error:', error)
    return { data: null, error }
  }
}
