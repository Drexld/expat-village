// src/pages/About.jsx
// EXPAT VILLAGE - About Page - The Story

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function About() {
  const { isAuthenticated, openAuthModal } = useAuth()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100)
  }, [])

  const values = [
    { icon: '🤝', title: 'By Expats, For Expats', description: "Every feature is built by people who've felt the frustration. We're not outsiders guessing what you need." },
    { icon: '💜', title: 'Community First', description: 'Real reviews from real people. No paid placements. No fake ratings. Just expats helping expats.' },
    { icon: '🔒', title: 'Privacy Matters', description: "Your data is yours. We don't sell it, share it, or mine it. Period." },
    { icon: '🌍', title: 'Inclusive by Design', description: "Whether you're a student, professional, or retiree—from any country—this is your village." },
  ]

  const milestones = [
    { year: '2024', event: 'Idea born from personal frustration in Warsaw', active: false },
    { year: '2025', event: 'First version launched with 42 guides', active: false },
    { year: '2025', event: 'AI Contract Analyzer goes live', active: false },
    { year: 'Now', event: '8,000+ expats in the village', active: true },
    { year: 'Next', event: 'Expanding to Kraków, Wrocław, Gdańsk', active: false },
  ]

  return (
    <div className={`min-h-screen transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10">
        
        {/* ===== HERO ===== */}
        <section className="py-16 text-center">
          <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <span className="inline-block bg-violet-500/20 border border-violet-500/30 rounded-full px-5 py-2 text-sm font-semibold text-violet-300 mb-6">
              Our Story
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              We Built What We<br />
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-400 bg-clip-text text-transparent">
                Wished Existed
              </span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Expat Village wasn't built in a boardroom. It was built from frustration, 
              late nights googling "how to PESEL", and asking the same questions in 
              Facebook groups that had been answered 47 times before.
            </p>
          </div>
        </section>

        {/* ===== THE STORY ===== */}
        <section className="py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            {/* Visual Card */}
            <div className={`transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-br from-violet-600/30 to-amber-500/20 rounded-3xl blur-2xl" />
                <div className="relative bg-slate-900/80 border border-violet-500/30 rounded-3xl p-8 md:p-10">
                  <div className="text-6xl mb-6">🇵🇱</div>
                  <div className="space-y-4 text-slate-400">
                    <p className="flex items-start gap-3">
                      <span className="text-violet-400 mt-1">→</span>
                      <span>Landed in Warsaw with two suitcases and zero Polish</span>
                    </p>
                    <p className="flex items-start gap-3">
                      <span className="text-violet-400 mt-1">→</span>
                      <span>Spent 3 weeks trying to open a bank account</span>
                    </p>
                    <p className="flex items-start gap-3">
                      <span className="text-violet-400 mt-1">→</span>
                      <span>Signed a rental contract I couldn't fully understand</span>
                    </p>
                    <p className="flex items-start gap-3">
                      <span className="text-violet-400 mt-1">→</span>
                      <span>Got lost in ZUS bureaucracy for months</span>
                    </p>
                    <p className="flex items-start gap-3 mt-6">
                      <span className="text-amber-400 mt-1">✓</span>
                      <span className="text-white font-semibold">Decided no one else should go through this alone</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Text */}
            <div className={`transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
                The Frustration That Started It All
              </h2>
              <div className="space-y-4 text-slate-400 leading-relaxed">
                <p>
                  When I moved to Poland, I thought the hardest part would be the language. 
                  I was wrong. The hardest part was <span className="text-white font-medium">not knowing what I didn't know</span>.
                </p>
                <p>
                  Every simple task became an odyssey. Opening a bank account? Five rejected 
                  applications before I found one that worked. Finding an apartment? Nearly signed 
                  a contract with illegal clauses because I couldn't read the fine print.
                </p>
                <p>
                  I joined every Facebook group. Asked questions. Got conflicting answers. 
                  Found advice from 2019 that was completely outdated.
                </p>
                <p className="text-white font-semibold text-lg">
                  There had to be a better way. So we built it.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== MISSION ===== */}
        <section className="py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">Our Mission</h2>
            <p className="text-xl md:text-2xl text-slate-300 leading-relaxed mb-8">
              To make moving to Poland feel less like <span className="text-violet-400">surviving</span> and 
              more like <span className="text-amber-400">thriving</span>.
            </p>
            <div className="bg-gradient-to-r from-violet-900/40 via-slate-900 to-amber-900/30 border border-violet-500/20 rounded-2xl p-8">
              <p className="text-slate-400 text-lg italic">
                "We want Expat Village to be the first thing you open when you move to Poland. 
                Not Google. Not Facebook. <span className="text-white not-italic font-medium">Us.</span> Because we're not 
                giving you articles to read—we're giving you <span className="text-violet-400 not-italic font-medium">tools to use</span> and 
                <span className="text-amber-400 not-italic font-medium"> people to meet</span>."
              </p>
            </div>
          </div>
        </section>

        {/* ===== VALUES ===== */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">What We Stand For</h2>
            <p className="text-slate-500">The principles that guide everything we build</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <div 
                key={value.title}
                className={`group bg-slate-900/60 border border-violet-500/20 hover:border-violet-500/40 rounded-2xl p-8 transition-all duration-500 hover:scale-[1.02] ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${400 + index * 100}ms` }}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{value.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-violet-300 transition-colors">
                  {value.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== TIMELINE ===== */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Our Journey</h2>
            <p className="text-slate-500">From idea to 8,000+ expats</p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-500 via-amber-500 to-violet-500/30" />
              
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div 
                    key={index}
                    className={`flex gap-6 items-start transition-all duration-700 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                    style={{ transitionDelay: `${600 + index * 100}ms` }}
                  >
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-sm font-bold shrink-0 ${
                      milestone.active 
                        ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-slate-900 shadow-lg shadow-amber-500/30' 
                        : milestone.year === 'Next'
                        ? 'bg-violet-600/30 text-violet-300 border border-violet-500/50'
                        : 'bg-slate-800 text-slate-400 border border-violet-500/20'
                    }`}>
                      {milestone.year}
                    </div>
                    <div className="pt-4">
                      <p className={`font-medium ${milestone.active ? 'text-amber-400' : 'text-white'}`}>
                        {milestone.event}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== COMPARISON ===== */}
        <section className="py-16">
          <div className="bg-slate-900/60 border border-violet-500/20 rounded-3xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-10 text-center">
              Why We're Different
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl mb-4">📚</div>
                <h3 className="text-lg font-bold text-white mb-2">Other Sites</h3>
                <p className="text-slate-500 text-sm">Static articles from 2019. Generic advice. No community.</p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">💬</div>
                <h3 className="text-lg font-bold text-white mb-2">Facebook Groups</h3>
                <p className="text-slate-500 text-sm">Same questions daily. Answers buried. Chaos.</p>
              </div>
              <div className="text-center relative">
                <div className="absolute -inset-4 bg-violet-500/10 rounded-2xl" />
                <div className="relative">
                  <div className="text-5xl mb-4">🏘️</div>
                  <h3 className="text-lg font-bold text-amber-400 mb-2">Expat Village</h3>
                  <p className="text-slate-300 text-sm">AI tools. Real-time reviews. Living community. Actually useful.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== TEAM ===== */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Built by Real Expats</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              We're not a faceless corporation. We're expats who've been through it all.
            </p>
          </div>

          <div className="flex justify-center">
            <div className="bg-slate-900/80 border border-violet-500/30 rounded-3xl p-8 max-w-sm text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-violet-600 to-amber-500 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl shadow-lg shadow-violet-500/20">
                👨‍💻
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Jude</h3>
              <p className="text-violet-400 text-sm font-medium mb-4">Founder & Builder</p>
              <p className="text-slate-400 text-sm leading-relaxed">
                Nigerian expat in Warsaw. Built Expat Village because he got tired of 
                scrolling through Facebook groups at 2am looking for answers that didn't exist.
              </p>
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="py-16">
          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-900/60 via-slate-900 to-amber-900/40" />
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl" />
            
            <div className="relative border border-violet-500/30 rounded-3xl p-10 md:p-14 text-center">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-5">
                Join 8,000+ Expats Who've Found Their Village
              </h2>
              <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
                Stop surviving. Start thriving. Your Poland journey starts here.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {isAuthenticated ? (
                  <Link
                    to="/"
                    className="bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-500 hover:to-violet-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-violet-500/30"
                  >
                    Explore the Village
                  </Link>
                ) : (
                  <button
                    onClick={() => openAuthModal('sign_up')}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-amber-500/30"
                  >
                    Join Free — No Credit Card
                  </button>
                )}
                <a
                  href="mailto:hello@expatvillage.com"
                  className="border-2 border-violet-500/50 hover:border-violet-400 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:bg-violet-500/10"
                >
                  Get in Touch
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Note */}
        <section className="text-center pb-8 pt-8">
          <p className="text-slate-600 text-sm">Made with 💜 in Warsaw, Poland</p>
        </section>
      </div>
    </div>
  )
}

export default About
