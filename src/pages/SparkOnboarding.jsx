import { useEffect, useMemo, useState } from 'react'
import Icon from '../components/Icon'
import './SparkOnboarding.css'

const TOTAL_DURATION = 14

const BLOB_CONFIG = [
  { x: -170, y: -220, size: 190, color: '#ff4fb3', orbit: 18, phase: 0.2 },
  { x: 155, y: -205, size: 170, color: '#39d5ff', orbit: 20, phase: 0.8 },
  { x: -190, y: -18, size: 150, color: '#ff8b3d', orbit: 14, phase: 1.6 },
  { x: 178, y: 12, size: 160, color: '#d7ff4a', orbit: 16, phase: 2.2 },
  { x: -122, y: 210, size: 182, color: '#63ffbc', orbit: 20, phase: 2.9 },
  { x: 142, y: 208, size: 176, color: '#905dff', orbit: 19, phase: 3.8 },
]

const THEME_CARDS = [
  { title: 'Rebellions', color: '#ff8b3d', icon: 'bolt' },
  { title: 'Rockets', color: '#3fd0ff', icon: 'mapRoute' },
  { title: 'Pokemon', color: '#ffd454', icon: 'spark' },
  { title: 'Potatoes', color: '#e8c898', icon: 'cart' },
  { title: 'Wonders of the World', color: '#8fd7ff', icon: 'globe' },
  { title: 'Blue Whales', color: '#55a6ff', icon: 'cloud' },
  { title: 'Pop Culture', color: '#ff63bc', icon: 'music' },
  { title: 'Science Facts', color: '#7dffa5', icon: 'health' },
  { title: 'History Mysteries', color: '#be93ff', icon: 'book' },
]

const PUZZLE_ICONS = [
  { name: 'checklist', label: 'Word' },
  { name: 'mapRoute', label: 'Match' },
  { name: 'graduation', label: 'Quiz' },
  { name: 'link', label: 'Connect' },
]

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value))
}

function smoothstep(edge0, edge1, x) {
  const t = clamp((x - edge0) / (edge1 - edge0))
  return t * t * (3 - 2 * t)
}

