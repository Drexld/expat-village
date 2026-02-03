// src/hooks/useSubscription.js
// Hook for subscription status and management

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import {
  getSubscription,
  checkFeatureAccess,
  clearSubscriptionCache,
  PLAN_FEATURES
} from '../services/subscription'

export function useSubscription() {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchSubscription = useCallback(async () => {
    if (!user?.id) {
      setSubscription(null)
      setLoading(false)
      return
    }

    setLoading(true)
    const { data, error: fetchError } = await getSubscription(user.id)

    if (fetchError) {
      setError(fetchError)
    } else {
      setSubscription(data)
      setError(null)
    }

    setLoading(false)
  }, [user?.id])

  // Fetch on mount and when user changes
  useEffect(() => {
    fetchSubscription()
  }, [fetchSubscription])

  // Listen for subscription updates via Supabase realtime
  useEffect(() => {
    if (!user?.id) return

    const channel = supabase
      .channel('subscription_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          // Clear cache and refetch
          clearSubscriptionCache(user.id)
          fetchSubscription()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user?.id, fetchSubscription])

  const refresh = useCallback(() => {
    if (user?.id) {
      clearSubscriptionCache(user.id)
      fetchSubscription()
    }
  }, [user?.id, fetchSubscription])

  const canAccess = useCallback(async (feature, currentUsage = 0) => {
    if (!user?.id) return false
    const { hasAccess } = await checkFeatureAccess(user.id, feature, currentUsage)
    return hasAccess
  }, [user?.id])

  return {
    subscription,
    loading,
    error,
    refresh,
    canAccess,
    // Convenience getters
    plan: subscription?.plan || 'free',
    isPremium: subscription?.isPremium || false,
    isBasic: subscription?.isBasic || false,
    isFree: subscription?.isFree ?? true,
    isActive: subscription?.isActive ?? false,
    features: subscription?.features || PLAN_FEATURES.free,
  }
}

export default useSubscription
