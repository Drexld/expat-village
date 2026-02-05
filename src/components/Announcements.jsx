// src/components/Announcements.jsx
// Smart announcements component - filters based on user context

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getAnnouncements, getAnnouncementColors } from '../services/announcements'
import { filterAnnouncementsForUser } from '../services/briefing'
import Icon from './Icon'

function Announcements() {
  const { profile } = useAuth()
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isActive = true
    const timeoutId = setTimeout(() => {
      if (isActive) {
        setError('timeout')
        setLoading(false)
      }
    }, 4000)

    async function fetchAnnouncements() {
      try {
        const data = await getAnnouncements()

        // Filter announcements based on user profile
        // - Newcomers (<2 years) see welcome/getting started content
        // - Experienced users (2+ years) don't see basic onboarding stuff
        // - Alerts and warnings show to everyone
        const filtered = filterAnnouncementsForUser(data, profile)

        console.log('Announcements fetched:', data?.length, 'Filtered for user:', filtered?.length)
        if (!isActive) return
        setAnnouncements(filtered || [])
        setError(null)
      } catch (err) {
        console.error('Error fetching announcements:', err)
        if (!isActive) return
        setError(err.message)
        setAnnouncements([])
      } finally {
        if (isActive) {
          clearTimeout(timeoutId)
          setLoading(false)
        }
      }
    }
    fetchAnnouncements()
    return () => {
      isActive = false
      clearTimeout(timeoutId)
    }
  }, [profile])

  const noData = !announcements || announcements.length === 0

  const alerts = announcements.filter(a => (a.scope || '').toLowerCase() === 'city')
  const personal = announcements.filter(a => (a.scope || '').toLowerCase() === 'personal')
  const opportunities = announcements.filter(a => (a.scope || '').toLowerCase() === 'village')

  const topAlerts = alerts.slice(0, 1)
  const topPersonal = personal.slice(0, 1)
  const topOpportunities = opportunities.slice(0, 1)
  const hasMore = announcements.length > (topAlerts.length + topPersonal.length + topOpportunities.length)

  const typeLabel = (type) => {
    const t = (type || '').toLowerCase()
    if (t === 'alert') return 'Alert'
    if (t === 'warning') return 'Warning'
    if (t === 'event') return 'Event'
    if (t === 'update') return 'Update'
    if (t === 'success') return 'Perk'
    return 'Info'
  }

  const renderCard = (announcement) => {
    const colors = getAnnouncementColors(announcement.type)
    const typeKey = (announcement.type || '').toLowerCase()
    const iconMap = {
      info: 'info',
      warning: 'warning',
      success: 'success',
      alert: 'alert',
      event: 'calendar',
      update: 'bell',
    }
    const iconName = iconMap[typeKey] || 'info'
    return (
      <div
        key={announcement.id}
        className="px-3 py-2.5 rounded-2xl prism-card prism-reveal"
        style={{
          borderColor: colors.border,
          '--prism': colors.glow,
          '--glass-glow': colors.glow,
        }}
      >
        {/* Header */}
        <div className="flex items-start gap-2 mb-1.5">
          <Icon name={iconName} className="w-4 h-4 text-slate-200 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-semibold uppercase tracking-wide" style={{ color: colors.text }}>
                {announcement.title}
              </h3>
              <span
                className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border"
                style={{ color: colors.text, borderColor: colors.border, background: colors.bg }}
              >
                {typeLabel(announcement.type)}
              </span>
            </div>
          </div>
        </div>

        {/* Message */}
        <p className="text-xs text-slate-300 leading-relaxed pl-6">
          {announcement.message}
        </p>

        {/* Link (if provided and valid) */}
        {announcement.link_url &&
         announcement.link_url !== 'Null' &&
         announcement.link_url !== 'null' &&
         announcement.link_url.trim() !== '' && (
                    <a
            href={announcement.link_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-1.5 ml-6 text-[11px] font-medium hover:underline"
            style={{ color: colors.text }}
          >
            {(announcement.link_text && announcement.link_text !== 'Null' && announcement.link_text !== 'null')
              ? announcement.link_text
              : 'Learn more'}
            <Icon name="arrowRight" className="w-3 h-3" />
          </a>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 prism-reveal">
      {(loading || error || topAlerts.length > 0) && (
        <div>
          <p className="text-[11px] uppercase tracking-widest text-slate-500 mb-2 px-1">City Alerts</p>
          <div className="flex flex-col gap-2">
            {loading && (
              <div className="px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-xs text-slate-400">
                Loading alerts...
              </div>
            )}
            {error && !loading && topAlerts.length === 0 && (
              <div className="px-3 py-2.5 rounded-xl border border-red-500/20 bg-red-500/10 text-xs text-red-200">
                Couldn't load alerts. Try again later.
              </div>
            )}
            {!loading && !error && topAlerts.length === 0 && (
              <div className="px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-xs text-slate-400">
                No city alerts right now.
              </div>
            )}
            {topAlerts.map(renderCard)}
          </div>
        </div>
      )}

      {topPersonal.length > 0 && (
        <div>
          <p className="text-[11px] uppercase tracking-widest text-slate-500 mb-2 px-1">Your Updates</p>
          <div className="flex flex-col gap-2">
            {topPersonal.map(renderCard)}
          </div>
        </div>
      )}

      {(loading || error || topOpportunities.length > 0) && (
        <div>
          <p className="text-[11px] uppercase tracking-widest text-slate-500 mb-2 px-1">Village Opportunities</p>
          <div className="flex flex-col gap-2">
            {loading && (
              <div className="px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-xs text-slate-400">
                Loading opportunities...
              </div>
            )}
            {error && !loading && topOpportunities.length === 0 && (
              <div className="px-3 py-2.5 rounded-xl border border-red-500/20 bg-red-500/10 text-xs text-red-200">
                Couldn't load opportunities. Try again later.
              </div>
            )}
            {!loading && !error && topOpportunities.length === 0 && (
              <div className="px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-xs text-slate-400">
                No opportunities yet - we'll surface perks and events here.
              </div>
            )}
            {topOpportunities.map(renderCard)}
          </div>
        </div>
      )}

      {!noData && hasMore && (
        <Link
          to="/alerts"
          className="text-[11px] text-slate-400 hover:text-white transition-colors px-1"
        >
          View all updates
        </Link>
      )}
    </div>
  )
}

export default Announcements




