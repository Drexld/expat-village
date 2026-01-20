import { Link } from 'react-router-dom'

function InsuranceHealth() {
  return (
    <div>
      <nav className="mb-6">
        <Link to="/" className="text-slate-400 hover:text-white transition-colors">
          ← Back to Home
        </Link>
      </nav>

      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">🏥</span>
          <h1 className="text-3xl font-bold text-white">Insurance & Health</h1>
        </div>
        <p className="text-slate-400 text-lg">
          Understanding healthcare in Poland doesn't have to be confusing.
        </p>
      </header>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
        <p className="text-slate-400 mb-4">🚧 Content coming soon!</p>
        <p className="text-slate-500 text-sm">
          We're adding guides for NFZ, private health insurance, and more.
        </p>
      </div>
    </div>
  )
}

export default InsuranceHealth