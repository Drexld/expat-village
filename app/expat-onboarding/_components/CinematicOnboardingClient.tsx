'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import CinematicSection from './CinematicSection'
import { CINEMATIC_EASE, SOFT_EASE, staggerContainer, staggerItem } from '../_lib/motion'

type CinematicOnboardingClientProps = {
  className?: string
}

type StepCard = {
  id: string
  icon: string
  title: string
  description: string
}

const STEPS: StepCard[] = [
  {
    id: 'pesel',
    icon: 'ID',
    title: 'PESEL',
    description: 'Get your national identification number with clear document prep and office guidance.',
  },
  {
    id: 'residency',
    icon: 'RP',
    title: 'Residency',
    description: 'Understand permits, timelines, and practical legal next steps for your stay in Poland.',
  },
  {
    id: 'banking',
    icon: 'BK',
    title: 'Banking',
    description: 'Open the right account quickly and avoid the common traps many newcomers face.',
  },
  {
    id: 'healthcare',
    icon: 'HC',
    title: 'Healthcare',
    description: 'Choose between NFZ and private care options so support is ready when you need it.',
  },
  {
    id: 'housing',
    icon: 'HS',
    title: 'Housing',
    description: 'Find trusted neighborhoods and rental guidance before you sign your next contract.',
  },
  {
    id: 'jobs',
    icon: 'JB',
    title: 'Jobs',
    description: 'Navigate CV norms, permit realities, and practical routes into Warsaw work life.',
  },
]

const heroImage = {
  src: '/images/expat-onboarding/hero-bg.jpg',
  alt: 'Palace of Culture and Science at dusk rising between modern buildings in Warsaw.',
  blurDataURL:
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2NzUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMCIgeTE9IjAiIHgyPSIxIiB5Mj0iMSI+PHN0b3Agc3RvcC1jb2xvcj0iIzBlMTYyYiIgb2Zmc2V0PSIwIi8+PHN0b3Agc3RvcC1jb2xvcj0iIzAwM0E4QyIgb2Zmc2V0PSIwLjUiLz48c3RvcCBzdG9wLWNvbG9yPSIjRTA3QTVGIiBvZmZzZXQ9IjEiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2NzUiIGZpbGw9InVybCgjZykiLz48L3N2Zz4=',
}

const oldTownImage = {
  src: '/images/expat-onboarding/oldtown.jpg',
  alt: 'Christmas-lit Old Town square in Warsaw with colorful buildings and warm market lights.',
  blurDataURL:
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI4MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMCIgeTE9IjAiIHgyPSIxIiB5Mj0iMSI+PHN0b3Agc3RvcC1jb2xvcj0iIzFlMjkzYiIgb2Zmc2V0PSIwIi8+PHN0b3Agc3RvcC1jb2xvcj0iI0Y0QTI2MSIgb2Zmc2V0PSIwLjYiLz48c3RvcCBzdG9wLWNvbG9yPSIjRTA3QTVGIiBvZmZzZXQ9IjEiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI4MDAiIGZpbGw9InVybCgjZykiLz48L3N2Zz4=',
}

const riversideImage = {
  src: '/images/expat-onboarding/riverside.jpg',
  alt: 'Golden-hour Vistula riverside promenade in Warsaw with people biking and walking.',
  blurDataURL:
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI4MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMCIgeTE9IjAiIHgyPSIxIiB5Mj0iMSI+PHN0b3Agc3RvcC1jb2xvcj0iIzBmMTcyYSIgb2Zmc2V0PSIwIi8+PHN0b3Agc3RvcC1jb2xvcj0iIzAwM0E4QyIgb2Zmc2V0PSIwLjUiLz48c3RvcCBzdG9wLWNvbG9yPSIjRjRBMjYxIiBvZmZzZXQ9IjEiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI4MDAiIGZpbGw9InVybCgjZykiLz48L3N2Zz4=',
}

