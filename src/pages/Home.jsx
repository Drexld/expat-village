import { Link } from 'react-router-dom'

function Home() {
  const sections = [
    {
      id: 'get-things-done',
      icon: '📋',
      title: 'Get Things Done',
      description: 'Bank accounts, PESEL, residency permits, contracts reviewed in plain English.',
      tags: ['Banking', 'Legal', 'Bureaucracy'],
      path: '/get-things-done',
      featured: false
    },
    {
      id: 'insurance-health',
      icon: '🏥',
      title: 'Insurance & Health',
      description: 'NFZ explained simply, private insurance expats actually use, and staying covered.',
      tags: ['NFZ', 'Private Health', 'Home Insurance'],
      path: '/insurance-health',
      featured: false
    },
    {
      id: 'live-your-life',
      icon: '🎯',
      title: 'Live Your Life',
      description: 'Salons for all hair types, gyms, restaurants, events — the good stuff.',
      tags: ['Salons', 'Fitness', 'Food & Drink'],
      path: '/live-your-life',
      featured: false
    },
    {
      id: 'housing',
      icon: '🏠',
      title: 'Housing',
      description: 'Trusted rental sites, English-speaking agents, scam warnings, and co-living options.',
      tags: ['Rentals', 'Agents', 'Scam Alerts'],
      path: '/housing',
      featured: false
    },
    {
      id: 'town-hall',
      icon: '🏛️',
      title: 'Town Hall',
      description: 'Real expats, real experiences. Ask questions, share tips, find your people.',
      tags: ['🏀 Sports', '🍽️ Food Meetups', '💬 Q&A'],
      path: '/town-hall',
      featured: true
    }
  ]

  return (
    <>
      {/* Welcome Section */}
      <section className="mb-12 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Welcome to Warsaw 🇵🇱
        </h2>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          Everything you need to settle in, sorted by someone who's been through it.
          No scattered blogs. No outdated guides. Just calm, clear help.
        </p>
      </section>

      {/* Main Navigation Cards */}
      <section className="space-y-4">
        {sections.map((section) => (
          <Link
            key={section.id}
            to={section.path}
            className={`block border rounded-xl p-6 transition-all group ${
              section.featured
                ? 'bg-gradient-to-r from-emerald-900/50 to-slate-800 hover:from-emerald-900/70 border-emerald-700/50 hover:border-emerald-600/50'
                : 'bg-slate-800 hover:bg-slate-750 border-slate-700 hover:border-slate-600'
            }`}
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl">{section.icon}</span>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                  {section.title}
                  {section.featured && (
                    <span className="ml-2 text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                      Community
                    </span>
                  )}
                </h3>
                <p className="text-slate-400">{section.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {section.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`text-xs px-2 py-1 rounded ${
                        section.featured
                          ? 'bg-emerald-800/50 text-emerald-300'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <span className={`transition-colors ${
                section.featured
                  ? 'text-slate-500 group-hover:text-emerald-300'
                  : 'text-slate-500 group-hover:text-slate-300'
              }`}>→</span>
            </div>
          </Link>
        ))}
      </section>

      {/* Trust Banner */}
      <section className="mt-12 text-center text-slate-500 text-sm">
        <p>
          ✓ Updated regularly · ✓ Sources linked · ✓ Community moderated
        </p>
      </section>
    </>
  )
}

export default Home