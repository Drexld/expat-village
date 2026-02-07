import type { Variants } from 'framer-motion'

export const CINEMATIC_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]
export const SOFT_EASE = 'easeInOut' as const

export const sectionReveal = (shouldReduceMotion: boolean): Variants => ({
  hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: shouldReduceMotion ? 0.45 : 1,
      ease: shouldReduceMotion ? SOFT_EASE : CINEMATIC_EASE,
    },
  },
})

export const staggerContainer = (stagger = 0.1): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren: 0.08,
    },
  },
})

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: CINEMATIC_EASE,
    },
  },
}
