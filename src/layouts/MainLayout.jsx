// src/layouts/MainLayout.jsx
// EXPAT VILLAGE - Premium Layout with Glassmorphism Header
// Handles redirect to onboarding for new users

import { useState, useEffect } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import AuthModal from '../components/AuthModal'
import BottomNav from '../components/BottomNav'

function MainLayout() {
  const navigate = useNavigate()
  const { user, profile, isAuthenticated, signOut, openAuthModal, shouldRedirectToOnboarding, clearOnboardingRedirect } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  // Handle redirect to onboarding for new users
  useEffect(() => {
    if (shouldRedirectToOnboarding) {
      console.log('Redirecting new user to onboarding...')
      clearOnboardingRedirect()
      navigate('/onboarding')
    }
  }, [shouldRedirectToOnboarding, clearOnboardingRedirect, navigate])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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

  const handleProtectedClick = (e, path) => {
    if (!isAuthenticated) {
      e.preventDefault()
      openAuthModal('sign_up')
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex justify-center">
      {/* Mobile container - constrain width on desktop to simulate mobile */}
      <div className="w-full max-w-md relative">
      <AuthModal />

      {/* ===== HEADER ===== */}
      <header 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled 
            ? 'bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50 shadow-lg shadow-purple-500/5' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-amber-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-xl shadow-lg overflow-hidden">
                  <img src="/icon.svg" alt="Expat Village" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg md:text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                  Expat Village
                </h1>
                <p className="text-xs text-slate-500 -mt-0.5">Warsaw & Beyond</p>
              </div>
            </Link>

            {/* Navigation - Hidden (using bottom nav instead) */}

            {/* Auth Buttons / User Menu */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-full pl-1 pr-3 py-1 transition-all"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {avatarLetter}
                    </div>
                    <span className="text-sm font-medium text-white hidden sm:block">{displayName}</span>
                    <svg className={`w-4 h-4 text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-40"
                        onClick={() => setShowUserMenu(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-xl shadow-black/20 py-2 z-50 animate-fadeIn">
                        <div className="px-4 py-2 border-b border-slate-700">
                          <p className="text-sm font-medium text-white">{displayName}</p>
                          <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        </div>
                        <Link
                          to="/my-checklist"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <span>📋</span> My Checklist
                        </Link>
                        <Link
                          to="/rewards"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <span>🏆</span> Rewards & Badges
                        </Link>
                        <Link
                          to="/alerts"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <span>🔔</span> My Alerts
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <span>⚙️</span> Settings
                        </Link>
                        {profile?.is_admin && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <span>🛠️</span> Admin Dashboard
                          </Link>
                        )}
                        <div className="border-t border-slate-700 mt-2 pt-2">
                          <button
                            onClick={handleSignOut}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                          >
                            <span>🚪</span> Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <button
                    onClick={() => openAuthModal('sign_in')}
                    className="text-sm font-medium text-slate-400 hover:text-white transition-colors px-3 py-2"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => openAuthModal('sign_up')}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-amber-500 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
                    <span className="relative flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all">
                      Join Free
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - extra padding at bottom for mobile nav */}
      <main className="pt-20 md:pt-24 pb-24 md:pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <Outlet />
      </main>

      {/* Bottom Navigation - Always visible (mobile-first layout) */}
      <BottomNav />

      {/* ===== FOOTER ===== (Hidden - we use bottom nav for navigation) */}
      <footer className="hidden bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl overflow-hidden">
                  <img src="/icon.svg" alt="Expat Village" className="w-full h-full object-cover" />
                </div>
                <span className="font-bold text-white">Expat Village</span>
              </Link>
              <p className="text-slate-500 text-sm">
                Your complete guide to thriving as an expat in Poland.
              </p>
            </div>

            {/* Explore */}
            <div>
              <h4 className="font-semibold text-white mb-4">Explore</h4>
              <ul className="space-y-2">
                <li>
                  <Link 
                    to={isAuthenticated ? '/get-things-done' : '#'}
                    onClick={(e) => handleProtectedClick(e, '/get-things-done')}
                    className="text-slate-500 hover:text-purple-400 text-sm transition-colors"
                  >
                    Get Things Done
                  </Link>
                </li>
                <li>
                  <Link 
                    to={isAuthenticated ? '/housing' : '#'}
                    onClick={(e) => handleProtectedClick(e, '/housing')}
                    className="text-slate-500 hover:text-purple-400 text-sm transition-colors"
                  >
                    Housing
                  </Link>
                </li>
                <li>
                  <Link 
                    to={isAuthenticated ? '/jobs-careers' : '#'}
                    onClick={(e) => handleProtectedClick(e, '/jobs-careers')}
                    className="text-slate-500 hover:text-purple-400 text-sm transition-colors"
                  >
                    Jobs & Careers
                  </Link>
                </li>
                <li>
                  <Link 
                    to={isAuthenticated ? '/directory' : '#'}
                    onClick={(e) => handleProtectedClick(e, '/directory')}
                    className="text-slate-500 hover:text-purple-400 text-sm transition-colors"
                  >
                    Directory
                  </Link>
                </li>
              </ul>
            </div>

            {/* AI Tools */}
            <div>
              <h4 className="font-semibold text-white mb-4">AI Tools</h4>
              <ul className="space-y-2">
                <li>
                  <Link 
                    to={isAuthenticated ? '/contract-analyzer' : '#'}
                    onClick={(e) => handleProtectedClick(e, '/contract-analyzer')}
                    className="text-slate-500 hover:text-purple-400 text-sm transition-colors"
                  >
                    Contract Analyzer
                  </Link>
                </li>
                <li>
                  <Link 
                    to={isAuthenticated ? '/document-analyzer' : '#'}
                    onClick={(e) => handleProtectedClick(e, '/document-analyzer')}
                    className="text-slate-500 hover:text-purple-400 text-sm transition-colors"
                  >
                    Document Translator
                  </Link>
                </li>
                <li>
                  <Link 
                    to={isAuthenticated ? '/my-checklist' : '#'}
                    onClick={(e) => handleProtectedClick(e, '/my-checklist')}
                    className="text-slate-500 hover:text-purple-400 text-sm transition-colors"
                  >
                    Arrival Checklist
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company - PUBLIC LINKS */}
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-slate-500 hover:text-purple-400 text-sm transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-slate-500 hover:text-purple-400 text-sm transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <a href="mailto:hello@expatvillage.pl" className="text-slate-500 hover:text-purple-400 text-sm transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-slate-600 text-sm">
              © 2025 Expat Village. Made with 💜 in Warsaw.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-slate-600 text-sm">🇵🇱 Pomagamy obcokrajowcom</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Animation styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
      </div>{/* End mobile container */}
    </div>
  )
}

export default MainLayout
