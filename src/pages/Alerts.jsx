import { Link } from 'react-router-dom'
import { useState } from 'react'

function Alerts() {
  const [activeFilter, setActiveFilter] = useState('all') // all, immigration, tax, health, housing, transport
  const [subscribedTopics, setSubscribedTopics] = useState(['immigration', 'tax'])

  const filters = [
    { id: 'all', name: 'All Alerts', icon: '📢' },
    { id: 'immigration', name: 'Immigration', icon: '🛂' },
    { id: 'tax', name: 'Tax & Finance', icon: '💰' },
    { id: 'health', name: 'Health', icon: '🏥' },
    { id: 'housing', name: 'Housing', icon: '🏠' },
    { id: 'transport', name: 'Transport', icon: '🚇' },
  ]

  const alerts = [
    {
      id: 1,
      type: 'urgent',
      category: 'immigration',
      title: 'Work Permit Processing Delays',
      summary: 'Mazovian Voivodeship Office reports 3-4 month delays for work permit applications. Plan accordingly.',
      fullContent: 'Due to increased application volume, the Mazovian Voivodeship Office is experiencing significant delays in processing work permit applications. Current wait times are 3-4 months, up from the usual 1-2 months. Applicants are advised to submit applications well in advance of permit expiration dates.',
      date: '2 hours ago',
      source: 'Mazovian Voivodeship Office',
      verified: true,
      actionRequired: true,
      affectedUsers: 'All work permit applicants in Warsaw',
    },
    {
      id: 2,
      type: 'important',
      category: 'tax',
      title: 'PIT-37 Deadline Extended to May 15',
      summary: 'Good news! The deadline for filing PIT-37 tax returns has been extended from April 30 to May 15, 2026.',
      fullContent: 'The Ministry of Finance announced an extension for the 2025 tax year PIT-37 filing deadline. The new deadline is May 15, 2026. This applies to employees and contractors filing standard tax returns. B2B taxpayers filing PIT-36 are not affected.',
      date: '1 day ago',
      source: 'Ministry of Finance',
      verified: true,
      actionRequired: false,
      affectedUsers: 'All taxpayers filing PIT-37',
    },
    {
      id: 3,
      type: 'info',
      category: 'immigration',
      title: 'New Online Appointment System for Foreigners Office',
      summary: 'Warsaw Foreigners Office launches new online booking system. Old system will be discontinued Feb 1.',
      fullContent: 'Starting February 1, 2026, all appointments at the Warsaw Foreigners Office must be booked through the new online system at cudzoziemcy.um.warszawa.pl. The old phone booking system will be discontinued. Users must create a new account even if they had one in the old system.',
      date: '3 days ago',
      source: 'Warsaw City Hall',
      verified: true,
      actionRequired: true,
      affectedUsers: 'All foreigners needing office appointments',
    },
    {
      id: 4,
      type: 'important',
      category: 'health',
      title: 'NFZ Registration Now Available at ZUS Offices',
      summary: 'You can now register for NFZ health insurance at any ZUS office, not just NFZ branches.',
      fullContent: 'In a move to reduce wait times, NFZ registration can now be completed at ZUS (Social Insurance) offices across Poland. This is particularly helpful in Warsaw where NFZ offices often have long queues. Bring your passport, PESEL confirmation, and employment contract.',
      date: '5 days ago',
      source: 'NFZ / ZUS',
      verified: true,
      actionRequired: false,
      affectedUsers: 'Expats needing NFZ registration',
    },
    {
      id: 5,
      type: 'info',
      category: 'housing',
      title: 'Rent Prices Stabilizing in Warsaw',
      summary: 'After 2 years of increases, Warsaw rent prices show signs of stabilization according to latest data.',
      fullContent: 'Data from Otodom and Morizon shows Warsaw rental prices have stabilized after significant increases in 2024-2025. Average prices remain high but month-over-month growth has slowed to under 1%. Experts suggest this could be a good time for expats looking to negotiate longer lease terms.',
      date: '1 week ago',
      source: 'Otodom Market Report',
      verified: true,
      actionRequired: false,
      affectedUsers: 'Renters and apartment seekers',
    },
    {
      id: 6,
      type: 'info',
      category: 'transport',
      title: 'ZTM Ticket Prices Increase from March 1',
      summary: 'Monthly ticket prices will increase by 10%. Single tickets remain unchanged.',
      fullContent: 'Warsaw Public Transport (ZTM) announced a 10% increase in monthly and quarterly ticket prices effective March 1, 2026. A monthly ticket will cost 121 PLN (up from 110 PLN). Single tickets and 24-hour tickets remain at current prices. Student discounts (51%) still apply.',
      date: '1 week ago',
      source: 'ZTM Warsaw',
      verified: true,
      actionRequired: false,
      affectedUsers: 'Public transport users',
    },
    {
      id: 7,
      type: 'urgent',
      category: 'immigration',
      title: 'Temporary Protection Status Extended for Ukrainians',
      summary: 'EU extends temporary protection for Ukrainian refugees until March 2027.',
      fullContent: 'The European Council has extended the Temporary Protection Directive for Ukrainian refugees until March 4, 2027. This means Ukrainians in Poland under this status do not need to take immediate action. PESEL UKR holders should check their documentation is up to date.',
      date: '2 weeks ago',
      source: 'European Council',
      verified: true,
      actionRequired: false,
      affectedUsers: 'Ukrainian refugees under temporary protection',
    },
    {
      id: 8,
      type: 'important',
      category: 'tax',
      title: 'New ZUS Contributions for 2026',
      summary: 'ZUS contribution amounts have changed for 2026. B2B freelancers take note.',
      fullContent: 'ZUS contributions for 2026 have been updated. Large ZUS (duży ZUS) is now approximately 1,600 PLN/month. Small ZUS (mały ZUS) for new businesses remains available for the first 24 months. Health insurance (składka zdrowotna) calculations remain at 9% of income for B2B.',
      date: '3 weeks ago',
      source: 'ZUS',
      verified: true,
      actionRequired: true,
      affectedUsers: 'B2B contractors and freelancers',
    },
  ]

  const filteredAlerts = activeFilter === 'all' 
    ? alerts 
    : alerts.filter(a => a.category === activeFilter)

  const toggleSubscription = (topic) => {
    setSubscribedTopics(prev => 
      prev.includes(topic) 
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    )
  }

  const getAlertTypeStyles = (type) => {
    switch (type) {
      case 'urgent':
        return {
          border: 'border-red-700/50',
          bg: 'bg-red-900/20',
          badge: 'bg-red-600',
          icon: '🚨'
        }
      case 'important':
        return {
          border: 'border-yellow-700/50',
          bg: 'bg-yellow-900/20',
          badge: 'bg-yellow-600',
          icon: '⚠️'
        }
      default:
        return {
          border: 'border-slate-700',
          bg: 'bg-slate-800',
          badge: 'bg-blue-600',
          icon: 'ℹ️'
        }
    }
  }

  const getCategoryIcon = (category) => {
    return filters.find(f => f.id === category)?.icon || '📢'
  }

  return (
    <div className="min-h-screen">
      {/* Back Navigation */}
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
      >
        ← Back to Home
      </Link>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">🔔</span>
          <div>
            <h1 className="text-3xl font-bold text-white">Alerts</h1>
            <p className="text-slate-400">Policy updates, deadlines & important news for expats</p>
          </div>
        </div>
      </header>

      {/* Subscription Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-700/50 rounded-xl p-5 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Get Alerts That Matter</h2>
            <p className="text-slate-400 text-sm">Subscribe to topics and never miss important updates</p>
          </div>
          <span className="text-2xl">📬</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.filter(f => f.id !== 'all').map((filter) => (
            <button
              key={filter.id}
              onClick={() => toggleSubscription(filter.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                subscribedTopics.includes(filter.id)
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <span>{filter.icon}</span>
              <span>{filter.name}</span>
              {subscribedTopics.includes(filter.id) && <span>✓</span>}
            </button>
          ))}
        </div>
        <p className="text-slate-500 text-xs mt-3">
          📧 Subscribed topics will be sent to your email • 
          <button className="text-blue-400 hover:underline ml-1">Manage notification settings</button>
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-red-400">{alerts.filter(a => a.type === 'urgent').length}</p>
          <p className="text-slate-400 text-sm">Urgent Alerts</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-white">{alerts.length}</p>
          <p className="text-slate-400 text-sm">This Month</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-emerald-400">{subscribedTopics.length}</p>
          <p className="text-slate-400 text-sm">Subscribed Topics</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeFilter === filter.id
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <span>{filter.icon}</span>
            <span className="text-sm">{filter.name}</span>
            {filter.id !== 'all' && (
              <span className="text-xs bg-slate-700 px-1.5 py-0.5 rounded">
                {alerts.filter(a => a.category === filter.id).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          const styles = getAlertTypeStyles(alert.type)
          return (
            <div 
              key={alert.id}
              className={`${styles.bg} border ${styles.border} rounded-xl p-5 transition-all hover:border-opacity-100`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{styles.icon}</span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-white">{alert.title}</h3>
                      <span className={`text-xs ${styles.badge} text-white px-2 py-0.5 rounded-full capitalize`}>
                        {alert.type}
                      </span>
                      {alert.actionRequired && (
                        <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full">
                          Action Required
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-slate-500 text-sm">{getCategoryIcon(alert.category)} {filters.find(f => f.id === alert.category)?.name}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-500 text-sm">{alert.date}</span>
                    </div>
                  </div>
                </div>
                {alert.verified && (
                  <span className="text-xs bg-emerald-600 text-white px-2 py-1 rounded-full flex items-center gap-1">
                    ✓ Verified
                  </span>
                )}
              </div>

              {/* Content */}
              <p className="text-slate-300 mb-4">{alert.summary}</p>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-slate-500">📋 Source: {alert.source}</span>
                  <span className="text-slate-500">👥 {alert.affectedUsers}</span>
                </div>
                <button className="text-emerald-400 hover:text-emerald-300 text-sm font-medium">
                  Read more →
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* No Alerts */}
      {filteredAlerts.length === 0 && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
          <span className="text-4xl mb-4 block">🔕</span>
          <p className="text-slate-400">No alerts in this category right now.</p>
        </div>
      )}

      {/* Contribute CTA */}
      <div className="mt-8 bg-slate-800/50 border border-dashed border-slate-700 rounded-xl p-6 text-center">
        <span className="text-3xl mb-3 block">💡</span>
        <h3 className="text-white font-semibold mb-2">Know about an important update?</h3>
        <p className="text-slate-400 text-sm mb-4">Help the community by submitting alerts. Our team verifies all submissions.</p>
        <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg transition-colors">
          Submit an Alert
        </button>
      </div>

      {/* Premium Alerts Promo */}
      <div className="mt-6 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-700/50 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <span className="text-3xl">⚡</span>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-white font-semibold">Premium Alerts</h3>
              <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">Coming Soon</span>
            </div>
            <p className="text-slate-300 text-sm mb-3">
              Get instant SMS alerts for urgent immigration updates, personalized deadline reminders, 
              and early warnings about policy changes that affect you.
            </p>
            <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg transition-colors text-sm">
              Join Waitlist →
            </button>
          </div>
        </div>
      </div>

      {/* Upcoming Deadlines */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-white mb-4">📅 Upcoming Deadlines</h3>
        <div className="space-y-3">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-red-600 text-white text-center rounded-lg p-2 w-14">
                <p className="text-xs">FEB</p>
                <p className="text-xl font-bold">1</p>
              </div>
              <div>
                <p className="text-white font-medium">New Appointment System Launch</p>
                <p className="text-slate-500 text-sm">Old booking system discontinued</p>
              </div>
            </div>
            <span className="text-red-400 text-sm">9 days left</span>
          </div>
          
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-600 text-white text-center rounded-lg p-2 w-14">
                <p className="text-xs">MAR</p>
                <p className="text-xl font-bold">1</p>
              </div>
              <div>
                <p className="text-white font-medium">ZTM Ticket Price Increase</p>
                <p className="text-slate-500 text-sm">Monthly tickets +10%</p>
              </div>
            </div>
            <span className="text-yellow-400 text-sm">37 days left</span>
          </div>
          
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 text-white text-center rounded-lg p-2 w-14">
                <p className="text-xs">MAY</p>
                <p className="text-xl font-bold">15</p>
              </div>
              <div>
                <p className="text-white font-medium">PIT-37 Tax Filing Deadline</p>
                <p className="text-slate-500 text-sm">Extended from April 30</p>
              </div>
            </div>
            <span className="text-slate-400 text-sm">112 days left</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Alerts
