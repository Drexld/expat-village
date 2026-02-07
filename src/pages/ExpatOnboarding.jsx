import { useEffect, useMemo, useState } from 'react'
import Icon from '../components/Icon'
import './ExpatOnboarding.css'

const TOTAL_DURATION = 14

const BLOB_CONFIG = [
  { x: -168, y: -214, size: 214, color: 'rgba(199,107,85,0.44)', orbit: 14, phase: 0.2 },
  { x: 170, y: -190, size: 188, color: 'rgba(117,153,124,0.4)', orbit: 15, phase: 0.85 },
  { x: -194, y: -10, size: 166, color: 'rgba(210,160,115,0.38)', orbit: 12, phase: 1.5 },
  { x: 188, y: 24, size: 170, color: 'rgba(168,154,143,0.36)', orbit: 12, phase: 2.2 },
  { x: -132, y: 220, size: 204, color: 'rgba(246,195,143,0.3)', orbit: 14, phase: 2.9 },
  { x: 146, y: 212, size: 196, color: 'rgba(117,153,124,0.28)', orbit: 13, phase: 3.5 },
]

const JOURNEY_CARDS = [
  { title: 'PESEL', subtitle: 'Set up your local ID', icon: 'checklist', accent: 'rgba(199,107,85,0.58)' },
  { title: 'Residency', subtitle: 'TRC and permit guidance', icon: 'document', accent: 'rgba(210,160,115,0.56)' },
  { title: 'Banking', subtitle: 'Open the right account', icon: 'building', accent: 'rgba(117,153,124,0.56)' },
  { title: 'Healthcare', subtitle: 'NFZ and private cover', icon: 'health', accent: 'rgba(199,107,85,0.48)' },
  { title: 'Housing', subtitle: 'Trusted rentals and checks', icon: 'home', accent: 'rgba(168,154,143,0.62)' },
  { title: 'Jobs', subtitle: 'Career and paperwork support', icon: 'briefcase', accent: 'rgba(117,153,124,0.6)' },
]

const CITY_PULSE_ITEMS = [
  { icon: 'bellPin', label: 'City alert', value: 'M2 delay around Centrum' },
  { icon: 'cloud', label: 'Weather', value: '2C and light snow in Warsaw' },
  { icon: 'calendar', label: 'Today', value: 'District office open until 17:00' },
]

const COMMUNITY_SNIPPETS = [
  { name: 'Charlotte Menora', note: '4.7 rating', icon: 'pin' },
  { name: 'Town Hall Live', note: '128 expats online', icon: 'community' },
]

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value))
}

function smoothstep(edge0, edge1, x) {
  const t = clamp((x - edge0) / (edge1 - edge0))
  return t * t * (3 - 2 * t)
}

function easeOutBack(value) {
  const c1 = 1.35
  const c3 = c1 + 1
  const t = clamp(value)
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}

function fadeWindow(time, start, end, fadeIn = 0.35, fadeOut = 0.35) {
  const enter = smoothstep(start - fadeIn, start + 0.01, time)
  const leave = 1 - smoothstep(end - 0.01, end + fadeOut, time)
  return clamp(Math.min(enter, leave))
}

function mix(a, b, t) {
  return a + (b - a) * clamp(t)
}

