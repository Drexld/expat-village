// src/layouts/MainLayout.jsx
// EXPAT VILLAGE - Premium Layout with New Header

import { useState, useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import AuthModal from '../components/AuthModal'

function MainLayout() {
  const { user, profile, isAuthenticated, signOut, openAuthModal } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu when route changes
  useEffect(() => {
    setShowUserMenu(false)
  }, [location.pathname])

  const handleSignOut = async () => {
    localStorage.removeItem('sb-nkybxminaowwtrmoffzw-auth-token')
    await signOut()
    setShowUserMenu(false)
    window.location.reload()
  }

  const displayName = profile?.display_name 
    || user?.user_metadata?.display_name 
    || user?.email?.split('@')[0] 
    || 'User'

  const avatarLetter = displayName.charAt(0).toUpperCase()

  const navLinks = [
    { path: '/about', label: 'About' },
    { path: '/directory', label: 'Directory' },
    { path: '/town-hall', label: 'Community' },
  ]

  return (
    <div className="min-h-screen bg-[#0F0D1A] text-white">
      <AuthModal />

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled 
          ? 'bg-[#0F0D1A]/90 backdrop-blur-xl border-b border-purple-500/20 shadow-lg shadow-purple-500/5' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-amber-500 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-shadow">
                🏘️
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-lg text-white group-hover:text-purple-300 transition-colors">Expat Village</span>
                <span className="block text-xs text-gray-500 -mt-0.5">Warsaw & Beyond</span>
              </div>
            </Link>

            {/* Center Nav - Desktop */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === link.path
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 bg-[#1A1625] hover:bg-[#221E2D] border border-purple-500/20 hover:border-purple-500/40 rounded-full pl-2 pr-4 py-1.5 transition-all"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-amber-500 rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                      {avatarLetter}
                    </div>
                    <span className="text-sm text-gray-300 hidden sm:block">
                      {displayName}
                    </span>
                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-30" 
                        onClick={() => setShowUserMenu(false)}
                      />
                      <div className="absolute right-0 mt-2 w-64 bg-[#1A1625] border border-purple-500/30 rounded-2xl shadow-2xl shadow-purple-500/10 overflow-hidden z-40 animate-scaleIn origin-top-right">
                        {/* User Info */}
                        <div className="px-4 py-4 border-b border-purple-500/20 bg-gradient-to-r from-purple-900/20 to-transparent">
                          <p className="text-white font-semibold">{displayName}</p>
                          <p className="text-gray-400 text-sm truncate">{user?.email}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-0.5 rounded-full border border-purple-500/30">
                              {profile?.level || 'Newcomer'}
                            </span>
                            <span className="text-amber-400 text-xs font-medium">
                              {profile?.points || 0} points
                            </span>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          <Link
                            to="/rewards"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-purple-500/10 hover:text-white transition-colors"
                          >
                            <span className="text-lg">🏆</span>
                            <span>My Rewards</span>
                          </Link>
                          <Link
                            to="/my-checklist"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-purple-500/10 hover:text-white transition-colors"
                          >
                            <span className="text-lg">✅</span>
                            <span>My Checklist</span>
                          </Link>
                          <Link
                            to="/onboarding"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-purple-500/10 hover:text-white transition-colors"
                          >
                            <span className="text-lg">🎭</span>
                            <span>Update My Tribe</span>
                          </Link>
                        </div>

                        {/* Sign Out */}
                        <div className="border-t border-purple-500/20 py-2">
                          <button
                            onClick={handleSignOut}
                            className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 transition-colors w-full"
                          >
                            <span className="text-lg">🚪</span>
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openAuthModal('sign_in')}
                    className="text-gray-400 hover:text-white transition-colors text-sm font-medium px-4 py-2"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => openAuthModal('sign_up')}
                    className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105"
                  >
                    <span className="relative z-10">Join Free</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-500" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-500/10 bg-[#0A0811]">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-amber-500 rounded-lg flex items-center justify-center text-sm">
                  🏘️
                </div>
                <span className="font-bold text-white">Expat Village</span>
              </Link>
              <p className="text-gray-500 text-sm leading-relaxed">
                Your village, your people, your Poland. Made with 💜 in Warsaw.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Explore</h4>
              <ul className="space-y-2">
                <li><Link to="/get-things-done" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">Get Things Done</Link></li>
                <li><Link to="/housing" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">Housing</Link></li>
                <li><Link to="/jobs-careers" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">Jobs & Careers</Link></li>
                <li><Link to="/directory" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">Directory</Link></li>
              </ul>
            </div>

            {/* Tools */}
            <div>
              <h4 className="text-white font-semibold mb-4">AI Tools</h4>
              <ul className="space-y-2">
                <li><Link to="/contract-analyzer" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">Contract Analyzer</Link></li>
                <li><Link to="/document-analyzer" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">Document Translator</Link></li>
                <li><Link to="/my-checklist" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">My Checklist</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">About Us</Link></li>
                <li><Link to="/privacy" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">Privacy Policy</Link></li>
                <li><a href="mailto:hello@expatvillage.com" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-purple-500/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2026 Expat Village • Built in Warsaw, Poland 🇵🇱
            </p>
            <div className="flex items-center gap-4">
              <span className="text-gray-600 text-xs">
                By expats, for expats
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom Animation Styles */}
      <style jsx>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease forwards;
        }
      `}</style>
    </div>
  )
}

export default MainLayout
