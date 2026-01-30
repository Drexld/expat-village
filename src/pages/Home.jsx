// src/pages/Home.jsx
// EXPAT VILLAGE - Premium Homepage with Tailwind
// This version uses Tailwind classes properly for the wow factor

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function Home() {
  const { isAuthenticated, user, profile, openAuthModal } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Trigger animations after mount
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const displayName = profile?.display_name 
    || user?.user_metadata?.display_name 
    || user?.email?.split('@')[0] 
    || 'friend'

  const quickActions = [
    { icon: '🏦', label: 'Open a bank account', path: '/guides/banking' },
    { icon: '🏠', label: 'Find an apartment', path: '/housing' },
    { icon: '📋', label: 'Get my PESEL', path: '/guides/pesel' },
    { icon: '💼', label: 'Find a job', path: '/jobs-careers' },
    { icon: '🏥', label: 'Get health insurance', path: '/insurance-health' },
    { icon: '🚇', label: 'Understand transport', path: '/transport' },
  ]

  const sections = [
    {
      id: 'get-things-done',
      icon: '📋',
      title: 'Get Things Done',
      description: 'PESEL, banking, residency, contracts',
      gradient: 'from-violet-600/20 to-purple-900/20',
      border: 'border-violet-500/30 hover:border-violet-400/50',
      path: '/get-things-done',
      badge: '6 guides',
      badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30'
    },
    {
      id: 'housing',
      icon: '🏠',
      title: 'Housing',
      description: 'Find apartments, avoid scams, know your rights',
      gradient: 'from-amber-600/20 to-orange-900/20',
      border: 'border-amber-500/30 hover:border-amber-400/50',
      path: '/housing',
      badge: 'AI Tools',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      featured: true
    },
    {
      id: 'insurance-health',
      icon: '🏥',
      title: 'Insurance & Health',
      description: 'NFZ, private insurance, doctors',
      gradient: 'from-emerald-600/20 to-teal-900/20',
      border: 'border-emerald-500/30 hover:border-emerald-400/50',
      path: '/insurance-health',
      badge: '6 guides',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    },
    {
      id: 'jobs-careers',
      icon: '💼',
      title: 'Jobs & Careers',
      description: 'Work permits, job hunting, B2B',
      gradient: 'from-blue-600/20 to-indigo-900/20',
      border: 'border-blue-500/30 hover:border-blue-400/50',
      path: '/jobs-careers',
      badge: '6 guides',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    },
    {
      id: 'live-your-life',
      icon: '🎉',
      title: 'Live Your Life',
      description: 'Restaurants, nightlife, fitness',
      gradient: 'from-pink-600/20 to-rose-900/20',
      border: 'border-pink-500/30 hover:border-pink-400/50',
      path: '/live-your-life',
      badge: '6 guides',
      badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/30'
    },
    {
      id: 'transport',
      icon: '🚇',
      title: 'Getting Around',
      description: 'Trams, buses, driving, cycling',
      gradient: 'from-cyan-600/20 to-blue-900/20',
      border: 'border-cyan-500/30 hover:border-cyan-400/50',
      path: '/transport',
      badge: '6 guides',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
    },
  ]

  const aiTools = [
    {
      icon: '📄',
      title: 'Contract Analyzer',
      description: 'Paste your rental contract. Our AI checks it against Polish law and flags illegal clauses.',
      path: '/contract-analyzer',
      gradient: 'from-violet-600 to-purple-700',
      bgGradient: 'from-violet-900/30 to-purple-900/10'
    },
    {
      icon: '📝',
      title: 'Document Translator',
      description: "Got a confusing Polish letter? We'll tell you what it means and if you need to act.",
      path: '/document-analyzer',
      gradient: 'from-amber-500 to-orange-600',
      bgGradient: 'from-amber-900/30 to-orange-900/10'
    },
  ]

  const communityFeatures = [
    { icon: '🎵', title: 'Village Vibes', description: 'Vote on today\'s vibe', path: '/village-vibes', stat: '2.8k votes' },
    { icon: '🎓', title: 'Student Hub', description: 'Universities & roommates', path: '/student-hub', stat: '4.8k students' },
    { icon: '📍', title: 'Directory', description: 'Expat-friendly businesses', path: '/directory', stat: '500+ listings' },
  ]

  return (
    <div className="min-h-screen">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10">
        {/* ==================== HERO SECTION ==================== */}
        <section className="pt-8 pb-12">
          {/* Main Heading */}
          <div className={`text-center mb-10 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {isAuthenticated ? (
              <>
                <p className="text-amber-400 font-semibold mb-3 tracking-widest uppercase text-sm">Welcome back</p>
                <h1 className="text-5xl md:text-6xl font-extrabold mb-5">
                  Hey, <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">{displayName}</span> 👋
                </h1>
              </>
            ) : (
              <>
                <p className="text-amber-400 font-semibold mb-3 tracking-widest uppercase text-sm">Welcome to Warsaw</p>
                <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
                  <span className="block text-white">Your Village.</span>
                  <span className="block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-400 bg-clip-text text-transparent">Your People.</span>
                  <span className="block text-white">Your Poland.</span>
                </h1>
              </>
            )}
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mt-6 leading-relaxed">
              Like having a friend who's lived here for 10 years. 
              <span className="text-violet-400"> Everything you need</span> to thrive as an expat in Poland.
            </p>
          </div>

          {/* Search Bar */}
          <div className={`max-w-2xl mx-auto mb-8 transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="relative group">
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-amber-500 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
              
              {/* Search Input Container */}
              <div className="relative bg-slate-900/90 backdrop-blur-xl border border-violet-500/30 rounded-2xl p-2 flex items-center gap-3">
                <div className="pl-4 text-2xl">🔍</div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What do you need help with?"
                  className="flex-1 bg-transparent border-none outline-none text-white text-lg placeholder-slate-500 py-3"
                />
                <button className="bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-500 hover:to-violet-600 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-violet-500/30">
                  Search
                </button>
              </div>
            </div>
            <p className="text-center text-slate-500 text-sm mt-3">
              Try: "How do I get PESEL?" or "Best banks for expats"
            </p>
          </div>

          {/* Quick Actions */}
          <div className={`flex flex-wrap justify-center gap-3 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {quickActions.map((action, index) => (
              <Link
                key={action.path}
                to={action.path}
                className="group flex items-center gap-2 bg-slate-800/60 hover:bg-slate-700/80 border border-violet-500/20 hover:border-violet-500/50 rounded-full px-5 py-2.5 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-violet-500/10"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">{action.icon}</span>
                <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{action.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ==================== LIVE SESSIONS BANNER ==================== */}
        <section className={`mb-12 transition-all duration-1000 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Link 
            to="/town-hall"
            className="block group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-violet-600/20 to-red-600/20 rounded-2xl" />
            <div className="relative border border-red-500/30 hover:border-red-500/50 rounded-2xl p-6 transition-all duration-300">
              {/* Animated Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                  {/* Pulsing Live Dot */}
                  <div className="relative">
                    <div className="w-4 h-4 bg-red-500 rounded-full" />
                    <div className="absolute inset-0 w-4 h-4 bg-red-500 rounded-full animate-ping opacity-75" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">2 Live Sessions Happening Now</h3>
                    <p className="text-slate-400 text-sm">Tax Q&A with Marta K. • Newcomers Welcome Circle</p>
                  </div>
                </div>
                <div className="text-violet-400 group-hover:text-amber-400 font-semibold transition-colors flex items-center gap-2">
                  Join <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>
          </Link>
        </section>

        {/* ==================== EXPLORE SECTIONS ==================== */}
        <section className="mb-16">
          <div className={`mb-8 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Explore Everything</h2>
            <p className="text-slate-500">42 comprehensive guides to help you thrive</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sections.map((section, index) => (
              <Link
                key={section.id}
                to={section.path}
                className={`group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-[1.03] hover:-translate-y-1 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${500 + index * 100}ms` }}
              >
                {/* Card Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${section.gradient}`} />
                <div className="absolute inset-0 bg-slate-900/70" />
                
                {/* Featured Glow */}
                {section.featured && (
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/30 rounded-full blur-2xl" />
                )}
                
                {/* Card Content */}
                <div className={`relative border ${section.border} rounded-2xl p-6 h-full transition-all duration-300`}>
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-4xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">{section.icon}</span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${section.badgeColor}`}>
                      {section.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-violet-300 transition-colors">{section.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">{section.description}</p>
                  
                  <div className="flex items-center text-violet-400 group-hover:text-amber-400 font-semibold text-sm transition-colors">
                    Explore <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ==================== AI TOOLS SECTION ==================== */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500/20 to-amber-500/20 border border-violet-500/30 rounded-full px-5 py-2 mb-4">
              <span className="text-lg">✨</span>
              <span className="text-sm font-semibold text-violet-300">Powered by AI</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Smart Tools for Expats</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Stop guessing. Let AI analyze your contracts and documents in seconds.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aiTools.map((tool) => (
              <Link
                key={tool.path}
                to={tool.path}
                className="group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-[1.02]"
              >
                {/* Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.bgGradient}`} />
                <div className="absolute inset-0 bg-slate-900/60" />
                
                {/* Top Glow Line */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${tool.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                {/* Content */}
                <div className="relative border border-violet-500/20 group-hover:border-violet-500/40 rounded-2xl p-8 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {tool.icon}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">AI Powered</span>
                      <h3 className="text-xl font-bold text-white group-hover:text-violet-300 transition-colors">{tool.title}</h3>
                    </div>
                  </div>
                  <p className="text-slate-400 leading-relaxed mb-4">{tool.description}</p>
                  <div className="flex items-center text-violet-400 group-hover:text-amber-400 font-semibold transition-colors">
                    Try it free <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ==================== COMMUNITY SECTION ==================== */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Join the Village</h2>
            <p className="text-slate-400">More than information. A real community.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {communityFeatures.map((feature) => (
              <Link
                key={feature.path}
                to={feature.path}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-violet-500/20 hover:border-violet-500/40 p-6 transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-3xl group-hover:scale-110 transition-transform">{feature.icon}</span>
                  <div>
                    <h3 className="font-bold text-white group-hover:text-violet-300 transition-colors">{feature.title}</h3>
                    <p className="text-slate-500 text-sm">{feature.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-amber-400 font-semibold">{feature.stat}</span>
                  <span className="text-violet-400 group-hover:text-amber-400 text-sm font-semibold transition-colors">
                    Explore →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ==================== CTA SECTION ==================== */}
        {!isAuthenticated && (
          <section className="mb-16">
            <div className="relative overflow-hidden rounded-3xl">
              {/* Background Gradients */}
              <div className="absolute inset-0 bg-gradient-to-r from-violet-900/60 via-slate-900 to-amber-900/40" />
              <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl" />
              
              {/* Content */}
              <div className="relative border border-violet-500/30 rounded-3xl p-10 md:p-14 text-center">
                <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-5 leading-tight">
                  Ready to make Poland<br />feel like <span className="text-amber-400">home</span>?
                </h2>
                <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
                  Join 8,000+ expats who've found their village. Free forever for basic features.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => openAuthModal('sign_up')}
                    className="group relative overflow-hidden bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-500 hover:to-violet-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-violet-500/30"
                  >
                    <span className="relative z-10">Join the Village — It's Free</span>
                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  </button>
                  <Link
                    to="/about"
                    className="border-2 border-violet-500/50 hover:border-violet-400 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:bg-violet-500/10"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ==================== STATS SECTION ==================== */}
        <section className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: '8,200+', label: 'Expats in the Village' },
              { value: '42', label: 'Comprehensive Guides' },
              { value: '500+', label: 'Verified Businesses' },
              { value: '12', label: 'Polish Cities Covered' },
            ].map((stat, index) => (
              <div 
                key={index} 
                className="text-center p-6 rounded-2xl bg-slate-800/40 border border-violet-500/10 hover:border-violet-500/30 transition-colors"
              >
                <div className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-violet-400 to-amber-400 bg-clip-text text-transparent mb-1">
                  {stat.value}
                </div>
                <div className="text-slate-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ==================== TRUST FOOTER ==================== */}
        <section className="text-center pb-8">
          <p className="text-slate-600 text-sm">
            🇵🇱 Made with love in Warsaw • By expats, for expats
          </p>
        </section>
      </div>
    </div>
  )
}

export default Home