function easeOutBack(value) {
  const c1 = 1.70158
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

function SparkOnboarding() {
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

    window.__setSparkTime = setExportTime
    window.__sparkDuration = TOTAL_DURATION

    return () => {
      delete window.__setSparkTime
      delete window.__sparkDuration
    }
  }, [exportMode])

  const scene1Progress = clamp(time / 3)
  const scene2Progress = clamp((time - 3) / 3)
  const scene3Progress = clamp((time - 6) / 3)
  const scene4Progress = clamp((time - 9) / 3)
  const scene5Progress = clamp((time - 12) / 2)

  const scene1Opacity = fadeWindow(time, 0, 3, 0.2, 0.45)
  const scene2Opacity = fadeWindow(time, 3, 6, 0.45, 0.35)
  const scene3Opacity = fadeWindow(time, 6, 9, 0.35, 0.35)
  const scene4Opacity = fadeWindow(time, 9, 12, 0.35, 0.42)
  const scene5Opacity = fadeWindow(time, 12, 14, 0.3, 0.1)

  const centerCardIndex = Math.round(scene3Progress * (THEME_CARDS.length - 1))
  const cardShift = mix(0, -136 * (THEME_CARDS.length - 1), scene3Progress)
  const pulseScale = 1 + Math.sin(time * 7.2) * 0.03

  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, idx) => ({
        id: idx,
        left: ((idx * 37) % 100) + '%',
        top: ((idx * 61) % 100) + '%',
        delay: `${(idx * 0.09).toFixed(2)}s`,
        duration: `${(2.2 + (idx % 6) * 0.38).toFixed(2)}s`,
      })),
    []
  )

  return (
    <div className={`spark-onboarding-page${exportMode ? ' is-export' : ''}`}>
      <div className={`spark-stage${exportMode ? ' is-export' : ''}`} aria-label="Spark onboarding animation preview">
        <div className="spark-film-grain" />

        <div className="spark-bg spark-bg-1" style={{ opacity: scene1Opacity }} />
        <div className="spark-bg spark-bg-2" style={{ opacity: scene2Opacity }} />
        <div className="spark-bg spark-bg-3" style={{ opacity: scene3Opacity }} />
        <div className="spark-bg spark-bg-4" style={{ opacity: scene4Opacity }} />
        <div className="spark-bg spark-bg-5" style={{ opacity: scene5Opacity }} />

        <header className="spark-status-bar">
          <span className="spark-status-time">9:41</span>
          <span className="spark-status-icons">
            <span className="spark-pill-dot" />
            <span className="spark-pill-dot" />
            <span className="spark-pill-dot spark-pill-dot-wide" />
          </span>
        </header>

        <div className="spark-blob-layer">
          {BLOB_CONFIG.map((blob, idx) => {
            const floatX = Math.sin(time * 1.15 + blob.phase) * blob.orbit
            const floatY = Math.cos(time * 1.28 + blob.phase) * blob.orbit * 0.9
            const x = mix(blob.x + floatX, 0, scene5Progress)
            const y = mix(blob.y + floatY, 0, scene5Progress)
            const scale = mix(1, 0.44, scene5Progress)

            return (
              <span
                key={`${blob.color}-${idx}`}
                className="spark-blob"
                style={{
                  width: `${blob.size}px`,
                  height: `${blob.size}px`,
                  '--blob-color': blob.color,
                  '--blob-x': `${x}px`,
                  '--blob-y': `${y}px`,
                  '--blob-scale': scale,
                  opacity: clamp(0.34 + scene1Opacity * 0.72 + scene2Opacity * 0.5 + scene3Opacity * 0.35),
                  animationDelay: `${idx * 0.21}s`,
                }}
              />
            )
          })}
        </div>

        <section
          className="spark-scene spark-scene-1"
          style={{
            opacity: scene1Opacity,
            transform: `scale(${mix(1, 1.08, scene1Progress)})`,
          }}
        >
          <div
            className="spark-scene-copy"
            style={{
              transform: `translateY(${mix(22, 0, scene1Progress)}px) scale(${mix(0.93, 1, easeOutBack(scene1Progress))})`,
            }}
          >
            <h1>Learn something new every day</h1>
            <div className="spark-underline">
              <span />
              <span />
              <span />
            </div>
          </div>
        </section>

        <section className="spark-scene spark-scene-2" style={{ opacity: scene2Opacity }}>
          <div className="spark-ripple" style={{ transform: `scale(${mix(0.7, 1.55, scene2Progress)})`, opacity: 1 - scene2Progress }} />
          <p className="spark-kicker">Daily handcrafted puzzles</p>
          <div
            className="spark-phone-shell"
            style={{
              transform: `translateY(${mix(44, 0, scene2Progress)}px) scale(${mix(0.86, 1, easeOutBack(scene2Progress))})`,
            }}
          >
            <div className="spark-phone-notch" />
            <div className="spark-phone-screen">
              <div className="spark-puzzle-card">
                <p className="spark-card-eyebrow">Today&apos;s theme</p>
                <h2>Rebellions</h2>
              </div>
              <div className="spark-puzzle-icons">
                {PUZZLE_ICONS.map((item, idx) => (
                  <div key={item.label} className="spark-puzzle-icon" style={{ animationDelay: `${0.15 + idx * 0.1}s` }}>
                    <Icon name={item.name} size={16} />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="spark-scene spark-scene-3" style={{ opacity: scene3Opacity }}>
          <div className="spark-copy-block" style={{ transform: `scale(${mix(0.95, 1, easeOutBack(scene3Progress))})` }}>
            <h2>Pick your poison</h2>
            <p>Choose a topic that sparks your curiosity</p>
          </div>
          <div className="spark-carousel-wrap">
            <div className="spark-carousel-track" style={{ transform: `translateX(${cardShift}px)` }}>
              {THEME_CARDS.map((theme, idx) => {
                const isCentered = idx === centerCardIndex
                return (
                  <article
                    key={theme.title}
                    className={`spark-theme-card${isCentered ? ' is-selected' : ''}`}
                    style={{
                      '--theme-color': theme.color,
                      transform: `translateY(${isCentered ? -8 : Math.sin(time * 2.1 + idx) * 3}px) scale(${isCentered ? pulseScale : 0.94}) rotate(${isCentered ? Math.sin(time * 3.6) * 0.8 : (idx % 2 === 0 ? -1.4 : 1.4)}deg)`,
                    }}
                  >
                    <div className="spark-theme-icon">
                      <Icon name={theme.icon} size={18} />
                    </div>
                    <h3>{theme.title}</h3>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="spark-scene spark-scene-4" style={{ opacity: scene4Opacity }}>
          <div
            className="spark-zoom-theme"
            style={{
              transform: `scale(${mix(0.84, 1.06, scene4Progress)}) translateY(${mix(16, -8, scene4Progress)}px)`,
            }}
          >
            <p className="spark-kicker">Rebellions puzzle mode</p>
            <h2>Expand your mind in minutes a day</h2>

            <div className="spark-grid-puzzle">
              {Array.from({ length: 16 }, (_, idx) => (
                <span key={`grid-${idx}`} className="spark-grid-cell" style={{ animationDelay: `${0.2 + (idx % 4) * 0.06}s` }} />
              ))}
            </div>

            <div className="spark-connection-lines">
              <span className="spark-line spark-line-a" style={{ transform: `scaleX(${mix(0.2, 1, scene4Progress)})` }} />
              <span className="spark-line spark-line-b" style={{ transform: `scaleX(${mix(0.15, 1, scene4Progress)})` }} />
              <span className="spark-line spark-line-c" style={{ transform: `scaleX(${mix(0.1, 1, scene4Progress)})` }} />
            </div>
          </div>
        </section>

        <section className="spark-scene spark-scene-5" style={{ opacity: scene5Opacity }}>
          <div className="spark-burst" style={{ transform: `scale(${mix(0.4, 1.18, scene5Progress)})`, opacity: mix(0.3, 1, scene5Progress) }} />
          <div className="spark-logo-lockup" style={{ transform: `translateY(${mix(14, 0, easeOutBack(scene5Progress))}px)` }}>
            <h2>Spark</h2>
            <p>Puzzles for the curious</p>
          </div>

          <div className="spark-particles">
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

export default SparkOnboarding
