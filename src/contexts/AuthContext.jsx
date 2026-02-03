// src/contexts/AuthContext.jsx
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
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        const p = await fetchProfile(session.user.id)
        setProfile(p)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user)
          const p = await fetchProfile(session.user.id)
          setProfile(p)
          
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
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
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

    // Clear local storage directly
    localStorage.removeItem('sb-nkybxminaowwtrmoffzw-auth-token')

    // Clear state
    setUser(null)
    setProfile(null)

    // Try Supabase signOut in background (don't await)
    supabase.auth.signOut().catch(err => console.log('Background signout:', err))

    console.log('Signed out locally')

    // Reload page to ensure clean state
    window.location.reload()
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
    setProfile(p)
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
