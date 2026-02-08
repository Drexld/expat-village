import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Icon from '../components/Icon'

const TOTAL_DURATION = 14
const EASE = [0.22, 0.61, 0.36, 1]
const SPRING = { stiffness: 120, damping: 20, mass: 0.9 }
const STEP_TIME = TOTAL_DURATION / 5
const _MOTION_COMPONENT_REFERENCE = motion.div

const SLIDES = [
  {
    id: 'arrival',
    image: '/images/expat-onboarding/crowded-street.jpg',
    heading: 'Expat Village - Warsaw & Beyond',
    subheading: 'Your soft landing in Poland',
    body: "From paperwork to Polish sunsets - we've got you",
    cta: 'Begin Journey',
  },
  {
    id: 'promise',
    image: '/images/expat-onboarding/couple-walking-back.jpg',
    heading: 'A calmer way to begin life in Warsaw',
    body: 'Relocation can feel intense. We turn uncertainty into clear next actions, trusted local context, and a community that truly understands.',
  },
  {
    id: 'path',
    image: '/images/expat-onboarding/modern-atrium-lights.jpg',
    heading: 'Handle the hard stuff, step by step',
    body: 'One practical path from arrival pressure to everyday confidence.',
    steps: [
      {
        icon: 'checklist',
        title: 'PESEL',
        description: 'Prepare your documents and get your national ID number without office-day guesswork.',
      },
      {
        icon: 'document',
        title: 'Residency',
        description: 'Navigate permits, timelines, and legal next steps with clear guidance.',
      },
      {
        icon: 'building',
        title: 'Banking',
        description: 'Open the right account fast and avoid common newcomer mistakes.',
      },
      {
        icon: 'health',
        title: 'Healthcare',
        description: 'Compare NFZ and private options so you can access care with confidence.',
      },
      {
        icon: 'home',
        title: 'Housing',
        description: 'Find trusted neighborhoods and rental guidance before signing.',
      },
      {
        icon: 'briefcase',
        title: 'Jobs',
        description: 'Understand CV norms, permit realities, and practical routes into Warsaw work life.',
      },
    ],
  },
  {
    id: 'village',
    image: '/images/expat-onboarding/historic-cafe-arcade-flowers.jpg',
    heading: 'Daily city pulse, curated for expats',
    body: 'Discover trusted recommendations, local events, real stories from people building a life here. Practical updates meet human warmth so your days feel connected.',
    emotionImage: '/images/expat-onboarding/woman-arms-raised-mountains.jpg',
  },
  {
    id: 'final',
    image: '/images/expat-onboarding/crowded-street.jpg',
    heading: 'Ready to make Warsaw feel like home?',
    body: '',
  },
]

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value))
}

function splitWords(text) {
  return text.split(' ').filter(Boolean)
}

