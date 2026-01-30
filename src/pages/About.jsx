// src/pages/About.jsx
// EXPAT VILLAGE - About Page
// "The Story Behind the Village"

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function About() {
  const { isAuthenticated, openAuthModal } = useAuth()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const values = [
    {
      icon: '🤝',
      title: 'By Expats, For Expats',
      description: 'Every feature is built by people who\'ve felt the frustration. We\'re not outsiders guessing what you need.'
    },
    {
      icon: '💜',
      title: 'Community First',
      description: 'Real reviews from real people. No paid placements. No fake ratings. Just expats helping expats.'
    },
    {
      icon: '🔒',
      title: 'Privacy Matters',
      description: 'Your data is yours. We don\'t sell it, share it, or mine it. Period.'
    },
    {
      icon: '🌍',
      title: 'Inclusive by Design',
      description: 'Whether you\'re a student, professional, or retiree—from any country—this is your village.'
    },
  ]

  const milestones = [
    { year: '2024', event: 'Idea born from personal frustration in Warsaw' },
    { year: '2025', event: 'First version launched with 42 guides' },
    { year: '2025', event: 'AI Contract Analyzer goes live' },
    { year: 'Now', event: '8,000+ expats in the village' },
    { year: 'Next', event: 'Expanding to Kraków, Wrocław, Gdańsk' },
  ]

  return (
    <div className={`min-h-screen transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <div className={`transition-all duration-700 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="inline-block bg-gradient-to-r from-purple-500/20 to-amber-500/20 border border-purple-500/30 rounded-full px-4 py-1 text-sm font-medium text-purple-300 mb-6">
              Our Story
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              We Built What We<br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
                Wished Existed
              </span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
              Expat Village wasn't built in a boardroom. It was built from frustration, 
              late nights googling "how to PESEL", and asking the same questions in 
              Facebook groups that had been answered 47 times before.
            </p>
          </div>
        </div>
      </section>

      {/* The Story Section */}
      <section className="py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image/Visual */}
          <div className={`transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-amber-500/20 rounded-3xl blur-2xl" />
              <div className="relative bg-gradient-to-br from-[#1A1625] to-[#221E2D] border border-purple-500/30 rounded-3xl p-8 md:p-12">
                <div className="text-6xl mb-6">🇵🇱</div>
                <div className="space-y-4 text-gray-400">
                  <p className="flex items-start gap-3">
                    <span className="text-purple-400 mt-1">→</span>
                    <span>Landed in Warsaw with two suitcases and zero Polish</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <span className="text-purple-400 mt-1">→</span>
                    <span>Spent 3 weeks trying to open a bank account</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <span className="text-purple-400 mt-1">→</span>
                    <span>Signed a rental contract I couldn't fully understand</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <span className="text-purple-400 mt-1">→</span>
                    <span>Got lost in ZUS bureaucracy for months</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <span className="text-amber-400 mt-1">✓</span>
                    <span className="text-white font-medium">Decided no one else should go through this alone</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Text */}
          <div className={`transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              The Frustration That Started It All
            </h2>
            <div className="space-y-4 text-gray-400 leading-relaxed">
              <p>
                When I moved to Poland, I thought the hardest part would be the language. 
                I was wrong. The hardest part was <span className="text-white">not knowing what I didn't know</span>.
              </p>
              <p>
                Every simple task became an odyssey. Opening a bank account? Five rejected 
                applications before I found one that worked. Finding an apartment? Nearly signed 
                a contract with illegal clauses because I couldn't read the fine print.
              </p>
              <p>
                I joined every Facebook group. Asked questions. Got conflicting answers. 
                Found advice from 2019 that was completely outdated. Watched my questions 
                disappear into the void of endless posts.
              </p>
              <p className="text-white font-medium">
                There had to be a better way. So we built it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className={`text-center max-w-3xl mx-auto transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Our Mission</h2>
          <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-8">
            To make moving to Poland feel less like <span className="text-purple-400">surviving</span> and 
            more like <span className="text-amber-400">thriving</span>.
          </p>
          <div className="bg-gradient-to-r from-purple-900/30 via-[#1A1625] to-amber-900/30 border border-purple-500/20 rounded-2xl p-8">
            <p className="text-gray-400 text-lg italic">
              "We want Expat Village to be the first thing you open when you move to Poland. 
              Not Google. Not Facebook. <span className="text-white not-italic">Us.</span> Because we're not 
              giving you articles to read—we're giving you <span className="text-purple-400 not-italic">tools to use</span> and 
              <span className="text-amber-400 not-italic"> people to meet</span>."
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What We Stand For</h2>
          <p className="text-gray-500">The principles that guide everything we build</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {values.map((value, index) => (
            <div 
              key={value.title}
              className={`group bg-gradient-to-br from-[#1A1625] to-[#221E2D] border border-purple-500/20 hover:border-purple-500/40 rounded-2xl p-8 transition-all duration-300 hover:scale-[1.02] ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${400 + index * 100}ms` }}
            >
              <div className="text-4xl mb-4">{value.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                {value.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Journey</h2>
          <p className="text-gray-500">From idea to 8,000+ expats</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500 via-amber-500 to-purple-500/50" />
            
            {/* Timeline Items */}
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div 
                  key={index}
                  className={`flex gap-6 items-start transition-all duration-700 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
                  style={{ transitionDelay: `${600 + index * 100}ms` }}
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-sm font-bold shrink-0 ${
                    milestone.year === 'Now' 
                      ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-black' 
                      : milestone.year === 'Next'
                      ? 'bg-gradient-to-br from-purple-600 to-purple-700 text-white border border-purple-400/50'
                      : 'bg-[#221E2D] text-purple-400 border border-purple-500/30'
                  }`}>
                    {milestone.year}
                  </div>
                  <div className="pt-4">
                    <p className="text-white font-medium">{milestone.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-16">
        <div className="bg-gradient-to-br from-[#1A1625] to-[#0F0D1A] border border-purple-500/20 rounded-3xl p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
            Why We're Different
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">📚</div>
              <h3 className="text-lg font-bold text-white mb-2">Other Sites</h3>
              <p className="text-gray-500 text-sm">Static articles from 2019. Generic advice. No community.</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">💬</div>
              <h3 className="text-lg font-bold text-white mb-2">Facebook Groups</h3>
              <p className="text-gray-500 text-sm">Same questions daily. Answers buried. Chaos.</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🏘️</div>
              <h3 className="text-lg font-bold text-amber-400 mb-2">Expat Village</h3>
              <p className="text-gray-300 text-sm">AI tools. Real-time reviews. Living community. Actually useful.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Built by Real Expats</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            We're not a faceless corporation. We're expats who've been through it all 
            and decided to build something better.
          </p>
        </div>

        <div className="flex justify-center">
          <div className="bg-gradient-to-br from-[#1A1625] to-[#221E2D] border border-purple-500/30 rounded-3xl p-8 max-w-sm text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-amber-500 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
              👨‍💻
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Jude</h3>
            <p className="text-purple-400 text-sm mb-4">Founder & Builder</p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Nigerian expat in Warsaw. Built Expat Village because he got tired of 
              scrolling through Facebook groups at 2am looking for answers that didn't exist.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900/50 via-[#1A1625] to-amber-900/30 border border-purple-500/30 p-8 md:p-12 text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Join 8,000+ Expats Who've Found Their Village
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Stop surviving. Start thriving. Your Poland journey starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link
                  to="/"
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25"
                >
                  Explore the Village
                </Link>
              ) : (
                <button
                  onClick={() => openAuthModal('sign_up')}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 hover:shadow-xl hover:shadow-amber-500/25"
                >
                  Join Free — No Credit Card
                </button>
              )}
              <Link
                to="/contact"
                className="border border-purple-500/50 hover:border-purple-500 text-white px-8 py-4 rounded-xl font-semibold transition-all hover:bg-purple-500/10"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <section className="text-center pb-8 pt-8">
        <p className="text-gray-600 text-sm">
          Made with 💜 in Warsaw, Poland
        </p>
      </section>
    </div>
  )
}

export default About
