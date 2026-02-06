// src/pages/Home.jsx
// Warm, grounded home experience

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getWarsawWeather } from '../services/weather'
import { getTownHallRooms } from '../services/townhall'
import { getDirectoryListings } from '../services/directory'
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

const TOTAL_CHECKLIST_TASKS = 23

function Home() {
  const { isAuthenticated, openAuthModal, profile } = useAuth()
  const navigate = useNavigate()
  const [weatherData, setWeatherData] = useState({ state: 'cloudy', temp: 8, condition: 'Partly cloudy', icon: 'cloud' })
  const [showMorningBriefing, setShowMorningBriefing] = useState(false)
  const [communitySparks, setCommunitySparks] = useState([])
  const [checklistDone, setChecklistDone] = useState(0)
  const [featuredListings, setFeaturedListings] = useState([])
  const points = profile?.points || profile?.reward_points || 0

  useEffect(() => {
    async function fetchHomeData() {
      const weather = await getWarsawWeather()
      setWeatherData(weather)

      // Fetch real community data
      const [roomsResult, listingsResult] = await Promise.all([
        getTownHallRooms(),
        getDirectoryListings('all')
      ])

      const sparks = []

      // Add active TownHall rooms
      if (roomsResult.data?.length > 0) {
        const topRooms = roomsResult.data.slice(0, 2)
        topRooms.forEach(room => {
          sparks.push({
            icon: 'community',
            label: room.title || room.name,
            helper: room.description?.substring(0, 30) || 'Join the conversation',
            path: '/town-hall',
            live: true
          })
        })
      }

      // Add latest directory listing
      if (listingsResult.data?.length > 0) {
        const latest = listingsResult.data[0]
        sparks.push({
          icon: 'pin',
          label: latest.name,
          helper: `${Number(latest.rating_average || 0).toFixed(1)} rating - ${latest.review_count || 0} reviews`,
          path: '/directory'
        })
      }

      // Fallback if no data
      if (sparks.length === 0) {
        sparks.push(
          { icon: 'community', label: 'Town Hall', helper: 'Join a conversation', path: '/town-hall' },
          { icon: 'pin', label: 'Directory', helper: 'Explore local places', path: '/directory' },
        )
      }

      if (listingsResult.data?.length > 0) {
        setFeaturedListings(listingsResult.data.slice(0, 3))
      }

      setCommunitySparks(sparks)
    }
    fetchHomeData()

    // Load checklist progress
    try {
      const saved = localStorage.getItem('expat-checklist')
      if (saved) {
        const parsed = JSON.parse(saved)
        setChecklistDone(Object.values(parsed).filter(Boolean).length)
      }
    } catch {
      // ignore
    }
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
                <span>Your progress</span>
                <span>{checklistDone} of {TOTAL_CHECKLIST_TASKS} done</span>
              </div>
              <div className="h-2 rounded-full bg-terra-cream">
                <div className="h-2 rounded-full" style={{ width: `${Math.round((checklistDone / TOTAL_CHECKLIST_TASKS) * 100)}%`, background: '#C76B55' }} />
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
              {communitySparks.map((item, index) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path || '/town-hall')}
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
                    {item.live && (
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

          {featuredListings.length > 0 && (
            <section className="space-y-3 motion-rise" style={{ '--rise-delay': '0.06s' }}>
              <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-semibold text-terra-ink accent-sweep">Expat-approved places</h3>
                <button onClick={() => openAuthModal('sign_up')} className="text-xs text-terra-primary font-semibold">See all</button>
              </div>
              <div className="grid gap-3">
                {featuredListings.map((listing, index) => (
                  <button
                    key={listing.id}
                    onClick={() => openAuthModal('sign_up')}
                    className="action-card texture-layer texture-paper hover-tilt text-left motion-rise"
                    style={{ '--rise-delay': `${0.08 + index * 0.06}s` }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="glass-panel flex h-10 w-10 items-center justify-center rounded-2xl">
                          <Icon name="pin" className="w-5 h-5 text-terra-ink" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-terra-ink">{listing.name}</p>
                          <p className="text-xs text-terra-taupe">{listing.description?.substring(0, 40)}...</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-terra-ink">{Number(listing.rating_average || 0).toFixed(1)}</p>
                        <p className="text-[10px] text-terra-taupe">{listing.review_count || 0} reviews</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

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
