// src/layouts/AdminLayout.jsx
// Admin dashboard layout with sidebar navigation

import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Icon from '../components/Icon'

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: 'badge', exact: true },
  { path: '/admin/announcements', label: 'Announcements', icon: 'bell' },
  { path: '/admin/alerts', label: 'System Alerts', icon: 'alert' },
  { path: '/admin/listings', label: 'Featured Listings', icon: 'star' },
  { path: '/admin/directory', label: 'Directory', icon: 'pin' },
  { path: '/admin/users', label: 'Users', icon: 'user' },
]

function AdminLayout() {
  const location = useLocation()
  const { user, profile, signOut } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path
    }
    return location.pathname.startsWith(item.path)
  }

  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'Admin'

  return (
    <div className="min-h-screen text-terra-ink bg-terra-bg">
      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 glass-strong border-b border-black/10">
        <div className="flex items-center justify-between px-4 h-14">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-terra-ink-soft hover:text-terra-ink"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-sm font-semibold text-terra-ink">Admin Dashboard</span>
          <Link to="/" className="p-2 text-terra-ink-soft hover:text-terra-ink">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Link>
        </div>
      </header>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 glass-strong border-r border-black/10
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        {/* Sidebar header */}
        <div className="p-4 border-b border-black/10">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div
                className="absolute inset-0 rounded-lg blur opacity-40 group-hover:opacity-70 transition-opacity"
                style={{ background: 'linear-gradient(135deg, rgba(199,107,85,0.45), rgba(117,153,124,0.35))' }}
              />
              <div className="relative w-10 h-10 rounded-lg overflow-hidden glass-3d">
                <img src="/icon.svg" alt="Expat Village" className="w-full h-full object-cover" />
              </div>
            </div>
            <div>
              <h1 className="text-sm font-bold text-terra-ink">Expat Village</h1>
              <p className="text-xs text-terra-taupe">Admin Panel</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                ${isActive(item)
                  ? 'glass-panel text-terra-ink border border-black/10'
                  : 'text-terra-ink-soft hover:text-terra-ink hover:bg-black/5'
                }
              `}
            >
              <Icon name={item.icon} className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Divider */}
        <div className="px-4 my-4">
          <div className="border-t border-black/10" />
        </div>

        {/* Back to app link */}
        <div className="px-4">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-terra-ink-soft hover:text-terra-ink hover:bg-black/5 transition-all"
          >
            <Icon name="home" className="w-5 h-5" />
            Back to App
          </Link>
        </div>

        {/* User info at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-black/10 glass-strong">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-terra-bg font-bold text-sm"
              style={{ background: 'linear-gradient(135deg, rgba(199,107,85,0.85), rgba(210,160,115,0.85))' }}
            >
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-terra-ink truncate">{displayName}</p>
              <p className="text-xs text-terra-taupe truncate">{user?.email}</p>
            </div>
            <button
              onClick={signOut}
              className="p-2 text-terra-ink-soft hover:text-red-600 transition-colors"
              title="Sign out"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 pt-14 lg:pt-0 min-h-screen">
        <div className="p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout


