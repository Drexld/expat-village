// src/pages/Home.jsx
// EXPAT VILLAGE - Mobile Homepage Hero
// Based on approved MobileHomepageHero.jsx mockup

import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getWarsawWeather } from '../services/weather'
import MorningBriefing from '../components/MorningBriefing'
import Announcements from '../components/Announcements'
import Icon from '../components/Icon'

// WEATHER STATES
const WEATHER = {
  cold: {
    label: "-3C", condition: "Heavy snow", icon: "snow",
    skyTop: "#0b0d17", skyMid: "#141828", skyBot: "#1a2034",
    fogOpacity: 0.16, skylineOpacity: 0.32, ambientColor: "#c0a08c",
    stars: false, windowGlow: true,
  },
  cloudy: {
    label: "-1C", condition: "Partly cloudy", icon: "cloud",
    skyTop: "#0b0f19", skyMid: "#13182a", skyBot: "#1b2136",
    fogOpacity: 0.08, skylineOpacity: 0.42, ambientColor: "#c5a892",
    stars: false, windowGlow: false,
  },
  sunny: {
    label: "12C", condition: "Sunny, warm", icon: "sun",
    skyTop: "#0d0f1a", skyMid: "#1a1e30", skyBot: "#262b42",
    fogOpacity: 0.02, skylineOpacity: 0.5, ambientColor: "#d1b39a",
    stars: false, windowGlow: false,
  },
  night: {
    label: "-5C", condition: "Clear night", icon: "moon",
    skyTop: "#070912", skyMid: "#0d1020", skyBot: "#14172a",
    fogOpacity: 0.05, skylineOpacity: 0.44, ambientColor: "#b79884",
    stars: true, windowGlow: true,
  },
}

// ACTIVITY STRIP DATA
const ACTIVITY = [
  { id: 0, icon: "alert", text: "47 in Tax Q&A - Live now", live: true },
  { id: 1, icon: "home", text: "New listing in Mokotow - 12 min ago", live: false },
  { id: 2, icon: "spark", text: "Warsaw Daily - 68% say brutal", live: false },
  { id: 3, icon: "user", text: "12 new villagers today", live: false },
  { id: 4, icon: "community", text: "Housing Scams talk - Tomorrow 7pm", live: false },
  { id: 5, icon: "star", text: "Top review: Cafe Czeczka", live: false },
  { id: 6, icon: "music", text: "Newcomers Welcome - 23 listening", live: true },
]

// THREE PATHS (for non-authenticated users - onboarding style)
const PATHS = [
  { icon: "checklist", label: "Get set up", color: "#f2a65a", glow: "rgba(242,166,90,0.26)", path: "/get-things-done" },
  { icon: "home", label: "Find a place", color: "#f6c38f", glow: "rgba(246,195,143,0.24)", path: "/housing" },
  { icon: "community", label: "Meet people", color: "#f28f7b", glow: "rgba(242,143,123,0.24)", path: "/town-hall" },
]

// QUICK ACTIONS (for authenticated users - dashboard style)
const QUICK_ACTIONS = [
  { icon: "checklist", label: "My Checklist", path: "/my-checklist", color: "#f2a65a", glow: "rgba(242,166,90,0.22)" },
  { icon: "community", label: "Town Hall", path: "/town-hall", color: "#f28f7b", glow: "rgba(242,143,123,0.22)" },
  { icon: "pin", label: "Directory", path: "/directory", color: "#f6c38f", glow: "rgba(246,195,143,0.2)" },
  { icon: "spark", label: "Get Things Done", path: "/get-things-done", color: "#f7d9b5", glow: "rgba(247,217,181,0.22)" },
]

// STARS
const STAR_FIELD = Array.from({ length: 32 }, (_, i) => ({
  id: i,
  x: (i * 31.1 + 7) % 100,
  y: (i * 19.7 + 4) % 48,
  size: (i % 3) * 0.7 + 0.5,
  delay: (i * 0.33) % 2.6,
  dur: (i % 4) * 0.5 + 1.3,
}))

