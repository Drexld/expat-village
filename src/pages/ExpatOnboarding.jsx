import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import Icon from '../components/Icon'

const TOTAL_DURATION = 14
const EASE = [0.22, 0.61, 0.36, 1]
const SPRING = { stiffness: 120, damping: 20, mass: 0.9 }
const STEP_TIME = TOTAL_DURATION / 5
const SWIPE_THRESHOLD = 56
const _MOTION_COMPONENT_REFERENCE = motion.div

const IMAGE_ASSETS = {
  crowdedStreet: {
    fallback: '/images/expat-onboarding/crowded-street.jpg',
    src720: '/images/expat-onboarding/crowded-street-720.jpg',
    src1080: '/images/expat-onboarding/crowded-street-1080.jpg',
    alt: 'Busy Warsaw pedestrian street',
  },
  coupleWalkingBack: {
    fallback: '/images/expat-onboarding/couple-walking-back.jpg',
    src720: '/images/expat-onboarding/couple-walking-back-720.jpg',
    src1080: '/images/expat-onboarding/couple-walking-back-1080.jpg',
    alt: 'Couple walking through a calm city path',
  },
  modernAtriumLights: {
    fallback: '/images/expat-onboarding/modern-atrium-lights.jpg',
    src720: '/images/expat-onboarding/modern-atrium-lights-720.jpg',
    src1080: '/images/expat-onboarding/modern-atrium-lights-1080.jpg',
    alt: 'Modern Warsaw atrium with circular lights',
  },
  historicCafeArcadeFlowers: {
    fallback: '/images/expat-onboarding/historic-cafe-arcade-flowers.jpg',
    src720: '/images/expat-onboarding/historic-cafe-arcade-flowers-720.jpg',
    src1080: '/images/expat-onboarding/historic-cafe-arcade-flowers-1080.jpg',
    alt: 'Historic cafe arcade with flower baskets',
  },
  womanArmsRaisedMountains: {
    fallback: '/images/expat-onboarding/woman-arms-raised-mountains.jpg',
    src720: '/images/expat-onboarding/woman-arms-raised-mountains-720.jpg',
    src1080: '/images/expat-onboarding/woman-arms-raised-mountains-1080.jpg',
    alt: 'Woman celebrating on a mountain top',
  },
}

const SLIDES = [
  {
    id: 'arrival',
    imageKey: 'crowdedStreet',
    heading: 'Expat Village - Warsaw & Beyond',
    subheading: 'Your soft landing in Poland',
    body: "From paperwork to Polish sunsets - we've got you",
    cta: 'Begin Journey',
  },
  {
    id: 'promise',
    imageKey: 'coupleWalkingBack',
    heading: 'A calmer way to begin life in Warsaw',
    body: 'Relocation can feel intense. We turn uncertainty into clear next actions, trusted local context, and a community that truly understands.',
  },
  {
    id: 'path',
    imageKey: 'modernAtriumLights',
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
    imageKey: 'historicCafeArcadeFlowers',
    heading: 'Daily city pulse, curated for expats',
    body: 'Discover trusted recommendations, local events, real stories from people building a life here. Practical updates meet human warmth so your days feel connected.',
    emotionImageKey: 'womanArmsRaisedMountains',
  },
  {
    id: 'final',
    imageKey: 'crowdedStreet',
    heading: 'Ready to make Warsaw feel like home?',
  },
]

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value))
}

function splitWords(text) {
  return text.split(' ').filter(Boolean)
}

function getPreferredSource(asset) {
  if (typeof window !== 'undefined' && window.innerWidth <= 768) {
    return asset.src720 || asset.src1080 || asset.fallback
  }
  return asset.src1080 || asset.fallback
}

function ResponsiveImage({ assetKey, eager, className, style }) {
  const asset = IMAGE_ASSETS[assetKey]
  const fallback = asset.src1080 || asset.fallback

  return (
    <img
      src={fallback}
      srcSet={`${asset.src720} 720w, ${asset.src1080} 1080w, ${asset.fallback} 1600w`}
      sizes="(max-width: 768px) 100vw, 560px"
      alt={asset.alt}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : 'auto'}
      decoding="async"
      className={className}
      style={style}
    />
  )
}

