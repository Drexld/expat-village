// src/pages/Home.jsx
// EXPAT VILLAGE - Premium Homepage Redesign
// "Your Village, Your People, Your Poland"

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function Home() {
  const { isAuthenticated, user, profile, openAuthModal } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const displayName = profile?.display_name 
    || user?.user_metadata?.display_name 
    || user?.email?.split('@')[0] 
    || 'friend'

  // Quick action suggestions based on popular needs
  const quickActions = [
    { icon: '🏦', label: 'Open a bank account', path: '/guides/banking' },
    { icon: '🏠', label: 'Find an apartment', path: '/housing' },
    { icon: '📋', label: 'Get my PESEL', path: '/guides/pesel' },
    { icon: '💼', label: 'Find a job', path: '/jobs-careers' },
    { icon: '🏥', label: 'Get health insurance', path: '/insurance-health' },
    { icon: '🚇', label: 'Understand transport', path: '/transport' },
  ]

  // Main sections with new design
  const sections = [
    {
      id: 'get-things-done',
      icon: '📋',
      title: 'Get Things Done',
      description: 'PESEL, banking, residency, contracts',
      color: 'from-violet-600 to-purple-700',
      path: '/get-things-done',
      badge: '6 guides'
    },
    {
      id: 'housing',
      icon: '🏠',
      title: 'Housing',
      description: 'Find apartments, avoid scams, know your rights',
      color: 'from-amber-500 to-orange-600',
      path: '/housing',
      badge: 'AI Tools',
      featured: true
    },
    {
      id: 'insurance-health',
      icon: '🏥',
      title: 'Insurance & Health',
      description: 'NFZ, private insurance, doctors',
      color: 'from-emerald-500 to-teal-600',
      path: '/insurance-health',
      badge: '6 guides'
    },
    {
      id: 'jobs-careers',
      icon: '💼',
      title: 'Jobs & Careers',
      description: 'Work permits, job hunting, B2B',
      color: 'from-blue-500 to-indigo-600',
      path: '/jobs-careers',
      badge: '6 guides'
    },
    {
      id: 'live-your-life',
      icon: '🎉',
      title: 'Live Your Life',
      description: 'Restaurants, nightlife, fitness',
      color: 'from-pink-500 to-rose-600',
      path: '/live-your-life',
      badge: '6 guides'
    },
    {
      id: 'transport',
      icon: '🚇',
      title: 'Getting Around',
      description: 'Trams, buses, driving, cycling',
      color: 'from-cyan-500 to-blue-600',
      path: '/transport',
      badge: '6 guides'
    },
  ]

  // AI Tools
  const aiTools = [
    {
      icon: '📄',
      title: 'Contract Analyzer',
      description: 'Paste your rental contract. Our AI checks it against Polish law and flags illegal clauses.',
      path: '/contract-analyzer',
      gradient: 'from-violet-600 via-purple-600 to-indigo-600',
      tag: 'AI Powered'
    },
    {
      icon: '📝',
      title: 'Document Translator',
      description: 'Got a confusing Polish letter? We\'ll tell you what it means and if you need to act.',
      path: '/document-analyzer',
      gradient: 'from-amber-500 via-orange-500 to-red-500',
      tag: 'AI Powered'
    },
  ]

  // Community features
  const communityFeatures = [
    {
      icon: '🎵',
      title: 'Village Vibes',
      description: 'Vote on today\'s community vibe',
      path: '/village-vibes',
      stat: '2.8k votes today'
    },
    {
      icon: '🎓',
      title: 'Student Hub',
      description: 'Universities, roommates, discounts',
      path: '/student-hub',
      stat: '4.8k students'
    },
    {
      icon: '📍',
      title: 'Directory',
      description: 'Verified expat-friendly businesses',
      path: '/directory',
      stat: '500+ listings'
    },
  ]

  return (
    <div className={`min-h-screen transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Hero Section */}
      <section className="relative pt-8 pb-16 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          {/* Greeting */}
          <div className={`text-center mb-8 transition-all duration-700 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {isAuthenticated ? (
              <>
                <p className="text-amber-400 font-medium mb-2 tracking-wide uppercase text-sm">Welcome back</p>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Hey, <span className="bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent">{displayName}</span> 👋
                </h1>
              </>
            ) : (
              <>
                <p className="text-amber-400 font-medium mb-2 tracking-wide uppercase text-sm">Welcome to Warsaw</p>
                <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                  Your Village.<br />
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">Your People.</span><br />
                  Your Poland.
                </h1>
              </>
            )}
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Like having a friend who's lived here for 10 years. 
              <span className="text-purple-400"> Everything you need</span> to thrive as an expat in Poland.
            </p>
          </div>

          {/* Search Bar */}
          <div className={`max-w-2xl mx-auto mb-10 transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-amber-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
              <div className="relative bg-[#1A1625]/90 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-2 flex items-center gap-3 shadow-2xl">
                <div className="pl-4 text-2xl">🔍</div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What do you need help with?"
                  className="flex-1 bg-transparent border-none outline-none text-white text-lg placeholder-gray-500 py-3"
                />
                <button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25">
                  Search
                </button>
              </div>
            </div>
            <p className="text-center text-gray-500 text-sm mt-3">
              Try: "How do I get PESEL?" or "Best banks for expats"
            </p>
          </div>

          {/* Quick Actions */}
          <div className={`flex flex-wrap justify-center gap-3 mb-12 transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {quickActions.map((action, index) => (
              <Link
                key={action.path}
                to={action.path}
                className="group flex items-center gap-2 bg-[#221E2D]/80 hover:bg-[#2A2538] border border-purple-500/20 hover:border-purple-500/40 rounded-full px-4 py-2.5 transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/10"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="text-lg group-hover:scale-110 transition-transform">{action.icon}</span>
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Live Sessions Banner */}
      <section className={`mb-12 transition-all duration-700 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <Link 
          to="/town-hall"
          className="block group relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-900/40 via-purple-900/40 to-red-900/40 border border-red-500/30 hover:border-red-500/50 p-6 transition-all"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" />
                <div className="absolute inset-0 w-4 h-4 bg-red-500 rounded-full animate-ping" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  2 Live Sessions Happening Now
                </h3>
                <p className="text-gray-400 text-sm">Tax Q&A with Marta K. • Newcomers Welcome Circle</p>
              </div>
            </div>
            <div className="text-purple-400 group-hover:text-amber-400 font-semibold transition-colors flex items-center gap-2">
              Join <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        </Link>
      </section>

      {/* Main Sections Grid */}
      <section className="mb-16">
        <div className={`flex items-center justify-between mb-8 transition-all duration-700 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">Explore Everything</h2>
            <p className="text-gray-500 mt-1">42 comprehensive guides to help you thrive</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map((section, index) => (
            <Link
              key={section.id}
              to={section.path}
              className={`group relative overflow-hidden rounded-2xl bg-[#1A1625] border border-purple-500/20 hover:border-purple-500/40 p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/10 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${500 + index * 100}ms` }}
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              {/* Featured Glow */}
              {section.featured && (
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl" />
              )}
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl group-hover:scale-110 transition-transform duration-300">{section.icon}</span>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    section.featured 
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                      : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  }`}>
                    {section.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">{section.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{section.description}</p>
                
                <div className="mt-4 flex items-center text-purple-400 group-hover:text-amber-400 font-medium text-sm transition-colors">
                  Explore <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* AI Tools Section */}
      <section className="mb-16">
        <div className={`text-center mb-10 transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <span className="inline-block bg-gradient-to-r from-purple-500/20 to-amber-500/20 border border-purple-500/30 rounded-full px-4 py-1 text-sm font-medium text-purple-300 mb-4">
            ✨ Powered by AI
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Smart Tools for Expats</h2>
          <p className="text-gray-400 max-w-xl mx-auto">Stop guessing. Let AI analyze your contracts and documents in seconds.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {aiTools.map((tool, index) => (
            <Link
              key={tool.path}
              to={tool.path}
              className="group relative overflow-hidden rounded-2xl bg-[#1A1625] border border-purple-500/20 hover:border-purple-500/40 p-8 transition-all duration-300 hover:scale-[1.02]"
            >
              {/* Animated Gradient Border */}
              <div className={`absolute inset-0 bg-gradient-to-r ${tool.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center text-2xl shadow-lg`}>
                    {tool.icon}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">{tool.tag}</span>
                    <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">{tool.title}</h3>
                  </div>
                </div>
                <p className="text-gray-400 leading-relaxed mb-4">{tool.description}</p>
                <div className="flex items-center text-purple-400 group-hover:text-amber-400 font-semibold transition-colors">
                  Try it free <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Community Section */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Join the Village</h2>
          <p className="text-gray-400">More than information. A real community.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {communityFeatures.map((feature, index) => (
            <Link
              key={feature.path}
              to={feature.path}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1A1625] to-[#221E2D] border border-purple-500/20 hover:border-purple-500/40 p-6 transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4 mb-3">
                <span className="text-3xl">{feature.icon}</span>
                <div className="flex-1">
                  <h3 className="font-bold text-white group-hover:text-purple-300 transition-colors">{feature.title}</h3>
                  <p className="text-gray-500 text-sm">{feature.description}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-amber-400 font-medium">{feature.stat}</span>
                <span className="text-purple-400 group-hover:text-amber-400 text-sm font-medium transition-colors">
                  Explore →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="mb-16">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900/50 via-[#1A1625] to-amber-900/30 border border-purple-500/30 p-8 md:p-12">
            {/* Decorative */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
            
            <div className="relative z-10 text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to make Poland feel like <span className="text-amber-400">home</span>?
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Join 8,000+ expats who've found their village. Free forever for basic features.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => openAuthModal('sign_up')}
                  className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25"
                >
                  <span className="relative z-10">Join the Village — It's Free</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </button>
                <Link
                  to="/about"
                  className="border border-purple-500/50 hover:border-purple-500 text-white px-8 py-4 rounded-xl font-semibold transition-all hover:bg-purple-500/10"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: '8,200+', label: 'Expats in the Village' },
            { value: '42', label: 'Comprehensive Guides' },
            { value: '500+', label: 'Verified Businesses' },
            { value: '12', label: 'Polish Cities Covered' },
          ].map((stat, index) => (
            <div key={index} className="text-center p-6 rounded-2xl bg-[#1A1625]/50 border border-purple-500/10">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent mb-1">
                {stat.value}
              </div>
              <div className="text-gray-500 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Banner */}
      <section className="text-center pb-8">
        <p className="text-gray-600 text-sm">
          🇵🇱 Made with love in Warsaw • By expats, for expats
        </p>
      </section>
    </div>
  )
}

export default Home
