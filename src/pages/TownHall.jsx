import { Link } from 'react-router-dom'

function TownHall() {
  return (
    <div>
      <nav className="mb-6">
        <Link to="/" className="text-slate-400 hover:text-white transition-colors">
          ← Back to Home
        </Link>
      </nav>

      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">🏛️</span>
          <h1 className="text-3xl font-bold text-white">Town Hall</h1>
          <span className="text-xs bg-emerald-600 text-white px-2 py-1 rounded-full">
            Community
          </span>
        </div>
        <p className="text-slate-400 text-lg">
          Connect with fellow expats. Ask questions. Share experiences. Meet up.
        </p>
      </header>

      <div className="bg-gradient-to-r from-emerald-900/30 to-slate-800 border border-emerald-700/50 rounded-xl p-8 text-center">
        <p className="text-emerald-300 mb-4">🚧 Community features coming soon!</p>
        <p className="text-slate-400 text-sm">
          Topic rooms, event planning, Q&A, and real-time discussions are on the way.
        </p>
      </div>
    </div>
  )
}

export default TownHall