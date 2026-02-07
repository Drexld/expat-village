import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import Icon from '../components/Icon'
import './ExpatOnboarding.css'

const TOTAL_DURATION = 14
const CINEMATIC_EASE = [0.22, 0.61, 0.36, 1]

const STAGES = [
  {
    id: 'arrival',
    label: 'Arrival',
    start: 0,
    end: 3,
    image: '/images/expat-onboarding/hero-bg.jpg',
    title: 'Expat Village - Warsaw and Beyond',
    subtitle: 'Your soft landing in Poland',
    copy: "From paperwork to Polish sunsets - we've got you",
  },
  {
    id: 'promise',
    label: 'Promise',
    start: 3,
    end: 6,
    image: '/images/expat-onboarding/oldtown.jpg',
    title: 'A calmer way to begin life in Warsaw',
    copy: 'Relocation can feel intense. We turn uncertainty into clear next actions, trusted local context, and a community that truly understands this transition.',
  },
  {
    id: 'path',
    label: 'Path',
    start: 6,
    end: 9,
    image: '/images/expat-onboarding/oldtown.jpg',
    title: 'Handle the hard stuff, step by step',
    copy: 'One practical path from arrival pressure to everyday confidence.',
  },
  {
    id: 'village',
    label: 'Village',
    start: 9,
    end: 12,
    image: '/images/expat-onboarding/riverside.jpg',
    title: 'Daily city pulse, curated for expats',
    copy: 'Discover trusted recommendations, local events, real stories from people building a life here. Practical updates meet human warmth so your days feel connected.',
  },
  {
    id: 'final',
    label: 'Start',
    start: 12,
    end: 14,
    title: 'Ready to make Warsaw feel like home?',
  },
]

const STEP_CARDS = [
  {
    id: 'pesel',
    icon: 'checklist',
    title: 'PESEL',
    description: 'Prepare your documents and get your national ID number without office-day guesswork.',
  },
  {
    id: 'residency',
    icon: 'document',
    title: 'Residency',
    description: 'Navigate permits, timelines, and legal next steps with clear guidance.',
  },
  {
    id: 'banking',
    icon: 'building',
    title: 'Banking',
    description: 'Open the right account fast and avoid common newcomer mistakes.',
  },
  {
    id: 'healthcare',
    icon: 'health',
    title: 'Healthcare',
    description: 'Compare NFZ and private options so you can access care with confidence.',
  },
  {
    id: 'housing',
    icon: 'home',
    title: 'Housing',
    description: 'Find trusted neighborhoods and rental guidance before signing.',
  },
  {
    id: 'jobs',
    icon: 'briefcase',
    title: 'Jobs',
    description: 'Understand CV norms, permit realities, and practical routes into Warsaw work life.',
  },
]

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value))
}

function smoothstep(edge0, edge1, value) {
  const t = clamp((value - edge0) / (edge1 - edge0))
  return t * t * (3 - 2 * t)
}

function mix(a, b, t) {
  return a + (b - a) * clamp(t)
}

function fadeWindow(time, start, end, fadeIn = 0.36, fadeOut = 0.4) {
  const enter = smoothstep(start - fadeIn, start + 0.01, time)
  const leave = 1 - smoothstep(end - 0.01, end + fadeOut, time)
  return clamp(Math.min(enter, leave))
}

function getActiveStageIndex(time) {
  for (let idx = STAGES.length - 1; idx >= 0; idx -= 1) {
    if (time >= STAGES[idx].start) return idx
  }
  return 0
}