function ExpatOnboarding() {
  const reduceMotion = Boolean(useReducedMotion())
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const indexRef = useRef(0)

  const exportMode = useMemo(() => {
    if (typeof window === 'undefined') return false
    return new URLSearchParams(window.location.search).get('export') === '1'
  }, [])

  const initialTime = useMemo(() => {
    if (typeof window === 'undefined') return 0
    const parsed = Number.parseFloat(new URLSearchParams(window.location.search).get('t') || '0')
    return clamp(Number.isFinite(parsed) ? parsed : 0, 0, TOTAL_DURATION)
  }, [])

  const isLowPowerDevice = useMemo(() => {
    if (typeof window === 'undefined') return false
    const cores = navigator.hardwareConcurrency || 8
    const memory = navigator.deviceMemory || 8
    return cores <= 4 || memory <= 4
  }, [])

  const animateBackground = !reduceMotion && !isLowPowerDevice

  const goTo = (next) => {
    if (next < 0 || next > SLIDES.length - 1) return
    setDirection(next > indexRef.current ? 1 : -1)
    indexRef.current = next
    setIndex(next)
  }

  useEffect(() => {
    indexRef.current = index
  }, [index])

  useEffect(() => {
    if (exportMode || reduceMotion) return undefined

    const interval = window.setInterval(() => {
      const next = (indexRef.current + 1) % SLIDES.length
      goTo(next)
    }, 4800)

    return () => window.clearInterval(interval)
  }, [exportMode, reduceMotion])

  useEffect(() => {
    // Preload slide images once to avoid transition stutter on first visit.
    SLIDES.forEach((slide) => {
      if (!slide.image) return
      const img = new Image()
      img.src = slide.image
    })
  }, [])

  useEffect(() => {
    if (!exportMode || typeof window === 'undefined') return undefined

    const setExportTime = (value) => {
      const parsed = Number.parseFloat(value)
      if (!Number.isFinite(parsed)) return
      const t = clamp(parsed, 0, TOTAL_DURATION)
      const nextIndex = Math.min(SLIDES.length - 1, Math.floor(t / STEP_TIME))
      goTo(nextIndex)
    }

    window.__setExpatOnboardingTime = setExportTime
    window.__expatOnboardingDuration = TOTAL_DURATION
    setExportTime(initialTime)

    return () => {
      delete window.__setExpatOnboardingTime
      delete window.__expatOnboardingDuration
    }
  }, [exportMode, initialTime])

  const slide = SLIDES[index]

  const dragEnd = (_, info) => {
    if (reduceMotion) return
    if (info.offset.x < -85 || info.velocity.x < -550) {
      goTo(index + 1)
      return
    }
    if (info.offset.x > 85 || info.velocity.x > 550) {
      goTo(index - 1)
    }
  }

  const slideVariants = {
    enter: (dir) => ({
      x: reduceMotion ? 0 : dir > 0 ? '45%' : '-45%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      x: reduceMotion ? 0 : dir > 0 ? '-32%' : '32%',
      opacity: 0,
    }),
  }

  const wordVariants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: reduceMotion ? { duration: 0.12 } : { type: 'spring', ...SPRING },
    },
  }

  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#070b14] text-white">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute left-[-16%] top-[-8%] h-72 w-72 rounded-[50%] bg-gradient-to-br from-[#003A8C]/80 to-[#1E40AF]/70 blur-2xl"
          style={{ willChange: 'transform, opacity' }}
          animate={
            animateBackground
              ? {
                  scale: [1, 1.09, 1.03, 1],
                  x: [0, 8, -6, 0],
                  y: [0, -7, 6, 0],
                  opacity: [0.85, 0.95, 0.88, 0.92],
                }
              : reduceMotion
              ? { opacity: 0.95 }
              : { opacity: 0.9, scale: 1.02 }
          }
          transition={animateBackground ? { duration: 14, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' } : undefined}
        />
        <motion.div
          className="absolute right-[-18%] top-[18%] h-64 w-64 rounded-[50%] bg-gradient-to-br from-[#F4A261]/75 to-[#E07A5F]/70 blur-2xl"
          style={{ willChange: 'transform, opacity' }}
          animate={
            animateBackground
              ? {
                  scale: [1, 1.1, 1.04, 1],
                  x: [0, -8, 8, 0],
                  y: [0, 7, -9, 0],
                  opacity: [0.86, 0.95, 0.9, 0.92],
                }
              : reduceMotion
              ? { opacity: 0.92 }
              : { opacity: 0.88, scale: 1.02 }
          }
          transition={animateBackground ? { duration: 13, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut', delay: 1.1 } : undefined}
        />
        <motion.div
          className="absolute bottom-[-16%] left-[12%] h-72 w-72 rounded-[50%] bg-gradient-to-br from-[#6B7280]/68 to-[#374151]/75 blur-2xl"
          style={{ willChange: 'transform, opacity' }}
          animate={
            animateBackground
              ? {
                  scale: [1, 1.08, 1.04, 1],
                  x: [0, 9, -6, 0],
                  y: [0, -7, 6, 0],
                  opacity: [0.84, 0.92, 0.9, 0.91],
                }
              : reduceMotion
              ? { opacity: 0.9 }
              : { opacity: 0.86, scale: 1.02 }
          }
          transition={animateBackground ? { duration: 15, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut', delay: 0.6 } : undefined}
        />
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.section
          key={slide.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={reduceMotion ? { duration: 0.12 } : { duration: 0.44, ease: EASE }}
          drag={reduceMotion ? false : 'x'}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.08}
          onDragEnd={dragEnd}
          className="relative z-10 h-screen w-full touch-pan-y"
          style={{ willChange: 'transform, opacity' }}
        >
          <motion.div
            className="absolute inset-0"
            style={{ willChange: 'transform, opacity' }}
            animate={
              animateBackground
                ? { scale: [1.02, 1.04, 1.02] }
                : reduceMotion
                ? { scale: 1 }
                : { scale: 1.01 }
            }
            transition={animateBackground ? { duration: 16, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' } : undefined}
          >
            <img src={slide.image} alt={slide.heading} className="h-full w-full object-cover" />
          </motion.div>

          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/45 to-black/70" />

          <div className="relative mx-auto flex h-full w-full max-w-md flex-col justify-between px-5 pb-8 pt-10 sm:max-w-lg sm:px-7">
            <div />

            {slide.id === 'arrival' && (
              <motion.div
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: {
                    transition: reduceMotion ? { staggerChildren: 0.01 } : { staggerChildren: 0.09, delayChildren: 0.06 },
                  },
                }}
                className="space-y-4 text-center"
              >
                <motion.p variants={wordVariants} className="text-xs uppercase tracking-[0.26em] text-[#F4A261]">
                  Expat Village
                </motion.p>
                <motion.h1 className="font-display text-5xl leading-[0.95] sm:text-6xl">
                  {splitWords(slide.heading).map((word, i) => (
                    <motion.span key={`${word}-${i}`} variants={wordVariants} className="mr-2 inline-block">
                      {word}
                    </motion.span>
                  ))}
                </motion.h1>
                <motion.p variants={wordVariants} className="text-3xl font-semibold leading-tight sm:text-4xl">
                  {slide.subheading}
                </motion.p>
                <motion.p variants={wordVariants} className="mx-auto max-w-sm text-base text-white/90 sm:text-lg">
                  {slide.body}
                </motion.p>
                <motion.button
                  type="button"
                  onClick={() => goTo(1)}
                  whileTap={{ scale: 0.95 }}
                  whileHover={reduceMotion ? undefined : { y: -2, boxShadow: '0 16px 30px rgba(0,0,0,0.35)' }}
                  className="mx-auto inline-flex h-12 items-center justify-center rounded-full border border-[#F4A261]/75 bg-[#003A8C]/85 px-7 font-semibold"
                >
                  {slide.cta}
                </motion.button>
              </motion.div>
            )}

            {slide.id === 'promise' && (
              <motion.div
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: {
                    transition: reduceMotion ? { staggerChildren: 0.01 } : { staggerChildren: 0.1, delayChildren: 0.05 },
                  },
                }}
                className="space-y-4"
              >
                <motion.p variants={wordVariants} className="text-xs uppercase tracking-[0.26em] text-[#F4A261]">
                  The Promise
                </motion.p>
                <motion.h2 className="font-display text-4xl leading-tight sm:text-5xl">
                  {splitWords(slide.heading).map((word, i) => (
                    <motion.span key={`${word}-${i}`} variants={wordVariants} className="mr-2 inline-block">
                      {word}
                    </motion.span>
                  ))}
                </motion.h2>
                <motion.p variants={wordVariants} className="max-w-md text-base leading-relaxed text-white/90 sm:text-lg">
                  {slide.body}
                </motion.p>
              </motion.div>
            )}

            {slide.id === 'path' && (
              <div className="space-y-5">
                <motion.div
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: {},
                    show: {
                      transition: reduceMotion ? { staggerChildren: 0.01 } : { staggerChildren: 0.08, delayChildren: 0.04 },
                    },
                  }}
                  className="space-y-3"
                >
                  <motion.p variants={wordVariants} className="text-xs uppercase tracking-[0.26em] text-[#F4A261]">
                    The Path
                  </motion.p>
                  <motion.h2 className="font-display text-4xl leading-tight sm:text-5xl">
                    {splitWords(slide.heading).map((word, i) => (
                      <motion.span key={`${word}-${i}`} variants={wordVariants} className="mr-2 inline-block">
                        {word}
                      </motion.span>
                    ))}
                  </motion.h2>
                  <motion.p variants={wordVariants} className="text-base text-white/90 sm:text-lg">
                    {slide.body}
                  </motion.p>
                </motion.div>

                <motion.div
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: {},
                    show: {
                      transition: reduceMotion ? { staggerChildren: 0.01 } : { staggerChildren: 0.12, delayChildren: 0.06 },
                    },
                  }}
                  className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                >
                  {slide.steps.map((card) => (
                    <motion.article
                      key={card.title}
                      variants={{
                        hidden: { y: reduceMotion ? 0 : 96, opacity: 0 },
                        show: {
                          y: 0,
                          opacity: 1,
                          transition: reduceMotion ? { duration: 0.1 } : { type: 'spring', stiffness: 120, damping: 18 },
                        },
                      }}
                      className="rounded-2xl border border-white/20 bg-black/35 p-4 backdrop-blur-md"
                    >
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-[#1E40AF]/60">
                          <Icon name={card.icon} size={14} />
                        </span>
                        <p className="text-lg font-semibold">{card.title}</p>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-white/90">{card.description}</p>
                    </motion.article>
                  ))}
                </motion.div>
              </div>
            )}

            {slide.id === 'village' && (
              <motion.div
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: {
                    transition: reduceMotion ? { staggerChildren: 0.01 } : { staggerChildren: 0.1, delayChildren: 0.05 },
                  },
                }}
                className="space-y-4"
              >
                <motion.p variants={wordVariants} className="text-xs uppercase tracking-[0.26em] text-[#F4A261]">
                  The Village
                </motion.p>
                <motion.h2 className="font-display text-4xl leading-tight sm:text-5xl">
                  {splitWords(slide.heading).map((word, i) => (
                    <motion.span key={`${word}-${i}`} variants={wordVariants} className="mr-2 inline-block">
                      {word}
                    </motion.span>
                  ))}
                </motion.h2>
                <motion.p variants={wordVariants} className="max-w-md text-base leading-relaxed text-white/90 sm:text-lg">
                  {slide.body}
                </motion.p>
                <motion.div
                  variants={{
                    hidden: { y: reduceMotion ? 0 : 100, opacity: 0 },
                    show: {
                      y: 0,
                      opacity: 1,
                      transition: reduceMotion ? { duration: 0.1 } : { type: 'spring', stiffness: 115, damping: 19 },
                    },
                  }}
                  className="relative h-44 overflow-hidden rounded-2xl border border-white/20 bg-black/35"
                >
                  <img src={slide.emotionImage} alt="New beginnings and achievement" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/52 to-transparent" />
                </motion.div>
              </motion.div>
            )}

            {slide.id === 'final' && (
              <motion.div
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: {
                    transition: reduceMotion ? { staggerChildren: 0.01 } : { staggerChildren: 0.1, delayChildren: 0.05 },
                  },
                }}
                className="space-y-5 text-center"
              >
                <motion.p variants={wordVariants} className="text-xs uppercase tracking-[0.26em] text-[#F4A261]">
                  Final Step
                </motion.p>
                <motion.h2 className="font-display text-4xl leading-tight sm:text-5xl">
                  {splitWords(slide.heading).map((word, i) => (
                    <motion.span key={`${word}-${i}`} variants={wordVariants} className="mr-2 inline-block">
                      {word}
                    </motion.span>
                  ))}
                </motion.h2>
                <motion.div variants={wordVariants} className="mx-auto flex max-w-sm flex-col gap-3">
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Link to="/onboarding" className="inline-flex h-12 w-full items-center justify-center rounded-full border border-[#F4A261]/75 bg-[#003A8C]/85 px-7 font-semibold">
                      Begin Onboarding
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center justify-center gap-2">
                {SLIDES.map((_, dotIndex) => (
                  <button key={dotIndex} type="button" aria-label={`Go to step ${dotIndex + 1}`} onClick={() => goTo(dotIndex)} className="h-4 w-4 rounded-full p-0">
                    <motion.span
                      className="block h-2.5 w-2.5 rounded-full"
                      animate={{
                        scale: dotIndex === index ? 1.3 : 1,
                        backgroundColor: dotIndex === index ? '#003A8C' : 'rgba(255,255,255,0.55)',
                      }}
                      transition={reduceMotion ? { duration: 0.1 } : { duration: 0.26, ease: EASE }}
                    />
                  </button>
                ))}
              </div>

              <div className="flex w-full items-center justify-between">
                <motion.button
                  type="button"
                  onClick={() => goTo(index - 1)}
                  whileTap={{ scale: 0.95 }}
                  className="h-11 rounded-full border border-white/22 bg-black/35 px-5 text-sm font-medium disabled:opacity-35"
                  disabled={index === 0}
                >
                  Back
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => goTo(index + 1)}
                  whileTap={{ scale: 0.95 }}
                  className="h-11 rounded-full border border-[#F4A261]/75 bg-[#003A8C]/82 px-6 text-sm font-semibold disabled:opacity-35"
                  disabled={index === SLIDES.length - 1}
                >
                  Next
                </motion.button>
              </div>
            </div>
          </div>
        </motion.section>
      </AnimatePresence>
    </main>
  )
}

export default ExpatOnboarding
