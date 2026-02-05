// src/pages/admin/Users.jsx
// User directory page (read-only)

import { useState, useEffect, useCallback } from 'react'
import { getUsers } from '../../services/admin'

function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    const result = await getUsers(page, 20, search)
    setUsers(result.users)
    setTotal(result.total)
    setTotalPages(result.totalPages)
    setLoading(false)
  }, [page, search])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers()
  }, [fetchUsers])

  function handleSearch(e) {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  function formatDate(dateStr) {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-terra-ink mb-1">Users</h1>
        <p className="text-terra-ink-soft">Community members directory ({total} total)</p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-terra-taupe" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2.5 bg-terra-cream border border-terra-taupe/40 rounded-xl text-terra-ink text-sm focus:border-terra-primary/60 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-terra-primary hover:opacity-95 text-white text-sm font-medium rounded-xl transition-colors shadow-glass"
          >
            Search
          </button>
          {search && (
            <button
              type="button"
              onClick={() => { setSearch(''); setSearchInput(''); setPage(1) }}
              className="px-4 py-2 bg-terra-cream hover:bg-terra-cream/60 text-terra-ink text-sm font-medium rounded-xl transition-colors border border-terra-taupe/40"
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {/* Users List */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-8 rounded-2xl bg-terra-cream/70 border border-terra-taupe/40 text-center text-terra-ink-soft">
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 rounded-2xl bg-terra-cream/70 border border-terra-taupe/40 text-center text-terra-ink-soft">
            {search ? `No users found matching "${search}"` : 'No users yet.'}
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className="p-4 rounded-2xl bg-terra-cream/70 border border-terra-taupe/40"
            >
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 bg-gradient-to-br from-terra-primary to-amber-400 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {(user.display_name || user.email || '?').charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-terra-ink font-medium truncate">
                      {user.display_name || 'Anonymous'}
                    </h3>
                    {user.years_in_poland !== null && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        user.years_in_poland < 1
                          ? 'bg-terra-sage/20 text-terra-sage'
                          : user.years_in_poland >= 3
                          ? 'bg-terra-primary/20 text-terra-primary'
                          : 'bg-terra-taupe/30 text-terra-ink-soft'
                      }`}>
                        {user.years_in_poland < 1
                          ? 'Newcomer'
                          : user.years_in_poland >= 3
                          ? 'Veteran'
                          : 'Settling in'}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-terra-taupe truncate">{user.email}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-terra-taupe">
                    <span>Joined {formatDate(user.created_at)}</span>
                    {user.years_in_poland !== null && (
                      <>
                        <span>-</span>
                        <span>{user.years_in_poland} year{user.years_in_poland !== 1 ? 's' : ''} in Poland</span>
                      </>
                    )}
                    {user.interests && user.interests.length > 0 && (
                      <>
                        <span>-</span>
                        <span>{user.interests.length} interest{user.interests.length !== 1 ? 's' : ''}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Interests preview */}
                {user.interests && user.interests.length > 0 && (
                  <div className="hidden sm:flex flex-wrap gap-1 max-w-[200px]">
                    {user.interests.slice(0, 3).map((interest, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-0.5 rounded-full bg-terra-cream/60 text-terra-ink"
                      >
                        {interest}
                      </span>
                    ))}
                    {user.interests.length > 3 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-terra-cream/60 text-terra-ink-soft">
                        +{user.interests.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-terra-taupe/40">
          <p className="text-sm text-terra-taupe">
            Showing {(page - 1) * 20 + 1} - {Math.min(page * 20, total)} of {total}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 bg-terra-cream hover:bg-terra-cream/60 disabled:opacity-50 disabled:cursor-not-allowed text-terra-ink text-sm rounded-lg transition-colors border border-terra-taupe/40"
            >
              Previous
            </button>
            <span className="text-sm text-terra-ink-soft">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 bg-terra-cream hover:bg-terra-cream/60 disabled:opacity-50 disabled:cursor-not-allowed text-terra-ink text-sm rounded-lg transition-colors border border-terra-taupe/40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Users


