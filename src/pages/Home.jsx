// src/pages/Home.jsx
// EXPAT VILLAGE - Premium Homepage
// Fixed links to match actual routes

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function Home() {
  const { isAuthenticated, profile, user } = useAuth()
  const [isVisible, setIsVisible] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const displayName = profile?.display_name 
    || user?.user_metadata?.display_name 
    || user?.email?.split('@')[0] 
    || 'friend'

  const quickActions = [
    { icon: '🏦', label: 'Open a bank account', path: '/get-things-done' },
    { icon: '🏠', label: 'Find an apartment', path: '/housing' },
    { icon: '📝', label: 'Get my PESEL', path: '/get-things-done' },
    { icon: '💼', label: 'Find a job', path: '/jobs-careers' },
    { icon: '🏥', label: 'Get health insurance', path: '/insurance-health' },
    { icon: '🚇', label: 'Understand transport', path: '/getting-around' },
  ]

  const sections = [
    {
      id: 'get-things-done',
      icon: '📋',
      title: 'Get Things Done',
      description: 'Banking, PESEL, residency, contracts, lawyers, ZUS',
      path: '/get-things-done',
      color: 'from-purple-600/20 to-purple-800/20',
      border: 'border-purple-500/30',
      hoverBorder: 'hover:border-purple-500/60'
    },
    {
      id: 'insurance-health',
      icon: '🏥',
      title: 'Insurance & Health',
      description: 'NFZ, private insurance, dentists, mental health support',
      path: '/insurance-health',
      color: 'from-blue-600/20 to-blue-800/20',
      border: 'border-blue-500/30',
      hoverBorder: 'hover:border-blue-500/60'
    },
    {
      id: 'housing',
      icon: '🏠',
      title: 'Housing',
      description: 'Find apartments, avoid scams, NestQuest analyzer',
      path: '/housing',
      color: 'from-amber-600/20 to-amber-800/20',
      border: 'border-amber-500/30',
      hoverBorder: 'hover:border-amber-500/60'
    },
    {
      id: 'jobs-careers',
      icon: '💼',
      title: 'Jobs & Careers',
      description: 'Work permits, job hunting, IT scene, B2B contracts',
      path: '/jobs-careers',
      color: 'from-green-600/20 to-green-800/20',
      border: 'border-green-500/30',
      hoverBorder: 'hover:border-green-500/60'
    },
    {
      id: 'live-your-life',
      icon: '🎯',
      title: 'Live Your Life',
      description: 'Restaurants, gyms, salons, events, entertainment',
      path: '/live-your-life',
      color: 'from-pink-600/20 to-pink-800/20',
      border: 'border-pink-500/30',
      hoverBorder: 'hover:border-pink-500/60'
    },
    {
      id: 'getting-around',
      icon: '🚇',
      title: 'Getting Around',
      description: 'Transport, tickets, trains, driving, essential apps',
      path: '/getting-around',
      color: 'from-cyan-600/20 to-cyan-800/20',
      border: 'border-cyan-500/30',
      hoverBorder: 'hover:border-cyan-500/60'
    },
    {
      id: 'town-hall',
      icon: '🏛️',
      title: 'Town Hall',
      description: 'Community forum, live events, connect with expats',
      path: '/town-hall',
      color: 'from-red-600/20 to-red-800/20',
      border: 'border-red-500/30',
      hoverBorder: 'hover:border-red-500/60',
      badge: '🔴 Live'
    }
  ]

  return (
    <div className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none animate-float" style={{ animationDelay: '1s' }} />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          {isAuthenticated ? (
            <>
              <span className="inline-block bg-amber-500/20 border border-amber-500/30 rounded-full px-4 py-1 text-sm font-medium text-amber-300 mb-4 animate-fadeIn">
                WELCOME BACK
              </span>
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                <span className="text-white">Hey, </span>
                <span className="bg-gradient-to-r from-purple-400 to-amber-400 text-transparent bg-clip-text">
                  {displayName}
                </span>
                <span className="ml-3 animate-wave inline-block">👋</span>
              </h1>
            </>
          ) : (
            <>
              <span className="inline-block bg-purple-500/20 border border-purple-500/30 rounded-full px-4 py-1 text-sm font-medium text-purple-300 mb-4 animate-fadeIn">
                YOUR GUIDE TO POLAND
              </span>
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                <span className="text-white">Navigate </span>
                <span className="bg-gradient-to-r from-purple-400 to-amber-400 text-transparent bg-clip-text">
                  Your Poland.
                </span>
              </h1>
            </>
          )}
          
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Like having a friend who's lived here for 10 years. Everything you need to thrive as an expat in Poland.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-6">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-amber-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300" />
              <div className="relative flex items-center bg-[#1A1625] border border-purple-500/30 rounded-2xl overflow-hidden">
                <span className="pl-5 text-purple-400 text-xl">🔍</span>
                <input
                  type="text"
                  placeholder="What do you need help with?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none px-4 py-4 text-white placeholder-gray-500"
                />
                <button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-medium px-8 py-3 m-1.5 rounded-xl transition-all">
                  Search
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              Try: "How do I get PESEL?" or "Best banks for expats"
            </p>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mb-12 px-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 text-center">
          Popular right now
        </h2>
        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          {quickActions.map((action, i) => (
            <Link
              key={i}
              to={action.path}
              className="flex items-center gap-2 bg-[#1A1625] hover:bg-[#221E2D] border border-purple-500/20 hover:border-purple-500/40 rounded-full px-4 py-2.5 text-gray-300 hover:text-white transition-all group"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <span className="text-lg">{action.icon}</span>
              <span className="text-sm font-medium">{action.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Live Sessions Banner */}
      <Link 
        to="/town-hall"
        className="block mb-12 max-w-4xl mx-auto px-4"
      >
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300" />
          <div className="relative bg-gradient-to-r from-red-900/40 to-orange-900/40 border border-red-500/50 hover:border-red-500/70 rounded-2xl p-6 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                </span>
                <div>
                  <p className="text-white font-bold text-lg">2 Live Sessions Happening Now</p>
                  <p className="text-gray-300 text-sm mt-1">Tax Q&A with Marta K. • Newcomers Welcome Circle</p>
                </div>
              </div>
              <span className="text-red-300 font-medium group-hover:translate-x-1 transition-transform">
                Join →
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Explore Sections */}
      <section className="mb-12 px-4">
        <div className="max-w-4xl mx-auto mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Explore Everything</h2>
          <p className="text-gray-400">All the resources you need to thrive in Poland</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {sections.map((section, i) => (
            <Link
              key={section.id}
              to={section.path}
              className={`group relative block bg-gradient-to-br ${section.color} border ${section.border} ${section.hoverBorder} rounded-2xl p-6 transition-all hover:scale-[1.02]`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl">{section.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                      {section.title}
                    </h3>
                    {section.badge && (
                      <span className="text-xs bg-red-500/20 border border-red-500/30 text-red-300 px-2 py-0.5 rounded-full font-medium">
                        {section.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {section.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* AI Tools */}
      <section className="mb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">AI-Powered Tools</h2>
            <p className="text-gray-400">Let AI help you navigate Polish bureaucracy</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              to="/contract-analyzer"
              className="group relative block bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-500/30 hover:border-purple-500/60 rounded-2xl p-6 transition-all hover:scale-[1.02]"
            >
              <div className="absolute top-3 right-3">
                <span className="inline-block bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs px-2 py-1 rounded-lg font-medium">
                  ✨ AI Powered
                </span>
              </div>
              <span className="text-4xl mb-3 block">📄</span>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                Contract Analyzer
              </h3>
              <p className="text-gray-400 text-sm">
                Upload your rental contract and get instant analysis against Polish law
              </p>
            </Link>

            <Link
              to="/document-analyzer"
              className="group relative block bg-gradient-to-br from-amber-600/20 to-amber-800/20 border border-amber-500/30 hover:border-amber-500/60 rounded-2xl p-6 transition-all hover:scale-[1.02]"
            >
              <div className="absolute top-3 right-3">
                <span className="inline-block bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs px-2 py-1 rounded-lg font-medium">
                  ✨ AI Powered
                </span>
              </div>
              <span className="text-4xl mb-3 block">🔍</span>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                Document Translator
              </h3>
              <p className="text-gray-400 text-sm">
                Translate and understand Polish government documents in plain English
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Community Features */}
      <section className="mb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Community & Tools</h2>
            <p className="text-gray-400">Connect, organize, and track your progress</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              to="/village-vibes"
              className="group block bg-gradient-to-br from-pink-600/20 to-pink-800/20 border border-pink-500/30 hover:border-pink-500/60 rounded-2xl p-6 transition-all hover:scale-[1.02]"
            >
              <span className="text-3xl mb-3 block">🎵</span>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-pink-300 transition-colors">
                Village Vibes
              </h3>
              <p className="text-gray-400 text-sm">
                Vote for today's song
              </p>
            </Link>

            <Link
              to="/student-hub"
              className="group block bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 hover:border-blue-500/60 rounded-2xl p-6 transition-all hover:scale-[1.02]"
            >
              <span className="text-3xl mb-3 block">🎓</span>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                Student Hub
              </h3>
              <p className="text-gray-400 text-sm">
                University resources
              </p>
            </Link>

            <Link
              to="/my-checklist"
              className="group block bg-gradient-to-br from-green-600/20 to-green-800/20 border border-green-500/30 hover:border-green-500/60 rounded-2xl p-6 transition-all hover:scale-[1.02]"
            >
              <span className="text-3xl mb-3 block">✅</span>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-green-300 transition-colors">
                My Checklist
              </h3>
              <p className="text-gray-400 text-sm">
                Track your progress
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mb-12 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-purple-600/10 to-amber-600/10 border border-purple-500/20 rounded-2xl p-8">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-amber-400 text-transparent bg-clip-text mb-2">
                42+
              </p>
              <p className="text-gray-400 text-sm">Detailed Guides</p>
            </div>
            <div>
              <p className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-amber-400 text-transparent bg-clip-text mb-2">
                8.2k+
              </p>
              <p className="text-gray-400 text-sm">Community Members</p>
            </div>
            <div>
              <p className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-amber-400 text-transparent bg-clip-text mb-2">
                24/7
              </p>
              <p className="text-gray-400 text-sm">Active Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-16 px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to join the village?
            </h2>
            <p className="text-gray-400 mb-8">
              Join thousands of expats who are thriving in Poland with our community
            </p>
            <Link
              to="/onboarding"
              className="inline-block bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-500 hover:to-amber-500 text-white font-bold px-8 py-4 rounded-xl transition-all hover:scale-105 shadow-lg"
            >
              Join Free →
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}

export default Home
