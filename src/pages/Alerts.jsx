import { Link } from 'react-router-dom'
import { useState } from 'react'
import Icon from '../components/Icon'

function Alerts() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [subscribedTopics, setSubscribedTopics] = useState(['immigration', 'tax'])

  const filters = [
    { id: 'all', name: 'All Alerts', icon: 'bell' },
    { id: 'immigration', name: 'Immigration', icon: 'document' },
    { id: 'tax', name: 'Tax & Finance', icon: 'briefcase' },
    { id: 'health', name: 'Health', icon: 'health' },
    { id: 'housing', name: 'Housing', icon: 'home' },
    { id: 'transport', name: 'Transport', icon: 'train' },
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
      summary: 'The deadline for filing PIT-37 tax returns has been extended from April 30 to May 15, 2026.',
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
      summary: 'Warsaw Foreigners Office launches a new online booking system. The old system is discontinued Feb 1.',
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
      summary: 'After two years of increases, Warsaw rent prices show signs of stabilization.',
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
      summary: 'The EU extends temporary protection for Ukrainian refugees until March 2027.',
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
      fullContent: 'ZUS contributions for 2026 have been updated. Large ZUS (duzy ZUS) is now approximately 1,600 PLN/month. Small ZUS (maly ZUS) for new businesses remains available for the first 24 months. Health insurance (skladka zdrowotna) calculations remain at 9% of income for B2B.',
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
          border: 'border-red-500/30',
          badge: 'bg-red-500/80',
          accent: 'text-red-200',
          icon: 'alert',
          panel: 'glass-3d'
        }
      case 'important':
        return {
          border: 'border-amber-400/30',
          badge: 'bg-amber-400/80',
          accent: 'text-amber-200',
          icon: 'warning',
          panel: 'glass-panel'
        }
      default:
        return {
          border: 'border-white/10',
          badge: 'bg-slate-500/70',
          accent: 'text-slate-200',
          icon: 'info',
          panel: 'glass-panel'
        }
    }
  }

  const getCategoryIcon = (category) => {
    return filters.find(f => f.id === category)?.icon || 'info'
  }

  return (
    <div className="min-h-screen space-y-8">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
      >
        <Icon name="arrowLeft" size={16} />
        Back to Home
      </Link>

      <header className="glass-panel rounded-3xl p-6">
        <div className="flex items-center gap-4">
          <div className="glass-panel flex h-12 w-12 items-center justify-center rounded-2xl">
            <Icon name="bell" size={22} className="text-slate-100" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-white">Alerts</h1>
            <p className="text-slate-400">Policy updates, deadlines, and important news for expats</p>
          </div>
        </div>
      </header>

      <section className="glass-strong rounded-3xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Get Alerts That Matter</h2>
            <p className="text-slate-400 text-sm">Subscribe to topics and never miss important updates</p>
          </div>
          <div className="glass-panel flex h-12 w-12 items-center justify-center rounded-2xl">
            <Icon name="update" size={20} className="text-slate-200" />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.filter(f => f.id !== 'all').map((filter) => (
            <button
              key={filter.id}
              onClick={() => toggleSubscription(filter.id)}
              className={`glass-chip flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                subscribedTopics.includes(filter.id)
                  ? 'text-white ring-1 ring-white/20'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Icon name={filter.icon} size={14} className="text-slate-200" />
              <span>{filter.name}</span>
              {subscribedTopics.includes(filter.id) && <Icon name="success" size={12} className="text-emerald-300" />}
            </button>
          ))}
        </div>
        <p className="text-slate-500 text-xs mt-3">
          Subscribed topics will be sent to your email.
          <button className="text-slate-300 hover:underline ml-1">Manage notification settings</button>
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel rounded-2xl p-4 text-center">
          <p className="text-2xl font-semibold text-red-200">{alerts.filter(a => a.type === 'urgent').length}</p>
          <p className="text-slate-400 text-sm">Urgent Alerts</p>
        </div>
        <div className="glass-panel rounded-2xl p-4 text-center">
          <p className="text-2xl font-semibold text-white">{alerts.length}</p>
          <p className="text-slate-400 text-sm">This Month</p>
        </div>
        <div className="glass-panel rounded-2xl p-4 text-center">
          <p className="text-2xl font-semibold text-emerald-200">{subscribedTopics.length}</p>
          <p className="text-slate-400 text-sm">Subscribed Topics</p>
        </div>
      </section>

      <section className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`glass-chip flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeFilter === filter.id
                ? 'text-white ring-1 ring-white/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Icon name={filter.icon} size={14} className="text-slate-200" />
            <span className="text-sm">{filter.name}</span>
            {filter.id !== 'all' && (
              <span className="text-xs bg-white/10 px-1.5 py-0.5 rounded">
                {alerts.filter(a => a.category === filter.id).length}
              </span>
            )}
          </button>
        ))}
      </section>

      <section className="space-y-4">
        {filteredAlerts.map((alert) => {
          const styles = getAlertTypeStyles(alert.type)
          return (
            <div
              key={alert.id}
              className={`${styles.panel} ${styles.border} rounded-2xl p-5 hover-tilt transition-all`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-3">
                  <div className="glass-panel flex h-10 w-10 items-center justify-center rounded-xl">
                    <Icon name={styles.icon} size={18} className="text-slate-200" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-white">{alert.title}</h3>
                      <span className={`text-xs ${styles.badge} text-white px-2 py-0.5 rounded-full capitalize`}>
                        {alert.type}
                      </span>
                      {alert.actionRequired && (
                        <span className="text-xs bg-red-600/80 text-white px-2 py-0.5 rounded-full">
                          Action Required
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                      <Icon name={getCategoryIcon(alert.category)} size={12} className="text-slate-400" />
                      <span>{filters.find(f => f.id === alert.category)?.name}</span>
                      <span>|</span>
                      <span>{alert.date}</span>
                    </div>
                  </div>
                </div>
                {alert.verified && (
                  <span className="text-xs bg-emerald-500/80 text-white px-2 py-1 rounded-full flex items-center gap-1">
                    <Icon name="success" size={12} className="text-white" />
                    Verified
                  </span>
                )}
              </div>

              <p className="text-slate-300 mb-4">{alert.summary}</p>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Icon name="document" size={12} className="text-slate-500" />
                    Source: {alert.source}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="community" size={12} className="text-slate-500" />
                    {alert.affectedUsers}
                  </span>
                </div>
                <button className="text-slate-200 hover:text-white text-sm font-medium inline-flex items-center gap-2">
                  Read more
                  <Icon name="arrowRight" size={14} className="text-slate-300" />
                </button>
              </div>
            </div>
          )
        })}
      </section>

      {filteredAlerts.length === 0 && (
        <div className="glass-panel rounded-2xl p-8 text-center">
          <Icon name="info" size={28} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-400">No alerts in this category right now.</p>
        </div>
      )}

      <section className="glass-panel rounded-2xl p-6 text-center">
        <div className="glass-panel mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl">
          <Icon name="spark" size={20} className="text-slate-100" />
        </div>
        <h3 className="text-white font-semibold mb-2">Know about an important update?</h3>
        <p className="text-slate-400 text-sm mb-4">
          Help the community by submitting alerts. Our team verifies all submissions.
        </p>
        <button className="glass-chip text-white px-6 py-2 rounded-lg transition-colors">
          Submit an Alert
        </button>
      </section>

      <section className="glass-strong rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="glass-panel flex h-12 w-12 items-center justify-center rounded-2xl">
            <Icon name="bolt" size={20} className="text-slate-100" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-white font-semibold">Premium Alerts</h3>
              <span className="text-xs bg-white/10 text-slate-100 px-2 py-0.5 rounded-full">Coming Soon</span>
            </div>
            <p className="text-slate-300 text-sm mb-3">
              Get instant SMS alerts for urgent immigration updates, personalized deadline reminders,
              and early warnings about policy changes that affect you.
            </p>
            <button className="glass-chip text-white px-4 py-2 rounded-lg transition-colors text-sm">
              Join Waitlist
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Icon name="calendar" size={18} className="text-slate-200" />
          Upcoming Deadlines
        </h3>
        <div className="space-y-3">
          {[
            {
              month: 'FEB',
              day: '1',
              title: 'New Appointment System Launch',
              desc: 'Old booking system discontinued',
              timeLeft: '9 days left',
              tone: 'text-red-200',
              badge: 'bg-red-500/80'
            },
            {
              month: 'MAR',
              day: '1',
              title: 'ZTM Ticket Price Increase',
              desc: 'Monthly tickets +10%',
              timeLeft: '37 days left',
              tone: 'text-amber-200',
              badge: 'bg-amber-500/80'
            },
            {
              month: 'MAY',
              day: '15',
              title: 'PIT-37 Tax Filing Deadline',
              desc: 'Extended from April 30',
              timeLeft: '112 days left',
              tone: 'text-slate-300',
              badge: 'bg-slate-500/70'
            }
          ].map((item) => (
            <div key={`${item.month}-${item.day}`} className="glass-panel rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`${item.badge} text-white text-center rounded-lg p-2 w-14`}
                >
                  <p className="text-xs">{item.month}</p>
                  <p className="text-xl font-bold">{item.day}</p>
                </div>
                <div>
                  <p className="text-white font-medium">{item.title}</p>
                  <p className="text-slate-500 text-sm">{item.desc}</p>
                </div>
              </div>
              <span className={`${item.tone} text-sm`}>{item.timeLeft}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Alerts
