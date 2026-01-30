// src/components/AuthModal.jsx
// EXPAT VILLAGE - Premium Auth Modal
// Warsaw Skyline + Walking Villagers Animation

import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

function AuthModal() {
  const { authModal, closeAuthModal, signIn, signUp, signInWithGoogle } = useAuth()
  const [activeTab, setActiveTab] = useState('sign_in')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')

  // Reset when modal opens
  useEffect(() => {
    if (authModal.isOpen) {
      setError('')
      setSuccess('')
      setActiveTab(authModal.view || 'sign_in')
    }
  }, [authModal.isOpen, authModal.view])

  if (!authModal.isOpen) return null

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setDisplayName('')
    setError('')
    setSuccess('')
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    resetForm()
  }

  const handleSignIn = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await signIn(email, password)
    if (error) {
      setError(error.message)
    } else {
      closeAuthModal()
      resetForm()
    }
    setLoading(false)
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }
    const { error } = await signUp(email, password, displayName)
    if (error) {
      setError(error.message)
    } else {
      setSuccess('Check your email for a confirmation link!')
    }
    setLoading(false)
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError('')
    const { error } = await signInWithGoogle()
    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <>
      {/* Backdrop with blur */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
        onClick={() => { closeAuthModal(); resetForm(); }}
        style={{ animation: 'fadeIn 0.3s ease' }}
      />
      
      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="relative w-full max-w-md pointer-events-auto"
          style={{ animation: 'scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        >
          {/* Animated Glow Border */}
          <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-amber-500 to-violet-600 rounded-3xl blur-xl opacity-50 animate-pulse" />
          
          {/* Modal Content */}
          <div className="relative bg-gradient-to-b from-slate-800 to-slate-900 border border-violet-500/40 rounded-3xl overflow-hidden shadow-2xl">
            
            {/* ===== ANIMATED SCENE BACKGROUND ===== */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              
              {/* Night Sky Gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-violet-950/50 to-slate-900" />
              
              {/* Twinkling Stars */}
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white animate-pulse"
                  style={{
                    width: Math.random() * 3 + 1 + 'px',
                    height: Math.random() * 3 + 1 + 'px',
                    top: Math.random() * 40 + '%',
                    left: Math.random() * 100 + '%',
                    animationDelay: Math.random() * 2 + 's',
                    animationDuration: Math.random() * 2 + 1 + 's',
                    opacity: Math.random() * 0.5 + 0.3
                  }}
                />
              ))}
              
              {/* Warsaw Skyline */}
              <svg 
                viewBox="0 0 400 120" 
                className="absolute bottom-16 left-0 right-0 w-full h-auto opacity-20"
                preserveAspectRatio="xMidYMax meet"
              >
                <defs>
                  <linearGradient id="skylineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.3" />
                  </linearGradient>
                </defs>
                
                {/* Palace of Culture (Center) */}
                <rect x="180" y="10" width="40" height="110" fill="url(#skylineGradient)" />
                <rect x="175" y="30" width="50" height="90" fill="url(#skylineGradient)" />
                <polygon points="200,0 195,10 205,10" fill="url(#skylineGradient)" />
                
                {/* Left Buildings */}
                <rect x="20" y="60" width="30" height="60" fill="url(#skylineGradient)" />
                <rect x="55" y="45" width="35" height="75" fill="url(#skylineGradient)" />
                <rect x="95" y="55" width="25" height="65" fill="url(#skylineGradient)" />
                <rect x="125" y="40" width="40" height="80" fill="url(#skylineGradient)" />
                
                {/* Right Buildings */}
                <rect x="230" y="50" width="35" height="70" fill="url(#skylineGradient)" />
                <rect x="270" y="60" width="30" height="60" fill="url(#skylineGradient)" />
                <rect x="305" y="45" width="40" height="75" fill="url(#skylineGradient)" />
                <rect x="350" y="55" width="35" height="65" fill="url(#skylineGradient)" />
                
                {/* Ground Line */}
                <rect x="0" y="118" width="400" height="2" fill="#8B5CF6" opacity="0.5" />
              </svg>
              
              {/* Walking Villagers */}
              <div className="absolute bottom-12 left-0 right-0 h-8 overflow-hidden">
                {/* Person 1 */}
                <div 
                  className="absolute text-xl"
                  style={{
                    animation: 'walkRight 14s linear infinite',
                    bottom: '0px'
                  }}
                >
                  🚶
                </div>
                
                {/* Person 2 */}
                <div 
                  className="absolute text-lg"
                  style={{
                    animation: 'walkRight 20s linear infinite',
                    animationDelay: '4s',
                    bottom: '0px'
                  }}
                >
                  🚶‍♀️
                </div>
                
                {/* Cyclist */}
                <div 
                  className="absolute text-xl"
                  style={{
                    animation: 'walkRight 10s linear infinite',
                    animationDelay: '2s',
                    bottom: '0px'
                  }}
                >
                  🚴
                </div>
                
                {/* Person with luggage */}
                <div 
                  className="absolute text-lg"
                  style={{
                    animation: 'walkRight 18s linear infinite',
                    animationDelay: '7s',
                    bottom: '0px'
                  }}
                >
                  🧳
                </div>
                
                {/* Dog walker */}
                <div 
                  className="absolute text-base"
                  style={{
                    animation: 'walkRight 22s linear infinite',
                    animationDelay: '10s',
                    bottom: '0px'
                  }}
                >
                  🐕
                </div>
              </div>
            </div>
            
            {/* ===== HEADER ===== */}
            <div className="relative z-10 flex items-center justify-between p-6 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {activeTab === 'sign_in' ? 'Welcome Back!' : 'Join the Village'}
                </h2>
                <p className="text-violet-300/70 text-sm mt-1">
                  {activeTab === 'sign_in' 
                    ? 'Your village missed you 💜' 
                    : 'Your Poland journey starts here ✨'}
                </p>
              </div>
              <button 
                onClick={() => { closeAuthModal(); resetForm(); }}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300 hover:rotate-90"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* ===== TABS ===== */}
            <div className="relative z-10 flex mx-6 mb-6 bg-slate-900/80 rounded-xl p-1.5">
              <button
                onClick={() => handleTabChange('sign_in')}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all duration-300 ${
                  activeTab === 'sign_in'
                    ? 'bg-gradient-to-r from-violet-600 to-violet-700 text-white shadow-lg shadow-violet-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => handleTabChange('sign_up')}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all duration-300 ${
                  activeTab === 'sign_up'
                    ? 'bg-gradient-to-r from-violet-600 to-violet-700 text-white shadow-lg shadow-violet-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* ===== FORM CONTENT ===== */}
            <div className="relative z-10 px-6 pb-8">
              
              {/* Error Message */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/40 text-red-300 px-4 py-3 rounded-xl mb-4 text-sm flex items-center gap-2 animate-shake">
                  <span>⚠️</span> {error}
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded-xl mb-4 text-sm flex items-center gap-2">
                  <span>✅</span> {success}
                </div>
              )}

              {/* Google Sign In */}
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-800 font-bold py-4 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 mb-5"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <div className="flex items-center gap-4 mb-5">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
                <span className="text-slate-500 text-sm">or</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
              </div>

              {/* Sign In Form */}
              {activeTab === 'sign_in' && (
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <label className="block text-slate-400 text-sm mb-2 font-medium">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-slate-900/80 border border-violet-500/30 focus:border-violet-500 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 outline-none transition-all focus:ring-2 focus:ring-violet-500/30"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2 font-medium">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full bg-slate-900/80 border border-violet-500/30 focus:border-violet-500 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 outline-none transition-all focus:ring-2 focus:ring-violet-500/30"
                      placeholder="••••••••"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full relative overflow-hidden bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-500 hover:to-violet-600 text-white font-bold py-4 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-violet-500/30 disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Signing in...
                      </span>
                    ) : 'Sign In'}
                  </button>
                </form>
              )}

              {/* Sign Up Form */}
              {activeTab === 'sign_up' && !success && (
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <label className="block text-slate-400 text-sm mb-2 font-medium">What should we call you?</label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      required
                      className="w-full bg-slate-900/80 border border-violet-500/30 focus:border-violet-500 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 outline-none transition-all focus:ring-2 focus:ring-violet-500/30"
                      placeholder="Your name or nickname"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2 font-medium">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-slate-900/80 border border-violet-500/30 focus:border-violet-500 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 outline-none transition-all focus:ring-2 focus:ring-violet-500/30"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2 font-medium">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full bg-slate-900/80 border border-violet-500/30 focus:border-violet-500 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 outline-none transition-all focus:ring-2 focus:ring-violet-500/30"
                      placeholder="At least 6 characters"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full relative overflow-hidden bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-bold py-4 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-500/30 disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Creating account...
                      </span>
                    ) : 'Join the Village 🏘️'}
                  </button>
                </form>
              )}

              {/* Terms */}
              {activeTab === 'sign_up' && !success && (
                <p className="text-slate-500 text-xs text-center mt-4">
                  By joining, you agree to our{' '}
                  <a href="/privacy" className="text-violet-400 hover:text-violet-300 underline">Privacy Policy</a>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Animation Keyframes */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { 
            opacity: 0; 
            transform: scale(0.9) translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: scale(1) translateY(0); 
          }
        }
        
        @keyframes walkRight {
          from { transform: translateX(-30px); }
          to { transform: translateX(430px); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-shake {
          animation: shake 0.3s ease;
        }
      `}</style>
    </>
  )
}

export default AuthModal
