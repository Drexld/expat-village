// src/contexts/AuthContext.jsx
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authModal, setAuthModal] = useState({ isOpen: false, view: 'sign_in' })
  const [shouldRedirectToOnboarding, setShouldRedirectToOnboarding] = useState(false)

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      if (error) console.error('Profile fetch error:', error)
      return data
    } catch (err) {
      console.error('fetchProfile error:', err)
      return null
    }
  }

  useEffect(() => {
    let isMounted = true
    let profileFetched = false

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!isMounted) return
      if (session?.user) {
        setUser(session.user)
        const p = await fetchProfile(session.user.id)
        if (!isMounted) return
        if (p) {
          setProfile(p)
          profileFetched = true
        }
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return

        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user)

          // Only fetch profile if we don't have one yet
          // Prevents profile wipe when SIGNED_IN re-fires on token refresh
          if (!profileFetched) {
            const p = await fetchProfile(session.user.id)
            if (!isMounted) return
            if (p) {
              setProfile(p)
              profileFetched = true
            }
          }

          // Check if this is a NEW user (created within last 60 seconds)
          const createdAt = new Date(session.user.created_at)
          const now = new Date()
          const secondsSinceCreation = (now - createdAt) / 1000
          const isNewUser = secondsSinceCreation < 60

          // Check if they've already completed onboarding
          const hasCompletedOnboarding = localStorage.getItem('expat-village-tribe')

          if (isNewUser && !hasCompletedOnboarding) {
            setShouldRedirectToOnboarding(true)
          }
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          // Keep user updated with fresh token, but don't touch profile
          setUser(session.user)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setProfile(null)
          profileFetched = false
        }
        setLoading(false)
      }
    )

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email, password, displayName) => {
    // Store display name for onboarding page to use
    localStorage.setItem('expat-village-pending-name', displayName)
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } }
    })
    return { data, error }
  }

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  }

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    })
    return { data, error }
  }

  const signOut = async () => {
    console.log('Sign out clicked!')
    let signOutError = null

    try {
      const { error } = await supabase.auth.signOut({ scope: 'local' })
      if (error) {
        signOutError = error
        console.error('Supabase signOut error:', error)
      }
    } catch (err) {
      signOutError = err
      console.error('SignOut error:', err)
    }

    try {
      // Stop auto-refresh to avoid token refresh after sign out
      supabase.auth.stopAutoRefresh()
    } catch (err) {
      console.error('Stop auto refresh error:', err)
    }

    try {
      // Clear all Supabase auth keys from localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('sb-') || key.includes('supabase')) {
          localStorage.removeItem(key)
        }
      })
    } catch (err) {
      console.error('LocalStorage clear error:', err)
    }

    // Clear state
    setUser(null)
    setProfile(null)

    console.log('Signed out successfully')

    if (signOutError) {
      console.warn('Sign-out completed with errors; forcing redirect.')
    }

    // Redirect to home (hard reload)
    window.location.replace('/')
  }

  const updateProfile = async (updates) => {
    if (!user) return { error: 'Not authenticated' }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (!error && data) {
      setProfile(data)
    }

    return { data, error }
  }

  const refreshProfile = async () => {
    if (!user) return
    const p = await fetchProfile(user.id)
    // Only update if fetch succeeded - don't wipe existing profile on failure
    if (p) setProfile(p)
  }

  const openAuthModal = (view = 'sign_in') => setAuthModal({ isOpen: true, view })
  const closeAuthModal = () => setAuthModal({ isOpen: false, view: 'sign_in' })
  
  // Clear the redirect flag after it's been used
  const clearOnboardingRedirect = () => setShouldRedirectToOnboarding(false)

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      isAuthenticated: !!user,
      signUp,
      signIn,
      signInWithGoogle,
      signOut,
      updateProfile,
      refreshProfile,
      authModal,
      openAuthModal,
      closeAuthModal,
      shouldRedirectToOnboarding,
      clearOnboardingRedirect
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
