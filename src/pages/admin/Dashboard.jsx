// src/pages/admin/Dashboard.jsx
// Admin dashboard overview with stats and quick actions

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAdminStats, getAllAnnouncements, getAllAlerts } from '../../services/admin'

function StatCard({ icon, label, value, trend, color = 'purple' }) {
  const colorClasses = {
    purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30',
    amber: 'from-amber-500/20 to-amber-600/10 border-amber-500/30',
    green: 'from-green-500/20 to-green-600/10 border-green-500/30',
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
  }

  return (
    <div className={`p-4 rounded-2xl bg-gradient-to-br ${colorClasses[color]} border`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        {trend && (
          <span className={`text-xs font-medium ${trend > 0 ? 'text-green-400' : 'text-slate-400'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  )
}

function QuickAction({ to, icon, label, description }) {
  return (
    <Link
      to={to}
      className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 hover:border-purple-500/30 transition-all group"
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl group-hover:scale-110 transition-transform">{icon}</span>
        <div>
          <p className="text-sm font-medium text-white">{label}</p>
          <p className="text-xs text-slate-500">{description}</p>
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
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Admin Dashboard</h1>
        <p className="text-slate-400">Overview of your Expat Village community</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon="👥"
          label="Total Users"
          value={loading ? '...' : stats.totalUsers.toLocaleString()}
          color="purple"
        />
        <StatCard
          icon="📈"
          label="Signups Today"
          value={loading ? '...' : stats.signupsToday}
          color="green"
        />
        <StatCard
          icon="📅"
          label="This Week"
          value={loading ? '...' : stats.signupsWeek}
          color="blue"
        />
        <StatCard
          icon="📊"
          label="This Month"
          value={loading ? '...' : stats.signupsMonth}
          color="amber"
        />
      </div>

      {/* Content Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Announcements</h3>
            <Link to="/admin/announcements" className="text-xs text-purple-400 hover:text-purple-300">
              View all
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <p className="text-3xl font-bold text-white">{announcements.length}</p>
              <p className="text-xs text-slate-500">Total</p>
            </div>
            <div className="w-px h-10 bg-slate-700" />
            <div>
              <p className="text-3xl font-bold text-green-400">{activeAnnouncements}</p>
              <p className="text-xs text-slate-500">Active</p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">System Alerts</h3>
            <Link to="/admin/alerts" className="text-xs text-purple-400 hover:text-purple-300">
              View all
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <p className="text-3xl font-bold text-white">{alerts.length}</p>
              <p className="text-xs text-slate-500">Total</p>
            </div>
            <div className="w-px h-10 bg-slate-700" />
            <div>
              <p className="text-3xl font-bold text-amber-400">{activeAlerts}</p>
              <p className="text-xs text-slate-500">Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <QuickAction
            to="/admin/announcements"
            icon="📢"
            label="New Announcement"
            description="Create community update"
          />
          <QuickAction
            to="/admin/alerts"
            icon="🚨"
            label="New Alert"
            description="Post system alert"
          />
          <QuickAction
            to="/admin/listings"
            icon="⭐"
            label="Featured Listing"
            description="Add featured content"
          />
          <QuickAction
            to="/admin/users"
            icon="👥"
            label="View Users"
            description="Browse community"
          />
        </div>
      </div>

      {/* Recent Announcements */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Recent Announcements</h2>
          <Link to="/admin/announcements" className="text-xs text-purple-400 hover:text-purple-300">
            Manage all
          </Link>
        </div>
        <div className="space-y-2">
          {loading ? (
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 text-sm">
              Loading...
            </div>
          ) : announcements.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 text-sm">
              No announcements yet
            </div>
          ) : (
            announcements.slice(0, 5).map((announcement) => (
              <div
                key={announcement.id}
                className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${announcement.active ? 'bg-green-400' : 'bg-slate-600'}`} />
                  <div>
                    <p className="text-sm font-medium text-white">{announcement.title}</p>
                    <p className="text-xs text-slate-500">{announcement.type} • {new Date(announcement.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  announcement.active
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-slate-700 text-slate-400'
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
