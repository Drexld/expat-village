// src/services/subscription.js
// Subscription management service for frontend

import { supabase } from '../lib/supabase'

const CACHE_KEY = 'expat_village_subscription'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Plan feature definitions
export const PLAN_FEATURES = {
  free: {
    name: 'Free',
    price: 0,
    features: [
      'Access to community forums',
      'Basic expat guides',
      'Weekly newsletter',
      '3 document analyses per month',
    ],
    limits: {
      documentAnalysis: 3,
      contractAnalysis: 1,
      aiAssistant: 5,
    }
  },
  basic: {
    name: 'Basic',
    price: 9,
    features: [
      'Everything in Free',
      'Unlimited document analyses',
      '5 contract analyses per month',
      'Priority email support',
      'Exclusive Discord access',
    ],
    limits: {
      documentAnalysis: Infinity,
      contractAnalysis: 5,
      aiAssistant: 50,
    }
  },
  premium: {
    name: 'Premium',
    price: 19,
    features: [
      'Everything in Basic',
      'Unlimited contract analyses',
      'Unlimited AI assistant',
      '1-on-1 onboarding call',
      'Priority phone support',
      'Early access to new features',
    ],
    limits: {
      documentAnalysis: Infinity,
      contractAnalysis: Infinity,
      aiAssistant: Infinity,
    }
  },
}

/**
 * Get current user's subscription status
 * @param {string} userId - Supabase user ID
 * @returns {Promise<{data: Object|null, error: Object|null}>}
 */
export async function getSubscription(userId) {
  if (!userId) {
    return { data: null, error: 'User ID required' }
  }

  // Check cache first
  const cached = getFromCache(userId)
  if (cached) {
    return { data: cached, error: null }
  }

  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      throw error
    }

    // Default to free plan if no subscription exists
    const subscription = data || {
      user_id: userId,
      plan: 'free',
      status: 'active',
    }

    // Add computed properties
    const enrichedSubscription = {
      ...subscription,
      isPremium: subscription.plan === 'premium',
      isBasic: subscription.plan === 'basic',
      isFree: subscription.plan === 'free',
      isActive: ['active', 'trialing'].includes(subscription.status),
      features: PLAN_FEATURES[subscription.plan] || PLAN_FEATURES.free,
    }

    // Cache the result
    saveToCache(userId, enrichedSubscription)

    return { data: enrichedSubscription, error: null }
  } catch (error) {
    console.error('Error fetching subscription:', error)
    return { data: null, error }
  }
}

/**
 * Check if user has access to a specific feature
 * @param {string} userId - Supabase user ID
 * @param {string} feature - Feature key (documentAnalysis, contractAnalysis, aiAssistant)
 * @param {number} currentUsage - Current usage count
 * @returns {Promise<{hasAccess: boolean, limit: number, remaining: number}>}
 */
export async function checkFeatureAccess(userId, feature, currentUsage = 0) {
  const { data: subscription } = await getSubscription(userId)

  if (!subscription) {
    return { hasAccess: false, limit: 0, remaining: 0 }
  }

  const limit = subscription.features?.limits?.[feature] || 0
  const remaining = limit === Infinity ? Infinity : Math.max(0, limit - currentUsage)
  const hasAccess = remaining > 0

  return { hasAccess, limit, remaining }
}

/**
 * Create a Stripe Checkout Session
 * @param {string} plan - 'basic' or 'premium'
 * @param {string} userId - Supabase user ID
 * @param {string} email - User email
 * @returns {Promise<{data: Object|null, error: Object|null}>}
 */
export async function createCheckoutSession(plan, userId, email) {
  try {
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        plan,
        userId,
        email,
        successUrl: `${window.location.origin}/settings?success=true`,
        cancelUrl: `${window.location.origin}/pricing?canceled=true`,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Failed to create checkout session')
    }

    return result
  } catch (error) {
    console.error('Checkout session error:', error)
    return { data: null, error: error.message }
  }
}

/**
 * Open Stripe Customer Portal
 * @param {string} userId - Supabase user ID
 * @returns {Promise<{data: Object|null, error: Object|null}>}
 */
export async function openCustomerPortal(userId) {
  try {
    const response = await fetch('/api/stripe/create-customer-portal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        returnUrl: `${window.location.origin}/settings`,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Failed to create portal session')
    }

    return result
  } catch (error) {
    console.error('Customer portal error:', error)
    return { data: null, error: error.message }
  }
}

/**
 * Clear subscription cache
 * @param {string} userId - Supabase user ID
 */
export function clearSubscriptionCache(userId) {
  try {
    localStorage.removeItem(`${CACHE_KEY}_${userId}`)
  } catch (error) {
    console.error('Cache clear error:', error)
  }
}

// Cache helpers
function getFromCache(userId) {
  try {
    const cached = localStorage.getItem(`${CACHE_KEY}_${userId}`)
    if (!cached) return null

    const { data, timestamp } = JSON.parse(cached)
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(`${CACHE_KEY}_${userId}`)
      return null
    }

    return data
  } catch {
    return null
  }
}

function saveToCache(userId, data) {
  try {
    localStorage.setItem(`${CACHE_KEY}_${userId}`, JSON.stringify({
      data,
      timestamp: Date.now(),
    }))
  } catch (error) {
    console.error('Cache save error:', error)
  }
}
