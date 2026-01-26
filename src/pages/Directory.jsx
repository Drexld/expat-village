// src/pages/Directory.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function Directory() {
  const { user, isAuthenticated, openAuthModal, profile } = useAuth()
  const [selectedListing, setSelectedListing] = useState(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', content: '' })
  const [submitting, setSubmitting] = useState(false)
  const [reviews, setReviews] = useState({})

  const categories = [
    { id: 'all', label: 'All', icon: '📍' },
    { id: 'bank', label: 'Banks', icon: '🏦' },
    { id: 'restaurant', label: 'Restaurants', icon: '🍽️' },
    { id: 'doctor', label: 'Healthcare', icon: '🏥' },
    { id: 'gym', label: 'Gyms', icon: '💪' },
  ]

  const listings = [
    { id: '1', name: 'Millennium Bank', category: 'bank', description: 'One of the most expat-friendly banks in Poland. English app and support available.', english_level: 'fluent', price_range: '$$', verified: true, expat_approved: true, rating_average: 4.5, review_count: 127, tags: ['expat-friendly', 'english-app', 'online-account'] },
    { id: '2', name: 'mBank', category: 'bank', description: 'Modern digital bank with great mobile app. Account opening possible online.', english_level: 'fluent', price_range: '$', verified: true, expat_approved: true, rating_average: 4.3, review_count: 98, tags: ['expat-friendly', 'english-app', 'no-fees'] },
    { id: '3', name: 'Medicover', category: 'doctor', description: 'Private healthcare network with English-speaking doctors. Multiple specialties.', english_level: 'fluent', price_range: '$$$', verified: true, expat_approved: true, rating_average: 4.2, review_count: 85, tags: ['english-speaking', 'private', 'specialists'] },
    { id: '4', name: 'LuxMed', category: 'doctor', description: 'Large private medical network. Good for basic checkups and specialists.', english_level: 'basic', price_range: '$$$', verified: true, expat_approved: false, rating_average: 3.9, review_count: 62, tags: ['private', 'specialists', 'dental'] },
    { id: '5', name: 'Beef & Pepper', category: 'restaurant', description: 'Great burgers and steaks. English menu available. Popular with expats.', english_level: 'fluent', price_range: '$$', verified: true, expat_approved: true, rating_average: 4.6, review_count: 43, tags: ['english-menu', 'burgers', 'steaks'] },
    { id: '6', name: 'Charlotte Menora', category: 'restaurant', description: 'Beautiful French bakery and cafe. Perfect for brunch.', english_level: 'fluent', price_range: '$$', verified: true, expat_approved: true, rating_average: 4.7, review_count: 67, tags: ['english-menu', 'brunch', 'bakery'] },
    { id: '7', name: 'Zdrofit', category: 'gym', description: 'Large gym chain with modern equipment. Some English-speaking staff.', english_level: 'basic', price_range: '$$', verified: true, expat_approved: false, rating_average: 4.0, review_count: 34, tags: ['24h', 'classes', 'pool'] },
    { id: '8', name: 'Holmes Place', category: 'gym', description: 'Premium gym with excellent facilities. English-speaking staff.', english_level: 'fluent', price_range: '$$$$', verified: true, expat_approved: true, rating_average: 4.4, review_count: 28, tags: ['premium', 'spa', 'classes'] },
  ]

  // Load reviews from localStorage on mount
  useEffect(() => {
    const savedReviews = localStorage.getItem('directory-reviews')
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews))
    }
  }, [])

  const getListingReviews = (listingId) => {
    return reviews[listingId] || []
  }

  const submitReview = () => {
    if (!isAuthenticated) {
      openAuthModal('sign_up')
      return
    }

    if (!reviewForm.content.trim()) return

    setSubmitting(true)

    const newReview = {
      id: `review-${Date.now()}`,
      user_name: profile?.display_name || 'Anonymous',
      rating: reviewForm.rating,
      title: reviewForm.title,
      content: reviewForm.content,
      created_at: new Date().toISOString()
    }

    // Add to reviews
    const updatedReviews = {
      ...reviews,
      [selectedListing.id]: [newReview, ...(reviews[selectedListing.id] || [])]
    }
    
    setReviews(updatedReviews)
    localStorage.setItem('directory-reviews', JSON.stringify(updatedReviews))

    setShowReviewForm(false)
    setReviewForm({ rating: 5, title: '', content: '' })
    setSubmitting(false)
  }

  const filteredListings = activeCategory === 'all' 
    ? listings 
    : listings.filter(l => l.category === activeCategory)

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
    const listingReviews = getListingReviews(selectedListing.id)
    
    return (
      <div>
        <nav className="mb-6">
          <button 
            onClick={() => { setSelectedListing(null); setShowReviewForm(false); }}
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
              <div className="text-3xl font-bold text-white">{selectedListing.rating_average}</div>
              <div className="text-slate-500 text-sm">{selectedListing.review_count + listingReviews.length} reviews</div>
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
              <span className="text-white">{selectedListing.price_range}</span>
            </div>
          </div>

          {selectedListing.tags && (
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedListing.tags.map(tag => (
                <span key={tag} className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
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
            Reviews ({listingReviews.length})
          </h2>
          
          {listingReviews.length === 0 ? (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
              <p className="text-slate-400">No reviews yet. Be the first!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {listingReviews.map(review => (
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
        {categories.map(cat => (
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
        {filteredListings.map(listing => {
          const listingReviews = getListingReviews(listing.id)
          return (
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
                    <span className="text-slate-500">{listing.price_range}</span>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-2xl font-bold text-white">{listing.rating_average}</div>
                  <div className="text-slate-500 text-sm">{listing.review_count + listingReviews.length} reviews</div>
                </div>
              </div>
            </button>
          )
        })}
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
