import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import './ExpatOnboarding.css'

const TOTAL_DURATION = 14

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
    description: 'Navigate permits, timelines, and legal next steps with clear, practical guidance.',
  },
  {
    id: 'banking',
    icon: 'building',
    title: 'Banking',
    description: 'Open the right account fast and avoid the common newcomer mistakes.',
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
    description: 'Find trusted neighborhoods and rental guidance before signing a contract.',
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

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(media.matches)
    onChange()
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  return reduced
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

  const reducedMotion = useReducedMotion()
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const onScroll = () => setScrollY(window.scrollY || 0)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const revealNodes = Array.from(document.querySelectorAll('.expat-reveal'))
    if (exportMode) {
      revealNodes.forEach((node) => node.classList.add('is-visible'))
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' }
    )

    revealNodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [exportMode])

  useEffect(() => {
    if (!exportMode || typeof window === 'undefined') return undefined

    const setExportTime = (value) => {
      const t = Number.parseFloat(value)
      if (!Number.isFinite(t)) return

      const progress = clamp(t / TOTAL_DURATION)
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
      const nextScroll = progress * maxScroll

      window.scrollTo(0, nextScroll)
      setScrollY(nextScroll)
    }

    window.__setExpatOnboardingTime = setExportTime
    window.__expatOnboardingDuration = TOTAL_DURATION
    setExportTime(initialTime)

    return () => {
      delete window.__setExpatOnboardingTime
      delete window.__expatOnboardingDuration
    }
  }, [exportMode, initialTime])

  const heroParallax = reducedMotion ? 0 : Math.min(132, scrollY * 0.18)
  const heroScale = reducedMotion ? 1 : Math.min(1.06, 1 + scrollY * 0.000065)
  const riversideParallax = reducedMotion ? 0 : Math.max(-34, Math.min(24, (scrollY - 980) * 0.045))

  return (
    <main className={`expat-cinematic ${exportMode ? 'is-export' : ''}`}>
      <section className="expat-hero">
        <div className="expat-hero-media" style={{ transform: `translateY(${heroParallax}px) scale(${heroScale})` }}>
          <img
            src="/images/expat-onboarding/hero-bg.jpg"
            alt="Palace of Culture and Science at dusk in Warsaw"
            className="expat-hero-image"
            loading="eager"
          />
          <div className="expat-hero-overlay" />
          <div className="expat-hero-vignette" />
          <span className="expat-blob expat-blob-a" aria-hidden />
          <span className="expat-blob expat-blob-b" aria-hidden />
          <span className="expat-blob expat-blob-c" aria-hidden />
        </div>

        <div className="expat-hero-content expat-reveal is-visible">
          <p className="expat-overline">Expat Village</p>
          <h1>Expat Village - Warsaw and Beyond</h1>
          <h2>Your soft landing in Poland</h2>
          <p className="expat-hero-tagline">From paperwork to Polish sunsets - we&apos;ve got you.</p>

          <Link to="/onboarding" className="expat-primary-cta" aria-label="Start your onboarding journey">
            Start Your Journey
            <span aria-hidden>{'->'}</span>
          </Link>
        </div>
      </section>

      <section className="expat-welcome expat-reveal">
        <div className="expat-section-shell">
          <p className="expat-overline">Welcome Home</p>
          <h3>A calmer way to begin life in Warsaw</h3>
          <p>
            Relocation can feel intense. Expat Village turns uncertainty into clear next actions, trusted local context,
            and a community that understands what this transition really feels like.
          </p>
        </div>
      </section>

      <section className="expat-steps">
        <div className="expat-steps-media">
          <img
            src="/images/expat-onboarding/oldtown.jpg"
            alt="Christmas-lit Old Town square in Warsaw"
            loading="lazy"
            className="expat-steps-image"
          />
          <div className="expat-steps-overlay" />
        </div>

        <div className="expat-steps-inner">
          <div className="expat-steps-header expat-reveal">
            <p className="expat-overline">Onboarding Path</p>
            <h3>Handle the hard stuff, step by step</h3>
            <p>One practical path from arrival pressure to everyday confidence.</p>
          </div>

          <div className="expat-steps-grid">
            {STEP_CARDS.map((step, index) => (
              <article
                key={step.id}
                className="expat-step-card expat-reveal"
                style={{ '--reveal-delay': `${index * 70}ms` }}
              >
                <div className="expat-step-icon">
                  <Icon name={step.icon} size={16} />
                </div>
                <h4>{step.title}</h4>
                <p>{step.description}</p>
                <Link to={`/onboarding?step=${step.id}`} className="expat-learn-link" aria-label={`Learn more about ${step.title}`}>
                  Learn More
                  <span aria-hidden>{'->'}</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="expat-community">
        <div className="expat-community-text expat-reveal">
          <p className="expat-overline">Community Pulse</p>
          <h3>Daily city pulse, curated for expats</h3>
          <p>
            Discover trusted recommendations, local events, and real stories from people building a life in Warsaw.
            Practical updates meet human warmth so your days feel more connected and less overwhelming.
          </p>
        </div>

        <div className="expat-community-media expat-reveal">
          <img
            src="/images/expat-onboarding/riverside.jpg"
            alt="Golden-hour Vistula riverside promenade in Warsaw"
            loading="lazy"
            className="expat-community-image"
            style={{ transform: `translateY(${riversideParallax}px)` }}
          />
          <div className="expat-community-overlay" />
        </div>
      </section>

      <section className="expat-final expat-reveal">
        <div className="expat-section-shell expat-section-shell-final">
          <h3>Ready to make Warsaw feel like home?</h3>
          <p>Start your onboarding flow now, or explore the city first and come back when you are ready.</p>

          <div className="expat-final-actions">
            <Link to="/onboarding" className="expat-primary-cta" aria-label="Begin onboarding now">
              Begin Onboarding
            </Link>
            <Link to="/explore" className="expat-secondary-cta" aria-label="Explore Warsaw first">
              Explore Warsaw First
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default ExpatOnboarding
