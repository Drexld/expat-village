// src/pages/Home.jsx
// Warm, grounded home experience

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getWarsawWeather } from '../services/weather'
import MorningBriefing from '../components/MorningBriefing'
import Announcements from '../components/Announcements'
import Icon from '../components/Icon'

const PATHS = [
  { icon: 'mailbox', label: 'Get set up', detail: 'Step-by-step essentials', path: '/get-things-done' },
  { icon: 'mapRoute', label: 'Find a place', detail: 'Housing and neighborhoods', path: '/housing' },
  { icon: 'handshake', label: 'Meet people', detail: 'Community rooms', path: '/town-hall' },
]

const QUICK_ACTIONS = [
  { icon: 'checklist', label: 'My Checklist', cta: 'Continue', path: '/my-checklist' },
  { icon: 'community', label: 'Town Hall', cta: 'Join room', path: '/town-hall' },
  { icon: 'pin', label: 'Directory', cta: 'Explore', path: '/directory' },
]

const COMMUNITY_SPARKS = [
  { icon: 'alert', label: 'Tax Q&A live now', helper: 'Drop in and ask' },
  { icon: 'home', label: 'New listing in Mokotow', helper: '12 min ago' },
  { icon: 'spark', label: 'Warsaw Daily mood', helper: '68% say brutal' },
]