function ExpatOnboarding() {
  const exportMode = useMemo(() => {
    if (typeof window === 'undefined') return false
    return new URLSearchParams(window.location.search).get('export') === '1'
  }, [])

  const initialTime = useMemo(() => {
    if (typeof window === 'undefined') return 0
    const t = Number.parseFloat(new URLSearchParams(window.location.search).get('t') || '0')
    return clamp(Number.isFinite(t) ? t : 0, 0, TOTAL_DURATION)
  }, [])

  const [time, setTime] = useState(initialTime)

  useEffect(() => {
    if (exportMode) return undefined

    let rafId = 0
    const start = performance.now()

    const tick = (now) => {
      const elapsed = ((now - start) / 1000) % TOTAL_DURATION
      setTime(elapsed)
      rafId = window.requestAnimationFrame(tick)
    }

    rafId = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(rafId)
  }, [exportMode])

  useEffect(() => {
    if (!exportMode || typeof window === 'undefined') return undefined

    const setExportTime = (value) => {
      const next = Number.parseFloat(value)
      if (!Number.isFinite(next)) return
      setTime(clamp(next, 0, TOTAL_DURATION))
    }

    window.__setExpatOnboardingTime = setExportTime
    window.__expatOnboardingDuration = TOTAL_DURATION

    return () => {
      delete window.__setExpatOnboardingTime
      delete window.__expatOnboardingDuration
    }
  }, [exportMode])

  const scene1Progress = clamp(time / 3)
  const scene2Progress = clamp((time - 3) / 3)
  const scene3Progress = clamp((time - 6) / 3)
  const scene4Progress = clamp((time - 9) / 3)
  const scene5Progress = clamp((time - 12) / 2)

  const scene1Opacity = fadeWindow(time, 0, 3, 0.2, 0.42)
  const scene2Opacity = fadeWindow(time, 3, 6, 0.35, 0.35)
  const scene3Opacity = fadeWindow(time, 6, 9, 0.35, 0.35)
  const scene4Opacity = fadeWindow(time, 9, 12, 0.35, 0.4)
  const scene5Opacity = fadeWindow(time, 12, 14, 0.3, 0.12)

  const centerCardIndex = Math.round(scene3Progress * (JOURNEY_CARDS.length - 1))
  const cardShift = mix(0, -152 * (JOURNEY_CARDS.length - 1), scene3Progress)
  const pulseScale = 1 + Math.sin(time * 6.8) * 0.024

  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, idx) => ({
        id: idx,
        left: ((idx * 37) % 100) + '%',
        top: ((idx * 59) % 100) + '%',
        delay: `${(idx * 0.08).toFixed(2)}s`,
        duration: `${(2.2 + (idx % 5) * 0.42).toFixed(2)}s`,
      })),
    []
  )

  return (
    <div className={`expat-onboarding-page${exportMode ? ' is-export' : ''}`}>
      <div className={`expat-stage${exportMode ? ' is-export' : ''}`} aria-label="Expat Village onboarding animation preview">
        <div className="expat-film-grain" />

        <div className="expat-bg expat-bg-1" style={{ opacity: scene1Opacity }} />
        <div className="expat-bg expat-bg-2" style={{ opacity: scene2Opacity }} />
        <div className="expat-bg expat-bg-3" style={{ opacity: scene3Opacity }} />
        <div className="expat-bg expat-bg-4" style={{ opacity: scene4Opacity }} />
        <div className="expat-bg expat-bg-5" style={{ opacity: scene5Opacity }} />

        <header className="expat-status-bar">
          <span className="expat-status-time">9:41</span>
          <span className="expat-status-icons">
            <span className="expat-pill-dot" />
            <span className="expat-pill-dot" />
            <span className="expat-pill-dot expat-pill-dot-wide" />
          </span>
        </header>

        <div className="expat-blob-layer">
          {BLOB_CONFIG.map((blob, idx) => {
            const floatX = Math.sin(time * 1.04 + blob.phase) * blob.orbit
            const floatY = Math.cos(time * 1.16 + blob.phase) * blob.orbit * 0.9
            const x = mix(blob.x + floatX, 0, scene5Progress)
            const y = mix(blob.y + floatY, 0, scene5Progress)
            const scale = mix(1, 0.46, scene5Progress)

            return (
              <span
                key={`${blob.color}-${idx}`}
                className="expat-blob"
                style={{
                  width: `${blob.size}px`,
                  height: `${blob.size}px`,
                  '--blob-color': blob.color,
                  '--blob-x': `${x}px`,
                  '--blob-y': `${y}px`,
                  '--blob-scale': scale,
                  opacity: clamp(0.3 + scene1Opacity * 0.66 + scene2Opacity * 0.46 + scene3Opacity * 0.34),
                  animationDelay: `${idx * 0.18}s`,
                }}
              />
            )
          })}
        </div>

        <section
          className="expat-scene expat-scene-1"
          style={{
            opacity: scene1Opacity,
            transform: `scale(${mix(1, 1.05, scene1Progress)})`,
          }}
        >
          <div
            className="expat-scene-copy"
            style={{
              transform: `translateY(${mix(18, 0, scene1Progress)}px) scale(${mix(0.95, 1, easeOutBack(scene1Progress))})`,
            }}
          >
            <h1>Your soft landing in Poland</h1>
            <p>Local guidance for real expat life, every day.</p>
            <div className="expat-underline">
              <span />
              <span />
              <span />
            </div>
          </div>
        </section>

        <section className="expat-scene expat-scene-2" style={{ opacity: scene2Opacity }}>
          <div className="expat-ripple" style={{ transform: `scale(${mix(0.78, 1.34, scene2Progress)})`, opacity: 1 - scene2Progress }} />
          <p className="expat-kicker">Daily city pulse, curated for expats</p>
          <div
            className="expat-phone-shell glass-3d texture-layer texture-paper"
            style={{
              transform: `translateY(${mix(35, 0, scene2Progress)}px) scale(${mix(0.9, 1, easeOutBack(scene2Progress))})`,
            }}
          >
            <div className="expat-phone-notch" />
            <div className="expat-phone-screen">
              <div className="expat-pulse-header">
                <Icon name="pin" size={14} />
                <span>Warsaw Live</span>
              </div>
              <div className="expat-pulse-chips">
                <span className="pill">2C</span>
                <span className="pill">City alerts</span>
              </div>
              <div className="expat-pulse-list">
                {CITY_PULSE_ITEMS.map((item, idx) => (
                  <div key={item.label} className="expat-pulse-item glass-panel" style={{ animationDelay: `${0.14 + idx * 0.08}s` }}>
                    <Icon name={item.icon} size={14} />
                    <div>
                      <p>{item.label}</p>
                      <span>{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="expat-scene expat-scene-3" style={{ opacity: scene3Opacity }}>
          <div className="expat-copy-block" style={{ transform: `scale(${mix(0.96, 1, easeOutBack(scene3Progress))})` }}>
            <h2>Handle the hard stuff, step by step</h2>
            <p>PESEL, residency, banking, and healthcare in one flow.</p>
          </div>
          <div className="expat-carousel-wrap">
            <div className="expat-carousel-track" style={{ transform: `translateX(${cardShift}px)` }}>
              {JOURNEY_CARDS.map((card, idx) => {
                const isCentered = idx === centerCardIndex
                return (
                  <article
                    key={card.title}
                    className={`expat-journey-card${isCentered ? ' is-selected' : ''} glass-panel texture-layer texture-paper`}
                    style={{
                      '--journey-accent': card.accent,
                      transform: `translateY(${isCentered ? -6 : Math.sin(time * 2 + idx) * 2}px) scale(${isCentered ? pulseScale : 0.95}) rotate(${isCentered ? Math.sin(time * 3.2) * 0.4 : (idx % 2 === 0 ? -0.9 : 0.9)}deg)`,
                    }}
                  >
                    <div className="expat-journey-icon">
                      <Icon name={card.icon} size={17} />
                    </div>
                    <h3>{card.title}</h3>
                    <p>{card.subtitle}</p>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="expat-scene expat-scene-4" style={{ opacity: scene4Opacity }}>
          <div
            className="expat-discovery-shell"
            style={{
              transform: `scale(${mix(0.9, 1.02, scene4Progress)}) translateY(${mix(12, -5, scene4Progress)}px)`,
            }}
          >
            <h2>Find trusted places. Meet your village.</h2>
            <div className="expat-community-cards">
              {COMMUNITY_SNIPPETS.map((item, idx) => (
                <article key={item.name} className="expat-community-card action-card texture-layer texture-paper" style={{ animationDelay: `${0.2 + idx * 0.12}s` }}>
                  <Icon name={item.icon} size={18} />
                  <div>
                    <p>{item.name}</p>
                    <span>{item.note}</span>
                  </div>
                </article>
              ))}
            </div>
            <div className="expat-connection-lines">
              <span className="expat-line expat-line-a" style={{ transform: `scaleX(${mix(0.35, 1, scene4Progress)})` }} />
              <span className="expat-line expat-line-b" style={{ transform: `scaleX(${mix(0.25, 1, scene4Progress)})` }} />
            </div>
          </div>
        </section>

        <section className="expat-scene expat-scene-5" style={{ opacity: scene5Opacity }}>
          <div className="expat-burst" style={{ transform: `scale(${mix(0.55, 1.1, scene5Progress)})`, opacity: mix(0.35, 1, scene5Progress) }} />
          <div className="expat-logo-lockup" style={{ transform: `translateY(${mix(12, 0, easeOutBack(scene5Progress))}px)` }}>
            <img src="/icon.svg" alt="Expat Village" className="expat-logo-mark" />
            <h2>Expat Village</h2>
            <p>Warsaw & Beyond</p>
          </div>

          <div className="expat-particles">
            {particles.map((particle) => (
              <span
                key={particle.id}
                style={{
                  left: particle.left,
                  top: particle.top,
                  animationDelay: particle.delay,
                  animationDuration: particle.duration,
                }}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default ExpatOnboarding
