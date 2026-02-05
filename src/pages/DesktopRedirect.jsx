// src/pages/DesktopRedirect.jsx
// Desktop redirect page with QR code

import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'

function DesktopRedirect() {
  const navigate = useNavigate()

  const SITE_URL = 'https://expat-village.vercel.app'
  const QR_CODE_URL = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(SITE_URL)}&bgcolor=0F172A&color=A7B0FF`

  const handleContinueAnyway = () => {
    localStorage.setItem('bypass_desktop_redirect', 'true')
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="relative max-w-2xl w-full">
        <div className="glass-strong surface-glow rounded-3xl border border-white/10 p-10 text-center">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl blur-xl opacity-30" style={{ background: 'radial-gradient(circle, rgba(154,163,255,0.6), transparent 70%)' }} />
              <div className="relative w-20 h-20 rounded-2xl shadow-lg overflow-hidden border border-white/10">
                <img src="/icon.svg" alt="Expat Village" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-semibold text-white mb-2">Expat Village</h1>
          <p className="text-base text-slate-400 mb-6">Warsaw and beyond</p>

          <div className="flex justify-center mb-6">
            <div className="glass-panel flex items-center justify-center w-16 h-16 rounded-2xl">
              <Icon name="phone" size={28} className="text-slate-100" />
            </div>
          </div>

          <p className="text-2xl font-semibold text-white mb-3">
            Expat Village is a mobile-first experience
          </p>
          <p className="text-slate-400 mb-10 max-w-md mx-auto">
            Scan the QR code below with your phone to access the full experience, or continue on desktop for a limited view.
          </p>

          <div className="flex justify-center mb-8">
            <div className="relative p-6 bg-white rounded-2xl shadow-2xl">
              <img
                src={QR_CODE_URL}
                alt="QR Code to Expat Village"
                className="w-64 h-64"
              />
            </div>
          </div>

          <div className="glass-panel flex items-center justify-center gap-3 mb-8 px-6 py-3 rounded-xl border border-white/10 max-w-md mx-auto">
            <Icon name="globe" size={16} className="text-slate-300" />
            <span className="text-slate-200 font-mono text-sm">{SITE_URL}</span>
          </div>

          <button
            onClick={handleContinueAnyway}
            className="text-slate-400 hover:text-slate-200 text-sm transition-colors underline"
          >
            Continue on desktop anyway
          </button>
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          Made in Warsaw for expats
        </p>
      </div>
    </div>
  )
}

export default DesktopRedirect
