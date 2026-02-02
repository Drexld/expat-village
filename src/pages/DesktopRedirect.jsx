// src/pages/DesktopRedirect.jsx
// Desktop redirect page with QR code

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function DesktopRedirect() {
  const navigate = useNavigate()
  const [bypassDesktop, setBypassDesktop] = useState(false)

  const SITE_URL = 'https://expat-village.vercel.app'
  const QR_CODE_URL = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(SITE_URL)}&bgcolor=0F172A&color=A78BFA`

  const handleContinueAnyway = () => {
    // Store bypass preference
    localStorage.setItem('bypass_desktop_redirect', 'true')
    setBypassDesktop(true)
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative max-w-2xl w-full">
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-800/50 p-12 text-center shadow-2xl">

          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-amber-500 rounded-2xl blur-xl opacity-50" />
              <div className="relative w-20 h-20 rounded-2xl shadow-lg overflow-hidden">
                <img src="/icon.svg" alt="Expat Village" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-bold text-white mb-4">
            Expat Village
          </h1>
          <p className="text-xl text-slate-400 mb-2">Warsaw & Beyond</p>

          {/* Mobile emoji */}
          <div className="text-6xl mb-6">📱</div>

          {/* Message */}
          <p className="text-2xl font-semibold text-white mb-4">
            Expat Village is a mobile experience
          </p>
          <p className="text-slate-400 mb-12 max-w-md mx-auto">
            Scan the QR code below with your phone to access the full experience, or continue on desktop for a limited view.
          </p>

          {/* QR Code */}
          <div className="flex justify-center mb-8">
            <div className="relative p-6 bg-white rounded-2xl shadow-2xl">
              <img
                src={QR_CODE_URL}
                alt="QR Code to Expat Village"
                className="w-64 h-64"
              />
            </div>
          </div>

          {/* URL display */}
          <div className="flex items-center justify-center gap-3 mb-8 px-6 py-3 bg-slate-800/50 rounded-xl border border-slate-700/50 max-w-md mx-auto">
            <span className="text-purple-400 font-mono text-sm">🌐</span>
            <span className="text-slate-300 font-mono text-sm">{SITE_URL}</span>
          </div>

          {/* Continue anyway button */}
          <button
            onClick={handleContinueAnyway}
            className="text-slate-500 hover:text-slate-300 text-sm transition-colors underline"
          >
            Continue on desktop anyway
          </button>

        </div>

        {/* Footer note */}
        <p className="text-center text-slate-600 text-sm mt-6">
          Made with 💜 in Warsaw for expats
        </p>
      </div>
    </div>
  )
}

export default DesktopRedirect
