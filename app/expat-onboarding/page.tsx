import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import CinematicOnboardingClient from './_components/CinematicOnboardingClient'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['600', '700'],
})

export const metadata: Metadata = {
  title: 'Expat Onboarding | Expat Village - Warsaw and Beyond',
  description:
    'A cinematic onboarding experience for expats relocating to Warsaw, from first paperwork to everyday confidence.',
}

export default function ExpatOnboardingPage() {
  return (
    <div className={`${inter.variable} ${playfair.variable}`}>
      <CinematicOnboardingClient />
    </div>
  )
}
