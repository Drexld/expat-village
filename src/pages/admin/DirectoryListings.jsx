// src/pages/admin/DirectoryListings.jsx
// Admin page for managing directory listings

import { useState, useEffect } from 'react'
import {
  getAllListingsAdmin,
  createListing,
  updateListing,
  deleteListing,
  DIRECTORY_CATEGORIES
} from '../../services/directory'
import Icon from '../../components/Icon'

const categories = DIRECTORY_CATEGORIES.filter(c => c.id !== 'all')

const emptyForm = {
  name: '',
  description: '',
  category: 'restaurant',
  address: '',
  city: 'Warsaw',
  phone: '',
  website: '',
  expat_approved: false,
  rating_average: 0,
  active: true,
}

function DirectoryListings() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [filterCategory, setFilterCategory] = useState('all')

  const fetchListings = async () => {
    setLoading(true)
    const { data } = await getAllListingsAdmin()
    setListings(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchListings()
  }, [])

  function handleEdit(listing) {
    setForm({
      name: listing.name || '',
      description: listing.description || '',
      category: listing.category || 'restaurant',
      address: listing.address || '',
      city: listing.city || 'Warsaw',
      phone: listing.phone || '',
      website: listing.website || '',
      expat_approved: listing.expat_approved ?? false,
      rating_average: listing.rating_average || 0,
      active: listing.active ?? true,
    })
    setEditingId(listing.id)
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

  async function handleToggleApproved(listing) {
    await updateListing(listing.id, { expat_approved: !listing.expat_approved })
    fetchListings()
  }

  const getCategoryInfo = (catId) => {
    return categories.find(c => c.id === catId) || { id: catId, label: catId, icon: 'pin' }
  }

  const filteredListings = filterCategory === 'all'
    ? listings
    : listings.filter(l => l.category === filterCategory)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="glass-panel rounded-3xl p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-terra-ink mb-1">Directory Listings</h1>
          <p className="text-terra-ink-soft">Manage businesses in the directory</p>
        </div>
        <button
          onClick={handleNew}
          className="rounded-full bg-terra-primary px-4 py-2 text-sm font-medium text-white shadow-glass transition-colors hover:opacity-95"
        >
          Add Business
        </button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
            filterCategory === 'all'
              ? 'bg-terra-primary/15 text-terra-ink border border-terra-primary/30'
              : 'bg-terra-cream/70 text-terra-ink-soft border border-terra-taupe/40 hover:text-terra-ink'
          }`}
        >
          All ({listings.length})
        </button>
        {categories.map((cat) => {
          const count = listings.filter(l => l.category === cat.id).length
          return (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                filterCategory === cat.id
                  ? 'bg-terra-primary/15 text-terra-ink border border-terra-primary/30'
                  : 'bg-terra-cream/70 text-terra-ink-soft border border-terra-taupe/40 hover:text-terra-ink'
              }`}
            >
              <span className="inline-flex items-center gap-2">
                <Icon name={cat.icon} size={14} className="text-terra-ink" />
                {cat.label} ({count})
              </span>
            </button>
          )
        })}
      </div>

      {/* Create/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-lg glass-panel rounded-3xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-terra-ink mb-4">
              {editingId ? 'Edit Business' : 'Add New Business'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-terra-ink-soft mb-1">Business Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 bg-terra-cream/70 border border-terra-taupe/40 rounded-xl text-terra-ink text-sm focus:border-terra-primary/60 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-terra-ink-soft mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-terra-cream/70 border border-terra-taupe/40 rounded-xl text-terra-ink text-sm focus:border-terra-primary/60 focus:outline-none resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-terra-ink-soft mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 bg-terra-cream/70 border border-terra-taupe/40 rounded-xl text-terra-ink text-sm focus:border-terra-primary/60 focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-terra-ink-soft mb-1">City</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-3 py-2 bg-terra-cream/70 border border-terra-taupe/40 rounded-xl text-terra-ink text-sm focus:border-terra-primary/60 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-terra-ink-soft mb-1">Address</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-3 py-2 bg-terra-cream/70 border border-terra-taupe/40 rounded-xl text-terra-ink text-sm focus:border-terra-primary/60 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-terra-ink-soft mb-1">Phone</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-terra-cream/70 border border-terra-taupe/40 rounded-xl text-terra-ink text-sm focus:border-terra-primary/60 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-terra-ink-soft mb-1">Website</label>
                  <input
                    type="url"
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                    className="w-full px-3 py-2 bg-terra-cream/70 border border-terra-taupe/40 rounded-xl text-terra-ink text-sm focus:border-terra-primary/60 focus:outline-none"
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, active: !form.active })}
                    className={`w-12 h-7 rounded-full transition-colors ${form.active ? 'bg-terra-sage' : 'bg-terra-cream/60'}`}
                  >
                    <div className={`w-5 h-5 bg-terra-bg rounded-full shadow transition-transform ${form.active ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                  <span className="text-sm text-terra-ink-soft">Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, expat_approved: !form.expat_approved })}
                    className={`w-12 h-7 rounded-full transition-colors ${form.expat_approved ? 'bg-terra-primary' : 'bg-terra-cream/60'}`}
                  >
                    <div className={`w-5 h-5 bg-terra-bg rounded-full shadow transition-transform ${form.expat_approved ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                  <span className="text-sm text-terra-ink-soft">Expat Approved</span>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm) }}
                  className="flex-1 rounded-full border border-terra-taupe/40 px-4 py-2 text-sm font-medium text-terra-ink transition-colors hover:bg-terra-cream/60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-full bg-terra-primary px-4 py-2 text-sm font-medium text-white shadow-glass transition-colors hover:opacity-95 disabled:opacity-50"
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
          <div className="w-full max-w-sm glass-panel rounded-3xl p-6">
            <h2 className="text-lg font-semibold text-terra-ink mb-2">Delete Listing?</h2>
            <p className="text-sm text-terra-ink-soft mb-4">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 rounded-full border border-terra-taupe/40 px-4 py-2 text-sm font-medium text-terra-ink transition-colors hover:bg-terra-cream/60"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 rounded-full border border-red-400/40 bg-red-500/20 px-4 py-2 text-sm font-medium text-red-100 transition-colors hover:bg-red-500/30"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Listings List */}
      <div className="space-y-3">
        {loading ? (
          <div className="glass-panel rounded-2xl p-8 text-center text-terra-ink-soft">
            Loading directory listings...
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="glass-panel rounded-2xl p-8 text-center text-terra-ink-soft">
            No listings in this category yet.
          </div>
        ) : (
          filteredListings.map((listing) => {
            const catInfo = getCategoryInfo(listing.category)
            return (
              <div key={listing.id} className="glass-panel rounded-2xl p-4 border border-terra-taupe/40">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Icon name={catInfo.icon} size={16} className="text-terra-ink" />
                      <span className="text-xs px-2 py-0.5 rounded-full bg-terra-cream/70 text-terra-ink">
                        {catInfo.label}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        listing.active
                          ? 'bg-terra-sage/20 text-terra-sage'
                          : 'bg-terra-cream/60 text-terra-ink-soft'
                      }`}>
                        {listing.active ? 'Active' : 'Inactive'}
                      </span>
                      {listing.expat_approved && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-terra-primary/15 text-terra-primary">
                          Expat Approved
                        </span>
                      )}
                    </div>
                    <h3 className="text-terra-ink font-medium mb-1">{listing.name}</h3>
                    {listing.description && (
                      <p className="text-sm text-terra-ink-soft line-clamp-2 mb-1">{listing.description}</p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-terra-taupe">
                      {listing.city && <span>{listing.city}</span>}
                      {listing.address && <span>{listing.address}</span>}
                      {listing.phone && <span>{listing.phone}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleApproved(listing)}
                      className={`p-2 rounded-lg transition-colors ${
                        listing.expat_approved
                          ? 'text-terra-primary hover:bg-terra-primary/15'
                          : 'text-terra-ink-soft hover:bg-terra-cream/60'
                      }`}
                      title={listing.expat_approved ? 'Remove approval' : 'Mark as approved'}
                    >
                      <svg className="w-5 h-5" fill={listing.expat_approved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleToggleActive(listing)}
                      className={`p-2 rounded-lg transition-colors ${
                        listing.active
                          ? 'text-terra-sage hover:bg-terra-sage/15'
                          : 'text-terra-ink-soft hover:bg-terra-cream/60'
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
                      className="p-2 rounded-lg text-terra-ink-soft hover:text-terra-ink hover:bg-terra-cream/60 transition-colors"
                      title="Edit"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(listing.id)}
                      className="p-2 rounded-lg text-terra-ink-soft hover:text-red-300 hover:bg-red-500/20 transition-colors"
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

export default DirectoryListings
