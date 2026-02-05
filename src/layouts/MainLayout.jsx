// src/layouts/MainLayout.jsx
// EXPAT VILLAGE - Premium Layout with Glassmorphism Header
// Handles redirect to onboarding for new users

import { useState, useEffect } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import AuthModal from '../components/AuthModal'
import BottomNav from '../components/BottomNav'
import Icon from '../components/Icon'

function MainLayout() {
  const navigate = useNavigate()
  const { user, profile, isAuthenticated, signOut, openAuthModal, shouldRedirectToOnboarding, clearOnboardingRedirect } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  const isCoreScreen = (
    location.pathname === '/'
    || location.pathname.startsWith('/get-things-done')
    || location.pathname.startsWith('/directory')
    || location.pathname.startsWith('/town-hall')
  )

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShowUserMenu(false)
  }, [location.pathname])

  const handleSignOut = async () => {
    setShowUserMenu(false)
    await signOut()
  }

  const displayName = profile?.display_name 
    || user?.user_metadata?.display_name 
    || user?.email?.split('@')[0] 
    || 'User'

  const avatarLetter = displayName.charAt(0).toUpperCase()

  const handleProtectedClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault()
      openAuthModal('sign_up')
    }
  }

  return (
    <div className={`min-h-screen text-terra-ink flex justify-center ${isCoreScreen ? 'theme-midnight prism-backdrop' : ''}`}>
      {/* Mobile container - constrain width on desktop to simulate mobile */}
      <div className="w-full max-w-md relative">
      <AuthModal />

      {/* ===== HEADER ===== */}
      <header 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled 
            ? 'glass-panel border-b border-black/10' 
            : 'bg-transparent'
        }`}
        style={scrolled ? { '--glass-glow': 'rgba(199,107,85,0.2)' } : undefined}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-xl blur-lg opacity-50 transition-opacity"
                  style={{ background: 'linear-gradient(135deg, rgba(199,107,85,0.45), rgba(246,195,143,0.35))' }}
                />
                <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-xl overflow-hidden glass-3d texture-layer texture-paper texture-amber">
                  <img src="/icon.svg" alt="Expat Village" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg md:text-xl font-semibold text-terra-ink tracking-wide">
                  Expat Village
                </h1>
                <p className="text-xs text-terra-taupe -mt-0.5">Warsaw & Beyond</p>
              </div>
            </Link>

            {/* Navigation - Hidden (using bottom nav instead) */}

            {/* Auth Buttons / User Menu */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 glass-panel rounded-full pl-1 pr-3 py-1 transition-all hover:shadow-glass"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-terra-bg font-semibold text-sm"
                      style={{ background: 'linear-gradient(135deg, rgba(199,107,85,0.9), rgba(246,195,143,0.9))' }}
                    >
                      {avatarLetter}
                    </div>
                    <span className="text-sm font-medium text-terra-ink hidden sm:block">{displayName}</span>
                    <Icon name="chevronDown" className={`w-4 h-4 text-terra-taupe transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-40"
                        onClick={() => setShowUserMenu(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 glass-strong rounded-2xl shadow-xl shadow-black/10 py-2 z-50 animate-fadeIn">
                        <div className="px-4 py-2 border-b border-black/10">
                          <p className="text-sm font-medium text-terra-ink">{displayName}</p>
                          <p className="text-xs text-terra-taupe truncate">{user?.email}</p>
                        </div>
                        <Link
                          to="/my-checklist"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-terra-ink-soft hover:text-terra-ink hover:bg-black/5 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Icon name="checklist" className="w-4 h-4 text-terra-taupe" />
                          My Checklist
                        </Link>
                        <Link
                          to="/rewards"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-terra-ink-soft hover:text-terra-ink hover:bg-black/5 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Icon name="trophy" className="w-4 h-4 text-terra-taupe" />
                          Rewards & Badges
                        </Link>
                        <Link
                          to="/alerts"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-terra-ink-soft hover:text-terra-ink hover:bg-black/5 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Icon name="bell" className="w-4 h-4 text-terra-taupe" />
                          My Alerts
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-terra-ink-soft hover:text-terra-ink hover:bg-black/5 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Icon name="settings" className="w-4 h-4 text-terra-taupe" />
                          Settings
                        </Link>
                        {profile?.is_admin && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-terra-ink-soft hover:text-terra-ink hover:bg-black/5 transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Icon name="shield" className="w-4 h-4 text-terra-taupe" />
                            Admin Dashboard
                          </Link>
                        )}
                        <div className="border-t border-black/10 mt-2 pt-2">
                          <button
                            onClick={handleSignOut}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-700 hover:text-red-800 hover:bg-red-100 transition-colors"
                          >
                            <Icon name="logout" className="w-4 h-4 text-red-700" /> Sign Out
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
                    className="text-sm font-medium text-terra-ink-soft hover:text-terra-ink transition-colors px-3 py-2"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => openAuthModal('sign_up')}
                    className="relative"
                  >
                    <span className="relative px-5 py-2.5 rounded-full text-sm font-semibold text-terra-bg hover-tilt"
                      style={{ background: 'linear-gradient(135deg, #C76B55, #D07C63)' }}
                    >
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
      <footer className="hidden glass-panel border-t border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl overflow-hidden">
                  <img src="/icon.svg" alt="Expat Village" className="w-full h-full object-cover" />
                </div>
                <span className="font-bold text-terra-ink">Expat Village</span>
              </Link>
              <p className="text-terra-taupe text-sm">
                Your complete guide to thriving as an expat in Poland.
              </p>
            </div>

            {/* Explore */}
            <div>
              <h4 className="font-semibold text-terra-ink mb-4">Explore</h4>
              <ul className="space-y-2">
                <li>
                  <Link 
                    to={isAuthenticated ? '/get-things-done' : '#'}
                    onClick={(e) => handleProtectedClick(e)}
                    className="text-terra-ink-soft hover:text-terra-ink text-sm transition-colors"
                  >
                    Get Things Done
                  </Link>
                </li>
                <li>
                  <Link 
                    to={isAuthenticated ? '/housing' : '#'}
                    onClick={(e) => handleProtectedClick(e)}
                    className="text-terra-ink-soft hover:text-terra-ink text-sm transition-colors"
                  >
                    Housing
                  </Link>
                </li>
                <li>
                  <Link 
                    to={isAuthenticated ? '/jobs-careers' : '#'}
                    onClick={(e) => handleProtectedClick(e)}
                    className="text-terra-ink-soft hover:text-terra-ink text-sm transition-colors"
                  >
                    Jobs & Careers
                  </Link>
                </li>
                <li>
                  <Link 
                    to={isAuthenticated ? '/directory' : '#'}
                    onClick={(e) => handleProtectedClick(e)}
                    className="text-terra-ink-soft hover:text-terra-ink text-sm transition-colors"
                  >
                    Directory
                  </Link>
                </li>
              </ul>
            </div>

            {/* AI Tools */}
            <div>
              <h4 className="font-semibold text-terra-ink mb-4">AI Tools</h4>
              <ul className="space-y-2">
                <li>
                  <Link 
                    to={isAuthenticated ? '/contract-analyzer' : '#'}
                    onClick={(e) => handleProtectedClick(e)}
                    className="text-terra-ink-soft hover:text-terra-ink text-sm transition-colors"
                  >
                    Contract Analyzer
                  </Link>
                </li>
                <li>
                  <Link 
                    to={isAuthenticated ? '/document-analyzer' : '#'}
                    onClick={(e) => handleProtectedClick(e)}
                    className="text-terra-ink-soft hover:text-terra-ink text-sm transition-colors"
                  >
                    Document Translator
                  </Link>
                </li>
                <li>
                  <Link 
                    to={isAuthenticated ? '/my-checklist' : '#'}
                    onClick={(e) => handleProtectedClick(e)}
                    className="text-terra-ink-soft hover:text-terra-ink text-sm transition-colors"
                  >
                    Arrival Checklist
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company - PUBLIC LINKS */}
            <div>
              <h4 className="font-semibold text-terra-ink mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-terra-ink-soft hover:text-terra-ink text-sm transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-terra-ink-soft hover:text-terra-ink text-sm transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <a href="mailto:hello@expatvillage.pl" className="text-terra-ink-soft hover:text-terra-ink text-sm transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-black/10 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-terra-taupe text-sm">
              2025 Expat Village. Made in Warsaw.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-terra-taupe text-sm">Pomagamy obcokrajowcom</span>
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





