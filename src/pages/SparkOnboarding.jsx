import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import './SparkOnboarding.css'

// ─── Image Assets ────────────────────────────────────────────
const IMAGES = {
  heroBg: '/images/expat-onboarding/hero-bg.jpg',
  oldtown: '/images/expat-onboarding/oldtown.jpg',
  riverside: '/images/expat-onboarding/riverside.jpg',
  woman: '/images/expat-onboarding/woman-arms-raised-mountains-720.jpg',
  cafe: '/images/expat-onboarding/historic-cafe-arcade-flowers-720.jpg',
  atrium: '/images/expat-onboarding/modern-atrium-lights-720.jpg',
  couple: '/images/expat-onboarding/couple-walking-back-720.jpg',
  crowd: '/images/expat-onboarding/crowded-street-720.jpg',
}

// ─── Blob Config ─────────────────────────────────────────────
const BLOBS = [
  { color: '#E8836B', size: 280, x: '-12%', y: '-8%',  toX: '8%',  toY: '6%',  radius: '60% 40% 55% 45% / 50% 60% 40% 50%' },
  { color: '#7CC5D6', size: 320, x: '70%',  y: '-14%', toX: '62%', toY: '2%',  radius: '45% 55% 50% 50% / 55% 45% 55% 45%' },
  { color: '#F0C775', size: 200, x: '-8%',  y: '35%',  toX: '2%',  toY: '30%', radius: '50% 50% 45% 55% / 40% 60% 50% 50%' },
  { color: '#8CB896', size: 300, x: '65%',  y: '75%',  toX: '55%', toY: '68%', radius: '55% 45% 50% 50% / 45% 55% 50% 50%' },
  { color: '#C4A8D8', size: 240, x: '30%',  y: '80%',  toX: '38%', toY: '72%', radius: '50% 50% 55% 45% / 55% 45% 45% 55%' },
  { color: '#E89BAE', size: 180, x: '80%',  y: '40%',  toX: '72%', toY: '35%', radius: '45% 55% 45% 55% / 50% 50% 55% 45%' },
]

// ─── Grid cards for Value Screen 1 ──────────────────────────
const GRID_CARDS = [
  { image: IMAGES.heroBg,  label: 'PESEL' },
  { image: IMAGES.oldtown, label: 'Housing' },
  { image: IMAGES.crowd,   label: 'Transport' },
  { image: IMAGES.cafe,    label: 'Healthcare' },
  { image: IMAGES.couple,  label: 'Community' },
  { image: IMAGES.atrium,  label: 'Banking' },
  { image: IMAGES.riverside, label: 'Jobs' },
  { image: IMAGES.woman,   label: 'Insurance' },
  { image: IMAGES.oldtown, label: 'Events' },
]

// ─── Mini feature cards for phone fan ────────────────────────
const FEATURE_CARDS = [
  { label: 'Contract Analyzer', color: '#C76B55' },
  { label: 'Town Hall Chat', color: '#75997C' },
  { label: 'My Checklist', color: '#7CC5D6' },
  { label: 'Directory', color: '#B88A5E' },
  { label: 'Morning Brief', color: '#A07CC5' },
  { label: 'Alerts', color: '#E8836B' },
]

// ─── Survey options ──────────────────────────────────────────
const SURVEY_OPTIONS = [
  'Reddit',
  'Google Search',
  'Facebook Group',
  'Instagram or TikTok',
  'Friend or colleague',
  'Expat blog or article',
  'App Store or Google Play',
  'Other',
]

// ─── City reveal grid images ─────────────────────────────────
const REVEAL_IMAGES = [
  IMAGES.oldtown, IMAGES.cafe, IMAGES.riverside, IMAGES.heroBg,
  IMAGES.crowd, IMAGES.woman, IMAGES.atrium, IMAGES.couple,
]

// ─── Letter colors for brand name ────────────────────────────
const LETTER_COLORS = [
  '#C76B55', '#E8836B', '#F0C775', '#8CB896', '#75997C',
  '#7CC5D6', '#C4A8D8', '#E89BAE', '#C76B55', '#E8836B',
  '#75997C', '#F0C775',
]

// ─── Animation presets ───────────────────────────────────────
const springy = { type: 'spring', stiffness: 100, damping: 18, mass: 0.8 }
const smooth = { duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }
const fadeSlide = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: smooth,
}

// ─── STAGES ──────────────────────────────────────────────────
const STAGES = ['splash', 'value1', 'value2', 'value3', 'survey', 'reveal']

