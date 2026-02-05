// src/components/AdminRoute.jsx
// Protected route wrapper for admin-only pages

import { Navigate } from 'react-router-dom'
import { useAdmin } from '../hooks/useAdmin'

function AdminRoute({ children }) {
  const { isAdmin, isLoading } = useAdmin()

  // Show loading spinner while checking admin status
  if (isLoading) {
    return (
      <div className="min-h-screen bg-terra-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-terra-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-terra-taupe text-sm">Checking access...</p>
        </div>
      </div>
    )
  }

  // Redirect non-admins to home
  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return children
}

export default AdminRoute
