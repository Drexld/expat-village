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

  useEffect(() => {
    let isMounted = true
    let profileLoaded = false

    // Fetch profile - no aggressive timeout; let Supabase handle token refresh internally
    const loadProfile = async (userId) => {
      if (profileLoaded) return
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()

        if (!isMounted) return
        if (error) {
          console.error('Profile fetch error:', error)
          return
        }
        if (data) {
          setProfile(data)
          profileLoaded = true
        }
      } catch (err) {
        console.error('loadProfile error:', err)
      }
    }

    // Single source of truth: onAuthStateChange fires INITIAL_SESSION on subscribe
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!isMounted) return

        if (!session?.user) {
          setUser(null)
          setProfile(null)
          profileLoaded = false
          setLoading(false)
          return
        }

        // Synchronous state updates (no async in callback to avoid blocking events)
        setUser(session.user)
        setLoading(false)

        // Fire-and-forget profile load - doesn't block subsequent auth events
        if (!profileLoaded) {
          loadProfile(session.user.id)
        }

        // New user onboarding check
        if (event === 'SIGNED_IN') {
          const createdAt = new Date(session.user.created_at)
          const isNewUser = (new Date() - createdAt) / 1000 < 60
          if (isNewUser && !localStorage.getItem('expat-village-tribe')) {
            setShouldRedirectToOnboarding(true)
          }
        }
      }
    )

    // Safety net: if profile still hasn't loaded after 4s, force a session refresh
    const safetyTimer = setTimeout(async () => {
      if (!isMounted || profileLoaded) return
      try {
        const { data: { session } } = await supabase.auth.refreshSession()
        if (!isMounted || profileLoaded || !session?.user) return
        setUser(session.user)
        loadProfile(session.user.id)
      } catch (err) {
        console.error('Safety refresh failed:', err)
      }
    }, 4000)

    return () => {
      isMounted = false
      subscription.unsubscribe()
      clearTimeout(safetyTimer)
    }
  }, [])

  const signUp = async (email, password, displayName) => {
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
      supabase.auth.stopAutoRefresh()
    } catch (err) {
      console.error('Stop auto refresh error:', err)
    }

    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('sb-') || key.includes('supabase')) {
          localStorage.removeItem(key)
        }
      })
    } catch (err) {
      console.error('LocalStorage clear error:', err)
    }

    setUser(null)
    setProfile(null)

    console.log('Signed out successfully')

    if (signOutError) {
      console.warn('Sign-out completed with errors; forcing redirect.')
    }

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
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      if (data) setProfile(data)
    } catch (err) {
      console.error('refreshProfile error:', err)
    }
  }

  const openAuthModal = (view = 'sign_in') => setAuthModal({ isOpen: true, view })
  const closeAuthModal = () => setAuthModal({ isOpen: false, view: 'sign_in' })

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
