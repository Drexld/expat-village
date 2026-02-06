// src/components/MorningBriefing.jsx
// AI-powered personalized morning briefing overlay

import { useState, useEffect, useRef, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useAuth } from '../contexts/AuthContext'
import { generatePersonalizedBriefing, getTrcReminder } from '../services/briefing'
import { getAnnouncements } from '../services/announcements'
import { filterAnnouncementsForUser } from '../services/briefing'
import Icon from './Icon'

function MorningBriefing({ weatherData, onClose }) {
  const { user, profile } = useAuth()
  const [isVisible, setIsVisible] = useState(true)
  const [dragY, setDragY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [briefing, setBriefing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pulseItems, setPulseItems] = useState([])
  const startY = useRef(0)
  const containerRef = useRef(null)
  const scrollRef = useRef(null)

  const displayName = profile?.display_name
    || user?.user_metadata?.display_name
    || user?.email?.split('@')[0]
    || 'friend'

  // Fetch announcements first, then generate AI briefing with that context
  useEffect(() => {
    async function fetchData() {
      // 1. Fetch announcements
      let announcementData = []
      try {
        const data = await getAnnouncements()
        announcementData = filterAnnouncementsForUser(data, profile) || []
        const cityOnly = announcementData.filter(a => (a.scope || '').toLowerCase() === 'city')
        const items = cityOnly.slice(0, 4).map((a) => ({
          id: a.id,
          title: a.title,
          message: a.message,
          type: a.type || 'info',
        }))
        setPulseItems(items)
      } catch (error) {
        console.error('Failed to fetch announcements for pulse:', error)
        setPulseItems([])
      }

      // 2. Generate AI briefing with announcements context
      try {
        const data = await generatePersonalizedBriefing({
          user,
          profile,
          weatherData,
          announcements: announcementData
        })
        setBriefing(data)
      } catch (error) {
        console.error('Failed to fetch briefing:', error)
        setBriefing({
          greeting: `Good morning, ${displayName}! It's ${weatherData?.temp || 0}C outside.`,
          todayInPoland: "Poland has over 9,000 lakes, making it one of the most lake-rich countries in Europe.",
          tip: "Remember: most shops are closed on Sundays in Poland, except the last Sunday of each month.",
          isFallback: true
        })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user, profile, weatherData, displayName])

  // Get TRC reminder if applicable
  const trcReminder = getTrcReminder(profile)

  // Today's date
  const today = new Date()
  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })

  const transportStatus = useMemo(() => {
    // Check pulse items for transport-related warnings
    const transportKeywords = ['metro', 'tram', 'bus', 'ztm', 'transport', 'transit', 'train', 'commute', 'traffic', 'road', 'construction']
    const transportAlert = pulseItems.find(item => {
      const text = `${item.title} ${item.message}`.toLowerCase()
      return transportKeywords.some(k => text.includes(k))
    })
    if (transportAlert) {
      const isWarning = transportAlert.type === 'warning'
      return {
        level: isWarning ? 'busy' : 'info',
        label: transportAlert.title,
        color: isWarning ? '#C76B55' : '#D2A073',
      }
    }
    // Fallback to time-of-day heuristic
    const hour = new Date().getHours()
    if (hour >= 7 && hour <= 9) return { level: 'busy', label: 'Morning commute', color: '#C76B55' }
    if (hour >= 16 && hour <= 18) return { level: 'busy', label: 'Evening commute', color: '#C76B55' }
    return { level: 'clear', label: 'Smooth rides', color: '#75997C' }
  }, [pulseItems])

  const dayMood = useMemo(() => {
    const temp = weatherData?.temp ?? 0
    if (temp <= 0) return { label: 'Cozy day', hint: 'Layer up and lean into warm spots.' }
    if (temp <= 10) return { label: 'Brisk but bright', hint: 'Perfect for a quick walk.' }
    if (temp <= 20) return { label: 'Fresh energy', hint: 'Great day to explore.' }
    return { label: 'City heat', hint: 'Hydrate and find shade.' }
  }, [weatherData?.temp])

  const pulseHighlights = useMemo(() => {
    const hour = new Date().getHours()
    const timeLabel = hour < 12 ? 'morning' : hour < 17 ? 'day' : 'evening'
    const items = [
      { icon: 'bolt', text: dayMood.label },
      { icon: 'train', text: transportStatus.label },
    ]
    if (pulseItems[0]?.title) items.push({ icon: 'bell', text: pulseItems[0].title })
    items.push({ icon: 'spark', text: `Coffee-worthy ${timeLabel}` })
    return items
  }, [dayMood.label, transportStatus.label, pulseItems])

  const canSwipeDismiss = () => {
    const el = scrollRef.current
    if (!el) return true
    const isScrollable = el.scrollHeight > el.clientHeight + 1
    if (!isScrollable) return true
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 2
    return atBottom
  }

  // Touch handlers for swipe up to dismiss
  const handleTouchStart = (e) => {
    if (!canSwipeDismiss()) return
    startY.current = e.touches[0].clientY
    setIsDragging(true)
  }

  const handleTouchMove = (e) => {
    if (!isDragging) return
    const currentY = e.touches[0].clientY
    const diff = currentY - startY.current
    if (diff < 0) setDragY(diff)
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    if (dragY < -150) {
      setIsVisible(false)
      setTimeout(() => onClose?.(), 300)
    } else {
      setDragY(0)
    }
  }

  // Mouse handlers for desktop
  const handleMouseDown = (e) => {
    if (!canSwipeDismiss()) return
    startY.current = e.clientY
    setIsDragging(true)
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    const diff = e.clientY - startY.current
    if (diff < 0) setDragY(diff)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    if (dragY < -150) {
      setIsVisible(false)
      setTimeout(() => onClose?.(), 300)
    } else {
      setDragY(0)
    }
  }

  if (!isVisible) return null

  return createPortal(
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, rgba(253,251,248,0.98) 0%, rgba(246,241,234,0.98) 50%, rgba(253,251,248,0.98) 100%)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        transform: dragY !== 0 ? `translateY(${dragY}px)` : undefined,
        opacity: Math.max(0, 1 - Math.abs(dragY) / 400),
        transition: isDragging ? 'none' : 'transform 0.3s ease-out, opacity 0.3s ease-out',
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Swoosh header */}
      <div className="relative pt-5 pb-3 overflow-hidden">
        <div className="absolute inset-0">
          <svg viewBox="0 0 390 120" className="w-full h-full">
            <defs>
              <linearGradient id="swooshGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(199,107,85,0.28)" />
                <stop offset="55%" stopColor="rgba(210,160,115,0.3)" />
                <stop offset="100%" stopColor="rgba(117,153,124,0.2)" />
              </linearGradient>
              <linearGradient id="swooshGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(199,107,85,0.45)" />
                <stop offset="100%" stopColor="rgba(117,153,124,0.35)" />
              </linearGradient>
            </defs>
            <path
              d="M0,60 C70,18 160,16 235,34 C310,52 345,78 390,56 L390,0 L0,0 Z"
              fill="url(#swooshGradient)"
            />
            <path
              d="M0,62 C75,25 165,22 235,38 C305,54 345,74 390,58"
              stroke="url(#swooshGlow)"
              strokeWidth="2"
              fill="none"
              opacity="0.55"
            />
          </svg>
        </div>
        <div className="relative flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Icon name={weatherData?.icon || "cloud"} className="w-8 h-8 text-terra-ink" />
            <div>
              <p className="text-xs uppercase tracking-widest text-terra-taupe">Your Warsaw Pulse</p>
              <p className="text-lg font-semibold text-terra-ink">{dateStr}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-terra-ink leading-none">{weatherData?.temp ?? '--'}C</p>
            <p className="text-xs text-terra-taupe capitalize">{weatherData?.condition || 'Loading...'}</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div ref={scrollRef} className="flex-1 flex flex-col px-6 py-4 overflow-y-auto">
        {/* Pulse ticker */}
        <div className="mb-5">
          <div className="rounded-full border border-black/10 bg-terra-cream px-3 py-2 overflow-hidden">
            <div className="flex gap-5 animate-briefingMarquee" style={{ width: 'max-content' }}>
              {pulseHighlights.map((item, idx) => (
                <span key={idx} className="flex items-center gap-2 text-xs text-terra-ink whitespace-nowrap">
                  <Icon name={item.icon} className="w-3.5 h-3.5" />
                  {item.text}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-terra-taupe/60 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-terra-taupe">Preparing your briefing...</p>
            </div>
          </div>
        ) : (
          <>
            {/* AI-generated greeting */}
            <h1 className="text-2xl font-bold text-terra-ink mb-2 leading-tight line-clamp-2">
              {briefing?.greeting || `Good morning, ${displayName}!`}
            </h1>

            {/* Day snapshot */}
            <div className="grid grid-cols-2 gap-4 mb-7">
              <div className="p-4 rounded-2xl glass-panel">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="spark" className="w-4 h-4 text-terra-ink" />
                  <p className="text-xs uppercase tracking-widest text-terra-taupe">Weather mood</p>
                </div>
                <p className="text-sm text-terra-ink font-semibold">{dayMood.label}</p>
                <p className="text-xs text-terra-taupe mt-1">{dayMood.hint}</p>
              </div>
              <div className="p-4 rounded-2xl glass-panel">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="train" className="w-4 h-4 text-terra-ink" />
                  <p className="text-xs uppercase tracking-widest text-terra-taupe">Transit pulse</p>
                </div>
                <p className="text-sm font-semibold" style={{ color: transportStatus.color }}>{transportStatus.level === 'busy' ? 'Expect delays' : 'Clear routes'}</p>
                <p className="text-xs text-terra-taupe mt-1">{transportStatus.label}</p>
              </div>
            </div>

            {/* TRC Alert - Only if applicable */}
            {trcReminder && (
              <div className="mb-6 p-4 rounded-2xl glass-panel" style={{
                background: trcReminder.urgent ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.1)',
                border: `1px solid ${trcReminder.urgent ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.2)'}`,
              }}>
                <div className="flex items-start gap-3">
                  <Icon name={trcReminder.urgent ? "alert" : "info"} className="w-5 h-5 text-terra-ink" />
                  <div>
                    <p className="font-semibold text-terra-ink mb-1">
                      {trcReminder.urgent ? 'TRC Expiry Alert' : 'TRC Reminder'}
                    </p>
                    <p className="text-sm" style={{ color: trcReminder.urgent ? '#fca5a5' : '#fcd34d' }}>
                      {trcReminder.message}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* City Pulse */}
            <div className="mb-7">
              <h2 className="text-xs font-semibold text-terra-taupe uppercase tracking-wider mb-3 flex items-center gap-2">
                <Icon name="pin" className="w-3.5 h-3.5 text-terra-ink-soft" /> City Pulse
              </h2>
              <div className="flex flex-col gap-2">
                {pulseItems.length > 0 ? (
                  pulseItems.map((item) => (
                    <div key={item.id} className="p-4 rounded-2xl glass-panel">
                      <p className="text-sm font-semibold text-terra-ink mb-1">{item.title}</p>
                      <p className="text-xs text-terra-ink-soft line-clamp-2">{item.message}</p>
                    </div>
                  ))
                ) : (
                  <div className="grid gap-2">
                    <div className="p-4 rounded-2xl glass-panel">
                      <p className="text-sm text-terra-ink-soft">Live events will appear here as the city wakes up.</p>
                    </div>
                    <div className="p-4 rounded-2xl glass-panel">
                      <p className="text-xs text-terra-taupe">Add your interests to see hobby-matched events.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Pro tip */}
            {briefing?.tip && (
              <div className="p-4 rounded-2xl mb-7 glass-panel">
                <p className="text-sm text-terra-ink">
                  <Icon name="spark" className="w-4 h-4 inline-block mr-1.5" /> <strong>Pro tip:</strong> {briefing.tip}
                </p>
              </div>
            )}

            {/* Today in Poland - AI history */}
            <div className="mb-7">
              <h2 className="text-xs font-semibold text-terra-taupe uppercase tracking-wider mb-3 flex items-center gap-2">
                <Icon name="globe" className="w-3.5 h-3.5 text-terra-ink-soft" /> Today in Poland
              </h2>
              <div className="p-4 rounded-2xl glass-panel">
                <p className="text-sm text-terra-ink-soft leading-relaxed">
                  {briefing?.todayInPoland || "Poland is home to 17 UNESCO World Heritage Sites."}
                </p>
              </div>
            </div>

            {/* AI badge if using AI */}
            {!briefing?.isFallback && (
              <div className="flex items-center gap-2 text-xs text-terra-taupe mb-4">
                <Icon name="spark" className="w-3.5 h-3.5 text-terra-taupe" />
                <span>Personalized by AI</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom hint */}
      <div className="px-6 pb-8 flex justify-center">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-terra-cream border border-black/10 text-terra-ink-soft text-xs animate-floatUp">
          <span>Swipe up to start</span>
          <Icon name="arrowUp" className="w-3.5 h-3.5 text-terra-ink-soft" />
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes briefingMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes floatUp {
          0%, 100% { transform: translateY(0); opacity: 0.8; }
          50% { transform: translateY(-4px); opacity: 1; }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        .animate-briefingMarquee {
          animation: briefingMarquee 22s linear infinite;
        }
        .animate-floatUp {
          animation: floatUp 2.2s ease-in-out infinite;
        }
      `}</style>
    </div>,
    document.body
  )
}

export default MorningBriefing









