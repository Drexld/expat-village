// src/components/BottomNav.jsx
// Mobile bottom navigation bar

import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Icon from './Icon'

// Navigation items
const NAV_ITEMS = [
  { icon: 'home', label: 'Home', path: '/' },
  { icon: 'checklist', label: 'Tasks', path: '/get-things-done' },
  { icon: 'search', label: 'Ask', path: '/search', isSearch: true },
  { icon: 'community', label: 'Community', path: '/town-hall' },
  { icon: 'menu', label: 'More', path: '/menu', isMenu: true },
]
// Full menu sections for the slide-out menu
const MENU_SECTIONS = [
  {
    title: 'Get Set Up',
    items: [
      { icon: 'checklist', label: 'Get Things Done', path: '/get-things-done' },
      { icon: 'checklist', label: 'My Checklist', path: '/my-checklist' },
      { icon: 'document', label: 'Contract Analyzer', path: '/contract-analyzer' },
      { icon: 'document', label: 'Document Analyzer', path: '/document-analyzer' },
    ]
  },
  {
    title: 'Live in Poland',
    items: [
      { icon: 'home', label: 'Housing', path: '/housing' },
      { icon: 'briefcase', label: 'Jobs & Careers', path: '/jobs-careers' },
      { icon: 'shield', label: 'Insurance & Health', path: '/insurance-health' },
      { icon: 'train', label: 'Getting Around', path: '/getting-around' },
      { icon: 'spark', label: 'Live Your Life', path: '/live-your-life' },
    ]
  },
  {
    title: 'Community',
    items: [
      { icon: 'community', label: 'Town Hall', path: '/town-hall' },
      { icon: 'pin', label: 'Directory', path: '/directory' },
      { icon: 'music', label: 'Village Vibes', path: '/village-vibes' },
      { icon: 'graduation', label: 'Student Hub', path: '/student-hub' },
    ]
  },
  {
    title: 'Account',
    items: [
      { icon: 'trophy', label: 'Rewards', path: '/rewards' },
      { icon: 'bell', label: 'Alerts', path: '/alerts' },
      { icon: 'info', label: 'About', path: '/about' },
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
        <div className="fixed inset-0 z-50 bg-terra-bg/90 backdrop-blur-lg">
          <div className="flex flex-col h-full">
            {/* Search Header */}
            <div className="flex items-center gap-3 px-4 pt-4 pb-3">
              <button
                onClick={() => setSearchOpen(false)}
                className="p-2 rounded-full hover:bg-black/5"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-terra-ink-soft">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
              <form onSubmit={handleSearch} className="flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ask the village... (e.g., find a bank, PESEL help)"
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl glass-strong text-terra-ink placeholder-terra-taupe focus:outline-none focus:border-black/20"
                />
              </form>
            </div>

            {/* Quick Links */}
            <div className="px-4 py-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-terra-taupe">Quick links</p>
                <span className="text-xs text-terra-ink-soft">Ask the Village</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {['PESEL', 'Residence Permit', 'Bank Account', 'Health Insurance', 'Polish Lessons', 'Coworking'].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setSearchQuery(term)
                      navigate(`/directory?q=${encodeURIComponent(term)}`)
                      setSearchOpen(false)
                    }}
                    className="px-3 py-2 rounded-full text-sm text-terra-ink-soft glass-chip hover:bg-terra-bg transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Sections */}
            <div className="px-4 py-4">
              <p className="text-xs font-medium text-terra-taupe mb-3">Popular sections</p>
              <div className="space-y-2">
                {[
                  { icon: 'checklist', label: 'Get Things Done', path: '/get-things-done' },
                  { icon: 'home', label: 'Find Housing', path: '/housing' },
                  { icon: 'community', label: 'Town Hall', path: '/town-hall' },
                  { icon: 'pin', label: 'Directory', path: '/directory' },
                ].map((item) => (
                  <button
                    key={item.path}
                    onClick={() => {
                      handleMenuItemClick(item.path)
                      setSearchOpen(false)
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl action-card texture-layer texture-paper hover-tilt transition-colors"
                  >
                    <Icon name={item.icon} className="w-5 h-5 text-terra-ink" />
                    <span className="text-sm font-medium text-terra-ink">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-terra-bg/90 backdrop-blur-lg overflow-y-auto">
          {/* Menu Header */}
          <div className="sticky top-0 flex items-center justify-between px-4 py-4 glass-strong backdrop-blur-lg border-b border-black/10">
            <h2 className="text-lg font-bold text-terra-ink">Menu</h2>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 rounded-full hover:bg-black/5"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-terra-ink-soft">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Menu Sections */}
          <div className="px-4 py-4 space-y-6 pb-24">
            {MENU_SECTIONS.map((section) => (
              <div key={section.title}>
                <p className="text-xs font-semibold text-terra-taupe uppercase tracking-wider mb-2 px-2">
                  {section.title}
                </p>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => handleMenuItemClick(item.path)}
                      className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-colors ${
                        isActive(item.path)
                          ? 'glass-panel border border-black/10'
                          : 'hover:bg-black/5'
                      }`}
                    >
                      <Icon name={item.icon} className="w-5 h-5 text-terra-ink" />
                      <span className={`text-sm font-medium ${isActive(item.path) ? 'text-terra-ink' : 'text-terra-ink-soft'}`}>
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
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 glass-strong border-t border-black/10 safe-area-pb"
        style={{ '--glass-glow': 'rgba(199,107,85,0.2)' }}
      >
        <div className="flex items-center justify-around px-2 py-2">
          {NAV_ITEMS.map((item) => {
            const active = item.isMenu ? menuOpen : item.isSearch ? searchOpen : isActive(item.path)

            return (
              <button
                key={item.label}
                onClick={() => handleNavClick(item)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                  active ? 'nav-active' : ''
                }`}
              >
                <Icon
                  name={item.icon}
                  className={`w-6 h-6 transition-transform ${active ? 'scale-110 text-terra-ink' : 'text-terra-taupe'}`}
                />
                <span className={`text-[10px] font-medium ${
                  active ? 'text-terra-ink' : 'text-terra-taupe'
                }`}>
                  {item.label}
                </span>
                <span className="nav-dot" />
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





