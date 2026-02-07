'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { sectionReveal } from '../_lib/motion'

type CinematicSectionProps = {
  id?: string
  className?: string
  children: ReactNode
}

export default function CinematicSection({ id, className, children }: CinematicSectionProps) {
  const shouldReduceMotion = Boolean(useReducedMotion())

  return (
    <motion.section
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionReveal(shouldReduceMotion)}
    >
      {children}
    </motion.section>
  )
}
