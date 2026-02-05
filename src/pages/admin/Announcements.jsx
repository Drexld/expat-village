// src/pages/admin/Announcements.jsx
// Announcement management page with CRUD operations

import { useState, useEffect } from 'react'
import { getAllAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../../services/admin'

const announcementTypes = [
  { value: 'info', label: 'Info', color: 'blue' },
  { value: 'warning', label: 'Warning', color: 'amber' },
  { value: 'success', label: 'Success', color: 'green' },
  { value: 'alert', label: 'Alert', color: 'red' },
  { value: 'event', label: 'Event', color: 'purple' },
  { value: 'update', label: 'Update', color: 'indigo' },
]

const scopes = [
  { value: 'village', label: 'Village-wide' },
  { value: 'city', label: 'City-specific' },
  { value: 'personal', label: 'Personal' },
]

const audiences = [
  { value: 'all', label: 'Everyone' },
  { value: 'newcomers', label: 'Newcomers' },
  { value: 'experienced', label: 'Experienced' },
]

const languages = [
  { value: 'en', label: 'English' },
  { value: 'pl', label: 'Polish' },
]

const emptyForm = {
  title: '',
  message: '',
  type: 'info',
  priority: 1,
  active: true,
  scope: 'village',
  target_audience: 'all',
  language: 'en',
  link_url: '',
  link_text: '',
}

function Announcements() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const fetchAnnouncements = async () => {
    setLoading(true)
    const data = await getAllAnnouncements()
    setAnnouncements(data)
    setLoading(false)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAnnouncements()
  }, [])

  function handleEdit(announcement) {
    setForm({
      title: announcement.title || '',
      message: announcement.message || '',
      type: announcement.type || 'info',
      priority: announcement.priority || 1,
      active: announcement.active ?? true,
      scope: announcement.scope || 'village',
      target_audience: announcement.target_audience || 'all',
      language: announcement.language || 'en',
      link_url: announcement.link_url || '',
      link_text: announcement.link_text || '',
    })
    setEditingId(announcement.id)
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

    if (editingId) {
      await updateAnnouncement(editingId, form)
    } else {
      await createAnnouncement(form)
    }

    setSaving(false)
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
    fetchAnnouncements()
  }

  async function handleDelete(id) {
    await deleteAnnouncement(id)
    setDeleteConfirm(null)
    fetchAnnouncements()
  }

  async function handleToggleActive(announcement) {
    await updateAnnouncement(announcement.id, { active: !announcement.active })
    fetchAnnouncements()
  }

  const getTypeColor = (type) => {
    const colors = {
      info: 'bg-terra-sage/15 text-terra-ink border-terra-sage/30',
      warning: 'bg-terra-primary/15 text-terra-primary border-terra-primary/30',
      success: 'bg-terra-sage/20 text-terra-sage border-terra-sage/40',
      alert: 'bg-red-500/20 text-red-600 border-red-500/30',
      event: 'bg-amber-400/20 text-amber-700 border-amber-400/30',
      update: 'bg-terra-taupe/20 text-terra-ink-soft border-terra-taupe/40',
    }
    return colors[type] || colors.info
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-terra-ink mb-1">Announcements</h1>
          <p className="text-terra-taupe">Manage community announcements</p>
        </div>
        <button
          onClick={handleNew}
          className="px-4 py-2 text-terra-bg text-sm font-medium rounded-xl transition-colors hover-tilt"
          style={{ background: 'linear-gradient(135deg, #C76B55, #D07C63)' }}
        >
          + New Announcement
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
          <div className="w-full max-w-lg glass-strong texture-layer texture-paper border border-black/10 rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-terra-ink mb-4">
              {editingId ? 'Edit Announcement' : 'New Announcement'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-terra-taupe mb-1">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 bg-terra-cream border border-black/10 rounded-xl text-terra-ink text-sm focus:border-terra-primary focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-terra-taupe mb-1">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-terra-cream border border-black/10 rounded-xl text-terra-ink text-sm focus:border-terra-primary focus:outline-none resize-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-terra-taupe mb-1">Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-3 py-2 bg-terra-cream border border-black/10 rounded-xl text-terra-ink text-sm focus:border-terra-primary focus:outline-none"
                  >
                    {announcementTypes.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-terra-taupe mb-1">Priority (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 bg-terra-cream border border-black/10 rounded-xl text-terra-ink text-sm focus:border-terra-primary focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-terra-taupe mb-1">Scope</label>
                  <select
                    value={form.scope}
                    onChange={(e) => setForm({ ...form, scope: e.target.value })}
                    className="w-full px-3 py-2 bg-terra-cream border border-black/10 rounded-xl text-terra-ink text-sm focus:border-terra-primary focus:outline-none"
                  >
                    {scopes.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-terra-taupe mb-1">Audience</label>
                  <select
                    value={form.target_audience}
                    onChange={(e) => setForm({ ...form, target_audience: e.target.value })}
                    className="w-full px-3 py-2 bg-terra-cream border border-black/10 rounded-xl text-terra-ink text-sm focus:border-terra-primary focus:outline-none"
                  >
                    {audiences.map((a) => (
                      <option key={a.value} value={a.value}>{a.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-terra-taupe mb-1">Language</label>
                <select
                  value={form.language}
                  onChange={(e) => setForm({ ...form, language: e.target.value })}
                  className="w-full px-3 py-2 bg-terra-cream border border-black/10 rounded-xl text-terra-ink text-sm focus:border-terra-primary focus:outline-none"
                >
                  {languages.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-terra-taupe mb-1">Link URL (optional)</label>
                <input
                  type="url"
                  value={form.link_url}
                  onChange={(e) => setForm({ ...form, link_url: e.target.value })}
                  className="w-full px-3 py-2 bg-terra-cream border border-black/10 rounded-xl text-terra-ink text-sm focus:border-terra-primary focus:outline-none"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm text-terra-taupe mb-1">Link Text (optional)</label>
                <input
                  type="text"
                  value={form.link_text}
                  onChange={(e) => setForm({ ...form, link_text: e.target.value })}
                  className="w-full px-3 py-2 bg-terra-cream border border-black/10 rounded-xl text-terra-ink text-sm focus:border-terra-primary focus:outline-none"
                  placeholder="Learn more"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, active: !form.active })}
                  className={`w-12 h-7 rounded-full transition-colors ${form.active ? 'bg-terra-primary/60' : 'bg-terra-cream'}`}
                >
                  <div className={`w-5 h-5 bg-terra-bg rounded-full shadow transition-transform ${form.active ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
                <span className="text-sm text-terra-taupe">Active</span>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm) }}
                  className="flex-1 px-4 py-2 bg-terra-cream hover:bg-terra-bg text-terra-ink text-sm font-medium rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2 text-terra-bg text-sm font-medium rounded-xl transition-colors disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #C76B55, #D07C63)' }}
                >
                  {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
          <div className="w-full max-w-sm glass-strong texture-layer texture-paper border border-black/10 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-terra-ink mb-2">Delete Announcement?</h2>
            <p className="text-sm text-terra-taupe mb-4">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 bg-terra-cream hover:bg-terra-bg text-terra-ink text-sm font-medium rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-xl transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Announcements List */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-8 rounded-2xl action-card texture-layer texture-paper text-center text-terra-taupe">
            Loading announcements...
          </div>
        ) : announcements.length === 0 ? (
          <div className="p-8 rounded-2xl action-card texture-layer texture-paper text-center text-terra-taupe">
            No announcements yet. Create your first one!
          </div>
        ) : (
          announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="p-4 rounded-2xl action-card texture-layer texture-paper"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${getTypeColor(announcement.type)}`}>
                      {announcement.type}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      announcement.active
                        ? 'bg-terra-sage/20 text-terra-sage'
                        : 'bg-terra-cream text-terra-taupe'
                    }`}>
                      {announcement.active ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-xs text-terra-taupe">
                      Priority: {announcement.priority}
                    </span>
                  </div>
                  <h3 className="text-terra-ink font-medium mb-1">{announcement.title}</h3>
                  <p className="text-sm text-terra-ink-soft line-clamp-2">{announcement.message}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-terra-taupe">
                    <span>{announcement.scope}</span>
                    <span>-</span>
                    <span>{announcement.target_audience}</span>
                    <span>-</span>
                    <span>{new Date(announcement.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(announcement)}
                    className={`p-2 rounded-lg transition-colors ${
                      announcement.active
                        ? 'text-terra-sage hover:bg-terra-sage/20'
                        : 'text-terra-taupe hover:bg-terra-cream'
                    }`}
                    title={announcement.active ? 'Deactivate' : 'Activate'}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {announcement.active ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      )}
                    </svg>
                  </button>
                  <button
                    onClick={() => handleEdit(announcement)}
                    className="p-2 rounded-lg text-terra-taupe hover:text-terra-ink hover:bg-terra-cream transition-colors"
                    title="Edit"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(announcement.id)}
                    className="p-2 rounded-lg text-terra-taupe hover:text-red-500 hover:bg-red-500/20 transition-colors"
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

export default Announcements

