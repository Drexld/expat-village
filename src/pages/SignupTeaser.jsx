import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getWarsawWeather } from '../services/weather'
import AuthModal from '../components/AuthModal'
import Icon from '../components/Icon'

function SignupTeaser() {
  const { loading, isAuthenticated, authModal, openAuthModal } = useAuth()
  const [weatherData, setWeatherData] = useState({ temp: 0 })

  useEffect(() => {
    let mounted = true

    async function loadWeather() {
      const weather = await getWarsawWeather()
      if (mounted) {
        setWeatherData(weather)
      }
    }

    loadWeather()

    return () => {
      mounted = false
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-terra-bg flex items-center justify-center">
        <div className="text-terra-primary">Loading...</div>
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen theme-midnight prism-backdrop text-terra-ink flex justify-center">
      <AuthModal />
      <div className="w-full max-w-md relative px-4 pt-6 pb-8">
        <header className="fixed top-0 left-0 right-0 z-40 bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-16 md:h-20">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="relative">
                  <div
                    className="absolute inset-0 rounded-xl blur-lg opacity-50 transition-opacity"
                    style={{ background: 'linear-gradient(135deg, rgba(199,107,85,0.45), rgba(246,195,143,0.35))' }}
                  />
                  <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-xl overflow-hidden glass-3d texture-layer texture-paper texture-amber">
                    <img src="/icon.svg" alt="Expat Village" className="w-full h-full object-cover" />
                  </div>
                </div>
              </Link>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => openAuthModal('sign_in')}
                  className="text-sm font-medium text-terra-ink-soft hover:text-terra-ink transition-colors px-3 py-2"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuthModal('sign_up')}
                  className="relative"
                >
                  <span className="relative px-5 py-2.5 rounded-full text-sm font-semibold text-terra-bg hover-tilt"
                    style={{ background: 'linear-gradient(135deg, #C76B55, #D07C63)' }}
                  >
                    Join Free
                  </span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="pt-20 md:pt-24 min-h-[calc(100vh-5rem)] md:min-h-[calc(100vh-6rem)] flex items-center justify-center">
          {!authModal?.isOpen && (
            <section className="hero-card texture-layer texture-paper texture-amber text-center motion-rise glass-sheen w-full">
              <p className="text-xs uppercase tracking-widest text-terra-taupe">The Digital Neighborhood</p>
              <h1 className="text-3xl font-display text-terra-ink mt-2">
                A concierge in your pocket.
              </h1>
              <p className="text-sm text-terra-ink-soft mt-3">
                Warm, local guidance for expats settling in Warsaw and beyond.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <span className="pill pill-accent">Warsaw - Live</span>
                <span className="pill pill-accent">{weatherData.temp}C today</span>
              </div>
              <button
                onClick={() => openAuthModal('sign_up')}
                className="mt-5 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-terra-bg hover-tilt"
                style={{ background: 'linear-gradient(135deg, #C76B55, #D07C63)' }}
              >
                Join the village
                <Icon name="arrowRight" className="w-4 h-4 text-terra-bg" />
              </button>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

export default SignupTeaser
