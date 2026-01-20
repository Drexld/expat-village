import { Link } from 'react-router-dom'

function GetThingsDone() {
  return (
    <div>
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link to="/" className="text-slate-400 hover:text-white transition-colors">
          ← Back to Home
        </Link>
      </nav>

      {/* Page Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">📋</span>
          <h1 className="text-3xl font-bold text-white">Get Things Done</h1>
        </div>
        <p className="text-slate-400 text-lg">
          The essential tasks every expat needs to handle. Step by step, no confusion.
        </p>
      </header>

      {/* Coming Soon */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
        <p className="text-slate-400 mb-4">🚧 Content coming soon!</p>
        <p className="text-slate-500 text-sm">
          We're adding guides for banking, PESEL, residency, and more.
        </p>
      </div>
    </div>
  )
}

export default GetThingsDone