function Home() {
  const { isAuthenticated, openAuthModal, profile } = useAuth()
  const navigate = useNavigate()
  const [weatherData, setWeatherData] = useState({ state: 'cloudy', temp: 8, condition: 'Partly cloudy', icon: 'cloud' })
  const [showMorningBriefing, setShowMorningBriefing] = useState(false)
  const points = profile?.points || profile?.reward_points || 1280

  useEffect(() => {
    async function fetchWeather() {
      const data = await getWarsawWeather()
      setWeatherData(data)
    }
    fetchWeather()
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      const todayKey = new Date().toLocaleDateString('en-CA')
      const storageKey = `expat_morning_briefing_seen_${todayKey}`
      const hasSeenBriefing = localStorage.getItem(storageKey)
      if (!hasSeenBriefing) {
        const timer = setTimeout(() => setShowMorningBriefing(true), 600)
        return () => clearTimeout(timer)
      }
    }
  }, [isAuthenticated])

  const handleCloseMorningBriefing = () => {
    setShowMorningBriefing(false)
    const todayKey = new Date().toLocaleDateString('en-CA')
    const storageKey = `expat_morning_briefing_seen_${todayKey}`
    localStorage.setItem(storageKey, 'true')
  }

  return (
    <div className="min-h-screen space-y-8 pb-6">
      {isAuthenticated ? (
        <>
          <section className="hero-card texture-layer texture-paper texture-amber texture-ripple glass-sheen motion-rise">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-terra-taupe">Your Village Brief</p>
                <h1 className="text-2xl font-display text-terra-ink mt-1">Good day, neighbor.</h1>
                <p className="text-sm text-terra-ink-soft mt-2">
                  Warsaw is {weatherData.condition}. Tap for your morning briefing.
                </p>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center gap-2 pill pill-accent">
                  <Icon name={weatherData.icon} className="w-4 h-4 text-terra-ink" />
                  <span className="text-sm font-semibold text-terra-ink">{weatherData.temp}C</span>
                </div>
                <p className="text-xs text-terra-taupe mt-2">Village points</p>
                <p className="text-sm font-semibold text-terra-ink">{points.toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="pill pill-accent">City mood: cozy</span>
              <span className="pill pill-accent">Tonight: warm spots</span>
            </div>
            <button
              onClick={() => setShowMorningBriefing(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-terra-bg shadow-glass hover-tilt"
              style={{ background: 'linear-gradient(135deg, #C76B55, #D07C63)' }}
            >
              Open briefing
              <Icon name="arrowRight" className="w-4 h-4 text-terra-bg" />
            </button>
          </section>

          <section className="hero-card texture-layer texture-paper texture-photo glass-sheen motion-rise" style={{ '--rise-delay': '0.08s' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="glass-3d flex h-12 w-12 items-center justify-center rounded-2xl">
                <Icon name="checklist" className="w-6 h-6 text-terra-ink" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-terra-taupe">Settle In, Step by Step</p>
                <h2 className="text-xl font-semibold text-terra-ink">Your Action Plan</h2>
              </div>
            </div>
            <p className="text-sm text-terra-ink-soft">
              Keep it simple. One clear next step at a time.
            </p>
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-terra-taupe mb-2">
                <span>Weekly momentum</span>
                <span>2 of 5 done</span>
              </div>
              <div className="h-2 rounded-full bg-terra-cream">
                <div className="h-2 rounded-full" style={{ width: '40%', background: '#C76B55' }} />
              </div>
            </div>
            <button
              onClick={() => navigate('/get-things-done')}
              className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-terra-bg hover-tilt"
              style={{ background: 'linear-gradient(135deg, #C76B55, #D07C63)' }}
            >
              Open action plan
              <Icon name="arrowRight" className="w-4 h-4 text-terra-bg" />
            </button>
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-semibold text-terra-ink accent-sweep">Your Daily Brief</h3>
              <span className="text-xs text-terra-taupe">Fresh from the village</span>
            </div>
            <Announcements />
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-semibold text-terra-ink accent-sweep">Community Highlights</h3>
              <button
                onClick={() => navigate('/town-hall')}
                className="text-xs text-terra-primary font-semibold"
              >
                Visit Town Hall
              </button>
            </div>
            <div className="grid gap-3">
              {COMMUNITY_SPARKS.map((item, index) => (
                <button
                  key={item.label}
                  onClick={() => navigate('/town-hall')}
                  className="action-card texture-layer texture-paper texture-brick hover-tilt text-left motion-rise"
                  style={{ '--rise-delay': `${0.05 + index * 0.06}s` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="glass-panel flex h-10 w-10 items-center justify-center rounded-2xl">
                      <Icon name={item.icon} className="w-5 h-5 text-terra-ink" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-terra-ink">{item.label}</p>
                      <p className="text-xs text-terra-taupe">{item.helper}</p>
                    </div>
                    {index === 0 && (
                      <span className="ml-auto text-xs font-semibold text-terra-primary">Live</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-terra-ink px-1 accent-sweep">Quick steps</h3>
            <div className="grid gap-3">
              {QUICK_ACTIONS.map((action, index) => (
                <button
                  key={action.label}
                  onClick={() => navigate(action.path)}
                  className="action-card texture-layer texture-paper hover-tilt flex items-center justify-between gap-3 text-left motion-rise"
                  style={{ '--rise-delay': `${0.04 + index * 0.06}s` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="glass-panel flex h-10 w-10 items-center justify-center rounded-2xl">
                      <Icon name={action.icon} className="w-5 h-5 text-terra-ink" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-terra-ink">{action.label}</p>
                      <p className="text-xs text-terra-taupe">Make progress today</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-terra-primary inline-flex items-center gap-1">
                    {action.cta}
                    <Icon name="arrowRight" className="w-3.5 h-3.5" />
                  </span>
                </button>
              ))}
            </div>
          </section>
        </>
      ) : (
        <>
          <section className="hero-card texture-layer texture-paper texture-amber text-center motion-rise glass-sheen">
            <p className="text-xs uppercase tracking-widest text-terra-taupe">The Digital Neighborhood</p>
            <h1 className="text-3xl font-display text-terra-ink mt-2">
              A concierge in your pocket.
            </h1>
            <p className="text-sm text-terra-ink-soft mt-3">
              Warm, local guidance for expats settling in Warsaw and beyond.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <span className="pill pill-accent">Warsaw - Live</span>
              <span className="pill pill-accent">{weatherData.temp}C today</span>
            </div>
            <button
              onClick={() => openAuthModal('sign_up')}
              className="mt-5 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-terra-bg hover-tilt"
              style={{ background: 'linear-gradient(135deg, #C76B55, #D07C63)' }}
            >
              Join the village
              <Icon name="arrowRight" className="w-4 h-4 text-terra-bg" />
            </button>
          </section>

          <section className="space-y-3 section-backdrop motion-rise" style={{ '--rise-delay': '0.08s' }}>
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-semibold text-terra-ink accent-sweep">Choose your path</h3>
              <span className="text-xs text-terra-taupe">Start simple</span>
            </div>
            <div className="grid gap-3">
              {PATHS.map((path, index) => (
                <button
                  key={path.label}
                  onClick={() => openAuthModal('sign_up')}
                  className="action-card texture-layer texture-paper hover-tilt text-left motion-rise"
                  style={{ '--rise-delay': `${0.06 + index * 0.06}s` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="glass-panel flex h-10 w-10 items-center justify-center rounded-2xl">
                      <Icon name={path.icon} className="w-5 h-5 text-terra-ink" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-terra-ink">{path.label}</p>
                      <p className="text-xs text-terra-taupe">{path.detail}</p>
                    </div>
                    <Icon name="arrowRight" className="ml-auto w-4 h-4 text-terra-primary" />
                  </div>
                </button>
              ))}
            </div>
          </section>
        </>
      )}

      {showMorningBriefing && (
        <MorningBriefing
          weatherData={weatherData}
          onClose={handleCloseMorningBriefing}
        />
      )}
    </div>
  )
}

export default Home
