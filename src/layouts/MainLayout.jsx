// src/layouts/MainLayout.jsx
import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import AuthModal from '../components/AuthModal'

function MainLayout() {
  const { user, profile, isAuthenticated, signOut, openAuthModal } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    setShowUserMenu(false)
  }

  // Get display name - try profile first, then user metadata, then email
  const displayName = profile?.display_name 
    || user?.user_metadata?.display_name 
    || user?.email?.split('@')[0] 
    || 'User'

  // Get first letter for avatar
  const avatarLetter = displayName.charAt(0).toUpperCase()

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <AuthModal />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl">🏘️</span>
              <span className="font-bold text-lg">Expat Village</span>
            </Link>

            <nav className="flex items-center gap-3">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 rounded-full px-3 py-1.5 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-sm font-bold">
                      {avatarLetter}
                    </div>
                    <span className="text-sm text-slate-300 hidden sm:block">
                      {displayName}
                    </span>
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-lg overflow-hidden">
                      <div className="px-4 py-3 border-b border-slate-700">
                        <p className="text-white font-medium">{displayName}</p>
                        <p className="text-slate-400 text-sm truncate">{user?.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="bg-emerald-600/30 text-emerald-400 text-xs px-2 py-0.5 rounded-full">
                            {profile?.level || 'Newcomer'}
                          </span>
                          <span className="text-slate-400 text-xs">
                            {profile?.points || 0} points
                          </span>
                        </div>
                      </div>

                      <div className="py-2">
                        <Link
                          to="/rewards"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2 text-slate-300 hover:bg-slate-700 transition-colors"
                        >
                          <span>🏆</span>
                          <span>My Rewards</span>
                        </Link>
                        <Link
                          to="/my-checklist"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2 text-slate-300 hover:bg-slate-700 transition-colors"
                        >
                          <span>✅</span>
                          <span>My Checklist</span>
                        </Link>
                        <Link
                          to="/onboarding"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2 text-slate-300 hover:bg-slate-700 transition-colors"
                        >
                          <span>🎭</span>
                          <span>Update My Tribe</span>
                        </Link>
                      </div>

                      <div className="border-t border-slate-700 py-2">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-slate-700 transition-colors w-full"
                        >
                          <span>🚪</span>
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button
                    onClick={() => openAuthModal('sign_in')}
                    className="text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => openAuthModal('sign_up')}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Join Free
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-slate-800 mt-16">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              © 2026 Expat Village • Made with ❤️ in Warsaw
            </p>
            <div className="flex gap-6 text-sm text-slate-500">
              <a href="#" className="hover:text-slate-300 transition-colors">About</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Contact</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Privacy</a>
            </div>
          </div>
        </div>
      </footer>

      {showUserMenu && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </div>
  )
}

export default MainLayout