function ExpatOnboarding() {
  const reduceMotion = Boolean(useReducedMotion())
  const [index, setIndex] = useState(0)
  const indexRef = useRef(0)
  const loadedSourcesRef = useRef(new Set())
  const swipeRef = useRef({ source: null, startX: null, startY: null })

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

  const isTouchDevice = useMemo(() => {
    if (typeof window === 'undefined') return false
    return navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches
  }, [])

  const performanceMode = reduceMotion || isLowPowerDevice || isTouchDevice
  const canAutoplay = !exportMode && !performanceMode
  const slideWidth = 100 / SLIDES.length

  const goTo = useCallback((nextIndex) => {
    const bounded = clamp(nextIndex, 0, SLIDES.length - 1)
    indexRef.current = bounded
    setIndex(bounded)
  }, [])

  const preloadAssetKey = useCallback((assetKey) => {
    const asset = IMAGE_ASSETS[assetKey]
    if (!asset) return

    const preferred = getPreferredSource(asset)
    if (loadedSourcesRef.current.has(preferred)) return

    const img = new Image()
    img.src = preferred

    const markLoaded = () => {
      loadedSourcesRef.current.add(preferred)
    }

    if (img.decode) {
      img.decode().then(markLoaded).catch(markLoaded)
      return
    }

    img.onload = markLoaded
    img.onerror = markLoaded
  }, [])

  useEffect(() => {
    indexRef.current = index
  }, [index])

  useEffect(() => {
    if (!canAutoplay) return undefined

    const interval = window.setInterval(() => {
      const next = (indexRef.current + 1) % SLIDES.length
      goTo(next)
    }, 5200)

    return () => window.clearInterval(interval)
  }, [canAutoplay, goTo])

  useEffect(() => {
    if (exportMode) return undefined

    const nextSlides = [SLIDES[index + 1], SLIDES[index + 2]].filter(Boolean)
    const queue = nextSlides.flatMap((slide) => [slide.imageKey, slide.emotionImageKey]).filter(Boolean)
    if (queue.length === 0) return undefined

    let idleId = null
    let timeoutId = null

    const runQueue = () => {
      queue.forEach((assetKey) => preloadAssetKey(assetKey))
    }

    if (typeof window.requestIdleCallback === 'function') {
      idleId = window.requestIdleCallback(runQueue, { timeout: 500 })
    } else {
      timeoutId = window.setTimeout(runQueue, 120)
    }

    return () => {
      if (idleId !== null && typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(idleId)
      }
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId)
      }
    }
  }, [index, exportMode, preloadAssetKey])

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
  }, [exportMode, goTo, initialTime])

  const wordVariants = {
    hidden: { opacity: 0, y: performanceMode ? 0 : 28 },
    show: {
      opacity: 1,
      y: 0,
      transition: performanceMode ? { duration: 0.12 } : { type: 'spring', ...SPRING },
    },
  }

  const renderHeading = (text) => {
    if (performanceMode) return text
    return splitWords(text).map((word, idx) => (
      <motion.span key={`${word}-${idx}`} variants={wordVariants} className="mr-2 inline-block">
        {word}
      </motion.span>
    ))
  }

  const applySwipeDelta = (deltaX, deltaY = 0) => {
    if (Math.abs(deltaY) > Math.abs(deltaX)) return
    if (Math.abs(deltaX) < SWIPE_THRESHOLD) return
    if (deltaX < 0) goTo(indexRef.current + 1)
    if (deltaX > 0) goTo(indexRef.current - 1)
  }

  const onPointerDown = (event) => {
    if (event.pointerType !== 'touch') return
    swipeRef.current = { source: 'pointer', startX: event.clientX, startY: event.clientY }
  }

  const onPointerUp = (event) => {
    if (event.pointerType !== 'touch') return
    if (swipeRef.current.source !== 'pointer' || swipeRef.current.startX === null || swipeRef.current.startY === null) return
    applySwipeDelta(event.clientX - swipeRef.current.startX, event.clientY - swipeRef.current.startY)
    swipeRef.current = { source: null, startX: null, startY: null }
  }

  const onTouchStart = (event) => {
    if (swipeRef.current.source === 'pointer') return
    swipeRef.current = {
      source: 'touch',
      startX: event.changedTouches[0]?.clientX ?? null,
      startY: event.changedTouches[0]?.clientY ?? null,
    }
  }

  const onTouchEnd = (event) => {
    if (swipeRef.current.source !== 'touch' || swipeRef.current.startX === null || swipeRef.current.startY === null) return
    applySwipeDelta(
      (event.changedTouches[0]?.clientX ?? 0) - swipeRef.current.startX,
      (event.changedTouches[0]?.clientY ?? 0) - swipeRef.current.startY
    )
    swipeRef.current = { source: null, startX: null, startY: null }
  }

  const baseRevealTransition = performanceMode
    ? { duration: 0.1 }
    : { duration: 0.32, ease: EASE }

  return (
    <main
      className="relative h-screen h-[100dvh] min-h-[100svh] w-full overflow-hidden bg-[#070b14] text-white [--controls-h:120px] sm:[--controls-h:108px]"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{
        touchAction: 'pan-y',
        '--safe-top': 'env(safe-area-inset-top, 0px)',
        '--safe-bottom': 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute left-[-18%] top-[-10%] h-96 w-96 rounded-[50%] bg-gradient-to-br from-[#003A8C]/40 to-[#1E40AF]/30"
          animate={{ scale: 1.02 + index * 0.01, x: index % 2 === 0 ? -8 : 6, y: index % 2 === 0 ? 8 : -6, opacity: 0.88 }}
          transition={{ duration: performanceMode ? 0.16 : 0.42, ease: EASE }}
        />
        <motion.div
          className="absolute right-[-16%] top-[14%] h-80 w-80 rounded-[50%] bg-gradient-to-br from-[#F4A261]/32 to-[#E07A5F]/30"
          animate={{ scale: 1.01 + (index % 3) * 0.02, x: index % 2 === 0 ? 6 : -8, y: index % 2 === 0 ? -8 : 8, opacity: 0.86 }}
          transition={{ duration: performanceMode ? 0.16 : 0.42, ease: EASE }}
        />
        <motion.div
          className="absolute bottom-[-18%] left-[8%] h-96 w-96 rounded-[50%] bg-gradient-to-br from-[#6B7280]/28 to-[#374151]/32"
          animate={{ scale: 1.02 + index * 0.006, x: index % 2 === 0 ? 7 : -7, y: index % 2 === 0 ? -5 : 6, opacity: 0.82 }}
          transition={{ duration: performanceMode ? 0.16 : 0.42, ease: EASE }}
        />
      </div>

      <div className="relative z-10 h-full w-full overflow-hidden select-none">
        <motion.div
          className="flex h-full"
          style={{ width: `${SLIDES.length * 100}%`, willChange: 'transform' }}
          animate={{ x: `-${index * slideWidth}%` }}
          transition={performanceMode ? { duration: 0.1 } : { duration: 0.32, ease: EASE }}
        >
          {SLIDES.map((slide, slideIndex) => {
            const isActive = slideIndex === index
            const isCenterSlide = slide.id === 'arrival' || slide.id === 'final'

            return (
              <section key={slide.id} className="relative h-full flex-none" style={{ width: `${slideWidth}%` }} aria-hidden={!isActive}>
                <div className="absolute inset-0">
                  <ResponsiveImage
                    assetKey={slide.imageKey}
                    eager={slideIndex === 0 && index === 0}
                    className="h-full w-full object-cover"
                    style={{ transform: performanceMode ? 'none' : 'scale(1.015)' }}
                  />
                </div>

                <div className="absolute inset-0 bg-black/52" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/45 to-black/74" />

                <div
                  className="relative mx-auto flex h-full w-full max-w-md flex-col justify-start px-5 sm:max-w-lg sm:px-7"
                  style={{
                    paddingTop: 'calc(var(--safe-top) + 16px)',
                    paddingBottom: 'calc(var(--safe-bottom) + var(--controls-h) + 16px)',
                  }}
                >
                  <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
                    {isActive && (
                      <motion.div
                        key={`${slide.id}-${index}`}
                        initial="hidden"
                        animate="show"
                        variants={{
                          hidden: {},
                          show: {
                            transition: performanceMode ? { staggerChildren: 0.01 } : { staggerChildren: 0.08, delayChildren: 0.04 },
                          },
                        }}
                        className={isCenterSlide ? 'min-h-full space-y-5 text-center flex flex-col justify-center' : 'space-y-4 pt-2'}
                      >
                      {slide.id === 'arrival' && (
                        <>
                          <motion.p variants={wordVariants} className="text-xs uppercase tracking-[0.26em] text-[#F4A261]">
                            Expat Village
                          </motion.p>
                          <motion.h1 className="font-display text-5xl leading-[0.95] sm:text-6xl">{renderHeading(slide.heading)}</motion.h1>
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
                            whileHover={performanceMode ? undefined : { y: -2, boxShadow: '0 14px 28px rgba(0,0,0,0.28)' }}
                            className="mx-auto inline-flex h-12 items-center justify-center rounded-full border border-[#F4A261]/75 bg-[#003A8C]/85 px-7 font-semibold"
                          >
                            {slide.cta}
                          </motion.button>
                        </>
                      )}

                      {slide.id === 'promise' && (
                        <>
                          <motion.p variants={wordVariants} className="text-xs uppercase tracking-[0.26em] text-[#F4A261]">
                            The Promise
                          </motion.p>
                          <motion.h2 className="font-display text-4xl leading-tight sm:text-5xl">{renderHeading(slide.heading)}</motion.h2>
                          <motion.p variants={wordVariants} className="max-w-md text-base leading-relaxed text-white/90 sm:text-lg">
                            {slide.body}
                          </motion.p>
                        </>
                      )}

                      {slide.id === 'path' && (
                        <>
                          <motion.p variants={wordVariants} className="text-xs uppercase tracking-[0.26em] text-[#F4A261]">
                            The Path
                          </motion.p>
                          <motion.h2 className="font-display text-4xl leading-tight sm:text-5xl">{renderHeading(slide.heading)}</motion.h2>
                          <motion.p variants={wordVariants} className="text-base text-white/90 sm:text-lg">
                            {slide.body}
                          </motion.p>

                          <div
                            className="grid grid-cols-1 gap-3 max-h-[48dvh] overflow-y-auto overscroll-contain pr-1 sm:max-h-none sm:grid-cols-2 sm:overflow-visible sm:pr-0"
                            style={{ WebkitOverflowScrolling: 'touch' }}
                          >
                            {slide.steps.map((card) => (
                              <motion.article
                                key={card.title}
                                variants={{
                                  hidden: { y: performanceMode ? 0 : 58, opacity: 0 },
                                  show: {
                                    y: 0,
                                    opacity: 1,
                                    transition: baseRevealTransition,
                                  },
                                }}
                                className="rounded-2xl border border-white/20 bg-black/45 p-4"
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
                          </div>
                        </>
                      )}

                      {slide.id === 'village' && (
                        <>
                          <motion.p variants={wordVariants} className="text-xs uppercase tracking-[0.26em] text-[#F4A261]">
                            The Village
                          </motion.p>
                          <motion.h2 className="font-display text-4xl leading-tight sm:text-5xl">{renderHeading(slide.heading)}</motion.h2>
                          <motion.p variants={wordVariants} className="max-w-md text-base leading-relaxed text-white/90 sm:text-lg">
                            {slide.body}
                          </motion.p>
                          <motion.div
                            variants={{
                              hidden: { y: performanceMode ? 0 : 52, opacity: 0 },
                              show: {
                                y: 0,
                                opacity: 1,
                                transition: baseRevealTransition,
                              },
                            }}
                            className="relative h-44 overflow-hidden rounded-2xl border border-white/20 bg-black/35"
                          >
                            <ResponsiveImage assetKey={slide.emotionImageKey} eager={false} className="h-full w-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/52 to-transparent" />
                          </motion.div>
                        </>
                      )}

                      {slide.id === 'final' && (
                        <>
                          <motion.p variants={wordVariants} className="text-xs uppercase tracking-[0.26em] text-[#F4A261]">
                            Final Step
                          </motion.p>
                          <motion.h2 className="font-display text-4xl leading-tight sm:text-5xl">{renderHeading(slide.heading)}</motion.h2>
                          <motion.div variants={wordVariants} className="mx-auto flex max-w-sm flex-col gap-3">
                            <motion.div whileTap={{ scale: 0.95 }}>
                              <Link
                                to="/onboarding"
                                className="inline-flex h-12 w-full items-center justify-center rounded-full border border-[#F4A261]/75 bg-[#003A8C]/85 px-7 font-semibold"
                              >
                                Begin Onboarding
                              </Link>
                            </motion.div>
                          </motion.div>
                        </>
                      )}
                      </motion.div>
                    )}
                  </div>
                </div>
              </section>
            )
          })}
        </motion.div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 z-20"
        style={{ bottom: 'calc(var(--safe-bottom) + 8px)' }}
      >
        <div className="pointer-events-auto mx-auto w-full max-w-md px-5 sm:max-w-lg sm:px-7">
          <div className="rounded-2xl border border-white/20 bg-black/45 p-4">
            <div className="flex items-center justify-center gap-2">
              {SLIDES.map((_, dotIndex) => (
                <button
                  key={dotIndex}
                  type="button"
                  aria-label={`Go to step ${dotIndex + 1}`}
                  onClick={() => goTo(dotIndex)}
                  className="h-4 w-4 rounded-full p-0"
                >
                  <motion.span
                    className="block h-2.5 w-2.5 rounded-full"
                    animate={{
                      scale: dotIndex === index ? 1.3 : 1,
                      backgroundColor: dotIndex === index ? '#003A8C' : 'rgba(255,255,255,0.55)',
                    }}
                    transition={performanceMode ? { duration: 0.1 } : { duration: 0.2, ease: EASE }}
                  />
                </button>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between">
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
      </div>
    </main>
  )
}

export default ExpatOnboarding
