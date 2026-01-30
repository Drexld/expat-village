// src/layouts/MainLayout.jsx
// EXPAT VILLAGE - Premium Layout with Glassmorphism Header

import { useState, useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import AuthModal from '../components/AuthModal'

function MainLayout() {
  const { user, profile, isAuthenticated, signOut, openAuthModal } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

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

  const navLinks = [
    { path: '/about', label: 'About' },
    { path: '/directory', label: 'Directory' },
    { path: '/town-hall', label: 'Community' },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AuthModal />

      {/* ===== HEADER ===== */}
      <header 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled 
            ? 'bg-slate-950/80 backdrop-blur-xl border-b border-violet-500/20 shadow-lg shadow-violet-500/5' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 bg-gradient-to-br from-violet-600 to-amber-500 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/50 group-hover:scale-105 transition-all duration-300">
                🏘️
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-lg text-white group-hover:text-violet-300 transition-colors">Expat Village</span>
                <span className="block text-xs text-slate-500 -mt-0.5">Warsaw & Beyond</span>
              </div>
            </Link>

            {/* Center Nav */}
            <nav className="hidden md:flex items-center gap-1 bg-slate-900/50 backdrop-blur-sm rounded-full px-2 py-1.5 border border-violet-500/10">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    location.pathname === link.path
                      ? 'bg-violet-500/20 text-violet-300'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
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
                    className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700/80 border border-violet-500/20 hover:border-violet-500/40 rounded-full pl-1.5 pr-4 py-1.5 transition-all duration-300"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-amber-500 rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                      {avatarLetter}
                    </div>
                    <span className="text-sm text-slate-300 hidden sm:block">{displayName}</span>
                    <svg 
                      className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown */}
                  {showUserMenu && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setShowUserMenu(false)} />
                      <div 
                        className="absolute right-0 mt-3 w-72 bg-slate-900/95 backdrop-blur-xl border border-violet-500/30 rounded-2xl shadow-2xl shadow-violet-500/10 overflow-hidden z-40"
                        style={{ animation: 'scaleIn 0.2s ease' }}
                      >
                        {/* User Info Header */}
                        <div className="px-5 py-4 bg-gradient-to-r from-violet-900/40 to-transparent border-b border-violet-500/20">
                          <p className="text-white font-bold text-lg">{displayName}</p>
                          <p className="text-slate-400 text-sm truncate">{user?.email}</p>
                          <div className="flex items-center gap-2 mt-3">
                            <span className="bg-violet-500/20 text-violet-300 text-xs font-bold px-3 py-1 rounded-full border border-violet-500/30">
                              {profile?.level || 'Newcomer'}
                            </span>
                            <span className="text-amber-400 text-xs font-bold">
                              ⭐ {profile?.points || 0} points
                            </span>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          <Link
                            to="/rewards"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-5 py-3 text-slate-300 hover:bg-violet-500/10 hover:text-white transition-colors"
                          >
                            <span className="text-xl">🏆</span>
                            <span className="font-medium">My Rewards</span>
                          </Link>
                          <Link
                            to="/my-checklist"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-5 py-3 text-slate-300 hover:bg-violet-500/10 hover:text-white transition-colors"
                          >
                            <span className="text-xl">✅</span>
                            <span className="font-medium">My Checklist</span>
                          </Link>
                          <Link
                            to="/onboarding"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-5 py-3 text-slate-300 hover:bg-violet-500/10 hover:text-white transition-colors"
                          >
                            <span className="text-xl">🎭</span>
                            <span className="font-medium">Update My Tribe</span>
                          </Link>
                        </div>

                        {/* Sign Out */}
                        <div className="border-t border-violet-500/20 py-2">
                          <button
                            onClick={handleSignOut}
                            className="flex items-center gap-3 px-5 py-3 text-red-400 hover:bg-red-500/10 transition-colors w-full"
                          >
                            <span className="text-xl">🚪</span>
                            <span className="font-medium">Sign Out</span>
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
                    className="text-slate-400 hover:text-white transition-colors text-sm font-medium px-4 py-2.5"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => openAuthModal('sign_up')}
                    className="relative overflow-hidden bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-500 hover:to-violet-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/30 hover:scale-105"
                  >
                    <span className="relative z-10">Join Free</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className="pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-violet-500/10 bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 bg-gradient-to-br from-violet-600 to-amber-500 rounded-lg flex items-center justify-center text-base">
                  🏘️
                </div>
                <span className="font-bold text-white">Expat Village</span>
              </Link>
              <p className="text-slate-500 text-sm leading-relaxed">
                Your village, your people, your Poland. Made with 💜 in Warsaw.
              </p>
            </div>

            {/* Explore */}
            <div>
              <h4 className="text-white font-bold mb-4">Explore</h4>
              <ul className="space-y-3">
                <li><Link to="/get-things-done" className="text-slate-400 hover:text-violet-400 text-sm transition-colors">Get Things Done</Link></li>
                <li><Link to="/housing" className="text-slate-400 hover:text-violet-400 text-sm transition-colors">Housing</Link></li>
                <li><Link to="/jobs-careers" className="text-slate-400 hover:text-violet-400 text-sm transition-colors">Jobs & Careers</Link></li>
                <li><Link to="/directory" className="text-slate-400 hover:text-violet-400 text-sm transition-colors">Directory</Link></li>
              </ul>
            </div>

            {/* AI Tools */}
            <div>
              <h4 className="text-white font-bold mb-4">AI Tools</h4>
              <ul className="space-y-3">
                <li><Link to="/contract-analyzer" className="text-slate-400 hover:text-violet-400 text-sm transition-colors">Contract Analyzer</Link></li>
                <li><Link to="/document-analyzer" className="text-slate-400 hover:text-violet-400 text-sm transition-colors">Document Translator</Link></li>
                <li><Link to="/my-checklist" className="text-slate-400 hover:text-violet-400 text-sm transition-colors">My Checklist</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-3">
                <li><Link to="/about" className="text-slate-400 hover:text-violet-400 text-sm transition-colors">About Us</Link></li>
                <li><Link to="/privacy" className="text-slate-400 hover:text-violet-400 text-sm transition-colors">Privacy Policy</Link></li>
                <li><a href="mailto:hello@expatvillage.com" className="text-slate-400 hover:text-violet-400 text-sm transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-8 border-t border-violet-500/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              © 2026 Expat Village • Built in Warsaw, Poland 🇵🇱
            </p>
            <p className="text-slate-600 text-xs">
              By expats, for expats
            </p>
          </div>
        </div>
      </footer>

      {/* Dropdown Animation */}
      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95) translateY(-10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default MainLayout
