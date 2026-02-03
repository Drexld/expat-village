// src/pages/Directory.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  getDirectoryListings,
  getListingReviews,
  createReview,
  DIRECTORY_CATEGORIES
} from '../services/directory'

function Directory() {
  const { user, isAuthenticated, openAuthModal, profile } = useAuth()
  const [selectedListing, setSelectedListing] = useState(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', content: '' })
  const [submitting, setSubmitting] = useState(false)
  const [listings, setListings] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [reviewsLoading, setReviewsLoading] = useState(false)

  // Fetch listings on mount and category change
  useEffect(() => {
    fetchListings()
  }, [activeCategory])

  // Fetch reviews when listing is selected
  useEffect(() => {
    if (selectedListing) {
      fetchReviews(selectedListing.id)
    }
  }, [selectedListing?.id])

  async function fetchListings() {
    setLoading(true)
    const { data } = await getDirectoryListings(activeCategory)
    setListings(data)
    setLoading(false)
  }

  async function fetchReviews(listingId) {
    setReviewsLoading(true)
    const { data } = await getListingReviews(listingId)
    setReviews(data)
    setReviewsLoading(false)
  }

  const submitReview = async () => {
    if (!isAuthenticated) {
      openAuthModal('sign_up')
      return
    }

    if (!reviewForm.content.trim()) return

    setSubmitting(true)

    const newReview = {
      listing_id: selectedListing.id,
      user_id: user.id,
      user_name: profile?.display_name || user.email?.split('@')[0] || 'Anonymous',
      rating: reviewForm.rating,
      title: reviewForm.title || null,
      content: reviewForm.content,
    }

    const { data, error } = await createReview(newReview)

    if (!error && data) {
      // Add to local reviews list
      setReviews([data, ...reviews])
      // Update listing stats locally
      setSelectedListing({
        ...selectedListing,
        review_count: (selectedListing.review_count || 0) + 1,
        rating_average: ((selectedListing.rating_average * selectedListing.review_count) + reviewForm.rating) / (selectedListing.review_count + 1)
      })
    }

    setShowReviewForm(false)
    setReviewForm({ rating: 5, title: '', content: '' })
    setSubmitting(false)
  }

  const renderStars = (rating, interactive = false, onChange = null) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onChange && onChange(star)}
            className={`text-lg ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
          >
            {star <= rating ? '⭐' : '☆'}
          </button>
        ))}
      </div>
    )
  }

  // Detail View
  if (selectedListing) {
    return (
      <div>
        <nav className="mb-6">
          <button
            onClick={() => { setSelectedListing(null); setShowReviewForm(false); setReviews([]) }}
            className="text-slate-400 hover:text-white transition-colors"
          >
            ← Back to Directory
          </button>
        </nav>

        {/* Listing Header */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-2xl font-bold text-white">{selectedListing.name}</h1>
                {selectedListing.verified && (
                  <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">✓ Verified</span>
                )}
                {selectedListing.expat_approved && (
                  <span className="bg-emerald-600 text-white text-xs px-2 py-0.5 rounded-full">🌍 Expat Approved</span>
                )}
              </div>
              <p className="text-slate-400">{selectedListing.description}</p>
            </div>
            <div className="text-right ml-4">
              <div className="text-3xl font-bold text-white">{Number(selectedListing.rating_average || 0).toFixed(1)}</div>
              <div className="text-slate-500 text-sm">{selectedListing.review_count || 0} reviews</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">English:</span>
              <span className={selectedListing.english_level === 'fluent' ? 'text-emerald-400' : 'text-amber-400'}>
                {selectedListing.english_level === 'fluent' ? '🗣️ Fluent' : '🗣️ Basic'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Price:</span>
              <span className="text-white">{selectedListing.price_range || '$$'}</span>
            </div>
            {selectedListing.address && (
              <div className="flex items-center gap-2">
                <span className="text-slate-500">📍</span>
                <span className="text-white">{selectedListing.address}</span>
              </div>
            )}
          </div>

          {selectedListing.tags && selectedListing.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedListing.tags.map(tag => (
                <span key={tag} className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {(selectedListing.website || selectedListing.phone) && (
            <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-slate-700">
              {selectedListing.website && (
                <a
                  href={selectedListing.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 text-sm"
                >
                  🌐 Website
                </a>
              )}
              {selectedListing.phone && (
                <a
                  href={`tel:${selectedListing.phone}`}
                  className="text-purple-400 hover:text-purple-300 text-sm"
                >
                  📞 {selectedListing.phone}
                </a>
              )}
            </div>
          )}
        </div>

        {/* Write Review Button */}
        {!showReviewForm && (
          isAuthenticated ? (
            <button
              onClick={() => setShowReviewForm(true)}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-medium transition-colors mb-6"
            >
              ✍️ Write a Review
            </button>
          ) : (
            <button
              onClick={() => openAuthModal('sign_up')}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl font-medium transition-colors mb-6"
            >
              Sign in to write a review
            </button>
          )
        )}

        {/* Review Form */}
        {showReviewForm && (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Your Review</h3>

            <div className="mb-4">
              <label className="block text-slate-400 text-sm mb-2">Rating</label>
              {renderStars(reviewForm.rating, true, (r) => setReviewForm({...reviewForm, rating: r}))}
            </div>

            <div className="mb-4">
              <label className="block text-slate-400 text-sm mb-2">Title (optional)</label>
              <input
                type="text"
                value={reviewForm.title}
                onChange={(e) => setReviewForm({...reviewForm, title: e.target.value})}
                placeholder="Sum up your experience"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-slate-400 text-sm mb-2">Your Review</label>
              <textarea
                value={reviewForm.content}
                onChange={(e) => setReviewForm({...reviewForm, content: e.target.value})}
                placeholder="Share your experience with the expat community..."
                rows={4}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={submitReview}
                disabled={submitting || !reviewForm.content.trim()}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white py-2 rounded-lg font-medium transition-colors"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
              <button
                onClick={() => setShowReviewForm(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Reviews List */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">
            Reviews ({reviews.length})
          </h2>

          {reviewsLoading ? (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
              <p className="text-slate-400">Loading reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
              <p className="text-slate-400">No reviews yet. Be the first!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map(review => (
                <div key={review.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-white">{review.user_name}</span>
                        {renderStars(review.rating)}
                      </div>
                      {review.title && (
                        <h4 className="text-white font-medium">{review.title}</h4>
                      )}
                    </div>
                    <span className="text-slate-500 text-sm">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-300">{review.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // List View
  return (
    <div>
      <nav className="mb-6">
        <Link to="/" className="text-slate-400 hover:text-white transition-colors">
          ← Back to Home
        </Link>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">📍</span>
          <h1 className="text-3xl font-bold text-white">Directory</h1>
        </div>
        <p className="text-slate-400 text-lg">
          Verified, expat-approved places in Warsaw. Real reviews from the community.
        </p>
      </header>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {DIRECTORY_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              activeCategory === cat.id
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Listings */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-8 rounded-xl bg-slate-800 border border-slate-700 text-center">
            <p className="text-slate-400">Loading listings...</p>
          </div>
        ) : listings.length === 0 ? (
          <div className="p-8 rounded-xl bg-slate-800 border border-slate-700 text-center">
            <p className="text-slate-400">No listings found in this category yet.</p>
          </div>
        ) : (
          listings.map(listing => (
            <button
              key={listing.id}
              onClick={() => setSelectedListing(listing)}
              className="w-full bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-xl p-4 text-left transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-lg font-semibold text-white">{listing.name}</h3>
                    {listing.expat_approved && (
                      <span className="bg-emerald-600 text-white text-xs px-2 py-0.5 rounded-full">🌍 Expat Approved</span>
                    )}
                    {listing.verified && (
                      <span className="bg-blue-600/50 text-blue-300 text-xs px-2 py-0.5 rounded-full">✓</span>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm mb-2">{listing.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className={listing.english_level === 'fluent' ? 'text-emerald-400' : 'text-amber-400'}>
                      {listing.english_level === 'fluent' ? '🗣️ Fluent English' : '🗣️ Basic English'}
                    </span>
                    <span className="text-slate-500">{listing.price_range || '$$'}</span>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-2xl font-bold text-white">{Number(listing.rating_average || 0).toFixed(1)}</div>
                  <div className="text-slate-500 text-sm">{listing.review_count || 0} reviews</div>
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Add Business CTA */}
      <div className="mt-8 bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border border-emerald-700/50 rounded-xl p-6 text-center">
        <h3 className="text-lg font-semibold text-white mb-2">Know a great expat-friendly place?</h3>
        <p className="text-slate-400 text-sm mb-4">Help the community by suggesting a business</p>
        <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-medium transition-colors">
          Suggest a Business
        </button>
      </div>
    </div>
  )
}

export default Directory
