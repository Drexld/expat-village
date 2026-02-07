import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import Icon from '../components/Icon'
import './ExpatOnboarding.css'

const TOTAL_DURATION = 14
const CINEMATIC_EASE = [0.22, 0.61, 0.36, 1]

const STAGES = [
  {
    id: 'arrival',
    label: 'Arrival',
    navTarget: 'arrival',
    title: 'Expat Village - Warsaw and Beyond',
    subtitle: 'Your soft landing in Poland',
    tagline: "From paperwork to Polish sunsets - we've got you",
    image: '/images/expat-onboarding/hero-bg.jpg',
  },
  {
    id: 'promise',
    label: 'Promise',
    navTarget: 'promise',
    title: 'A calmer way to begin life in Warsaw',
    image: '/images/expat-onboarding/oldtown.jpg',
    copy: 'Relocation can feel intense. We turn uncertainty into clear next actions, trusted local context, and a community that truly understands this transition.',
  },
  {
    id: 'path',
    label: 'Path',
    navTarget: 'path',
    title: 'Handle the hard stuff, step by step',
    image: '/images/expat-onboarding/oldtown.jpg',
    copy: 'One practical path from arrival pressure to everyday confidence.',
  },
  {
    id: 'village',
    label: 'Village',
    navTarget: 'village',
    title: 'Daily city pulse, curated for expats',
    image: '/images/expat-onboarding/riverside.jpg',
    copy: 'Discover trusted recommendations, local events, real stories from people building a life here. Practical updates meet human warmth so your days feel connected.',
  },
  {
    id: 'final',
    label: 'Start',
    navTarget: 'final',
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

const revealVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.95, ease: CINEMATIC_EASE },
  },
}

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.14,
    },
  },
}

const lineVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: CINEMATIC_EASE },
  },
}

const _MOTION_COMPONENT_REFERENCE = motion.div

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value))
}