export default function CinematicOnboardingClient({ className }: CinematicOnboardingClientProps) {
  const shouldReduceMotion = Boolean(useReducedMotion())
  const heroRef = useRef<HTMLElement>(null)
  const riversideRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const heroY = useTransform(heroProgress, [0, 1], [0, shouldReduceMotion ? 0 : 66])
  const heroScale = useTransform(heroProgress, [0, 1], [1, shouldReduceMotion ? 1 : 1.06])

  const { scrollYProgress: riversideProgress } = useScroll({
    target: riversideRef,
    offset: ['start end', 'end start'],
  })

  const riversideY = useTransform(
    riversideProgress,
    [0, 1],
    [shouldReduceMotion ? 0 : 16, shouldReduceMotion ? 0 : -30],
  )

  return (
    <main className={`font-cinematic-body cinematic-gradient text-slate-100 ${className ?? ''}`}>
      <motion.section
        ref={heroRef}
        className="relative h-[75vh] sm:h-[80vh] lg:h-screen overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.1, ease: SOFT_EASE }}
      >
        <motion.div className="absolute inset-0 motion-safe-parallax" style={{ y: heroY, scale: heroScale }}>
          <motion.div
            className="absolute inset-0"
            initial={shouldReduceMotion ? false : { scale: 1.05, opacity: 0.9 }}
            animate={shouldReduceMotion ? undefined : { scale: 1, opacity: 1 }}
            transition={{ duration: 1.3, ease: CINEMATIC_EASE }}
          >
            <Image
              src={heroImage.src}
              alt={heroImage.alt}
              fill
              priority
              placeholder="blur"
              blurDataURL={heroImage.blurDataURL}
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
          <div className="cinematic-vignette absolute inset-0" />
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#003A8C]/35 via-black/30 to-black/70" />
        </motion.div>

        <div className="relative z-10 h-full mx-auto max-w-6xl px-6 md:px-10 flex items-center justify-center text-center">
          <motion.div variants={staggerContainer(0.1)} initial="hidden" animate="visible" className="max-w-4xl">
            <motion.h1
              variants={staggerItem}
              className="font-cinematic-heading text-shadow-hero text-5xl sm:text-6xl xl:text-7xl font-semibold tracking-tight leading-[1.02] mb-4"
            >
              Expat Village - Warsaw and Beyond
            </motion.h1>
            <motion.p variants={staggerItem} className="text-xl sm:text-2xl md:text-3xl text-slate-100/95 font-semibold mb-3">
              Your soft landing in Poland
            </motion.p>
            <motion.p variants={staggerItem} className="text-sm sm:text-base md:text-lg text-slate-100/85 max-w-2xl mx-auto mb-8">
              From paperwork to Polish sunsets - we&apos;ve got you.
            </motion.p>
            <motion.div variants={staggerItem} className="flex justify-center">
              <Link
                href="/onboarding"
                aria-label="Start your onboarding journey"
                className="focus-ring inline-flex items-center gap-2 rounded-full border border-[#F4A261]/60 bg-[#003A8C]/60 px-7 py-3 text-sm sm:text-base font-semibold text-white shadow-[0_0_28px_rgba(0,58,140,0.45)] transition-all duration-300 hover:scale-[1.03] hover:border-[#F4A261]/90 hover:shadow-[0_0_38px_rgba(244,162,97,0.35)]"
              >
                Start Your Journey
                <span aria-hidden>{'->'}</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <CinematicSection className="relative overflow-hidden border-t border-white/10 bg-gradient-to-b from-[#0c1427] to-[#111a2f]">
        <div className="mx-auto max-w-5xl px-6 md:px-10 py-16 sm:py-20 text-center">
          <p className="text-xs uppercase tracking-[0.16em] text-[#F4A261] mb-4">Welcome Home</p>
          <h2 className="font-cinematic-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-white mb-5">
            A calmer way to begin life in Warsaw
          </h2>
          <p className="mx-auto max-w-3xl text-slate-200/85 text-base sm:text-lg leading-relaxed">
            Relocation can feel intense. Expat Village turns uncertainty into clear next actions, trusted local context,
            and a community that understands what this transition really feels like.
          </p>
        </div>
      </CinematicSection>

      <section className="relative isolate overflow-hidden border-y border-white/10">
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.2, ease: SOFT_EASE }}
        >
          <Image
            src={oldTownImage.src}
            alt={oldTownImage.alt}
            fill
            placeholder="blur"
            blurDataURL={oldTownImage.blurDataURL}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#0a1224]/75" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#003A8C]/40 via-black/55 to-[#0a0f1f]/85" />
        </motion.div>

        <CinematicSection id="steps" className="relative z-10 mx-auto max-w-6xl px-6 md:px-10 py-20 sm:py-24">
          <div className="text-center mb-12 sm:mb-14">
            <p className="text-xs uppercase tracking-[0.16em] text-[#F4A261] mb-3">Onboarding Path</p>
            <h2 className="font-cinematic-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-white mb-4">
              Handle the hard stuff, step by step
            </h2>
            <p className="mx-auto max-w-2xl text-slate-100/85">
              One practical path from arrival pressure to everyday confidence.
            </p>
          </div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
            variants={staggerContainer(0.12)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
          >
            {STEPS.map((step) => (
              <motion.article
                key={step.id}
                variants={staggerItem}
                whileHover={shouldReduceMotion ? undefined : { y: -6, scale: 1.01 }}
                transition={{ duration: 0.45, ease: CINEMATIC_EASE }}
                className="group rounded-2xl border border-white/15 bg-white/[0.06] backdrop-blur-md p-6 shadow-[0_22px_45px_rgba(0,0,0,0.35)]"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-[#003A8C]/45 text-xs font-semibold tracking-wide text-white">
                  <span aria-hidden>{step.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-slate-200/85 text-sm leading-relaxed mb-5">{step.description}</p>
                <Link
                  href={`/onboarding?step=${encodeURIComponent(step.id)}`}
                  aria-label={`Learn more about ${step.title}`}
                  className="focus-ring inline-flex items-center text-sm font-semibold text-[#F4A261] transition-colors group-hover:text-[#ffd1a7]"
                >
                  Learn More
                  <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
                    {'->'}
                  </span>
                </Link>
              </motion.article>
            ))}
          </motion.div>
        </CinematicSection>
      </section>

      <CinematicSection id="community" className="relative border-t border-white/10 bg-gradient-to-b from-[#0b111f] to-[#101a30]">
        <div className="mx-auto max-w-6xl px-6 md:px-10 py-20 sm:py-24 grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-10 lg:gap-14 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[#F4A261] mb-4">Community Pulse</p>
            <h2 className="font-cinematic-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-white mb-5">
              Daily city pulse, curated for expats
            </h2>
            <p className="text-slate-200/85 text-base sm:text-lg leading-relaxed">
              Discover trusted recommendations, local events, and real stories from people building a life in Warsaw.
              Practical updates meet human warmth so your days feel more connected and less overwhelming.
            </p>
          </div>

          <div
            ref={riversideRef}
            className="relative h-[320px] sm:h-[420px] overflow-hidden rounded-2xl border border-white/10 shadow-[0_32px_75px_rgba(0,0,0,0.45)]"
          >
            <motion.div style={{ y: riversideY }} className="absolute inset-0 motion-safe-parallax scale-[1.08]">
              <Image
                src={riversideImage.src}
                alt={riversideImage.alt}
                fill
                placeholder="blur"
                blurDataURL={riversideImage.blurDataURL}
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
            </motion.div>
          </div>
        </div>
      </CinematicSection>

      <CinematicSection className="relative border-t border-white/10 bg-gradient-to-b from-[#111a30] to-[#070b14]">
        <div className="mx-auto max-w-4xl px-6 md:px-10 py-20 sm:py-24 text-center">
          <h2 className="font-cinematic-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-white mb-5">
            Ready to make Warsaw feel like home?
          </h2>
          <p className="mx-auto max-w-2xl text-slate-200/85 text-base sm:text-lg mb-9">
            Start your onboarding flow now, or explore the city first and come back when you are ready.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/onboarding"
              aria-label="Begin onboarding now"
              className="focus-ring inline-flex items-center justify-center rounded-full bg-[#003A8C] px-7 py-3 text-sm sm:text-base font-semibold text-white shadow-[0_12px_36px_rgba(0,58,140,0.5)] transition-transform duration-300 hover:scale-[1.03] hover:bg-[#0a4aa8]"
            >
              Begin Onboarding
            </Link>
            <Link
              href="/explore"
              aria-label="Explore Warsaw first"
              className="focus-ring inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 px-7 py-3 text-sm sm:text-base font-semibold text-white transition-colors duration-300 hover:bg-white/10"
            >
              Explore Warsaw First
            </Link>
          </div>
        </div>
      </CinematicSection>
    </main>
  )
}