// ═════════════════════════════════════════════════════════════
// SPLASH SCREEN
// ═════════════════════════════════════════════════════════════
function Splash({ onComplete, reduceMotion }) {
  const [showSubtitle, setShowSubtitle] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setShowSubtitle(true), 1600)
    const t2 = setTimeout(onComplete, reduceMotion ? 1500 : 3500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onComplete, reduceMotion])

  const brandName = 'Expat Village'

  return (
    <div className="spark-splash">
      {/* Animated blobs */}
      {BLOBS.map((blob, i) => (
        <motion.div
          key={i}
          className="spark-blob"
          initial={{
            x: blob.x, y: blob.y,
            scale: 0, opacity: 0,
            borderRadius: blob.radius,
          }}
          animate={{
            x: blob.toX, y: blob.toY,
            scale: 1, opacity: 0.85,
          }}
          transition={{
            ...springy,
            delay: reduceMotion ? 0 : i * 0.12,
            opacity: { duration: 0.6, delay: i * 0.12 },
          }}
          style={{
            width: blob.size,
            height: blob.size,
            background: blob.color,
            left: 0, top: 0,
          }}
        />
      ))}

      {/* Brand name - letter by letter */}
      <motion.div
        className="spark-splash-title"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {brandName.split('').map((char, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 20, scale: 0.6 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              ...springy,
              delay: reduceMotion ? 0.2 : 0.4 + i * 0.07,
            }}
            style={{
              display: 'inline-block',
              color: char === ' ' ? 'transparent' : LETTER_COLORS[i % LETTER_COLORS.length],
              width: char === ' ' ? '0.3em' : 'auto',
            }}
          >
            {char}
          </motion.span>
        ))}
      </motion.div>

      {/* Subtitle */}
      <AnimatePresence>
        {showSubtitle && (
          <motion.div
            className="spark-splash-subtitle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Your home away from home
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════
// VALUE SCREEN 1 - Image Grid
// ═════════════════════════════════════════════════════════════
function ValueScreen1({ reduceMotion }) {
  return (
    <div className="spark-screen-body">
      <div className="spark-image-grid">
        {GRID_CARDS.map((card, i) => (
          <motion.div
            key={i}
            className="spark-grid-card"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              ...springy,
              delay: reduceMotion ? 0 : 0.05 + i * 0.06,
            }}
          >
            <img src={card.image} alt={card.label} loading="eager" />
            <div className="spark-grid-label">{card.label}</div>
          </motion.div>
        ))}
      </div>
      <div className="spark-screen-text">
        <motion.h2 {...fadeSlide} transition={{ ...smooth, delay: 0.4 }}>
          Your new life starts here
        </motion.h2>
        <motion.p {...fadeSlide} transition={{ ...smooth, delay: 0.55 }}>
          Step-by-step guides for everything expats need in Poland.
        </motion.p>
      </div>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════
// VALUE SCREEN 2 - Phone Fan
// ═════════════════════════════════════════════════════════════
function ValueScreen2({ reduceMotion }) {
  const phones = [
    { rotate: -12, x: '-68%', y: '-52%', z: 0, image: IMAGES.crowd },
    { rotate: 0,   x: '-50%', y: '-50%', z: 1, content: true },
    { rotate: 12,  x: '-32%', y: '-52%', z: 0, image: IMAGES.cafe },
  ]

  return (
    <div className="spark-screen-body">
      <div className="spark-phone-fan">
        {phones.map((phone, i) => (
          <motion.div
            key={i}
            className="spark-phone-card"
            initial={{ opacity: 0, scale: 0.7, rotate: 0, x: '-50%', y: '-40%' }}
            animate={{
              opacity: 1, scale: phone.z ? 1 : 0.88,
              rotate: phone.rotate,
              x: phone.x, y: phone.y,
            }}
            transition={{
              ...springy,
              delay: reduceMotion ? 0 : 0.1 + i * 0.12,
            }}
            style={{ zIndex: phone.z ? 2 : 1 }}
          >
            {phone.image ? (
              <img src={phone.image} alt="" loading="lazy" />
            ) : (
              <div className="spark-phone-card-inner">
                {FEATURE_CARDS.map((feat, j) => (
                  <motion.div
                    key={j}
                    className="spark-mini-card"
                    style={{ background: feat.color }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: reduceMotion ? 0 : 0.4 + j * 0.08 }}
                  >
                    {feat.label}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
      <div className="spark-screen-text">
        <motion.h2 {...fadeSlide} transition={{ ...smooth, delay: 0.4 }}>
          Your expat toolkit
        </motion.h2>
        <motion.p {...fadeSlide} transition={{ ...smooth, delay: 0.55 }}>
          AI-powered tools built for expats, by expats.
        </motion.p>
      </div>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════
// VALUE SCREEN 3 - Featured Content
// ═════════════════════════════════════════════════════════════
function ValueScreen3({ reduceMotion }) {
  const badges = [
    { emoji: '🏠', bg: '#E8836B', top: '10%', left: '8%' },
    { emoji: '💼', bg: '#7CC5D6', top: '5%',  left: '62%' },
    { emoji: '🍽️', bg: '#F0C775', top: '55%', left: '2%' },
    { emoji: '🏥', bg: '#8CB896', top: '40%', left: '75%' },
    { emoji: '🎭', bg: '#C4A8D8', top: '70%', left: '68%' },
    { emoji: '🔑', bg: '#E89BAE', top: '75%', left: '18%' },
  ]

  return (
    <div className="spark-screen-body">
      <div className="spark-featured">
        {/* Floating badges */}
        {badges.map((badge, i) => (
          <motion.div
            key={i}
            className="spark-featured-badge"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              ...springy,
              delay: reduceMotion ? 0 : 0.3 + i * 0.1,
            }}
            style={{
              background: badge.bg,
              top: badge.top,
              left: badge.left,
            }}
          >
            {badge.emoji}
          </motion.div>
        ))}

        {/* Sparkle decorations */}
        {['12% 28%', '78% 18%', '25% 72%', '82% 65%', '48% 8%'].map((pos, i) => (
          <motion.span
            key={i}
            className="spark-sparkle"
            style={{ top: pos.split(' ')[0], left: pos.split(' ')[1] }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.5, scale: 1 }}
            transition={{ delay: reduceMotion ? 0 : 0.5 + i * 0.08 }}
          >
            ✦
          </motion.span>
        ))}

        {/* Center image */}
        <motion.div
          className="spark-featured-image"
          initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: -3 }}
          transition={{ ...springy, delay: 0.15 }}
        >
          <img src={IMAGES.cafe} alt="Polish cafe culture" loading="lazy" />
        </motion.div>
      </div>

      <motion.div
        style={{ textAlign: 'center', marginBottom: 4 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div style={{ fontSize: '0.78rem', color: '#A89A8F', fontWeight: 500 }}>
          By Expat Village
        </div>
      </motion.div>

      <div className="spark-screen-text">
        <motion.h2 {...fadeSlide} transition={{ ...smooth, delay: 0.4 }}>
          Find your village
        </motion.h2>
        <motion.p {...fadeSlide} transition={{ ...smooth, delay: 0.55 }}>
          Connect with expats who truly get it.
        </motion.p>
      </div>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════
// SURVEY SCREEN
// ═════════════════════════════════════════════════════════════
function Survey({ selected, onSelect, reduceMotion }) {
  return (
    <div className="spark-survey">
      <div style={{ padding: '20px 0 0' }}>
        <motion.h2
          className="spark-survey-title"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={smooth}
        >
          How did you hear about us?
        </motion.h2>
      </div>

      <div className="spark-survey-list">
        {SURVEY_OPTIONS.map((option, i) => (
          <motion.button
            key={option}
            className={`spark-survey-option ${selected === option ? 'selected' : ''}`}
            onClick={() => onSelect(option)}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...smooth, delay: reduceMotion ? 0 : 0.08 + i * 0.05 }}
            whileTap={{ scale: 0.98 }}
          >
            {option}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════
// CITY REVEAL SCREEN
// ═════════════════════════════════════════════════════════════
function CityReveal({ reduceMotion, onGetStarted }) {
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setExpanded(true), reduceMotion ? 300 : 800)
    return () => clearTimeout(t)
  }, [reduceMotion])

  return (
    <div className="spark-reveal">
      <div className="spark-reveal-content">
        <motion.div
          className="spark-reveal-overline"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...smooth, delay: 0.2 }}
        >
          Your City
        </motion.div>

        <motion.h1
          className="spark-reveal-title"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...springy, delay: 0.35 }}
        >
          <motion.span
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
          >
            Welcome to
          </motion.span>
          <br />
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springy, delay: 0.55 }}
          >
            Warsaw
          </motion.span>
        </motion.h1>

        <AnimatePresence>
          {expanded && (
            <>
              <motion.p
                className="spark-reveal-subtitle"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...smooth, delay: 0.15 }}
              >
                One platform. Everything you need. Let's make this city feel like home.
              </motion.p>

              <motion.div
                className="spark-reveal-grid"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...smooth, delay: 0.3 }}
              >
                {REVEAL_IMAGES.map((img, i) => (
                  <motion.div
                    key={i}
                    className="spark-reveal-grid-item"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      ...springy,
                      delay: reduceMotion ? 0 : 0.35 + i * 0.06,
                    }}
                  >
                    <img src={img} alt="" loading="lazy" />
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            className="spark-reveal-footer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...smooth, delay: 0.7 }}
          >
            <div className="spark-reveal-author">By Expat Village Warsaw</div>
            <div className="spark-reveal-actions">
              <button className="spark-invite-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
                Invite friends
              </button>
              <motion.button
                className="spark-go-btn"
                onClick={onGetStarted}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════
export default function SparkOnboarding() {
  const navigate = useNavigate()
  const { openAuthModal } = useAuth()
  const reduceMotion = Boolean(useReducedMotion())
  const [stage, setStage] = useState('splash')
  const [surveyChoice, setSurveyChoice] = useState(null)
  const touchRef = useRef({ startX: 0, startY: 0 })

  const stageIndex = STAGES.indexOf(stage)
  const isValueScreen = stage === 'value1' || stage === 'value2' || stage === 'value3'
  const valueIndex = isValueScreen ? stageIndex - 1 : -1

  // Preload images on mount
  useEffect(() => {
    Object.values(IMAGES).forEach(src => {
      const img = new Image()
      img.src = src
    })
  }, [])

  const goNext = useCallback(() => {
    const i = STAGES.indexOf(stage)
    if (i < STAGES.length - 1) setStage(STAGES[i + 1])
  }, [stage])

  const goPrev = useCallback(() => {
    const i = STAGES.indexOf(stage)
    if (i > 1) setStage(STAGES[i - 1])
  }, [stage])

  const skipToEnd = useCallback(() => {
    setStage('reveal')
  }, [])

  const handleGetStarted = useCallback(() => {
    if (surveyChoice) {
      localStorage.setItem('expat-village-referral', surveyChoice)
    }
    localStorage.setItem('expat-village-onboarded', 'true')
    navigate('/')
    // Open sign-up modal so user can create an account after onboarding
    setTimeout(() => openAuthModal('sign_up'), 300)
  }, [navigate, surveyChoice, openAuthModal])

  // Swipe handling
  const handleTouchStart = useCallback((e) => {
    touchRef.current.startX = e.touches[0].clientX
    touchRef.current.startY = e.touches[0].clientY
  }, [])

  const handleTouchEnd = useCallback((e) => {
    const dx = e.changedTouches[0].clientX - touchRef.current.startX
    const dy = e.changedTouches[0].clientY - touchRef.current.startY
    if (Math.abs(dx) < 50 || Math.abs(dy) > Math.abs(dx)) return
    if (dx < -50) goNext()
    if (dx > 50) goPrev()
  }, [goNext, goPrev])

  // Keyboard nav
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goNext()
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev])

  return (
    <div
      className="spark-onboarding"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence mode="wait">
        {/* ── SPLASH ── */}
        {stage === 'splash' && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{ position: 'absolute', inset: 0 }}
          >
            <Splash onComplete={goNext} reduceMotion={reduceMotion} />
          </motion.div>
        )}

        {/* ── VALUE SCREENS ── */}
        {isValueScreen && (
          <motion.div
            key={stage}
            className="spark-screen"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={smooth}
          >
            <button className="spark-skip" onClick={skipToEnd}>Skip</button>

            {stage === 'value1' && <ValueScreen1 reduceMotion={reduceMotion} />}
            {stage === 'value2' && <ValueScreen2 reduceMotion={reduceMotion} />}
            {stage === 'value3' && <ValueScreen3 reduceMotion={reduceMotion} />}

            <div className="spark-screen-footer">
              <div className="spark-dots">
                {[0, 1, 2].map(i => (
                  <div key={i} className={`spark-dot ${i === valueIndex ? 'active' : ''}`} />
                ))}
              </div>
              <button className="spark-cta spark-cta-primary" onClick={goNext}>
                Next
              </button>
            </div>
          </motion.div>
        )}

        {/* ── SURVEY ── */}
        {stage === 'survey' && (
          <motion.div
            key="survey"
            className="spark-screen"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={smooth}
          >
            <button className="spark-skip" onClick={skipToEnd}>Skip</button>

            <Survey
              selected={surveyChoice}
              onSelect={setSurveyChoice}
              reduceMotion={reduceMotion}
            />

            <div className="spark-screen-footer">
              <button
                className={`spark-cta ${surveyChoice ? 'spark-cta-primary' : 'spark-cta-disabled'}`}
                onClick={goNext}
                disabled={!surveyChoice}
              >
                Next
              </button>
            </div>
          </motion.div>
        )}

        {/* ── CITY REVEAL ── */}
        {stage === 'reveal' && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            style={{ position: 'absolute', inset: 0 }}
          >
            <CityReveal
              reduceMotion={reduceMotion}
              onGetStarted={handleGetStarted}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
