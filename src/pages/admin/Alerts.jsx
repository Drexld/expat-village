// src/pages/admin/Alerts.jsx
// System alerts management page

import { useState, useEffect } from 'react'
import { getAllAlerts, createAlert, updateAlert, deleteAlert } from '../../services/admin'
import Icon from '../../components/Icon'

const severityOptions = [
  { value: 'info', label: 'Info', color: 'blue', icon: 'info' },
  { value: 'warning', label: 'Warning', color: 'amber', icon: 'warning' },
  { value: 'critical', label: 'Critical', color: 'red', icon: 'alert' },
]

const audiences = [
  { value: 'all', label: 'Everyone' },
  { value: 'newcomers', label: 'Newcomers' },
  { value: 'experienced', label: 'Experienced' },
]

const emptyForm = {
  title: '',
  message: '',
  severity: 'info',
  active: true,
  dismissible: true,
  target_audience: 'all',
  start_date: '',
  end_date: '',
}

function Alerts() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const fetchAlerts = async () => {
    setLoading(true)
    const data = await getAllAlerts()
    setAlerts(data)
    setLoading(false)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAlerts()
  }, [])

  function handleEdit(alert) {
    setForm({
      title: alert.title || '',
      message: alert.message || '',
      severity: alert.severity || 'info',
      active: alert.active ?? true,
      dismissible: alert.dismissible ?? true,
      target_audience: alert.target_audience || 'all',
      start_date: alert.start_date ? alert.start_date.slice(0, 16) : '',
      end_date: alert.end_date ? alert.end_date.slice(0, 16) : '',
    })
    setEditingId(alert.id)
    setShowForm(true)
  }

  function handleNew() {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)

    const payload = {
      ...form,
      start_date: form.start_date ? new Date(form.start_date).toISOString() : null,
      end_date: form.end_date ? new Date(form.end_date).toISOString() : null,
    }

    if (editingId) {
      await updateAlert(editingId, payload)
    } else {
      await createAlert(payload)
    }

    setSaving(false)
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
    fetchAlerts()
  }

  async function handleDelete(id) {
    await deleteAlert(id)
    setDeleteConfirm(null)
    fetchAlerts()
  }

  async function handleToggleActive(alert) {
    await updateAlert(alert.id, { active: !alert.active })
    fetchAlerts()
  }

  const getSeverityStyle = (severity) => {
    const styles = {
      info: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      warning: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      critical: 'bg-red-500/20 text-red-300 border-red-500/30',
    }
    return styles[severity] || styles.info
  }

  const getSeverityIcon = (severity) => {
    return severityOptions.find(s => s.value === severity)?.icon || 'info'
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">System Alerts</h1>
          <p className="text-slate-400">Manage system-wide notifications</p>
        </div>
        <button
          onClick={handleNew}
          className="glass-chip px-4 py-2 text-white text-sm font-medium rounded-xl transition-colors"
        >
          New Alert
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-lg glass-strong rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-white mb-4">
              {editingId ? 'Edit Alert' : 'New System Alert'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 glass-panel border border-white/10 rounded-xl text-white text-sm focus:border-slate-400 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 glass-panel border border-white/10 rounded-xl text-white text-sm focus:border-slate-400 focus:outline-none resize-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Severity</label>
                  <select
                    value={form.severity}
                    onChange={(e) => setForm({ ...form, severity: e.target.value })}
                    className="w-full px-3 py-2 glass-panel border border-white/10 rounded-xl text-white text-sm focus:border-slate-400 focus:outline-none"
                  >
                    {severityOptions.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Audience</label>
                  <select
                    value={form.target_audience}
                    onChange={(e) => setForm({ ...form, target_audience: e.target.value })}
                    className="w-full px-3 py-2 glass-panel border border-white/10 rounded-xl text-white text-sm focus:border-slate-400 focus:outline-none"
                  >
                    {audiences.map((a) => (
                      <option key={a.value} value={a.value}>{a.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Start Date (optional)</label>
                  <input
                    type="datetime-local"
                    value={form.start_date}
                    onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                    className="w-full px-3 py-2 glass-panel border border-white/10 rounded-xl text-white text-sm focus:border-slate-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">End Date (optional)</label>
                  <input
                    type="datetime-local"
                    value={form.end_date}
                    onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                    className="w-full px-3 py-2 glass-panel border border-white/10 rounded-xl text-white text-sm focus:border-slate-400 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, active: !form.active })}
                    className={`w-12 h-7 rounded-full transition-colors ${form.active ? 'bg-slate-200/60' : 'bg-slate-700'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${form.active ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                  <span className="text-sm text-slate-400">Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, dismissible: !form.dismissible })}
                    className={`w-12 h-7 rounded-full transition-colors ${form.dismissible ? 'bg-slate-200/60' : 'bg-slate-700'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${form.dismissible ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                  <span className="text-sm text-slate-400">Dismissible</span>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm) }}
                  className="flex-1 px-4 py-2 glass-panel text-white text-sm font-medium rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2 glass-chip text-white text-sm font-medium rounded-xl transition-colors"
                >
                  {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-sm glass-strong rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-2">Delete Alert?</h2>
            <p className="text-sm text-slate-400 mb-4">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 glass-panel text-white text-sm font-medium rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600/80 text-white text-sm font-medium rounded-xl transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {loading ? (
          <div className="p-8 rounded-2xl glass-panel text-center text-slate-400">
            Loading alerts...
          </div>
        ) : alerts.length === 0 ? (
          <div className="p-8 rounded-2xl glass-panel text-center text-slate-400">
            No system alerts. Create one when needed.
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-2xl border ${
                alert.severity === 'critical'
                  ? 'bg-red-500/10 border-red-500/30'
                  : alert.severity === 'warning'
                  ? 'bg-amber-500/10 border-amber-500/30'
                  : 'glass-panel border-white/10'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name={getSeverityIcon(alert.severity)} size={16} className="text-slate-200" />
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${getSeverityStyle(alert.severity)}`}>
                      {alert.severity}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      alert.active
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-slate-700 text-slate-400'
                    }`}>
                      {alert.active ? 'Active' : 'Inactive'}
                    </span>
                    {!alert.dismissible && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-400">
                        Non-dismissible
                      </span>
                    )}
                  </div>
                  <h3 className="text-white font-medium mb-1">{alert.title}</h3>
                  <p className="text-sm text-slate-400 line-clamp-2">{alert.message}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                    <span>{alert.target_audience}</span>
                    {alert.start_date && (
                      <>
                        <span>|</span>
                        <span>From: {new Date(alert.start_date).toLocaleDateString()}</span>
                      </>
                    )}
                    {alert.end_date && (
                      <>
                        <span>|</span>
                        <span>Until: {new Date(alert.end_date).toLocaleDateString()}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(alert)}
                    className={`p-2 rounded-lg transition-colors ${
                      alert.active
                        ? 'text-emerald-300 hover:bg-emerald-500/20'
                        : 'text-slate-400 hover:bg-slate-700'
                    }`}
                    title={alert.active ? 'Deactivate' : 'Activate'}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {alert.active ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      )}
                    </svg>
                  </button>
                  <button
                    onClick={() => handleEdit(alert)}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                    title="Edit"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(alert.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-300 hover:bg-red-500/20 transition-colors"
                    title="Delete"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Alerts
