// src/pages/Home.jsx
// EXPAT VILLAGE - Mobile Homepage Hero
// Based on approved MobileHomepageHero.jsx mockup

import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getWarsawWeather } from '../services/weather'

// ═══════════════════════════════════════════════════════════════════════════════
// WEATHER STATES
// ═══════════════════════════════════════════════════════════════════════════════
const WEATHER = {
  cold: {
    label: "−3°C", condition: "Heavy snow", icon: "❄️",
    skyTop: "#1a1a2e", skyMid: "#2d1b4e", skyBot: "#1e1535",
    fogOpacity: 0.22, skylineOpacity: 0.38, ambientColor: "#8B5CF6",
    stars: false, windowGlow: true,
  },
  cloudy: {
    label: "−1°C", condition: "Partly cloudy", icon: "🌤️",
    skyTop: "#1e1e3a", skyMid: "#3a2860", skyBot: "#251d42",
    fogOpacity: 0.1, skylineOpacity: 0.46, ambientColor: "#a78bfa",
    stars: false, windowGlow: false,
  },
  sunny: {
    label: "12°C", condition: "Sunny, warm", icon: "☀️",
    skyTop: "#1a1630", skyMid: "#3b2d5e", skyBot: "#2a1f4a",
    fogOpacity: 0, skylineOpacity: 0.58, ambientColor: "#c4b5fd",
    stars: false, windowGlow: false,
  },
  night: {
    label: "−5°C", condition: "Clear night", icon: "🌙",
    skyTop: "#0d0d1a", skyMid: "#1a1230", skyBot: "#120e22",
    fogOpacity: 0.06, skylineOpacity: 0.5, ambientColor: "#7c3aed",
    stars: true, windowGlow: true,
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACTIVITY STRIP DATA
// ═══════════════════════════════════════════════════════════════════════════════
const ACTIVITY = [
  { id: 0, icon: "🔴", text: "47 in Tax Q&A · Live now", live: true },
  { id: 1, icon: "🏠", text: "New listing in Mokotów · 12 min ago", live: false },
  { id: 2, icon: "😤", text: "Warsaw Daily · 68% say brutal", live: false },
  { id: 3, icon: "👋", text: "12 new villagers today", live: false },
  { id: 4, icon: "🏛️", text: "Housing Scams talk · Tomorrow 7pm", live: false },
  { id: 5, icon: "⭐", text: "Top review: Café Czeczka", live: false },
  { id: 6, icon: "🎤", text: "Newcomers Welcome · 23 listening", live: true },
]

// ═══════════════════════════════════════════════════════════════════════════════
// THREE PATHS
// ═══════════════════════════════════════════════════════════════════════════════
const PATHS = [
  { icon: "📋", label: "Get set up", color: "#8B5CF6", glow: "rgba(139,92,246,0.22)", path: "/get-things-done" },
  { icon: "🏠", label: "Find a place", color: "#f59e0b", glow: "rgba(245,158,11,0.18)", path: "/housing" },
  { icon: "🤝", label: "Meet people", color: "#10b981", glow: "rgba(16,185,129,0.18)", path: "/town-hall" },
]

// ═══════════════════════════════════════════════════════════════════════════════
// STARS
// ═══════════════════════════════════════════════════════════════════════════════
function Stars({ visible }) {
  const stars = useRef(
    Array.from({ length: 32 }, (_, i) => ({
      id: i,
      x: (i * 31.1 + 7) % 100,
      y: (i * 19.7 + 4) % 48,
      size: (i % 3) * 0.7 + 0.5,
      delay: (i * 0.33) % 2.6,
      dur: (i % 4) * 0.5 + 1.3,
    }))
  ).current

  return (
    <div className="absolute inset-0 pointer-events-none transition-opacity duration-1000" style={{ opacity: visible ? 1 : 0 }}>
      {stars.map(s => (
        <div key={s.id} className="absolute rounded-full bg-white" style={{
          left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size,
          animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite alternate`, opacity: 0.6,
        }} />
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// FOG
// ═══════════════════════════════════════════════════════════════════════════════
function Fog({ opacity }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: "42%", opacity }}>
      <div className="absolute bottom-0 left-0 right-0 h-full" style={{
        background: "linear-gradient(to top, rgba(139,92,246,0.13) 0%, transparent 65%)",
        animation: "fogDrift 9s ease-in-out infinite alternate",
      }} />
      <div className="absolute bottom-0 left-0 right-0" style={{
        height: "50%",
        background: "linear-gradient(to top, rgba(22,16,42,0.75) 0%, transparent 100%)",
        animation: "fogDrift 13s ease-in-out 2s infinite alternate-reverse",
      }} />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// WARSAW SKYLINE
// ═══════════════════════════════════════════════════════════════════════════════
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

        {/* PALACE OF CULTURE – center */}
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

        {/* Window glows – night/cold */}
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
              <rect key={i} x={x} y={y} width="3" height="4" rx="0.5" fill="#fbbf24"
                style={{ animation: `windowPulse ${1.5 + (i % 3) * 0.7}s ease-in-out ${(i * 0.2) % 2}s infinite alternate` }}
              />
            ))}
          </g>
        )}
      </svg>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACTIVITY STRIP
// ═══════════════════════════════════════════════════════════════════════════════
function ActivityStrip() {
  const scrollRef = useRef(null)
  const navigate = useNavigate()
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
          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full transition-all active:scale-95"
          style={{
            background: a.live ? "linear-gradient(135deg, rgba(239,68,68,0.18), rgba(185,28,28,0.12))" : "rgba(30,27,75,0.6)",
            border: a.live ? "1px solid rgba(239,68,68,0.35)" : "1px solid rgba(139,92,246,0.2)",
            backdropFilter: "blur(8px)",
          }}
        >
          {a.live && (
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
            </span>
          )}
          <span className="text-sm">{a.icon}</span>
          <span className="text-xs font-medium whitespace-nowrap" style={{ color: a.live ? "#fca5a5" : "#cbd5e1" }}>{a.text}</span>
        </button>
      ))}
      <style>{`div::-webkit-scrollbar { display: none; }`}</style>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN HOME COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
function Home() {
  const { isAuthenticated, profile, user, openAuthModal } = useAuth()
  const navigate = useNavigate()
  const [weatherData, setWeatherData] = useState({ state: "night", temp: -5, condition: "Clear night", icon: "🌙" })
  const [tapped, setTapped] = useState(null)
  const w = WEATHER[weatherData.state]

  const displayName = profile?.display_name
    || user?.user_metadata?.display_name
    || user?.email?.split('@')[0]
    || 'friend'

  // Fetch real Warsaw weather on mount
  useEffect(() => {
    async function fetchWeather() {
      const data = await getWarsawWeather()
      setWeatherData(data)
    }
    fetchWeather()
  }, [])

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
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#a78bfa" }}>
              Warsaw · Live
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-white font-extrabold mb-3" style={{ 
            fontSize: 'clamp(2rem, 8vw, 3rem)', 
            lineHeight: 1.1, 
            textShadow: "0 2px 30px rgba(0,0,0,0.5)" 
          }}>
            {isAuthenticated ? (
              <>
                Hey, <span style={{
                  background: "linear-gradient(90deg, #a78bfa 0%, #c4b5fd 35%, #fbbf24 100%)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}>{displayName}</span> 👋
              </>
            ) : (
              <>
                Your village<br />is already{' '}
                <span style={{
                  background: "linear-gradient(90deg, #a78bfa 0%, #c4b5fd 35%, #fbbf24 100%)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}>here.</span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-slate-400 text-sm mb-8 max-w-xs">
            Everything you need to thrive as an expat in Poland.
          </p>

          {/* Weather badge */}
          <div className="flex items-center gap-2 mb-6 px-4 py-2 rounded-full" style={{
            background: "rgba(30,27,75,0.5)",
            border: "1px solid rgba(139,92,246,0.2)",
          }}>
            <span className="text-lg">{weatherData.icon}</span>
            <span className="text-sm text-slate-300">{weatherData.temp}°C · {weatherData.condition}</span>
          </div>
        </div>

        {/* Bottom zone */}
        <div className="flex flex-col items-center gap-4 px-5 pb-8">
          
          {/* What do you need */}
          <p className="text-xs font-medium text-slate-500">What do you need?</p>

          {/* Three path buttons */}
          <div className="flex gap-2.5 w-full max-w-sm justify-center">
            {PATHS.map((p, i) => (
              <button
                key={i}
                onClick={() => isAuthenticated ? navigate(p.path) : openAuthModal('sign_up')}
                onTouchStart={() => setTapped(i)}
                onTouchEnd={() => setTapped(null)}
                onMouseDown={() => setTapped(i)}
                onMouseUp={() => setTapped(null)}
                onMouseLeave={() => setTapped(null)}
                className="flex-1 flex flex-col items-center gap-1.5 py-4 rounded-2xl transition-all duration-200"
                style={{
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
                <span className="text-2xl">{p.icon}</span>
                <span className="text-xs font-bold text-white">{p.label}</span>
              </button>
            ))}
          </div>

          {/* Join CTA */}
          {!isAuthenticated && (
            <button
              onClick={() => openAuthModal('sign_up')}
              className="flex items-center gap-2 px-5 py-3 rounded-full transition-all duration-200 active:scale-95"
              style={{
                background: "rgba(20,16,38,0.55)",
                border: "1px solid rgba(251,191,36,0.3)",
                backdropFilter: "blur(8px)",
                boxShadow: "0 2px 14px rgba(251,191,36,0.1)",
              }}
            >
              <span>🏘️</span>
              <span className="text-sm font-semibold text-white">Join the village — it's free</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M4.5 2.5L8.5 6L4.5 9.5" stroke="#fbbf24" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}

          {isAuthenticated && (
            <button
              onClick={() => navigate('/get-things-done')}
              className="flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-200 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
                boxShadow: "0 4px 20px rgba(124,58,237,0.4)",
              }}
            >
              <span className="text-sm font-bold text-white">Let's go →</span>
            </button>
          )}
        </div>
      </div>

      {/* Weather switcher - dev only */}
      {import.meta.env.DEV && (
        <div className="absolute bottom-4 left-4 flex gap-1.5 z-50">
          {Object.keys(WEATHER).map((k) => (
            <button key={k} onClick={() => setWeatherData({ ...weatherData, state: k })}
              className="px-2.5 py-1 rounded-full text-xs font-semibold transition-all"
              style={{
                background: weatherData.state === k ? "rgba(139,92,246,0.4)" : "rgba(255,255,255,0.1)",
                color: weatherData.state === k ? "#c4b5fd" : "#64748b",
                border: `1px solid ${weatherData.state === k ? "rgba(139,92,246,0.5)" : "rgba(255,255,255,0.1)"}`,
              }}
            >
              {WEATHER[k].icon} {k}
            </button>
          ))}
        </div>
      )}

      {/* Keyframes */}
      <style>{`
        @keyframes twinkle { from { opacity: 0.15; } to { opacity: 0.85; } }
        @keyframes fogDrift { from { transform: translateX(-5px) scaleX(1); } to { transform: translateX(5px) scaleX(1.02); } }
        @keyframes windowPulse { from { opacity: 0.2; } to { opacity: 0.75; } }
      `}</style>
    </div>
  )
}

export default Home
