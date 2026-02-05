// src/pages/Directory.jsx
import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Icon from '../components/Icon'
import {
  getDirectoryListings,
  getListingReviews,
  createReview,
  submitBusinessSuggestion,
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
  const [showSuggestModal, setShowSuggestModal] = useState(false)
  const [suggestionForm, setSuggestionForm] = useState({
    name: '',
    category: 'restaurant',
    description: '',
    address: '',
    website: '',
    phone: '',
    why_recommend: ''
  })
  const [suggestionSubmitting, setSuggestionSubmitting] = useState(false)
  const [suggestionSuccess, setSuggestionSuccess] = useState(false)

  const fetchListings = useCallback(async () => {
    setLoading(true)
    const { data } = await getDirectoryListings(activeCategory)
    setListings(data)
    setLoading(false)
  }, [activeCategory])

  const fetchReviews = useCallback(async (listingId) => {
    setReviewsLoading(true)
    const { data } = await getListingReviews(listingId)
    setReviews(data)
    setReviewsLoading(false)
  }, [])

  // Fetch listings on mount and category change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchListings()
  }, [fetchListings])

  // Fetch reviews when listing is selected
  useEffect(() => {
    if (selectedListing) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchReviews(selectedListing.id)
    }
  }, [selectedListing, fetchReviews])

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

  const submitSuggestion = async () => {
    if (!isAuthenticated) {
      openAuthModal('sign_up')
      return
    }

    if (!suggestionForm.name.trim() || !suggestionForm.description.trim()) return

    setSuggestionSubmitting(true)

    const suggestion = {
      user_id: user.id,
      user_email: user.email,
      business_name: suggestionForm.name,
      category: suggestionForm.category,
      description: suggestionForm.description,
      address: suggestionForm.address || null,
      website: suggestionForm.website || null,
      phone: suggestionForm.phone || null,
      why_recommend: suggestionForm.why_recommend || null,
      status: 'pending'
    }

    const { error } = await submitBusinessSuggestion(suggestion)

    if (!error) {
      setSuggestionSuccess(true)
      setTimeout(() => {
        setShowSuggestModal(false)
        setSuggestionSuccess(false)
        setSuggestionForm({
          name: '',
          category: 'restaurant',
          description: '',
          address: '',
          website: '',
          phone: '',
          why_recommend: ''
        })
      }, 2000)
    }

    setSuggestionSubmitting(false)
  }

  const renderStars = (rating, interactive = false, onChange = null) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onChange && onChange(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
          >
            <Icon
              name={star <= rating ? 'starFill' : 'star'}
              className={star <= rating ? 'w-4 h-4 text-slate-200' : 'w-4 h-4 text-slate-600'}
            />
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
            className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"
          >
            <Icon name="arrowLeft" className="w-4 h-4" />
            Back to Directory
          </button>
        </nav>

        {/* Listing Header */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-2xl font-bold text-white">{selectedListing.name}</h1>
                {selectedListing.verified && (
                  <span className="bg-white/10 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Icon name="success" className="w-3 h-3" />
                    Verified
                  </span>
                )}
                {selectedListing.expat_approved && (
                  <span className="bg-white/10 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Icon name="globe" className="w-3 h-3" />
                    Expat Approved
                  </span>
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
                <span className="flex items-center gap-1 text-slate-300 text-sm">
                  <Icon name="user" className="w-3.5 h-3.5" />
                  {selectedListing.english_level === 'fluent' ? 'Fluent' : 'Basic'} English
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Price:</span>
              <span className="text-white">{selectedListing.price_range || '$$'}</span>
            </div>
            {selectedListing.address && (
              <div className="flex items-center gap-2">
                <Icon name="pin" className="w-4 h-4 text-slate-400" />
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
            <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-white/10">
              {selectedListing.website && (
                <a
                  href={selectedListing.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-white text-sm flex items-center gap-2"
                >
                  <Icon name="link" className="w-4 h-4" />
                  Website
                </a>
              )}
              {selectedListing.phone && (
                <a
                  href={`tel:${selectedListing.phone}`}
                  className="text-slate-300 hover:text-white text-sm flex items-center gap-2"
                >
                  <Icon name="phone" className="w-4 h-4" />
                  {selectedListing.phone}
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
              className="w-full glass-3d text-white py-3 rounded-xl font-medium transition-colors mb-6 flex items-center justify-center gap-2"
            >
              <Icon name="document" className="w-4 h-4" />
              Write a Review
            </button>
          ) : (
            <button
              onClick={() => openAuthModal('sign_up')}
              className="w-full glass-panel text-white py-3 rounded-xl font-medium transition-colors mb-6"
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
        <Link to="/" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
          <Icon name="arrowLeft" className="w-4 h-4" />
          Back to Home
        </Link>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Icon name="pin" className="w-8 h-8 text-slate-200" />
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
            <Icon name={cat.icon} className="w-4 h-4" />
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
              className="w-full glass-panel hover:bg-white/5 rounded-xl p-4 text-left transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-lg font-semibold text-white">{listing.name}</h3>
                    {listing.expat_approved && (
                      <span className="bg-white/10 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Icon name="globe" className="w-3 h-3" />
                        Expat Approved
                      </span>
                    )}
                    {listing.verified && (
                      <span className="bg-white/10 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Icon name="success" className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm mb-2">{listing.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-slate-300">
                      <Icon name="user" className="w-3.5 h-3.5" />
                      {listing.english_level === 'fluent' ? 'Fluent English' : 'Basic English'}
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
        <button
          onClick={() => isAuthenticated ? setShowSuggestModal(true) : openAuthModal('sign_up')}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Suggest a Business
        </button>
      </div>

      {/* Suggest Business Modal */}
      {showSuggestModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {suggestionSuccess ? (
              <div className="text-center py-8">
                <Icon name="success" className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Thank you!</h3>
                <p className="text-slate-400">Your suggestion has been submitted for review.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Suggest a Business</h3>
                  <button
                    onClick={() => setShowSuggestModal(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <Icon name="close" className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Business Name *</label>
                    <input
                      type="text"
                      value={suggestionForm.name}
                      onChange={(e) => setSuggestionForm({...suggestionForm, name: e.target.value})}
                      placeholder="e.g., Warsaw Wellness Clinic"
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Category *</label>
                    <select
                      value={suggestionForm.category}
                      onChange={(e) => setSuggestionForm({...suggestionForm, category: e.target.value})}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                    >
                      {DIRECTORY_CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Description *</label>
                    <textarea
                      value={suggestionForm.description}
                      onChange={(e) => setSuggestionForm({...suggestionForm, description: e.target.value})}
                      placeholder="What do they offer? What makes them great for expats?"
                      rows={3}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Address</label>
                    <input
                      type="text"
                      value={suggestionForm.address}
                      onChange={(e) => setSuggestionForm({...suggestionForm, address: e.target.value})}
                      placeholder="Street address or area"
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-400 text-sm mb-2">Website</label>
                      <input
                        type="url"
                        value={suggestionForm.website}
                        onChange={(e) => setSuggestionForm({...suggestionForm, website: e.target.value})}
                        placeholder="https://..."
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-sm mb-2">Phone</label>
                      <input
                        type="tel"
                        value={suggestionForm.phone}
                        onChange={(e) => setSuggestionForm({...suggestionForm, phone: e.target.value})}
                        placeholder="+48..."
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Why do you recommend it?</label>
                    <textarea
                      value={suggestionForm.why_recommend}
                      onChange={(e) => setSuggestionForm({...suggestionForm, why_recommend: e.target.value})}
                      placeholder="Share your personal experience..."
                      rows={2}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 resize-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={submitSuggestion}
                      disabled={suggestionSubmitting || !suggestionForm.name.trim() || !suggestionForm.description.trim()}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white py-3 rounded-lg font-medium transition-colors"
                    >
                      {suggestionSubmitting ? 'Submitting...' : 'Submit Suggestion'}
                    </button>
                    <button
                      onClick={() => setShowSuggestModal(false)}
                      className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Directory

