// src/components/AuthModal.jsx
// EXPAT VILLAGE - Premium Auth Modal with Warsaw Skyline & Animated Villagers

import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

function AuthModal() {
  const { authModal, closeAuthModal, signIn, signUp, signInWithGoogle } = useAuth()
  const [activeTab, setActiveTab] = useState(authModal.view || 'sign_in')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Form fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')

  // Reset error when modal opens
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

  // Animated Villagers Component
  const AnimatedVillagers = () => (
    <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden pointer-events-none">
      {/* Villager 1 - Walking right */}
      <div 
        className="absolute bottom-2 text-2xl"
        style={{
          animation: 'walkRight 12s linear infinite',
          animationDelay: '0s'
        }}
      >
        🚶
      </div>
      {/* Villager 2 - Walking right slower */}
      <div 
        className="absolute bottom-2 text-xl"
        style={{
          animation: 'walkRight 18s linear infinite',
          animationDelay: '3s'
        }}
      >
        🚶‍♀️
      </div>
      {/* Villager 3 - Walking right with bag */}
      <div 
        className="absolute bottom-2 text-2xl"
        style={{
          animation: 'walkRight 14s linear infinite',
          animationDelay: '6s'
        }}
      >
        🧳
      </div>
      {/* Cyclist */}
      <div 
        className="absolute bottom-2 text-xl"
        style={{
          animation: 'walkRight 8s linear infinite',
          animationDelay: '2s'
        }}
      >
        🚴
      </div>
      {/* Person with dog */}
      <div 
        className="absolute bottom-2 text-lg"
        style={{
          animation: 'walkRight 16s linear infinite',
          animationDelay: '8s'
        }}
      >
        🐕‍🦺
      </div>
    </div>
  )

  // Warsaw Skyline SVG Component
  const WarsawSkyline = () => (
    <svg 
      viewBox="0 0 800 200" 
      className="w-full h-auto absolute bottom-12 left-0 right-0 opacity-30"
      style={{ filter: 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.3))' }}
    >
      {/* Palace of Culture and Science (tallest) */}
      <g fill="currentColor" className="text-purple-400">
        {/* Main tower */}
        <rect x="380" y="20" width="40" height="180" />
        <rect x="370" y="60" width="60" height="140" />
        <rect x="360" y="100" width="80" height="100" />
        <rect x="350" y="140" width="100" height="60" />
        {/* Spire */}
        <polygon points="400,0 395,20 405,20" />
        
        {/* Left buildings */}
        <rect x="50" y="120" width="40" height="80" />
        <rect x="100" y="100" width="50" height="100" />
        <rect x="160" y="130" width="35" height="70" />
        <rect x="200" y="90" width="45" height="110" />
        <rect x="255" y="110" width="40" height="90" />
        <rect x="300" y="80" width="35" height="120" />
        
        {/* Right buildings */}
        <rect x="470" y="100" width="50" height="100" />
        <rect x="530" y="120" width="40" height="80" />
        <rect x="580" y="90" width="55" height="110" />
        <rect x="645" y="110" width="45" height="90" />
        <rect x="700" y="130" width="50" height="70" />
        
        {/* Windows (dots) */}
        {[...Array(20)].map((_, i) => (
          <rect 
            key={i} 
            x={385 + (i % 4) * 8} 
            y={70 + Math.floor(i / 4) * 25} 
            width="4" 
            height="6" 
            className="text-amber-400/50"
            fill="currentColor"
          />
        ))}
      </g>
      
      {/* Ground line */}
      <rect x="0" y="198" width="800" height="2" fill="currentColor" className="text-purple-500/50" />
    </svg>
  )

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 animate-fadeIn"
        onClick={() => { closeAuthModal(); resetForm(); }}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="relative w-full max-w-md pointer-events-auto animate-scaleIn"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-amber-500 to-purple-600 rounded-3xl blur-xl opacity-30 animate-pulse" />
          
          {/* Modal Content */}
          <div className="relative bg-gradient-to-b from-[#1A1625] to-[#0F0D1A] border border-purple-500/30 rounded-3xl overflow-hidden shadow-2xl">
            
            {/* Animated Background Scene */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {/* Stars */}
              <div className="absolute top-4 left-8 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
              <div className="absolute top-8 left-20 w-1.5 h-1.5 bg-purple-300 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
              <div className="absolute top-6 right-16 w-1 h-1 bg-amber-300 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="absolute top-12 right-8 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
              <div className="absolute top-16 left-12 w-1 h-1 bg-purple-200 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
              
              {/* Warsaw Skyline */}
              <WarsawSkyline />
              
              {/* Animated Villagers */}
              <AnimatedVillagers />
            </div>
            
            {/* Header */}
            <div className="relative z-10 flex items-center justify-between p-6 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {activeTab === 'sign_in' ? 'Welcome Back!' : 'Join the Village'}
                </h2>
                <p className="text-purple-300/70 text-sm mt-1">
                  {activeTab === 'sign_in' 
                    ? 'Your village missed you 💜' 
                    : 'Your Poland journey starts here ✨'}
                </p>
              </div>
              <button 
                onClick={() => { closeAuthModal(); resetForm(); }}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all hover:rotate-90 duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="relative z-10 flex mx-6 mb-6 bg-[#0F0D1A] rounded-xl p-1">
              <button
                onClick={() => handleTabChange('sign_in')}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  activeTab === 'sign_in'
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/25'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => handleTabChange('sign_up')}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  activeTab === 'sign_up'
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/25'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Content */}
            <div className="relative z-10 px-6 pb-8">
              
              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-4 text-sm flex items-center gap-2 animate-shake">
                  <span>⚠️</span>
                  {error}
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl mb-4 text-sm flex items-center gap-2">
                  <span>✅</span>
                  {success}
                </div>
              )}

              {/* Google Sign In */}
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-4 rounded-xl transition-all hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:hover:scale-100 mb-4"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
                <span className="text-gray-500 text-sm">or</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
              </div>

              {/* Sign In Form */}
              {activeTab === 'sign_in' && (
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2 font-medium">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-[#0F0D1A] border border-purple-500/30 focus:border-purple-500 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 outline-none transition-all focus:ring-2 focus:ring-purple-500/20"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2 font-medium">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full bg-[#0F0D1A] border border-purple-500/30 focus:border-purple-500 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 outline-none transition-all focus:ring-2 focus:ring-purple-500/20"
                      placeholder="••••••••"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full relative overflow-hidden bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold py-4 rounded-xl transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/25 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    <span className="relative z-10">
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Signing in...
                        </span>
                      ) : 'Sign In'}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
                  </button>
                </form>
              )}

              {/* Sign Up Form */}
              {activeTab === 'sign_up' && !success && (
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2 font-medium">What should we call you?</label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      required
                      className="w-full bg-[#0F0D1A] border border-purple-500/30 focus:border-purple-500 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 outline-none transition-all focus:ring-2 focus:ring-purple-500/20"
                      placeholder="Your name or nickname"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2 font-medium">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-[#0F0D1A] border border-purple-500/30 focus:border-purple-500 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 outline-none transition-all focus:ring-2 focus:ring-purple-500/20"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2 font-medium">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full bg-[#0F0D1A] border border-purple-500/30 focus:border-purple-500 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 outline-none transition-all focus:ring-2 focus:ring-purple-500/20"
                      placeholder="At least 6 characters"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full relative overflow-hidden bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold py-4 rounded-xl transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-500/25 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    <span className="relative z-10">
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Creating account...
                        </span>
                      ) : 'Join the Village 🏘️'}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
                  </button>
                </form>
              )}

              {/* Terms */}
              {activeTab === 'sign_up' && !success && (
                <p className="text-gray-500 text-xs text-center mt-4">
                  By joining, you agree to our{' '}
                  <a href="/privacy" className="text-purple-400 hover:text-purple-300 underline">Privacy Policy</a>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Keyframes */}
      <style jsx>{`
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
          from { transform: translateX(-50px); }
          to { transform: translateX(450px); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease forwards;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        
        .animate-shake {
          animation: shake 0.3s ease;
        }
      `}</style>
    </>
  )
}

export default AuthModal
