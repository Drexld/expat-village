// src/pages/About.jsx
// EXPAT VILLAGE - About Page - Warm cinematic story

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
    <div className={`min-h-screen text-terra-ink transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/4 left-1/4 w-[520px] h-[520px] rounded-full blur-[140px]"
          style={{ background: 'rgba(199,107,85,0.12)' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[420px] h-[420px] rounded-full blur-[120px]"
          style={{ background: 'rgba(117,153,124,0.14)' }}
        />
      </div>

      <div className="relative z-10 space-y-16">
        <section className="pt-10 text-center">
          <div className={`mx-auto max-w-3xl transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <span className="inline-block glass-chip rounded-full px-5 py-2 text-sm font-semibold text-terra-ink-soft mb-6">
              Our Story
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight mb-6">
              We Built What We<br />
              <span className="bg-gradient-to-r from-[#C76B55] via-[#D7A27A] to-[#75997C] bg-clip-text text-transparent">
                Wished Existed
              </span>
            </h1>
            <p className="text-terra-ink-soft text-lg md:text-xl leading-relaxed">
              Expat Village wasn't built in a boardroom. It was built from frustration,
              late nights googling "how to PESEL", and asking the same questions in
              Facebook groups that had been answered 47 times before.
            </p>
          </div>
        </section>

        <section>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <div className="hero-card texture-layer texture-paper texture-amber">
                <Icon name="globe" className="w-12 h-12 text-terra-ink mb-6" />
                <div className="space-y-4 text-terra-ink-soft">
                  <p className="flex items-start gap-3">
                    <Icon name="arrowRight" className="w-4 h-4 text-terra-taupe mt-1" />
                    <span>Landed in Warsaw with two suitcases and zero Polish</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <Icon name="arrowRight" className="w-4 h-4 text-terra-taupe mt-1" />
                    <span>Spent 3 weeks trying to open a bank account</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <Icon name="arrowRight" className="w-4 h-4 text-terra-taupe mt-1" />
                    <span>Signed a rental contract I couldn't fully understand</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <Icon name="arrowRight" className="w-4 h-4 text-terra-taupe mt-1" />
                    <span>Got lost in ZUS bureaucracy for months</span>
                  </p>
                  <p className="flex items-start gap-3 mt-6">
                    <Icon name="success" className="w-4 h-4 text-terra-primary mt-1" />
                    <span className="text-terra-ink font-semibold">Decided no one else should go through this alone</span>
                  </p>
                </div>
              </div>
            </div>

            <div className={`transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <h2 className="text-3xl md:text-4xl font-extrabold text-terra-ink mb-6">
                The Frustration That Started It All
              </h2>
              <div className="space-y-4 text-terra-ink-soft leading-relaxed">
                <p>
                  When I moved to Poland, I thought the hardest part would be the language.
                  I was wrong. The hardest part was <span className="text-terra-ink font-medium">not knowing what I didn't know</span>.
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
                <p className="text-terra-ink font-semibold text-lg">
                  There had to be a better way. So we built it.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-terra-ink mb-6">Our Mission</h2>
            <p className="text-xl md:text-2xl text-terra-ink-soft leading-relaxed mb-8">
              To make moving to Poland feel less like <span className="text-terra-ink">surviving</span> and
              more like <span className="text-terra-ink">thriving</span>.
            </p>
            <div className="action-card texture-layer texture-paper">
              <p className="text-terra-ink-soft text-lg italic">
                "We want Expat Village to be the first thing you open when you move to Poland.
                Not Google. Not Facebook. <span className="text-terra-ink not-italic font-medium">Us.</span> Because we're not
                giving you articles to read - we're giving you <span className="text-terra-ink not-italic font-medium">tools to use</span> and
                <span className="text-terra-ink not-italic font-medium"> people to meet</span>."
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-terra-ink mb-4">What We Stand For</h2>
            <p className="text-terra-taupe">The principles that guide everything we build</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <div
                key={value.title}
                className={`group action-card texture-layer texture-paper transition-all duration-500 hover:scale-[1.02] ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${300 + index * 100}ms` }}
              >
                <Icon name={value.icon} className="w-8 h-8 text-terra-ink mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-terra-ink mb-3 transition-colors">
                  {value.title}
                </h3>
                <p className="text-terra-ink-soft leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-terra-ink mb-4">Our Journey</h2>
            <p className="text-terra-taupe">From idea to 8,000+ expats</p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-black/20 via-black/10 to-transparent" />

              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div
                    key={index}
                    className={`flex gap-6 items-start transition-all duration-700 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                    style={{ transitionDelay: `${500 + index * 100}ms` }}
                  >
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-sm font-bold shrink-0 ${
                      milestone.active
                        ? 'glass-3d text-terra-ink'
                        : milestone.year === 'Next'
                        ? 'glass-panel text-terra-ink'
                        : 'glass-panel text-terra-ink-soft'
                    }`}>
                      {milestone.year}
                    </div>
                    <div className="pt-4">
                      <p className={`font-medium ${milestone.active ? 'text-terra-ink' : 'text-terra-ink-soft'}`}>
                        {milestone.event}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="hero-card texture-layer texture-paper">
            <h2 className="text-3xl md:text-4xl font-extrabold text-terra-ink mb-10 text-center">
              Why We're Different
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <Icon name="document" className="w-10 h-10 text-terra-ink mx-auto mb-4" />
                <h3 className="text-lg font-bold text-terra-ink mb-2">Other Sites</h3>
                <p className="text-terra-taupe text-sm">Static articles from 2019. Generic advice. No community.</p>
              </div>
              <div className="text-center">
                <Icon name="community" className="w-10 h-10 text-terra-ink mx-auto mb-4" />
                <h3 className="text-lg font-bold text-terra-ink mb-2">Facebook Groups</h3>
                <p className="text-terra-taupe text-sm">Same questions daily. Answers buried. Chaos.</p>
              </div>
              <div className="text-center relative">
                <div className="absolute -inset-4 bg-terra-cream/70 rounded-2xl" />
                <div className="relative">
                  <Icon name="home" className="w-10 h-10 text-terra-ink mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-terra-ink mb-2">Expat Village</h3>
                  <p className="text-terra-ink-soft text-sm">AI tools. Real-time reviews. Living community. Actually useful.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-terra-ink mb-4">Built by Real Expats</h2>
            <p className="text-terra-taupe max-w-2xl mx-auto">
              We're not a faceless corporation. We're expats who've been through it all.
            </p>
          </div>

          <div className="flex justify-center">
            <div className="hero-card texture-layer texture-paper text-center max-w-sm">
              <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center shadow-glass glass-3d">
                <Icon name="user" className="w-10 h-10 text-terra-ink" />
              </div>
              <h3 className="text-xl font-bold text-terra-ink mb-1">Jude</h3>
              <p className="text-terra-ink-soft text-sm font-medium mb-4">Founder & Builder</p>
              <p className="text-terra-ink-soft text-sm leading-relaxed">
                Nigerian expat in Warsaw. Built Expat Village because he got tired of
                scrolling through Facebook groups at 2am looking for answers that didn't exist.
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="hero-card texture-layer texture-amber text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-terra-ink mb-5">
              Join 8,000+ Expats Who've Found Their Village
            </h2>
            <p className="text-terra-ink-soft text-lg mb-8 max-w-xl mx-auto">
              Stop surviving. Start thriving. Your Poland journey starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link
                  to="/"
                  className="text-terra-bg px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover-tilt"
                  style={{ background: 'linear-gradient(135deg, #C76B55, #D07C63)' }}
                >
                  Explore the Village
                </Link>
              ) : (
                <button
                  onClick={() => openAuthModal('sign_up')}
                  className="text-terra-bg px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover-tilt"
                  style={{ background: 'linear-gradient(135deg, #C76B55, #D07C63)' }}
                >
                  Join Free - No Credit Card
                </button>
              )}
              <a
                href="mailto:hello@expatvillage.com"
                className="border border-black/10 text-terra-ink px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:bg-terra-cream"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </section>

        <section className="text-center pb-8">
          <p className="text-terra-taupe text-sm">Made in Warsaw, Poland</p>
        </section>
      </div>
    </div>
  )
}

export default About