function Stars({ visible }) {

  return (
    <div className="absolute inset-0 pointer-events-none transition-opacity duration-1000" style={{ opacity: visible ? 1 : 0 }}>
      {STAR_FIELD.map(s => (
        <div key={s.id} className="absolute rounded-full bg-white" style={{
          left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size,
          animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite alternate`, opacity: 0.6,
        }} />
      ))}
    </div>
  )
}

// FOG
function Fog({ opacity }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: "42%", opacity }}>
      <div className="absolute bottom-0 left-0 right-0 h-full" style={{
        background: "linear-gradient(to top, rgba(242,166,90,0.12) 0%, transparent 65%)",
        animation: "fogDrift 9s ease-in-out infinite alternate",
      }} />
      <div className="absolute bottom-0 left-0 right-0" style={{
        height: "50%",
        background: "linear-gradient(to top, rgba(28,18,22,0.8) 0%, transparent 100%)",
        animation: "fogDrift 13s ease-in-out 2s infinite alternate-reverse",
      }} />
    </div>
  )
}

// WARSAW SKYLINE
function Skyline({ weather }) {
  const w = weather
  return (
    <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ opacity: w.skylineOpacity, transition: "opacity 1s" }}>
      <svg viewBox="0 0 390 160" className="w-full h-auto" preserveAspectRatio="xMidYMax meet">
        <defs>
          <linearGradient id="bM" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={w.ambientColor} stopOpacity="0.95" />
            <stop offset="100%" stopColor={w.ambientColor} stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Far left ghost */}
        <rect x="0" y="118" width="14" height="42" rx="2" fill={w.ambientColor} opacity="0.17" />
        <rect x="18" y="108" width="10" height="52" rx="2" fill={w.ambientColor} opacity="0.21" />

        {/* Left cluster */}
        <rect x="34" y="88" width="26" height="72" rx="2" fill="url(#bM)" />
        <rect x="64" y="72" width="22" height="88" rx="2" fill="url(#bM)" />
        <rect x="90" y="94" width="30" height="66" rx="2" fill="url(#bM)" />
        <rect x="124" y="78" width="18" height="82" rx="2" fill="url(#bM)" />

        {/* Left-center tower */}
        <rect x="146" y="52" width="24" height="108" rx="2" fill="url(#bM)" />

        {/* PALACE OF CULTURE - center */}
        <rect x="176" y="10" width="38" height="150" rx="2" fill="url(#bM)" />
        <rect x="170" y="30" width="50" height="130" rx="2" fill="url(#bM)" />
        <rect x="164" y="50" width="62" height="110" rx="2" fill="url(#bM)" />
        <polygon points="195,0 189,14 201,14" fill={w.ambientColor} opacity="0.75" />
        <rect x="192.5" y="2" width="5" height="12" rx="1" fill={w.ambientColor} opacity="0.5" />
        <rect x="172" y="42" width="46" height="1.5" rx="0.75" fill={w.ambientColor} opacity="0.18" />
        <rect x="168" y="62" width="54" height="1.5" rx="0.75" fill={w.ambientColor} opacity="0.13" />

        {/* Right-center */}
        <rect x="232" y="68" width="28" height="92" rx="2" fill="url(#bM)" />
        <rect x="264" y="56" width="20" height="104" rx="2" fill="url(#bM)" />
        <rect x="288" y="80" width="32" height="80" rx="2" fill="url(#bM)" />

        {/* Right cluster */}
        <rect x="324" y="72" width="22" height="88" rx="2" fill="url(#bM)" />
        <rect x="350" y="90" width="26" height="70" rx="2" fill="url(#bM)" />
        <rect x="380" y="104" width="12" height="56" rx="2" fill={w.ambientColor} opacity="0.2" />

        {/* Ground */}
        <rect x="0" y="158" width="390" height="2" fill={w.ambientColor} opacity="0.3" />

        {/* Window glows - night/cold */}
        {w.windowGlow && (
          <g opacity="0.55">
            {[
              [40,96],[44,110],[68,80],[72,96],[68,112],
              [94,102],[98,118],[128,86],[132,104],
              [150,62],[154,80],[150,100],[154,118],
              [182,18],[186,36],[190,54],[182,74],[186,94],[190,114],
              [172,52],[176,72],[176,92],[198,24],[202,46],[198,68],
              [238,78],[242,98],[268,64],[272,82],[268,102],
              [294,92],[298,112],[328,82],[332,104],
              [354,98],[358,118],
            ].map(([x, y], i) => (
              <rect key={i} x={x} y={y} width="3" height="4" rx="0.5" fill="#f2a65a"
                style={{ animation: `windowPulse ${1.5 + (i % 3) * 0.7}s ease-in-out ${(i * 0.2) % 2}s infinite alternate` }}
              />
            ))}
          </g>
        )}
      </svg>
    </div>
  )
}

// ACTIVITY STRIP
function ActivityStrip() {
  const scrollRef = useRef(null)
  const [paused, setPaused] = useState(false)
  const pos = useRef(0)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    let raf
    const loop = () => {
      if (!paused) {
        pos.current += 0.4
        if (pos.current >= el.scrollWidth / 2) pos.current = 0
        el.scrollLeft = pos.current
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [paused])

  return (
    <div
      ref={scrollRef}
      className="flex gap-2.5 overflow-x-auto"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setTimeout(() => setPaused(false), 2000)}
    >
      {[...ACTIVITY, ...ACTIVITY].map((a, i) => (
        <button
          key={`${a.id}-${i}`}
          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full transition-all active:scale-95 glass-chip"
          style={{
            background: a.live ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
            border: a.live ? "1px solid rgba(255,255,255,0.25)" : "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(8px)",
            '--glass-glow': a.live ? 'rgba(242,166,90,0.22)' : 'rgba(246,195,143,0.12)',
          }}
        >
          {a.live && (
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/60 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
            </span>
          )}
          <Icon name={a.icon} className="w-4 h-4 text-slate-200" />
          <span className="text-xs font-medium whitespace-nowrap" style={{ color: a.live ? "#f8fafc" : "#cbd5e1" }}>{a.text}</span>
        </button>
      ))}
      <style>{`div::-webkit-scrollbar { display: none; }`}</style>
    </div>
  )
}

// MAIN HOME COMPONENT
function Home() {
  const { isAuthenticated, openAuthModal, profile } = useAuth()
  const navigate = useNavigate()
  const [weatherData, setWeatherData] = useState({ state: "night", temp: -5, condition: "Clear night", icon: "moon" })
  const [tapped, setTapped] = useState(null)
  const [showMorningBriefing, setShowMorningBriefing] = useState(false)
  const w = WEATHER[weatherData.state]
  const points = profile?.points || profile?.reward_points || 1280

  const MUSIC_PULSE = [
    { genre: "Afrohouse", listeners: 1204 },
    { genre: "Lo-fi Beats", listeners: 932 },
    { genre: "Polish Indie", listeners: 711 },
    { genre: "Jazz Cafe", listeners: 486 },
  ]

  const missionCta = (label) => {
    if (label === "My Checklist") return "Continue"
    if (label === "Town Hall") return "Join room"
    if (label === "Directory") return "Explore"
    if (label === "Get Things Done") return "Get started"
    return "Open"
  }

  // Fetch real Warsaw weather on mount
  useEffect(() => {
    async function fetchWeather() {
      const data = await getWarsawWeather()
      setWeatherData(data)
    }
    fetchWeather()
  }, [])

  // Show Morning Briefing once per day for authenticated users
  useEffect(() => {
    if (isAuthenticated) {
      const todayKey = new Date().toLocaleDateString('en-CA')
      const storageKey = `expat_morning_briefing_seen_${todayKey}`
      const hasSeenBriefing = localStorage.getItem(storageKey)
      if (!hasSeenBriefing) {
        // Small delay to let the page render first
        const timer = setTimeout(() => {
          setShowMorningBriefing(true)
        }, 500)
        return () => clearTimeout(timer)
      }
    }
  }, [isAuthenticated])

  // Handle closing the morning briefing
  const handleCloseMorningBriefing = () => {
    setShowMorningBriefing(false)
    const todayKey = new Date().toLocaleDateString('en-CA')
    const storageKey = `expat_morning_briefing_seen_${todayKey}`
    localStorage.setItem(storageKey, 'true')
  }

  return (
    <div 
      className="relative min-h-[calc(100vh-6rem)] overflow-hidden"
      style={{ marginTop: '-1.5rem', marginLeft: '-1rem', marginRight: '-1rem' }}
    >
      {/* SKY */}
      <div className="absolute inset-0 transition-all duration-1000" style={{
        background: `linear-gradient(180deg, ${w.skyTop} 0%, ${w.skyMid} 48%, ${w.skyBot} 100%)`,
      }} />

      {/* STARS */}
      <Stars visible={w.stars} />

      {/* SKYLINE */}
      <Skyline weather={w} />

      {/* FOG */}
      <Fog opacity={w.fogOpacity} />

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col min-h-[calc(100vh-6rem)]">

                {/* AUTHENTICATED USER EXPERIENCE */}
                {isAuthenticated ? (
          <div className="flex flex-col gap-6 px-4 pt-4 pb-10">
            {/* Village signal strip */}
            <div
              className="relative overflow-hidden rounded-2xl px-4 py-3 prism-card prism-sweep prism-reveal"
              style={{ '--prism': 'rgba(242,166,90,0.26)' }}
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <p className="text-[11px] uppercase tracking-widest text-slate-400">Village Signal</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-200 flex items-center gap-1">
                    <Icon name="star" className="w-3.5 h-3.5" />
                    {points.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-500">points</span>
                </div>
              </div>
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="flex gap-4 animate-signalMarquee" style={{ width: "max-content" }}>
                  {MUSIC_PULSE.map((m, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300 whitespace-nowrap">
                      <Icon name="music" className="w-3.5 h-3.5 text-slate-300" />
                      <span>Village is listening:</span>
                      <span className="text-white font-semibold">{m.genre}</span>
                      <span className="text-slate-500">- {m.listeners} villagers</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Daily Pulse - Tap to reopen morning briefing */}
            <button
              onClick={() => setShowMorningBriefing(true)}
              className="relative overflow-hidden rounded-3xl p-4 text-left transition-all active:scale-[0.99] prism-card prism-hero prism-sweep prism-breathe hover-tilt"
              style={{ '--prism': 'rgba(242,143,123,0.34)' }}
            >
              <div className="absolute inset-0 opacity-30" style={{
                background: "radial-gradient(120px 120px at 85% 20%, rgba(242,143,123,0.3), transparent 70%)",
              }} />
              <div className="relative flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Icon name={weatherData.icon} className="w-9 h-9 text-slate-100" />
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-300">Daily Pulse</p>
                    <p className="text-2xl font-bold text-white leading-tight">{weatherData.temp}C</p>
                    <p className="text-xs text-slate-400 capitalize">{weatherData.condition}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-300">Tap for briefing</p>
                  <p className="text-xs text-slate-500">Warsaw - Live</p>
                </div>
              </div>
              <div className="relative mt-4 flex items-center gap-3 text-xs text-slate-300">
                <span className="px-2 py-1 rounded-full border border-white/10 bg-white/5">City mood: {weatherData.state}</span>
                <span className="px-2 py-1 rounded-full border border-white/10 bg-white/5">Tonight: cozy</span>
              </div>
            </button>

            {/* Announcements */}
            <Announcements />

            {/* Choose your path */}
            <div>
              <p className="text-xs font-medium text-slate-500 mb-3 px-1">Choose your path</p>
              <div className="grid grid-cols-2 gap-3">
                {PATHS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => navigate(p.path)}
                    className="relative overflow-hidden rounded-3xl p-4 text-left transition-all duration-200 active:scale-95 prism-card prism-sweep hover-tilt"
                    style={{ '--prism': p.glow }}
                  >
                    <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full" style={{ background: p.color, opacity: 0.12 }} />
                    <Icon name={p.icon} className="w-6 h-6 text-slate-100 mb-2" />
                    <p className="text-sm font-semibold text-white">{p.label}</p>
                    <p className="text-[11px] text-slate-300 mt-1 flex items-center gap-1">
                      Jump in <Icon name="arrowRight" className="w-3 h-3" />
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Daily missions */}
            <div>
              <p className="text-xs font-medium text-slate-500 mb-3 px-1">Daily missions</p>
              <div className="grid grid-cols-1 gap-3">
                {QUICK_ACTIONS.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => navigate(action.path)}
                    className="flex items-center justify-between gap-3 px-4 py-4 rounded-2xl transition-all duration-200 active:scale-95 prism-card prism-reveal"
                    style={{ '--prism': action.glow }}
                  >
                    <div className="flex items-center gap-3">
                      <Icon name={action.icon} className="w-5 h-5 text-slate-200" />
                      <div className="text-left">
                        <p className="text-sm font-medium text-white">{action.label}</p>
                        <p className="text-[11px] text-slate-400">Make progress today</p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-300 flex items-center gap-1">
                      {missionCta(action.label)} <Icon name="arrowRight" className="w-3 h-3" />
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Featured rooms */}
            <div>
              <p className="text-xs font-medium text-slate-500 mb-3 px-1">Featured rooms</p>
              <div className="grid grid-cols-1 gap-3">
                {ACTIVITY.slice(0, 1).map((a, i) => (
                  <button
                    key={i}
                    className="relative overflow-hidden rounded-3xl p-4 text-left transition-all active:scale-95 prism-card prism-hero prism-sweep"
                    style={{ '--prism': 'rgba(242,166,90,0.28)' }}
                  >
                    <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-white/10" />
                    <div className="flex items-center gap-3 mb-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                      </span>
                      <Icon name={a.icon} className="w-4 h-4 text-slate-200" />
                      <span className="text-sm text-white">{a.text}</span>
                    </div>
                    <p className="text-xs text-slate-300">Drop in and say hi - it is live now.</p>
                    <div className="mt-3 text-xs text-slate-200 flex items-center gap-1">
                      Join room <Icon name="arrowRight" className="w-3 h-3" />
                    </div>
                  </button>
                ))}
                {ACTIVITY.slice(1, 3).map((a, i) => (
                  <button
                    key={i}
                    className="flex items-center justify-between gap-3 px-4 py-4 rounded-2xl transition-all active:scale-95 prism-card"
                    style={{ '--prism': 'rgba(246,195,143,0.2)' }}
                  >
                    <div className="flex items-center gap-3">
                      <Icon name={a.icon} className="w-4 h-4 text-slate-200" />
                      <span className="text-sm text-white">{a.text}</span>
                    </div>
                    <span className="text-xs text-slate-300 flex items-center gap-1">
                      Enter <Icon name="arrowRight" className="w-3 h-3" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
                        {/* NON-AUTHENTICATED USER EXPERIENCE (Landing page) */}
            
            {/* Activity strip */}
            <div className="px-4 pt-6">
              <ActivityStrip />
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">

              {/* Live indicator */}
              <div className="flex items-center gap-2 mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#f2a65a" }}>
                  Warsaw - Live
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-white font-extrabold mb-3" style={{
                fontSize: 'clamp(2rem, 8vw, 3rem)',
                lineHeight: 1.1,
                textShadow: "0 2px 30px rgba(0,0,0,0.5)"
              }}>
                Your village<br />is already{' '}
                <span style={{
                  background: "linear-gradient(90deg, #f2a65a 0%, #f6c38f 40%, #f28f7b 100%)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}>here.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-slate-400 text-sm mb-8 max-w-xs">
                Everything you need to thrive as an expat in Poland.
              </p>

              {/* Weather badge */}
              <div className="flex items-center gap-2 mb-6 px-4 py-2 rounded-full glass-panel">
                <Icon name={weatherData.icon} className="w-4 h-4 text-slate-200" />
                <span className="text-sm text-slate-300">{weatherData.temp}C - {weatherData.condition}</span>
              </div>
            </div>

            {/* Bottom zone */}
            <div className="flex flex-col items-center gap-4 px-5 pb-8">

              {/* What do you need */}
              <p className="text-xs font-medium text-slate-500">What do you need?</p>

              {/* Three path buttons - all lead to sign up for non-authenticated */}
              <div className="flex gap-2.5 w-full max-w-sm justify-center">
                {PATHS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => openAuthModal('sign_up')}
                    onTouchStart={() => setTapped(i)}
                    onTouchEnd={() => setTapped(null)}
                    onMouseDown={() => setTapped(i)}
                    onMouseUp={() => setTapped(null)}
                    onMouseLeave={() => setTapped(null)}
                    className="flex-1 flex flex-col items-center gap-1.5 py-4 rounded-2xl transition-all duration-200 prism-card prism-sweep"
                    style={{
                      '--prism': p.glow,
                      background: tapped === i
                        ? `linear-gradient(145deg, ${p.glow}, rgba(20,16,38,0.75))`
                        : "rgba(20,16,38,0.55)",
                      border: `1px solid ${tapped === i ? p.color + "50" : "rgba(139,92,246,0.2)"}`,
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      transform: tapped === i ? "scale(0.96)" : "scale(1)",
                      boxShadow: tapped === i ? `0 4px 18px ${p.glow}` : "0 2px 10px rgba(0,0,0,0.3)",
                    }}
                  >
                    <Icon name={p.icon} className="w-6 h-6 text-slate-100" />
                    <span className="text-xs font-bold text-white">{p.label}</span>
                  </button>
                ))}
              </div>

              {/* Join CTA */}
              <button
                onClick={() => openAuthModal('sign_up')}
                className="flex items-center gap-2 px-5 py-3 rounded-full transition-all duration-200 active:scale-95 glass-3d"
              >
                <Icon name="home" className="w-4 h-4 text-slate-100" />
                <span className="text-sm font-semibold text-white">Join the village - it's free</span>
                <Icon name="arrowRight" className="w-3 h-3 text-slate-200" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Weather switcher - dev only */}
      {import.meta.env.DEV && (
        <div className="absolute bottom-4 left-4 flex gap-1.5 z-50">
          {Object.keys(WEATHER).map((k) => (
            <button key={k} onClick={() => setWeatherData({ ...weatherData, state: k })}
              className="px-2.5 py-1 rounded-full text-xs font-semibold transition-all"
              style={{
                background: weatherData.state === k ? "rgba(139,92,246,0.4)" : "rgba(255,255,255,0.1)",
                color: weatherData.state === k ? "#f6c38f" : "#64748b",
                border: `1px solid ${weatherData.state === k ? "rgba(139,92,246,0.5)" : "rgba(255,255,255,0.1)"}`,
              }}
            >
              <span className="inline-flex items-center gap-1">
                <Icon name={WEATHER[k].icon} className="w-3.5 h-3.5" />
                {k}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Keyframes */}
      <style>{`
        @keyframes twinkle { from { opacity: 0.15; } to { opacity: 0.85; } }
        @keyframes fogDrift { from { transform: translateX(-5px) scaleX(1); } to { transform: translateX(5px) scaleX(1.02); } }
        @keyframes windowPulse { from { opacity: 0.2; } to { opacity: 0.75; } }
        @keyframes signalMarquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-signalMarquee { animation: signalMarquee 18s linear infinite; }
      `}</style>

      {/* Morning Briefing Overlay - shows once per session for authenticated users */}
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






