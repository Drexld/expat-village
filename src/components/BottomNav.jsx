// src/components/BottomNav.jsx
// Mobile bottom navigation bar

import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// Navigation items
const NAV_ITEMS = [
  { icon: '🏠', label: 'Home', path: '/' },
  { icon: '📋', label: 'Tasks', path: '/get-things-done' },
  { icon: '🔍', label: 'Search', path: '/search', isSearch: true },
  { icon: '🏛️', label: 'Community', path: '/town-hall' },
  { icon: '☰', label: 'More', path: '/menu', isMenu: true },
]

// Full menu sections for the slide-out menu
const MENU_SECTIONS = [
  {
    title: 'Get Set Up',
    items: [
      { icon: '📋', label: 'Get Things Done', path: '/get-things-done' },
      { icon: '✅', label: 'My Checklist', path: '/my-checklist' },
      { icon: '📄', label: 'Contract Analyzer', path: '/contract-analyzer' },
      { icon: '📑', label: 'Document Analyzer', path: '/document-analyzer' },
    ]
  },
  {
    title: 'Live in Poland',
    items: [
      { icon: '🏠', label: 'Housing', path: '/housing' },
      { icon: '💼', label: 'Jobs & Careers', path: '/jobs-careers' },
      { icon: '🏥', label: 'Insurance & Health', path: '/insurance-health' },
      { icon: '🚌', label: 'Getting Around', path: '/getting-around' },
      { icon: '🎉', label: 'Live Your Life', path: '/live-your-life' },
    ]
  },
  {
    title: 'Community',
    items: [
      { icon: '🏛️', label: 'Town Hall', path: '/town-hall' },
      { icon: '📖', label: 'Directory', path: '/directory' },
      { icon: '🎵', label: 'Village Vibes', path: '/village-vibes' },
      { icon: '🎓', label: 'Student Hub', path: '/student-hub' },
    ]
  },
  {
    title: 'Account',
    items: [
      { icon: '🎁', label: 'Rewards', path: '/rewards' },
      { icon: '🔔', label: 'Alerts', path: '/alerts' },
      { icon: 'ℹ️', label: 'About', path: '/about' },
    ]
  },
]

function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, openAuthModal } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleNavClick = (item) => {
    if (item.isMenu) {
      setMenuOpen(true)
      setSearchOpen(false)
    } else if (item.isSearch) {
      setSearchOpen(true)
      setMenuOpen(false)
    } else {
      if (!isAuthenticated && item.path !== '/') {
        openAuthModal('sign_up')
      } else {
        navigate(item.path)
      }
      setMenuOpen(false)
      setSearchOpen(false)
    }
  }

  const handleMenuItemClick = (path) => {
    if (!isAuthenticated) {
      openAuthModal('sign_up')
    } else {
      navigate(path)
    }
    setMenuOpen(false)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // For now, navigate to directory with search query
      navigate(`/directory?q=${encodeURIComponent(searchQuery)}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <>
      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-lg">
          <div className="flex flex-col h-full">
            {/* Search Header */}
            <div className="flex items-center gap-3 px-4 pt-4 pb-3">
              <button
                onClick={() => setSearchOpen(false)}
                className="p-2 rounded-full hover:bg-slate-800"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
              <form onSubmit={handleSearch} className="flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search services, places, guides..."
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </form>
            </div>

            {/* Quick Links */}
            <div className="px-4 py-4">
              <p className="text-xs font-medium text-slate-500 mb-3">Quick links</p>
              <div className="flex flex-wrap gap-2">
                {['PESEL', 'Residence Permit', 'Bank Account', 'Health Insurance', 'Polish Lessons', 'Coworking'].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setSearchQuery(term)
                      navigate(`/directory?q=${encodeURIComponent(term)}`)
                      setSearchOpen(false)
                    }}
                    className="px-3 py-2 rounded-full text-sm text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Sections */}
            <div className="px-4 py-4">
              <p className="text-xs font-medium text-slate-500 mb-3">Popular sections</p>
              <div className="space-y-2">
                {[
                  { icon: '📋', label: 'Get Things Done', path: '/get-things-done' },
                  { icon: '🏠', label: 'Find Housing', path: '/housing' },
                  { icon: '🏛️', label: 'Town Hall', path: '/town-hall' },
                  { icon: '📖', label: 'Directory', path: '/directory' },
                ].map((item) => (
                  <button
                    key={item.path}
                    onClick={() => {
                      handleMenuItemClick(item.path)
                      setSearchOpen(false)
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors"
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-sm font-medium text-white">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-lg overflow-y-auto">
          {/* Menu Header */}
          <div className="sticky top-0 flex items-center justify-between px-4 py-4 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800">
            <h2 className="text-lg font-bold text-white">Menu</h2>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 rounded-full hover:bg-slate-800"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Menu Sections */}
          <div className="px-4 py-4 space-y-6 pb-24">
            {MENU_SECTIONS.map((section) => (
              <div key={section.title}>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">
                  {section.title}
                </p>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => handleMenuItemClick(item.path)}
                      className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-colors ${
                        isActive(item.path)
                          ? 'bg-purple-500/20 border border-purple-500/30'
                          : 'hover:bg-slate-800'
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className={`text-sm font-medium ${isActive(item.path) ? 'text-purple-300' : 'text-white'}`}>
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 safe-area-pb">
        <div className="flex items-center justify-around px-2 py-2">
          {NAV_ITEMS.map((item) => {
            const active = item.isMenu ? menuOpen : item.isSearch ? searchOpen : isActive(item.path)

            return (
              <button
                key={item.label}
                onClick={() => handleNavClick(item)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                  active ? 'bg-purple-500/20' : ''
                }`}
              >
                <span className={`text-xl transition-transform ${active ? 'scale-110' : ''}`}>
                  {item.icon}
                </span>
                <span className={`text-[10px] font-medium ${
                  active ? 'text-purple-400' : 'text-slate-500'
                }`}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* Safe area spacer for content */}
      <style>{`
        .safe-area-pb {
          padding-bottom: env(safe-area-inset-bottom, 0);
        }
      `}</style>
    </>
  )
}

export default BottomNav
