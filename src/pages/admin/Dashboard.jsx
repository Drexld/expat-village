// src/pages/admin/Dashboard.jsx
// Admin dashboard overview with stats and quick actions

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAdminStats, getAllAnnouncements, getAllAlerts } from '../../services/admin'
import Icon from '../../components/Icon'

function StatCard({ icon, label, value, trend, color = 'slate' }) {
  const colorClasses = {
    slate: 'from-[#FDFBF8] to-[#F6F1EA] border-black/10',
    amber: 'from-[#F1E3D5] to-[#FDFBF8] border-[#C76B55]/30',
    green: 'from-[#E5EFE7] to-[#FDFBF8] border-[#75997C]/30',
    blue: 'from-[#F6F1EA] to-[#FDFBF8] border-[#A89A8F]/30',
  }

  return (
    <div className={`p-4 rounded-2xl bg-gradient-to-br ${colorClasses[color]} border`}> 
      <div className="flex items-center justify-between mb-2">
        <Icon name={icon} size={20} className="text-terra-ink" />
        {trend !== undefined && (
          <span className={`text-xs font-medium ${trend > 0 ? 'text-terra-sage' : 'text-terra-taupe'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-terra-ink mb-1">{value}</p>
      <p className="text-sm text-terra-taupe">{label}</p>
    </div>
  )
}

function QuickAction({ to, icon, label, description }) {
  return (
    <Link
      to={to}
      className="p-4 rounded-xl action-card texture-layer texture-paper hover-tilt transition-all group"
    >
      <div className="flex items-center gap-3">
        <div className="glass-panel h-10 w-10 rounded-xl flex items-center justify-center">
          <Icon name={icon} size={18} className="text-terra-ink" />
        </div>
        <div>
          <p className="text-sm font-medium text-terra-ink">{label}</p>
          <p className="text-xs text-terra-taupe">{description}</p>
        </div>
      </div>
    </Link>
  )
}

function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    signupsToday: 0,
    signupsWeek: 0,
    signupsMonth: 0
  })
  const [announcements, setAnnouncements] = useState([])
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const [statsData, announcementsData, alertsData] = await Promise.all([
        getAdminStats(),
        getAllAnnouncements(),
        getAllAlerts()
      ])
      setStats(statsData)
      setAnnouncements(announcementsData)
      setAlerts(alertsData)
      setLoading(false)
    }
    fetchData()
  }, [])

  const activeAnnouncements = announcements.filter(a => a.active).length
  const activeAlerts = alerts.filter(a => a.active).length

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-terra-ink mb-1">Admin Dashboard</h1>
        <p className="text-terra-taupe">Overview of your Expat Village community</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="community"
          label="Total Users"
          value={loading ? '...' : stats.totalUsers.toLocaleString()}
          color="slate"
        />
        <StatCard
          icon="arrowUp"
          label="Signups Today"
          value={loading ? '...' : stats.signupsToday}
          color="green"
        />
        <StatCard
          icon="calendar"
          label="This Week"
          value={loading ? '...' : stats.signupsWeek}
          color="blue"
        />
        <StatCard
          icon="chart"
          label="This Month"
          value={loading ? '...' : stats.signupsMonth}
          color="amber"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="action-card texture-layer texture-paper rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-terra-taupe uppercase tracking-wider">Announcements</h3>
            <Link to="/admin/announcements" className="text-xs text-terra-ink-soft hover:text-terra-ink">
              View all
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <p className="text-3xl font-bold text-terra-ink">{announcements.length}</p>
              <p className="text-xs text-terra-taupe">Total</p>
            </div>
            <div className="w-px h-10 bg-black/10" />
            <div>
              <p className="text-3xl font-bold text-terra-sage">{activeAnnouncements}</p>
              <p className="text-xs text-terra-taupe">Active</p>
            </div>
          </div>
        </div>

        <div className="action-card texture-layer texture-paper rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-terra-taupe uppercase tracking-wider">System Alerts</h3>
            <Link to="/admin/alerts" className="text-xs text-terra-ink-soft hover:text-terra-ink">
              View all
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <p className="text-3xl font-bold text-terra-ink">{alerts.length}</p>
              <p className="text-xs text-terra-taupe">Total</p>
            </div>
            <div className="w-px h-10 bg-black/10" />
            <div>
              <p className="text-3xl font-bold text-terra-primary">{activeAlerts}</p>
              <p className="text-xs text-terra-taupe">Active</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-terra-taupe uppercase tracking-wider mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <QuickAction
            to="/admin/announcements"
            icon="update"
            label="New Announcement"
            description="Create community update"
          />
          <QuickAction
            to="/admin/alerts"
            icon="alert"
            label="New Alert"
            description="Post system alert"
          />
          <QuickAction
            to="/admin/listings"
            icon="star"
            label="Featured Listing"
            description="Add featured content"
          />
          <QuickAction
            to="/admin/users"
            icon="community"
            label="View Users"
            description="Browse community"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-terra-taupe uppercase tracking-wider">Recent Announcements</h2>
          <Link to="/admin/announcements" className="text-xs text-terra-ink-soft hover:text-terra-ink">
            Manage all
          </Link>
        </div>
        <div className="space-y-2">
          {loading ? (
            <div className="p-4 rounded-xl action-card texture-layer texture-paper text-terra-taupe text-sm">
              Loading...
            </div>
          ) : announcements.length === 0 ? (
            <div className="p-4 rounded-xl action-card texture-layer texture-paper text-terra-taupe text-sm">
              No announcements yet
            </div>
          ) : (
            announcements.slice(0, 5).map((announcement) => (
              <div
                key={announcement.id}
                className="p-3 rounded-xl action-card texture-layer texture-paper flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${announcement.active ? 'bg-terra-sage' : 'bg-terra-taupe'}`} />
                  <div>
                    <p className="text-sm font-medium text-terra-ink">{announcement.title}</p>
                    <p className="text-xs text-terra-taupe">{announcement.type} | {new Date(announcement.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  announcement.active
                    ? 'bg-terra-sage/20 text-terra-sage'
                    : 'bg-terra-cream text-terra-taupe'
                }`}>
                  {announcement.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
