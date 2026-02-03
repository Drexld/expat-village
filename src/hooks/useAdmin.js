// src/hooks/useAdmin.js
// Admin authorization hook for protected admin routes

import { useAuth } from '../contexts/AuthContext'

export function useAdmin() {
  const { profile, loading } = useAuth()

  return {
    isAdmin: profile?.is_admin === true,
    isLoading: loading
  }
}

export default useAdmin
