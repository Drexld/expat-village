import { Link } from 'react-router-dom'
import { useState } from 'react'

function Home() {
  const [query, setQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)

  const quickActions = [
    { icon: '🏦', label: 'Open a bank account', path: '/get-things-done', category: 'banking' },
    { icon: '🏠', label: 'Find an apartment', path: '/housing', category: 'finding-apartment' },
    { icon: '📋', label: 'Get my PESEL', path: '/get-things-done', category: 'pesel' },
    { icon: '💼', label: 'Find a job', path: '/jobs-careers', category: 'job-hunting' },
    { icon: '🏥', label: 'Get health insurance', path: '/insurance-health', category: 'nfz' },
    { icon: '🚇', label: 'Understand transport', path: '/getting-around', category: 'public-transport' },
  ]

  const conversationalSuggestions = [
    { 
      trigger: ['eat', 'food', 'hungry', 'restaurant', 'dinner', 'lunch'],
      response: "Looking for good food? I've got you!",
      options: [
        { label: '🍽️ Restaurant recommendations', path: '/live-your-life' },
        { label: '🥡 Best delivery apps', path: '/live-your-life' },
        { label: '🍺 Where expats hang out', path: '/live-your-life' },
      ]
    },
    {
      trigger: ['apartment', 'flat', 'rent', 'housing', 'move', 'live'],
      response: "Apartment hunting in Poland? Let me help you avoid the traps.",
      options: [
        { label: '🔍 Where to search', path: '/housing' },
        { label: '🚨 Scam warnings', path: '/housing' },
        { label: '🏠 Use NestQuest tool', path: '/housing' },
        { label: '📝 Analyze my contract', path: '/housing' },
      ]
    },
    {
      trigger: ['bank', 'money', 'account', 'transfer'],
      response: "Let's get your banking sorted. It's easier than you think!",
      options: [
        { label: '🏦 Best expat-friendly banks', path: '/get-things-done' },
        { label: '💳 What documents you need', path: '/get-things-done' },
        { label: '📱 English banking apps', path: '/get-things-done' },
      ]
    },
    {
      trigger: ['job', 'work', 'career', 'salary', 'hire', 'employ'],
      response: "Ready to work in Poland? Here's everything you need.",
      options: [
        { label: '📄 Work permit info', path: '/jobs-careers' },
        { label: '🔍 Where to find jobs', path: '/jobs-careers' },
        { label: '💰 Salary expectations', path: '/jobs-careers' },
        { label: '💼 B2B vs employment', path: '/jobs-careers' },
      ]
    },
    {
      trigger: ['doctor', 'health', 'sick', 'hospital', 'insurance', 'nfz'],
      response: "Health matters! Let me explain how healthcare works here.",
      options: [
        { label: '🏥 NFZ (public health)', path: '/insurance-health' },
        { label: '💊 Private insurance', path: '/insurance-health' },
        { label: '🦷 Find a dentist', path: '/insurance-health' },
        { label: '🧠 Mental health support', path: '/insurance-health' },
      ]
    },
    {
      trigger: ['pesel', 'residency', 'permit', 'visa', 'document', 'register'],
      response: "Bureaucracy time! Don't worry, I'll walk you through it.",
      options: [
        { label: '📋 Get your PESEL', path: '/get-things-done' },
        { label: '🏠 Residency permit', path: '/get-things-done' },
        { label: '📄 What documents to bring', path: '/get-things-done' },
      ]
    },
    {
      trigger: ['friend', 'meet', 'social', 'lonely', 'people', 'community'],
      response: "Making friends in a new country is hard. We've got your back!",
      options: [
        { label: '🎉 Events & meetups', path: '/live-your-life' },
        { label: '🏛️ Join Town Hall', path: '/town-hall' },
        { label: '🔴 Live sessions now', path: '/town-hall' },
      ]
    },
    {
      trigger: ['transport', 'bus', 'tram', 'metro', 'ticket', 'fine'],
      response: "Getting around Warsaw? Here's the insider info.",
      options: [
        { label: '🚇 Transport basics', path: '/getting-around' },
        { label: '🎫 Tickets & fines', path: '/getting-around' },
        { label: '📱 Essential apps', path: '/getting-around' },
      ]
    },
    {
      trigger: ['tax', 'pit', 'vat', 'zus', 'accountant'],
      response: "Taxes in Poland can be tricky. Let me simplify it.",
      options: [
        { label: '💼 B2B & freelancing', path: '/jobs-careers' },
        { label: '📊 ZUS contributions', path: '/get-things-done' },
        { label: '🔴 Join live tax Q&A', path: '/town-hall' },
      ]
    }
  ]

  const getMatchingSuggestion = (input) => {
    const lowerInput = input.toLowerCase()
    return conversationalSuggestions.find(suggestion =>
      suggestion.trigger.some(word => lowerInput.includes(word))
    )
  }

  const matchedSuggestion = query.length > 2 ? getMatchingSuggestion(query) : null

  const sections = [
    {
      id: 'get-things-done',
      icon: '📋',
      title: 'Get Things Done',
      description: 'Banking, PESEL, residency, contracts, lawyers, ZUS.',
      tags: ['Banking', 'Legal', 'Bureaucracy'],
      path: '/get-things-done',
      featured: false
    },
    {
      id: 'insurance-health',
      icon: '🏥',
      title: 'Insurance & Health',
      description: 'NFZ, private insurance, dentists, mental health support.',
      tags: ['NFZ', 'Private Health', 'Dental'],
      path: '/insurance-health',
      featured: false
    },
    {
      id: 'housing',
      icon: '🏠',
      title: 'Housing',
      description: 'Find apartments, avoid scams, use NestQuest, understand contracts.',
      tags: ['Rentals', 'NestQuest', 'Scam Alerts'],
      path: '/housing',
      featured: false
    },
    {
      id: 'jobs-careers',
      icon: '💼',
      title: 'Jobs & Careers',
      description: 'Work permits, job hunting, IT scene, freelancing, B2B.',
      tags: ['Work Permits', 'IT Jobs', 'B2B'],
      path: '/jobs-careers',
      featured: false
    },
    {
      id: 'live-your-life',
      icon: '🎯',
      title: 'Live Your Life',
      description: 'Restaurants, salons, gyms, events, entertainment.',
      tags: ['Food', 'Fitness', 'Social'],
      path: '/live-your-life',
      featured: false
    },
    {
      id: 'getting-around',
      icon: '🚇',
      title: 'Getting Around',
      description: 'Transport, tickets, trains, driving, essential apps.',
      tags: ['Transport', 'Tickets', 'Trains'],
      path: '/getting-around',
      featured: false
    },
    {
      id: 'town-hall',
      icon: '🏛️',
      title: 'Town Hall',
      description: 'Live sessions, community rooms, real expats helping expats.',
      tags: ['🔴 Live Now', 'Community', 'Q&A'],
      path: '/town-hall',
      featured: true
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section - Conversational */}
      <section className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-white mb-3">
          Welcome to Warsaw 🇵🇱
        </h1>
        <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
          Like having a friend who's lived here for 10 years. What do you need help with?
        </p>

        {/* Conversational Input */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Try: 'I need to find an apartment' or 'How do I get a PESEL?'"
              className="w-full bg-slate-800 border border-slate-600 focus:border-emerald-500 rounded-2xl px-6 py-4 text-white text-lg placeholder-slate-500 focus:outline-none transition-colors"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl">
              💬
            </span>
          </div>

          {/* Matched Response */}
          {matchedSuggestion && (
            <div className="mt-4 bg-slate-800 border border-emerald-700/50 rounded-xl p-5 text-left animate-fade-in">
              <p className="text-emerald-400 font-medium mb-3">
                {matchedSuggestion.response}
              </p>
              <div className="space-y-2">
                {matchedSuggestion.options.map((option, i) => (
                  <Link
                    key={i}
                    to={option.path}
                    className="block bg-slate-700 hover:bg-slate-600 rounded-lg px-4 py-3 text-white transition-colors"
                  >
                    {option.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mb-10">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 text-center">
          Popular right now
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {quickActions.map((action, i) => (
            <Link
              key={i}
              to={action.path}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-full px-4 py-2 text-slate-300 hover:text-white transition-all"
            >
              <span>{action.icon}</span>
              <span className="text-sm">{action.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Live Now Banner */}
      <Link 
        to="/town-hall"
        className="block mb-8 bg-gradient-to-r from-red-900/40 to-orange-900/40 border border-red-700/50 hover:border-red-500 rounded-xl p-5 transition-all group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <div>
              <p className="text-white font-semibold">🔴 2 Live Sessions Happening Now</p>
              <p className="text-slate-400 text-sm">Tax Q&A with Marta K. • Newcomers Welcome Circle</p>
            </div>
          </div>
          <span className="text-red-400 group-hover:text-red-300 transition-colors">
            Join →
          </span>
        </div>
      </Link>

      {/* Main Sections */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">Explore Everything</h2>
        <div className="space-y-3">
          {sections.map((section) => (
            <Link
              key={section.id}
              to={section.path}
              className={`block border rounded-xl p-5 transition-all group ${
                section.featured
                  ? 'bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border-emerald-700/50 hover:border-emerald-500'
                  : 'bg-slate-800 hover:bg-slate-750 border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{section.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-lg font-semibold group-hover:text-emerald-400 transition-colors ${
                      section.featured ? 'text-emerald-300' : 'text-white'
                    }`}>
                      {section.title}
                    </h3>
                    {section.featured && (
                      <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                        Live
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm">{section.description}</p>
                </div>
                <span className="text-slate-500 group-hover:text-slate-300 transition-colors">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* My Checklist */}
      <Link 
        to="/my-checklist"
        className="block mb-10 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-700/50 hover:border-purple-500 rounded-xl p-6 transition-all group"
      >
        <div className="flex items-start gap-4">
          <span className="text-4xl">✅</span>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">My Checklist</h3>
              <span className="bg-emerald-600 text-white text-xs px-2 py-0.5 rounded-full">New!</span>
            </div>
            <p className="text-slate-300 mb-2">
              Your personal "New to Poland" tracker. 22 tasks organized by priority, 
              tick them off as you go. Never miss an important step.
            </p>
            <span className="text-purple-400 group-hover:text-purple-300 text-sm">Start tracking your progress →</span>
          </div>
        </div>
      </Link>

      {/* Community Stats */}
      <section className="grid grid-cols-3 gap-4 mb-10">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-white">42</p>
          <p className="text-slate-400 text-sm">Detailed Guides</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-emerald-400">8.2k+</p>
          <p className="text-slate-400 text-sm">Community Members</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-white">24/7</p>
          <p className="text-slate-400 text-sm">Active Support</p>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="text-center pb-10">
        <p className="text-slate-400 mb-4">
          Built by expats, for expats. No more scattered Facebook groups or outdated blogs.
        </p>
        <div className="flex justify-center gap-4">
          <Link 
            to="/town-hall"
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Join the Community
          </Link>
          <a 
            href="https://github.com/DrexId/expat-village"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Contribute
          </a>
        </div>
      </section>
    </div>
  )
}

export default Home
