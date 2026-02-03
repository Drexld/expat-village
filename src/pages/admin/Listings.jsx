// src/pages/admin/Listings.jsx
// Featured listings management page

import { useState, useEffect } from 'react'
import { getAllListings, createListing, updateListing, deleteListing } from '../../services/admin'

const categories = [
  { value: 'housing', label: 'Housing', icon: '🏠' },
  { value: 'jobs', label: 'Jobs', icon: '💼' },
  { value: 'services', label: 'Services', icon: '🛠️' },
  { value: 'events', label: 'Events', icon: '🎉' },
]

const emptyForm = {
  title: '',
  description: '',
  category: 'housing',
  image_url: '',
  link_url: '',
  link_text: 'Learn more',
  active: true,
  display_order: 0,
}

function Listings() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [filterCategory, setFilterCategory] = useState('all')

  useEffect(() => {
    fetchListings()
  }, [])

  async function fetchListings() {
    setLoading(true)
    const data = await getAllListings()
    setListings(data)
    setLoading(false)
  }

  function handleEdit(listing) {
    setForm({
      title: listing.title || '',
      description: listing.description || '',
      category: listing.category || 'housing',
      image_url: listing.image_url || '',
      link_url: listing.link_url || '',
      link_text: listing.link_text || 'Learn more',
      active: listing.active ?? true,
      display_order: listing.display_order || 0,
    })
    setEditingId(listing.id)
    setShowForm(true)
  }

  function handleNew() {
    setForm({
      ...emptyForm,
      display_order: listings.length,
    })
    setEditingId(null)
    setShowForm(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)

    if (editingId) {
      await updateListing(editingId, form)
    } else {
      await createListing(form)
    }

    setSaving(false)
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
    fetchListings()
  }

  async function handleDelete(id) {
    await deleteListing(id)
    setDeleteConfirm(null)
    fetchListings()
  }

  async function handleToggleActive(listing) {
    await updateListing(listing.id, { active: !listing.active })
    fetchListings()
  }

  const getCategoryInfo = (category) => {
    return categories.find(c => c.value === category) || categories[0]
  }

  const filteredListings = filterCategory === 'all'
    ? listings
    : listings.filter(l => l.category === filterCategory)

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Featured Listings</h1>
          <p className="text-slate-400">Manage featured content by category</p>
        </div>
        <button
          onClick={handleNew}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-xl transition-colors"
        >
          + New Listing
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
            filterCategory === 'all'
              ? 'bg-purple-600 text-white'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          All ({listings.length})
        </button>
        {categories.map((cat) => {
          const count = listings.filter(l => l.category === cat.value).length
          return (
            <button
              key={cat.value}
              onClick={() => setFilterCategory(cat.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                filterCategory === cat.value
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat.icon} {cat.label} ({count})
            </button>
          )
        })}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-white mb-4">
              {editingId ? 'Edit Listing' : 'New Featured Listing'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:border-purple-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:border-purple-500 focus:outline-none resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:border-purple-500 focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Display Order</label>
                  <input
                    type="number"
                    min="0"
                    value={form.display_order}
                    onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Image URL (optional)</label>
                <input
                  type="url"
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:border-purple-500 focus:outline-none"
                  placeholder="https://..."
                />
                {form.image_url && (
                  <div className="mt-2 rounded-lg overflow-hidden bg-slate-800 h-32">
                    <img
                      src={form.image_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Link URL</label>
                <input
                  type="url"
                  value={form.link_url}
                  onChange={(e) => setForm({ ...form, link_url: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:border-purple-500 focus:outline-none"
                  placeholder="https://..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Link Text</label>
                <input
                  type="text"
                  value={form.link_text}
                  onChange={(e) => setForm({ ...form, link_text: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:border-purple-500 focus:outline-none"
                  placeholder="Learn more"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, active: !form.active })}
                  className={`w-12 h-7 rounded-full transition-colors ${form.active ? 'bg-purple-600' : 'bg-slate-700'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${form.active ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
                <span className="text-sm text-slate-400">Active</span>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm) }}
                  className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 text-white text-sm font-medium rounded-xl transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-2">Delete Listing?</h2>
            <p className="text-sm text-slate-400 mb-4">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-xl transition-colors"
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

      {/* Listings Grid */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-8 rounded-2xl bg-slate-800/50 border border-slate-700/50 text-center text-slate-400">
            Loading listings...
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-800/50 border border-slate-700/50 text-center text-slate-400">
            No listings in this category yet.
          </div>
        ) : (
          filteredListings.map((listing) => {
            const catInfo = getCategoryInfo(listing.category)
            return (
              <div
                key={listing.id}
                className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50"
              >
                <div className="flex items-start gap-4">
                  {/* Image preview */}
                  {listing.image_url && (
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-700 flex-shrink-0">
                      <img
                        src={listing.image_url}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                        onError={(e) => e.target.parentElement.style.display = 'none'}
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{catInfo.icon}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                        {catInfo.label}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        listing.active
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-slate-700 text-slate-400'
                      }`}>
                        {listing.active ? 'Active' : 'Inactive'}
                      </span>
                      <span className="text-xs text-slate-500">
                        Order: {listing.display_order}
                      </span>
                    </div>
                    <h3 className="text-white font-medium mb-1 truncate">{listing.title}</h3>
                    {listing.description && (
                      <p className="text-sm text-slate-400 line-clamp-2">{listing.description}</p>
                    )}
                    <a
                      href={listing.link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-purple-400 hover:text-purple-300 mt-1 inline-block"
                    >
                      {listing.link_text || 'View link'} →
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleActive(listing)}
                      className={`p-2 rounded-lg transition-colors ${
                        listing.active
                          ? 'text-green-400 hover:bg-green-500/20'
                          : 'text-slate-400 hover:bg-slate-700'
                      }`}
                      title={listing.active ? 'Deactivate' : 'Activate'}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {listing.active ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        )}
                      </svg>
                    </button>
                    <button
                      onClick={() => handleEdit(listing)}
                      className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                      title="Edit"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(listing.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/20 transition-colors"
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default Listings