function ExpatOnboarding() {
  const shouldReduceMotion = Boolean(useReducedMotion())
  const stageRefs = useRef([])
  const ratioMapRef = useRef(new Map())
  const heroStageRef = useRef(null)
  const villageStageRef = useRef(null)
  const [activeStageIndex, setActiveStageIndex] = useState(0)
  const [selectedStepCard, setSelectedStepCard] = useState(STEP_CARDS[0].id)
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth < 768
  })

  const exportMode = useMemo(() => {
    if (typeof window === 'undefined') return false
    return new URLSearchParams(window.location.search).get('export') === '1'
  }, [])

  const initialTime = useMemo(() => {
    if (typeof window === 'undefined') return 0
    const rawTime = Number.parseFloat(new URLSearchParams(window.location.search).get('t') || '0')
    return clamp(Number.isFinite(rawTime) ? rawTime : 0, 0, TOTAL_DURATION)
  }, [])

  const sectionRevealProps = exportMode
    ? { initial: false, animate: 'visible' }
    : { initial: 'hidden', whileInView: 'visible', viewport: { once: true, amount: 0.28 } }

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroStageRef,
    offset: ['start start', 'end start'],
  })

  const { scrollYProgress: villageProgress } = useScroll({
    target: villageStageRef,
    offset: ['start end', 'end start'],
  })

  const heroParallaxY = useTransform(heroProgress, [0, 1], [0, shouldReduceMotion ? 0 : 110])
  const villageParallaxY = useTransform(villageProgress, [0, 1], [shouldReduceMotion ? 0 : 26, shouldReduceMotion ? 0 : -36])

  const registerStageRef = useCallback(
    (index) => (node) => {
      stageRefs.current[index] = node
      if (index === 0) heroStageRef.current = node
      if (index === 3) villageStageRef.current = node
    },
    []
  )

  const updateActiveStage = useCallback(() => {
    if (typeof window === 'undefined') return

    let bestIndex = -1
    let bestRatio = 0

    stageRefs.current.forEach((node, index) => {
      if (!node) return
      const ratio = ratioMapRef.current.get(node) ?? 0
      if (ratio > bestRatio) {
        bestRatio = ratio
        bestIndex = index
      }
    })

    if (bestIndex === -1 || bestRatio < 0.2) {
      const viewportAnchor = window.scrollY + window.innerHeight * 0.42
      let closestIndex = 0
      let closestDistance = Number.POSITIVE_INFINITY

      stageRefs.current.forEach((node, index) => {
        if (!node) return
        const rect = node.getBoundingClientRect()
        const sectionCenter = window.scrollY + rect.top + rect.height / 2
        const distance = Math.abs(sectionCenter - viewportAnchor)
        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = index
        }
      })

      bestIndex = closestIndex
    }

    setActiveStageIndex((prev) => (prev === bestIndex ? prev : bestIndex))
  }, [])

  const goToStage = useCallback(
    (index) => {
      const target = stageRefs.current[index]
      if (!target) return
      target.scrollIntoView({
        behavior: shouldReduceMotion || exportMode ? 'auto' : 'smooth',
        block: 'start',
      })
    },
    [exportMode, shouldReduceMotion]
  )

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const onResize = () => {
      setIsMobile(window.innerWidth < 768)
      updateActiveStage()
    }

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [updateActiveStage])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratioMapRef.current.set(entry.target, entry.intersectionRatio)
        })
        updateActiveStage()
      },
      { threshold: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9] }
    )

    stageRefs.current.forEach((node) => {
      if (node) observer.observe(node)
    })

    const onScroll = () => updateActiveStage()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [updateActiveStage])

  useEffect(() => {
    if (!exportMode || typeof window === 'undefined') return undefined

    const setExportTime = (value) => {
      const parsed = Number.parseFloat(value)
      if (!Number.isFinite(parsed)) return

      const progress = clamp(parsed / TOTAL_DURATION)
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
      const nextScroll = progress * maxScroll

      window.scrollTo({ top: nextScroll, behavior: 'auto' })
      updateActiveStage()
    }

    window.__setExpatOnboardingTime = setExportTime
    window.__expatOnboardingDuration = TOTAL_DURATION
    setExportTime(initialTime)

    return () => {
      delete window.__setExpatOnboardingTime
      delete window.__expatOnboardingDuration
    }
  }, [exportMode, initialTime, updateActiveStage])

  return (
    <main className={`expat-cinematic-flow${exportMode ? ' is-export' : ''}`}>
      <nav className="expat-stage-nav" aria-label="Onboarding stage navigation">
        <ol className="expat-stage-nav-list">
          {STAGES.map((stage, index) => (
            <li key={stage.id}>
              <button
                type="button"
                className={`expat-stage-nav-item${activeStageIndex === index ? ' is-active' : ''}`}
                aria-current={activeStageIndex === index ? 'step' : undefined}
                aria-label={`Go to ${stage.label}`}
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
            onClick={() => goToStage(Math.min(STAGES.length - 1, activeStageIndex + 1))}
            disabled={activeStageIndex === STAGES.length - 1}
            aria-label="Go to next stage"
          >
            Next
            <Icon name="arrowRight" size={15} />
          </button>
        </div>
      </nav>

      <section id="arrival" className="expat-stage expat-stage-arrival" ref={registerStageRef(0)}>
        <motion.div className="expat-stage-media" style={{ y: heroParallaxY }}>
          <motion.img
            src={STAGES[0].image}
            alt="Palace of Culture and Science tower in Warsaw at dusk"
            loading="eager"
            className="expat-stage-image"
            initial={shouldReduceMotion || exportMode ? false : { scale: 1.05, opacity: 0.84 }}
            animate={shouldReduceMotion || exportMode ? undefined : { scale: 1, opacity: 1 }}
            transition={{ duration: 1.35, ease: CINEMATIC_EASE }}
          />
          <div className="expat-stage-overlay" />
          <div className="expat-stage-vignette" />
          <span className="expat-ambient-glow expat-ambient-a" aria-hidden />
          <span className="expat-ambient-glow expat-ambient-b" aria-hidden />
        </motion.div>

        <motion.div
          className="expat-arrival-content"
          variants={staggerContainer}
          initial={exportMode ? false : 'hidden'}
          animate="visible"
        >
          <motion.p variants={lineVariants} className="expat-overline">
            Expat Village
          </motion.p>
          <motion.h1 variants={lineVariants}>{STAGES[0].title}</motion.h1>
          <motion.h2 variants={lineVariants}>{STAGES[0].subtitle}</motion.h2>
          <motion.p variants={lineVariants} className="expat-arrival-tagline">
            {STAGES[0].tagline}
          </motion.p>
          <motion.div variants={lineVariants}>
            <Link to="/onboarding" className="expat-cta-primary" aria-label="Begin your onboarding journey">
              Begin Your Journey
              <span aria-hidden>{'->'}</span>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <motion.section
        id="promise"
        className="expat-stage expat-stage-promise"
        ref={registerStageRef(1)}
        variants={revealVariants}
        {...sectionRevealProps}
      >
        <div className="expat-stage-media expat-stage-media-static">
          <img
            src={STAGES[1].image}
            alt="Warm Old Town square evening lights in Warsaw"
            loading="lazy"
            className="expat-stage-image"
          />
          <div className="expat-stage-overlay expat-stage-overlay-soft" />
        </div>
        <motion.div className="expat-promise-panel" variants={staggerContainer}>
          <motion.p variants={lineVariants} className="expat-overline">
            The Promise
          </motion.p>
          <motion.h3 variants={lineVariants}>{STAGES[1].title}</motion.h3>
          <motion.p variants={lineVariants}>{STAGES[1].copy}</motion.p>
        </motion.div>
      </motion.section>

      <motion.section
        id="path"
        className="expat-stage expat-stage-path"
        ref={registerStageRef(2)}
        variants={revealVariants}
        {...sectionRevealProps}
      >
        <div className="expat-stage-media expat-stage-media-subtle">
          <img
            src={STAGES[2].image}
            alt="Old Town details in Warsaw at dusk"
            loading="lazy"
            className="expat-stage-image"
          />
          <div className="expat-stage-overlay expat-stage-overlay-faint" />
        </div>

        <div className="expat-path-content">
          <motion.div className="expat-path-header" variants={staggerContainer} {...sectionRevealProps}>
            <motion.p variants={lineVariants} className="expat-overline">
              The Path
            </motion.p>
            <motion.h3 variants={lineVariants}>{STAGES[2].title}</motion.h3>
            <motion.p variants={lineVariants}>{STAGES[2].copy}</motion.p>
          </motion.div>

          <motion.div
            className="expat-path-grid"
            variants={staggerContainer}
            initial={exportMode ? false : 'hidden'}
            whileInView={exportMode ? undefined : 'visible'}
            animate={exportMode ? 'visible' : undefined}
            viewport={{ once: true, amount: 0.2 }}
          >
            {STEP_CARDS.map((step) => {
              const expanded = !isMobile || selectedStepCard === step.id
              return (
                <motion.article key={step.id} className="expat-step-card" variants={revealVariants}>
                  <button
                    type="button"
                    className="expat-step-head"
                    aria-expanded={expanded}
                    aria-controls={`step-${step.id}`}
                    onClick={() => {
                      if (!isMobile) return
                      setSelectedStepCard((prev) => (prev === step.id ? '' : step.id))
                    }}
                  >
                    <span className="expat-step-icon">
                      <Icon name={step.icon} size={16} />
                    </span>
                    <span className="expat-step-title">{step.title}</span>
                    <Icon name="chevronDown" size={16} className={`expat-step-chevron${expanded ? ' is-open' : ''}`} />
                  </button>

                  <motion.div
                    id={`step-${step.id}`}
                    className="expat-step-details"
                    initial={false}
                    animate={expanded ? 'open' : 'closed'}
                    variants={{
                      open: { height: 'auto', opacity: 1 },
                      closed: { height: isMobile ? 0 : 'auto', opacity: isMobile ? 0 : 1 },
                    }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.34, ease: CINEMATIC_EASE }}
                  >
                    <p>{step.description}</p>
                    <Link to={`/onboarding?step=${step.id}`} className="expat-step-link" aria-label={`Learn more about ${step.title}`}>
                      Learn More
                      <span aria-hidden>{'->'}</span>
                    </Link>
                  </motion.div>
                </motion.article>
              )
            })}
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        id="village"
        className="expat-stage expat-stage-village"
        ref={registerStageRef(3)}
        variants={revealVariants}
        {...sectionRevealProps}
      >
        <motion.div className="expat-stage-media" style={{ y: villageParallaxY }}>
          <img
            src={STAGES[3].image}
            alt="Vistula promenade and Warsaw skyline at golden hour"
            loading="lazy"
            className="expat-stage-image"
          />
          <div className="expat-stage-overlay expat-stage-overlay-village" />
        </motion.div>

        <motion.div className="expat-village-panel" variants={staggerContainer} {...sectionRevealProps}>
          <motion.p variants={lineVariants} className="expat-overline">
            The Village
          </motion.p>
          <motion.h3 variants={lineVariants}>{STAGES[3].title}</motion.h3>
          <motion.p variants={lineVariants}>{STAGES[3].copy}</motion.p>
        </motion.div>
      </motion.section>

      <motion.section
        id="final"
        className="expat-stage expat-stage-final"
        ref={registerStageRef(4)}
        variants={revealVariants}
        {...sectionRevealProps}
      >
        <motion.div className="expat-final-panel" variants={staggerContainer}>
          <motion.p variants={lineVariants} className="expat-overline">
            Final Step
          </motion.p>
          <motion.h3 variants={lineVariants}>{STAGES[4].title}</motion.h3>
          <motion.div variants={lineVariants} className="expat-final-actions">
            <Link to="/onboarding" className="expat-cta-primary" aria-label="Start onboarding">
              Start Onboarding
            </Link>
            <Link to="/explore" className="expat-cta-secondary" aria-label="Explore first">
              Explore First
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>
    </main>
  )
}

export default ExpatOnboarding
