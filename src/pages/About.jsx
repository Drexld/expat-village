// src/pages/About.jsx
// EXPAT VILLAGE - About Page - The Story

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Icon from '../components/Icon'

function About() {
  const { isAuthenticated, openAuthModal } = useAuth()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100)
  }, [])

  const values = [
    { icon: 'community', title: 'By Expats, For Expats', description: "Every feature is built by people who've felt the frustration. We're not outsiders guessing what you need." },
    { icon: 'heart', title: 'Community First', description: 'Real reviews from real people. No paid placements. No fake ratings. Just expats helping expats.' },
    { icon: 'shield', title: 'Privacy Matters', description: "Your data is yours. We don't sell it, share it, or mine it. Period." },
    { icon: 'globe', title: 'Inclusive by Design', description: "Whether you're a student, professional, or retiree-from any country-this is your village." },
  ]

  const milestones = [
    { year: '2024', event: 'Idea born from personal frustration in Warsaw', active: false },
    { year: '2025', event: 'First version launched with 42 guides', active: false },
    { year: '2025', event: 'AI Contract Analyzer goes live', active: false },
    { year: 'Now', event: '8,000+ expats in the village', active: true },
    { year: 'Next', event: 'Expanding to Krakow, Wroclaw, Gdansk', active: false },
  ]

  return (
    <div className={`min-h-screen transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px]"
          style={{ background: 'rgba(242,166,90,0.16)' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px]"
          style={{ background: 'rgba(242,143,123,0.14)' }}
        />
      </div>

      <div className="relative z-10">
        
        {/* ===== HERO ===== */}
        <section className="py-16 text-center">
          <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <span className="inline-block glass-chip rounded-full px-5 py-2 text-sm font-semibold text-slate-200 mb-6">
              Our Story
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              We Built What We<br />
              <span className="bg-gradient-to-r from-[#f2a65a] via-[#f6c38f] to-[#f28f7b] bg-clip-text text-transparent">
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
                <div className="absolute -inset-2 rounded-3xl blur-2xl opacity-40" style={{ background: 'linear-gradient(135deg, rgba(242,166,90,0.4), rgba(242,143,123,0.25))' }} />
                <div className="relative glass-strong rounded-3xl p-8 md:p-10">
                  <Icon name="globe" className="w-12 h-12 text-slate-200 mb-6" />
                  <div className="space-y-4 text-slate-400">
                    <p className="flex items-start gap-3">
                      <Icon name="arrowRight" className="w-4 h-4 text-slate-300 mt-1" />
                      <span>Landed in Warsaw with two suitcases and zero Polish</span>
                    </p>
                    <p className="flex items-start gap-3">
                      <Icon name="arrowRight" className="w-4 h-4 text-slate-300 mt-1" />
                      <span>Spent 3 weeks trying to open a bank account</span>
                    </p>
                    <p className="flex items-start gap-3">
                      <Icon name="arrowRight" className="w-4 h-4 text-slate-300 mt-1" />
                      <span>Signed a rental contract I couldn't fully understand</span>
                    </p>
                    <p className="flex items-start gap-3">
                      <Icon name="arrowRight" className="w-4 h-4 text-slate-300 mt-1" />
                      <span>Got lost in ZUS bureaucracy for months</span>
                    </p>
                    <p className="flex items-start gap-3 mt-6">
                      <Icon name="success" className="w-4 h-4 text-slate-200 mt-1" />
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
              To make moving to Poland feel less like <span className="text-slate-200">surviving</span> and 
              more like <span className="text-slate-200">thriving</span>.
            </p>
            <div className="glass-panel rounded-2xl p-8">
              <p className="text-slate-400 text-lg italic">
                "We want Expat Village to be the first thing you open when you move to Poland. 
                Not Google. Not Facebook. <span className="text-white not-italic font-medium">Us.</span> Because we're not 
                giving you articles to read - we're giving you <span className="text-slate-200 not-italic font-medium">tools to use</span> and 
                <span className="text-slate-200 not-italic font-medium"> people to meet</span>."
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
                className={`group glass-panel rounded-2xl p-8 transition-all duration-500 hover:scale-[1.02] ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${400 + index * 100}ms` }}
              >
                <Icon name={value.icon} className="w-8 h-8 text-slate-200 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-white mb-3 transition-colors">
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
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-white/30 via-white/10 to-white/5" />
              
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div 
                    key={index}
                    className={`flex gap-6 items-start transition-all duration-700 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                    style={{ transitionDelay: `${600 + index * 100}ms` }}
                  >
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-sm font-bold shrink-0 ${
                      milestone.active 
                        ? 'glass-3d text-white' 
                        : milestone.year === 'Next'
                        ? 'glass-panel text-slate-200'
                        : 'glass-panel text-slate-400'
                    }`}>
                      {milestone.year}
                    </div>
                    <div className="pt-4">
                      <p className={`font-medium ${milestone.active ? 'text-white' : 'text-slate-200'}`}>
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
          <div className="glass-panel rounded-3xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-10 text-center">
              Why We're Different
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <Icon name="document" className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Other Sites</h3>
                <p className="text-slate-500 text-sm">Static articles from 2019. Generic advice. No community.</p>
              </div>
              <div className="text-center">
                <Icon name="community" className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Facebook Groups</h3>
                <p className="text-slate-500 text-sm">Same questions daily. Answers buried. Chaos.</p>
              </div>
              <div className="text-center relative">
                <div className="absolute -inset-4 bg-white/5 rounded-2xl" />
                <div className="relative">
                  <Icon name="home" className="w-10 h-10 text-slate-100 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">Expat Village</h3>
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
            <div className="glass-strong rounded-3xl p-8 max-w-sm text-center">
              <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg shadow-black/30 glass-3d">
                <Icon name="user" className="w-10 h-10 text-slate-100" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Jude</h3>
              <p className="text-slate-300 text-sm font-medium mb-4">Founder & Builder</p>
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
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(11,12,18,0.7), rgba(17,20,34,0.9))' }} />
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-30" style={{ background: 'rgba(242,166,90,0.25)' }} />
            <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl opacity-25" style={{ background: 'rgba(242,143,123,0.22)' }} />
            
            <div className="relative glass-strong rounded-3xl p-10 md:p-14 text-center">
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
                    className="glass-3d text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105"
                  >
                    Explore the Village
                  </Link>
                ) : (
                  <button
                    onClick={() => openAuthModal('sign_up')}
                    className="glass-3d text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105"
                  >
                    Join Free - No Credit Card
                  </button>
                )}
                <a
                  href="mailto:hello@expatvillage.com"
                  className="border border-white/20 hover:border-white/40 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:bg-white/5"
                >
                  Get in Touch
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Note */}
        <section className="text-center pb-8 pt-8">
          <p className="text-slate-600 text-sm">Made in Warsaw, Poland</p>
        </section>
      </div>
    </div>
  )
}

export default About

