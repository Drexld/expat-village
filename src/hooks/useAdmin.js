// src/hooks/useAdmin.js
// Admin authorization hook for protected admin routes

import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

export function useAdmin() {
  const { user, profile, loading } = useAuth()
  const [timedOut, setTimedOut] = useState(false)

  // Safety timeout - if profile hasn't loaded after 10s, stop waiting
  useEffect(() => {
    if (!loading && user && !profile && !timedOut) {
      const timer = setTimeout(() => setTimedOut(true), 10000)
      return () => clearTimeout(timer)
    }
    // Reset timeout if profile loads
    if (profile) setTimedOut(false)
  }, [loading, user, profile, timedOut])

  // Profile is still loading if: auth done, user exists, but profile hasn't arrived yet
  const profileStillLoading = !loading && !!user && !profile && !timedOut

  return {
    isAdmin: profile?.is_admin === true,
    isLoading: loading || profileStillLoading
  }
}

export default useAdmin
