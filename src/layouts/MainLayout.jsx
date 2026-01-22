import { Link, Outlet, useLocation } from 'react-router-dom'

function MainLayout() {
  const location = useLocation()
  
  // Don't show layout on onboarding page
  if (location.pathname === '/onboarding') {
    return <Outlet />
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 sticky top-0 bg-slate-900/95 backdrop-blur z-50">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <span className="text-2xl">🏘️</span>
              <div>
                <h1 className="text-xl font-bold text-white">Expat Village</h1>
                <p className="text-slate-400 text-xs">Your guide to life in Poland</p>
              </div>
            </Link>
            <nav className="flex gap-4">
              <button className="text-slate-400 hover:text-white transition-colors text-sm">
                Sign In
              </button>
              <Link 
                to="/onboarding"
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg transition-colors text-sm"
              >
                Join Free
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-16">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              © 2026 Expat Village · Made with ❤️ in Warsaw
            </p>
            <div className="flex gap-6 text-sm text-slate-500">
              <a href="#" className="hover:text-slate-300 transition-colors">About</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Contact</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Privacy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default MainLayout
