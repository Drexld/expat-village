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
          border: 'border-red-400/40',
          badge: 'bg-red-500/80 text-terra-bg',
          accent: 'text-red-700',
          icon: 'alert',
          panel: 'action-card texture-layer texture-paper'
        }
      case 'important':
        return {
          border: 'border-amber-400/40',
          badge: 'bg-amber-400/80 text-terra-bg',
          accent: 'text-amber-700',
          icon: 'warning',
          panel: 'action-card texture-layer texture-paper'
        }
      default:
        return {
          border: 'border-black/10',
          badge: 'bg-terra-taupe/80 text-terra-bg',
          accent: 'text-terra-ink',
          icon: 'info',
          panel: 'action-card texture-layer texture-paper'
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
        className="inline-flex items-center gap-2 text-terra-ink-soft hover:text-terra-ink transition-colors"
      >
        <Icon name="arrowLeft" size={16} />
        Back to Home
      </Link>

      <header className="hero-card texture-layer texture-paper texture-amber">
        <div className="flex items-center gap-4">
          <div className="glass-3d flex h-12 w-12 items-center justify-center rounded-2xl">
            <Icon name="bell" size={22} className="text-terra-ink" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-terra-ink">Alerts</h1>
            <p className="text-terra-ink-soft">Policy updates, deadlines, and important news for expats</p>
          </div>
        </div>
      </header>

      <section className="hero-card texture-layer texture-paper texture-photo">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-terra-ink">Get Alerts That Matter</h2>
            <p className="text-terra-ink-soft text-sm">Subscribe to topics and never miss important updates</p>
          </div>
          <div className="glass-panel flex h-12 w-12 items-center justify-center rounded-2xl">
            <Icon name="update" size={20} className="text-terra-ink" />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.filter(f => f.id !== 'all').map((filter) => (
            <button
              key={filter.id}
              onClick={() => toggleSubscription(filter.id)}
              className={`glass-chip flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                subscribedTopics.includes(filter.id)
                  ? 'text-terra-ink ring-1 ring-terra-primary/30'
                  : 'text-terra-ink-soft hover:text-terra-ink'
              }`}
            >
              <Icon name={filter.icon} size={14} className="text-terra-ink" />
              <span>{filter.name}</span>
              {subscribedTopics.includes(filter.id) && <Icon name="success" size={12} className="text-terra-sage" />}
            </button>
          ))}
        </div>
        <p className="text-terra-taupe text-xs mt-3">
          Subscribed topics will be sent to your email.
          <button className="text-terra-ink hover:underline ml-1">Manage notification settings</button>
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="action-card texture-layer texture-paper text-center">
          <p className="text-2xl font-semibold text-red-700">{alerts.filter(a => a.type === 'urgent').length}</p>
          <p className="text-terra-taupe text-sm">Urgent Alerts</p>
        </div>
        <div className="action-card texture-layer texture-paper text-center">
          <p className="text-2xl font-semibold text-terra-ink">{alerts.length}</p>
          <p className="text-terra-taupe text-sm">This Month</p>
        </div>
        <div className="action-card texture-layer texture-paper text-center">
          <p className="text-2xl font-semibold text-terra-sage">{subscribedTopics.length}</p>
          <p className="text-terra-taupe text-sm">Subscribed Topics</p>
        </div>
      </section>

      <section className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`glass-chip flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeFilter === filter.id
                ? 'text-terra-ink ring-1 ring-terra-primary/30'
                : 'text-terra-ink-soft hover:text-terra-ink'
            }`}
          >
            <Icon name={filter.icon} size={14} className="text-terra-ink" />
            <span className="text-sm">{filter.name}</span>
            {filter.id !== 'all' && (
              <span className="text-xs bg-terra-cream px-1.5 py-0.5 rounded">
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
                    <Icon name={styles.icon} size={18} className="text-terra-ink" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-terra-ink">{alert.title}</h3>
                      <span className={`text-xs ${styles.badge} px-2 py-0.5 rounded-full capitalize`}>
                        {alert.type}
                      </span>
                      {alert.actionRequired && (
                        <span className="text-xs bg-red-600/80 text-terra-bg px-2 py-0.5 rounded-full">
                          Action Required
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-terra-taupe">
                      <Icon name={getCategoryIcon(alert.category)} size={12} className="text-terra-taupe" />
                      <span>{filters.find(f => f.id === alert.category)?.name}</span>
                      <span>|</span>
                      <span>{alert.date}</span>
                    </div>
                  </div>
                </div>
                {alert.verified && (
                  <span className="text-xs bg-terra-sage/80 text-terra-bg px-2 py-1 rounded-full flex items-center gap-1">
                    <Icon name="success" size={12} className="text-terra-bg" />
                    Verified
                  </span>
                )}
              </div>

              <p className="text-terra-ink-soft mb-4">{alert.summary}</p>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-4 text-xs text-terra-taupe">
                  <span className="flex items-center gap-1">
                    <Icon name="document" size={12} className="text-terra-taupe" />
                    Source: {alert.source}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="community" size={12} className="text-terra-taupe" />
                    {alert.affectedUsers}
                  </span>
                </div>
                <button className="text-terra-ink hover:text-terra-primary text-sm font-medium inline-flex items-center gap-2">
                  Read more
                  <Icon name="arrowRight" size={14} className="text-terra-primary" />
                </button>
              </div>
            </div>
          )
        })}
      </section>

      {filteredAlerts.length === 0 && (
        <div className="action-card texture-layer texture-paper rounded-2xl p-8 text-center">
          <Icon name="info" size={28} className="text-terra-ink mx-auto mb-3" />
          <p className="text-terra-ink-soft">No alerts in this category right now.</p>
        </div>
      )}

      <section className="action-card texture-layer texture-paper rounded-2xl p-6 text-center">
        <div className="glass-panel mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl">
          <Icon name="spark" size={20} className="text-terra-ink" />
        </div>
        <h3 className="text-terra-ink font-semibold mb-2">Know about an important update?</h3>
        <p className="text-terra-ink-soft text-sm mb-4">
          Help the community by submitting alerts. Our team verifies all submissions.
        </p>
        <button className="text-terra-bg px-6 py-2 rounded-lg transition-colors hover-tilt" style={{ background: 'linear-gradient(135deg, #C76B55, #D07C63)' }}>
          Submit an Alert
        </button>
      </section>

      <section className="hero-card texture-layer texture-paper texture-amber">
        <div className="flex items-start gap-4">
          <div className="glass-panel flex h-12 w-12 items-center justify-center rounded-2xl">
            <Icon name="bolt" size={20} className="text-terra-ink" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-terra-ink font-semibold">Premium Alerts</h3>
              <span className="text-xs bg-terra-cream text-terra-ink px-2 py-0.5 rounded-full">Coming Soon</span>
            </div>
            <p className="text-terra-ink-soft text-sm mb-3">
              Get instant SMS alerts for urgent immigration updates, personalized deadline reminders,
              and early warnings about policy changes that affect you.
            </p>
            <button className="text-terra-bg px-4 py-2 rounded-lg transition-colors text-sm hover-tilt" style={{ background: 'linear-gradient(135deg, #C76B55, #D07C63)' }}>
              Join Waitlist
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-terra-ink flex items-center gap-2">
          <Icon name="calendar" size={18} className="text-terra-ink" />
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
              tone: 'text-red-700',
              badge: 'bg-red-500/80'
            },
            {
              month: 'MAR',
              day: '1',
              title: 'ZTM Ticket Price Increase',
              desc: 'Monthly tickets +10%',
              timeLeft: '37 days left',
              tone: 'text-amber-700',
              badge: 'bg-amber-500/80'
            },
            {
              month: 'MAY',
              day: '15',
              title: 'PIT-37 Tax Filing Deadline',
              desc: 'Extended from April 30',
              timeLeft: '112 days left',
              tone: 'text-terra-ink-soft',
              badge: 'bg-terra-taupe/80'
            }
          ].map((item) => (
            <div key={`${item.month}-${item.day}`} className="action-card texture-layer texture-paper rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`${item.badge} text-terra-bg text-center rounded-lg p-2 w-14`}
                >
                  <p className="text-xs">{item.month}</p>
                  <p className="text-xl font-bold">{item.day}</p>
                </div>
                <div>
                  <p className="text-terra-ink font-medium">{item.title}</p>
                  <p className="text-terra-taupe text-sm">{item.desc}</p>
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