function ExpatOnboarding() {
  const shouldReduceMotion = Boolean(useReducedMotion())

  const exportMode = useMemo(() => {
    if (typeof window === 'undefined') return false
    return new URLSearchParams(window.location.search).get('export') === '1'
  }, [])

  const initialTime = useMemo(() => {
    if (typeof window === 'undefined') return 0
    const parsed = Number.parseFloat(new URLSearchParams(window.location.search).get('t') || '0')
    return clamp(Number.isFinite(parsed) ? parsed : 0, 0, TOTAL_DURATION)
  }, [])

  const timeRef = useRef(initialTime)
  const [time, setTime] = useState(initialTime)
  const [isPlaying, setIsPlaying] = useState(() => !exportMode)
  const [playbackSeed, setPlaybackSeed] = useState(0)
  const _MOTION_COMPONENT_REFERENCE = motion.div

  const jumpToTime = useCallback(
    (nextTime) => {
      const clamped = clamp(nextTime, 0, TOTAL_DURATION)
      timeRef.current = clamped
      setTime(clamped)
      if (!exportMode && isPlaying) {
        setPlaybackSeed((prev) => prev + 1)
      }
    },
    [exportMode, isPlaying]
  )

  const goToStage = useCallback(
    (index) => {
      const stage = STAGES[index]
      if (!stage) return
      jumpToTime(stage.start + 0.001)
    },
    [jumpToTime]
  )

  useEffect(() => {
    if (exportMode || !isPlaying) return undefined

    let rafId = 0
    const start = performance.now() - timeRef.current * 1000

    const tick = (now) => {
      const elapsed = ((now - start) / 1000) % TOTAL_DURATION
      timeRef.current = elapsed
      setTime(elapsed)
      rafId = window.requestAnimationFrame(tick)
    }

    rafId = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(rafId)
  }, [exportMode, isPlaying, playbackSeed])

  useEffect(() => {
    if (!exportMode || typeof window === 'undefined') return undefined

    const setExportTime = (value) => {
      const parsed = Number.parseFloat(value)
      if (!Number.isFinite(parsed)) return
      jumpToTime(parsed)
    }

    window.__setExpatOnboardingTime = setExportTime
    window.__expatOnboardingDuration = TOTAL_DURATION
    setExportTime(initialTime)

    return () => {
      delete window.__setExpatOnboardingTime
      delete window.__expatOnboardingDuration
    }
  }, [exportMode, initialTime, jumpToTime])

  const activeStageIndex = getActiveStageIndex(time)
  const progressRatio = clamp(time / TOTAL_DURATION)
  const stageState = STAGES.map((stage) => {
    const duration = stage.end - stage.start
    const progress = clamp((time - stage.start) / duration)
    const opacity = fadeWindow(time, stage.start, stage.end)
    return { progress, opacity }
  })

  const arrival = stageState[0]
  const promise = stageState[1]
  const pathStage = stageState[2]
  const village = stageState[3]
  const final = stageState[4]

  const ambientDrift = shouldReduceMotion ? 0 : Math.sin(time * 0.9) * 8
  const heroScale = mix(1.05, 1, arrival.progress)
  const heroY = shouldReduceMotion ? 0 : mix(-10, 18, arrival.progress) + ambientDrift
  const promiseY = shouldReduceMotion ? 0 : mix(16, -12, promise.progress) + ambientDrift * 0.4
  const villageY = shouldReduceMotion ? 0 : mix(16, -18, village.progress) - ambientDrift * 0.5

  const timeLabel = `${String(Math.floor(time)).padStart(2, '0')}:${String(Math.floor((time % 1) * 10)).padStart(1, '0')}`

  return (
    <main className={`expat-cinematic-player${exportMode ? ' is-export' : ''}`}>
      <div className="expat-film-canvas">
        <motion.section
          className="expat-scene-layer"
          style={{ opacity: arrival.opacity, pointerEvents: arrival.opacity > 0.52 ? 'auto' : 'none' }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.55, ease: CINEMATIC_EASE }}
        >
          <motion.div className="expat-scene-media" style={{ transform: `translateY(${heroY}px) scale(${heroScale})` }}>
            <img src={STAGES[0].image} alt="Palace of Culture and Science tower in Warsaw at dusk" loading="eager" className="expat-scene-image" />
            <div className="expat-scene-overlay expat-scene-overlay-hero" />
            <div className="expat-scene-vignette" />
            <span className="expat-blob expat-blob-a" aria-hidden />
            <span className="expat-blob expat-blob-b" aria-hidden />
          </motion.div>
          <div className="expat-scene-content expat-arrival-content">
            <p className="expat-overline">Expat Village</p>
            <h1>{STAGES[0].title}</h1>
            <h2>{STAGES[0].subtitle}</h2>
            <p className="expat-copy">{STAGES[0].copy}</p>
            <Link to="/onboarding" className="expat-cta-primary" aria-label="Begin your onboarding journey">
              Begin Your Journey
              <span aria-hidden>{'->'}</span>
            </Link>
          </div>
        </motion.section>

        <motion.section
          className="expat-scene-layer"
          style={{ opacity: promise.opacity, pointerEvents: promise.opacity > 0.5 ? 'auto' : 'none' }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: CINEMATIC_EASE }}
        >
          <div className="expat-scene-media" style={{ transform: `translateY(${promiseY}px)` }}>
            <img src={STAGES[1].image} alt="Warm Old Town square evening lights in Warsaw" loading="lazy" className="expat-scene-image" />
            <div className="expat-scene-overlay expat-scene-overlay-warm" />
          </div>
          <div className="expat-scene-content expat-panel-content">
            <div className="expat-panel">
              <p className="expat-overline">The Promise</p>
              <h3>{STAGES[1].title}</h3>
              <p className="expat-copy">{STAGES[1].copy}</p>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="expat-scene-layer"
          style={{ opacity: pathStage.opacity, pointerEvents: pathStage.opacity > 0.5 ? 'auto' : 'none' }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: CINEMATIC_EASE }}
        >
          <div className="expat-scene-media">
            <img src={STAGES[2].image} alt="Old Town details in Warsaw at dusk" loading="lazy" className="expat-scene-image" />
            <div className="expat-scene-overlay expat-scene-overlay-path" />
          </div>
          <div className="expat-scene-content expat-path-content">
            <div className="expat-path-header">
              <p className="expat-overline">The Path</p>
              <h3>{STAGES[2].title}</h3>
              <p className="expat-copy">{STAGES[2].copy}</p>
            </div>
            <div className="expat-path-grid">
              {STEP_CARDS.map((step, index) => {
                const cardProgress = smoothstep(0.12 + index * 0.07, 0.45 + index * 0.07, pathStage.progress)
                const opacity = pathStage.opacity * cardProgress
                const y = mix(34, 0, cardProgress)
                return (
                  <article key={step.id} className="expat-step-card" style={{ opacity, transform: `translateY(${y}px)` }}>
                    <div className="expat-step-head">
                      <span className="expat-step-icon">
                        <Icon name={step.icon} size={16} />
                      </span>
                      <span className="expat-step-title">{step.title}</span>
                    </div>
                    <p>{step.description}</p>
                    <Link to={`/onboarding?step=${step.id}`} className="expat-step-link" aria-label={`Learn more about ${step.title}`}>
                      Learn More
                      <span aria-hidden>{'->'}</span>
                    </Link>
                  </article>
                )
              })}
            </div>
          </div>
        </motion.section>

        <motion.section
          className="expat-scene-layer"
          style={{ opacity: village.opacity, pointerEvents: village.opacity > 0.5 ? 'auto' : 'none' }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: CINEMATIC_EASE }}
        >
          <div className="expat-scene-media" style={{ transform: `translateY(${villageY}px)` }}>
            <img src={STAGES[3].image} alt="Vistula promenade and Warsaw skyline at golden hour" loading="lazy" className="expat-scene-image" />
            <div className="expat-scene-overlay expat-scene-overlay-village" />
          </div>
          <div className="expat-scene-content expat-panel-content">
            <div className="expat-panel">
              <p className="expat-overline">The Village</p>
              <h3>{STAGES[3].title}</h3>
              <p className="expat-copy">{STAGES[3].copy}</p>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="expat-scene-layer"
          style={{ opacity: final.opacity, pointerEvents: final.opacity > 0.45 ? 'auto' : 'none' }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease: CINEMATIC_EASE }}
        >
          <div className="expat-scene-media expat-scene-media-final">
            <div className="expat-scene-overlay expat-scene-overlay-final" />
            <div className="expat-burst" style={{ transform: `scale(${mix(0.65, 1.08, final.progress)})` }} />
          </div>
          <div className="expat-scene-content expat-panel-content">
            <div className="expat-panel expat-panel-final">
              <p className="expat-overline">Final Step</p>
              <h3>{STAGES[4].title}</h3>
              <div className="expat-final-actions">
                <Link to="/onboarding" className="expat-cta-primary" aria-label="Start onboarding">
                  Start Onboarding
                </Link>
                <Link to="/explore" className="expat-cta-secondary" aria-label="Explore first">
                  Explore First
                </Link>
              </div>
            </div>
          </div>
        </motion.section>
      </div>

      <nav className="expat-stage-nav" aria-label="Onboarding stage navigation">
        <div className="expat-stage-head">
          <span>Cinematic Flow</span>
          <span>{timeLabel}</span>
        </div>
        <div className="expat-stage-progress">
          <span style={{ width: `${progressRatio * 100}%` }} />
        </div>
        <ol className="expat-stage-nav-list">
          {STAGES.map((stage, index) => (
            <li key={stage.id}>
              <button
                type="button"
                className={`expat-stage-nav-item${activeStageIndex === index ? ' is-active' : ''}`}
                aria-current={activeStageIndex === index ? 'step' : undefined}
                aria-label={`Jump to ${stage.label}`}
                onClick={() => goToStage(index)}
              >
                <span className="expat-stage-nav-dot" aria-hidden />
                <span className="expat-stage-nav-label">{stage.label}</span>
              </button>
            </li>
          ))}
        </ol>
        <div className="expat-stage-nav-controls">
          <button
            type="button"
            className="expat-nav-control"
            onClick={() => goToStage(Math.max(0, activeStageIndex - 1))}
            disabled={activeStageIndex === 0}
            aria-label="Go to previous stage"
          >
            <Icon name="arrowLeft" size={15} />
            Back
          </button>
          <button
            type="button"
            className="expat-nav-control"
            onClick={() => {
              setIsPlaying((prev) => !prev)
              setPlaybackSeed((prev) => prev + 1)
            }}
            aria-label={isPlaying ? 'Pause timeline' : 'Play timeline'}
            disabled={exportMode}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button
            type="button"
            className="expat-nav-control"
            onClick={() => goToStage(Math.min(STAGES.length - 1, activeStageIndex + 1))}
            disabled={activeStageIndex === STAGES.length - 1}
            aria-label="Go to next stage"
          >
            Next
            <Icon name="arrowRight" size={15} />
          </button>
        </div>
      </nav>
    </main>
  )
}

export default ExpatOnboarding
