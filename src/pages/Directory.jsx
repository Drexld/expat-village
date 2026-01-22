import { Link } from 'react-router-dom'
import { useState } from 'react'

function Directory() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedListing, setSelectedListing] = useState(null)

  const categories = [
    { id: 'all', name: 'All', icon: '📍' },
    { id: 'banks', name: 'Banks', icon: '🏦' },
    { id: 'lawyers', name: 'Lawyers', icon: '⚖️' },
    { id: 'doctors', name: 'Doctors', icon: '👨‍⚕️' },
    { id: 'dentists', name: 'Dentists', icon: '🦷' },
    { id: 'gyms', name: 'Gyms', icon: '🏋️' },
    { id: 'salons', name: 'Salons', icon: '💇' },
    { id: 'restaurants', name: 'Restaurants', icon: '🍽️' },
    { id: 'services', name: 'Services', icon: '🔧' },
  ]

  const listings = [
    {
      id: 1,
      name: 'Millennium Bank',
      category: 'banks',
      subcategory: 'Retail Bank',
      rating: 4.7,
      reviews: 234,
      verified: true,
      expatApproved: true,
      featured: true,
      englishLevel: 'Fluent',
      address: 'Multiple locations in Warsaw',
      phone: '+48 801 331 331',
      website: 'millenniumbank.pl',
      priceRange: null,
      description: 'Best expat-friendly bank in Poland. Full English app, English-speaking staff, easy account opening for foreigners.',
      tags: ['English App', 'No PESEL Required', 'Online Opening'],
      topReview: {
        author: 'Sarah M.',
        rating: 5,
        text: 'Opened my account in 30 minutes with just my passport. App is fully in English. Best choice for expats!',
        date: '2 weeks ago'
      }
    },
    {
      id: 2,
      name: 'mBank',
      category: 'banks',
      subcategory: 'Retail Bank',
      rating: 4.5,
      reviews: 189,
      verified: true,
      expatApproved: true,
      featured: false,
      englishLevel: 'Fluent',
      address: 'Online + branches in major cities',
      phone: '+48 42 6 300 800',
      website: 'mbank.pl',
      priceRange: null,
      description: 'Modern digital bank with great English support. Fully online account opening for EU citizens.',
      tags: ['Digital First', 'EU Citizens', 'Free Account'],
      topReview: {
        author: 'Marco T.',
        rating: 5,
        text: 'Super modern app, everything works smoothly. Customer service in English is excellent.',
        date: '1 month ago'
      }
    },
    {
      id: 3,
      name: 'Kancelaria Imigracyjna LegalPoland',
      category: 'lawyers',
      subcategory: 'Immigration Law',
      rating: 4.9,
      reviews: 127,
      verified: true,
      expatApproved: true,
      featured: true,
      englishLevel: 'Fluent',
      address: 'ul. Marszałkowska 87, Warsaw',
      phone: '+48 22 123 4567',
      website: 'legalpoland.pl',
      priceRange: '💰💰',
      description: 'Specialists in work permits, residency cards, and citizenship. Handled 2000+ expat cases.',
      tags: ['Work Permits', 'Residency', 'Citizenship'],
      topReview: {
        author: 'Ahmed K.',
        rating: 5,
        text: 'Got my work permit in record time. They handled everything and kept me updated throughout.',
        date: '3 weeks ago'
      }
    },
    {
      id: 4,
      name: 'Dr. Anna Kowalska - GP',
      category: 'doctors',
      subcategory: 'General Practitioner',
      rating: 4.8,
      reviews: 89,
      verified: true,
      expatApproved: true,
      featured: false,
      englishLevel: 'Fluent',
      address: 'ul. Mokotowska 15, Warsaw',
      phone: '+48 22 555 1234',
      website: null,
      priceRange: '💰',
      description: 'English-speaking GP with 15 years experience. NFZ and private patients welcome.',
      tags: ['NFZ Accepted', 'Private', 'Same Day'],
      topReview: {
        author: 'Emma L.',
        rating: 5,
        text: 'Finally found a doctor who listens and explains everything in English. Highly recommend!',
        date: '1 week ago'
      }
    },
    {
      id: 5,
      name: 'Medicover Dental',
      category: 'dentists',
      subcategory: 'Dental Clinic',
      rating: 4.6,
      reviews: 156,
      verified: true,
      expatApproved: true,
      featured: true,
      englishLevel: 'Fluent',
      address: 'Multiple locations',
      phone: '+48 500 900 500',
      website: 'medicover.pl',
      priceRange: '💰💰',
      description: 'International dental clinic chain. All dentists speak English. Modern equipment.',
      tags: ['English Staff', 'Modern Equipment', 'Insurance Accepted'],
      topReview: {
        author: 'John D.',
        rating: 4,
        text: 'Professional service, clean facilities. A bit pricey but worth it for the English communication.',
        date: '2 weeks ago'
      }
    },
    {
      id: 6,
      name: 'Holmes Place Mokotów',
      category: 'gyms',
      subcategory: 'Premium Gym',
      rating: 4.4,
      reviews: 203,
      verified: true,
      expatApproved: false,
      featured: false,
      englishLevel: 'Good',
      address: 'Galeria Mokotów, Warsaw',
      phone: '+48 22 541 4141',
      website: 'holmesplace.pl',
      priceRange: '💰💰💰',
      description: 'Premium gym with pool, spa, and group classes. MultiSport Plus accepted.',
      tags: ['Pool', 'Spa', 'MultiSport Plus'],
      topReview: {
        author: 'Lisa R.',
        rating: 4,
        text: 'Great facilities but expensive if you don\'t have MultiSport. Staff speaks some English.',
        date: '1 month ago'
      }
    },
    {
      id: 7,
      name: 'Zdrofit Centrum',
      category: 'gyms',
      subcategory: 'Budget Gym',
      rating: 4.2,
      reviews: 312,
      verified: true,
      expatApproved: true,
      featured: false,
      englishLevel: 'Basic',
      address: 'ul. Złota 59, Warsaw',
      phone: '+48 22 222 3333',
      website: 'zdrofit.pl',
      priceRange: '💰',
      description: '24/7 gym with great equipment. Budget-friendly. MultiSport accepted.',
      tags: ['24/7', 'Budget', 'MultiSport'],
      topReview: {
        author: 'Mike P.',
        rating: 5,
        text: 'Best value gym in Warsaw. Open 24/7, never crowded at night. Staff doesn\'t speak much English but the app works fine.',
        date: '3 days ago'
      }
    },
    {
      id: 8,
      name: 'Cut & Color Studio',
      category: 'salons',
      subcategory: 'Hair Salon',
      rating: 4.8,
      reviews: 67,
      verified: true,
      expatApproved: true,
      featured: false,
      englishLevel: 'Fluent',
      address: 'ul. Chmielna 21, Warsaw',
      phone: '+48 22 827 1234',
      website: null,
      priceRange: '💰💰',
      description: 'International hair salon with English-speaking stylists. Specializes in all hair types.',
      tags: ['All Hair Types', 'English', 'Booksy'],
      topReview: {
        author: 'Priya S.',
        rating: 5,
        text: 'Finally a salon that understands curly hair! Kasia is amazing and speaks perfect English.',
        date: '1 week ago'
      }
    },
    {
      id: 9,
      name: 'Pho Vietnam',
      category: 'restaurants',
      subcategory: 'Vietnamese',
      rating: 4.7,
      reviews: 445,
      verified: true,
      expatApproved: true,
      featured: false,
      englishLevel: 'Good',
      address: 'ul. Świętokrzyska 30, Warsaw',
      phone: '+48 22 828 5678',
      website: null,
      priceRange: '💰',
      description: 'Authentic Vietnamese food. Best pho in Warsaw according to expats. English menu.',
      tags: ['English Menu', 'Delivery', 'Vegan Options'],
      topReview: {
        author: 'Tom H.',
        rating: 5,
        text: 'The pho here is incredible. Reminds me of the real thing in Vietnam. Great prices too!',
        date: '5 days ago'
      }
    },
    {
      id: 10,
      name: 'Relocation Services Poland',
      category: 'services',
      subcategory: 'Relocation',
      rating: 4.9,
      reviews: 78,
      verified: true,
      expatApproved: true,
      featured: true,
      englishLevel: 'Fluent',
      address: 'ul. Emilii Plater 53, Warsaw',
      phone: '+48 22 333 4444',
      website: 'relocatepoland.com',
      priceRange: '💰💰💰',
      description: 'Full relocation support: apartment hunting, registration, school search, settling in.',
      tags: ['Apartments', 'Registration', 'Schools'],
      topReview: {
        author: 'Chen W.',
        rating: 5,
        text: 'Worth every penny. They found us an apartment, helped with PESEL, and registered the kids in school.',
        date: '2 weeks ago'
      }
    },
  ]

  const filteredListings = listings.filter(listing => {
    const matchesCategory = activeCategory === 'all' || listing.category === activeCategory
    const matchesSearch = listing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const featuredListings = filteredListings.filter(l => l.featured)
  const regularListings = filteredListings.filter(l => !l.featured)

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating)
    const hasHalf = rating % 1 >= 0.5
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`text-sm ${i < fullStars ? 'text-yellow-400' : 'text-slate-600'}`}>
            ★
          </span>
        ))}
        <span className="text-white font-medium ml-1">{rating}</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Back Navigation */}
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
      >
        ← Back to Home
      </Link>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">📍</span>
          <div>
            <h1 className="text-3xl font-bold text-white">Directory</h1>
            <p className="text-slate-400">Expat-verified places and services</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search places, services, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-3 pl-12 text-white placeholder-slate-500 focus:outline-none transition-colors"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeCategory === cat.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <span>{cat.icon}</span>
              <span className="text-sm">{cat.name}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-white">{listings.length}</p>
          <p className="text-slate-400 text-sm">Verified Places</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-emerald-400">{listings.reduce((sum, l) => sum + l.reviews, 0).toLocaleString()}</p>
          <p className="text-slate-400 text-sm">Community Reviews</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-white">{listings.filter(l => l.expatApproved).length}</p>
          <p className="text-slate-400 text-sm">Expat Approved</p>
        </div>
      </div>

      {/* Featured Listings */}
      {featuredListings.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">⭐</span>
            <h2 className="text-lg font-bold text-white">Featured</h2>
            <span className="text-xs bg-yellow-600 text-white px-2 py-0.5 rounded-full">Sponsored</span>
          </div>
          <div className="space-y-4">
            {featuredListings.map((listing) => (
              <div 
                key={listing.id}
                className="bg-gradient-to-r from-yellow-900/20 to-slate-800 border border-yellow-700/50 hover:border-yellow-600 rounded-xl p-5 transition-all cursor-pointer"
                onClick={() => setSelectedListing(listing)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center text-2xl">
                    {categories.find(c => c.id === listing.category)?.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white">{listing.name}</h3>
                      {listing.verified && (
                        <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">✓ Verified</span>
                      )}
                      {listing.expatApproved && (
                        <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-full">Expat Approved</span>
                      )}
                    </div>
                    <p className="text-slate-400 text-sm mb-2">{listing.subcategory} • {listing.address}</p>
                    <div className="flex items-center gap-4 mb-2">
                      {renderStars(listing.rating)}
                      <span className="text-slate-500 text-sm">({listing.reviews} reviews)</span>
                      {listing.priceRange && (
                        <span className="text-slate-400 text-sm">{listing.priceRange}</span>
                      )}
                    </div>
                    <p className="text-slate-300 text-sm mb-3">{listing.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {listing.tags.map((tag, i) => (
                        <span key={i} className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                      <span className={`text-xs px-2 py-1 rounded ${
                        listing.englishLevel === 'Fluent' ? 'bg-emerald-900/50 text-emerald-300' :
                        listing.englishLevel === 'Good' ? 'bg-blue-900/50 text-blue-300' :
                        'bg-slate-700 text-slate-400'
                      }`}>
                        🇬🇧 {listing.englishLevel}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Regular Listings */}
      <section>
        <h2 className="text-lg font-bold text-white mb-4">
          {activeCategory === 'all' ? 'All Places' : categories.find(c => c.id === activeCategory)?.name}
          <span className="text-slate-500 font-normal ml-2">({regularListings.length})</span>
        </h2>
        
        {regularListings.length === 0 ? (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
            <span className="text-4xl mb-4 block">🔍</span>
            <p className="text-slate-400">No places found matching your criteria.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {regularListings.map((listing) => (
              <div 
                key={listing.id}
                className="bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-xl p-5 transition-all cursor-pointer"
                onClick={() => setSelectedListing(listing)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center text-2xl">
                    {categories.find(c => c.id === listing.category)?.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white">{listing.name}</h3>
                      {listing.verified && (
                        <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">✓ Verified</span>
                      )}
                      {listing.expatApproved && (
                        <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-full">Expat Approved</span>
                      )}
                    </div>
                    <p className="text-slate-400 text-sm mb-2">{listing.subcategory} • {listing.address}</p>
                    <div className="flex items-center gap-4 mb-2">
                      {renderStars(listing.rating)}
                      <span className="text-slate-500 text-sm">({listing.reviews} reviews)</span>
                      {listing.priceRange && (
                        <span className="text-slate-400 text-sm">{listing.priceRange}</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {listing.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                      <span className={`text-xs px-2 py-1 rounded ${
                        listing.englishLevel === 'Fluent' ? 'bg-emerald-900/50 text-emerald-300' :
                        listing.englishLevel === 'Good' ? 'bg-blue-900/50 text-blue-300' :
                        'bg-slate-700 text-slate-400'
                      }`}>
                        🇬🇧 {listing.englishLevel}
                      </span>
                    </div>
                  </div>
                  <span className="text-slate-500">→</span>
                </div>
                
                {/* Top Review Preview */}
                {listing.topReview && (
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <div className="flex items-start gap-3">
                      <span className="text-slate-500 text-sm">💬</span>
                      <div>
                        <p className="text-slate-300 text-sm italic">"{listing.topReview.text}"</p>
                        <p className="text-slate-500 text-xs mt-1">— {listing.topReview.author}, {listing.topReview.date}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Add Place CTA */}
      <div className="mt-8 bg-slate-800/50 border border-dashed border-slate-700 rounded-xl p-6 text-center">
        <span className="text-3xl mb-3 block">📝</span>
        <h3 className="text-white font-semibold mb-2">Know a great place?</h3>
        <p className="text-slate-400 text-sm mb-4">Help other expats by adding verified businesses to the directory.</p>
        <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg transition-colors">
          + Add a Place
        </button>
      </div>

      {/* Business CTA */}
      <div className="mt-6 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-700/50 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <span className="text-3xl">🏢</span>
          <div>
            <h3 className="text-white font-semibold mb-1">Own a business?</h3>
            <p className="text-slate-300 text-sm mb-3">
              Get verified, reach 8,000+ expats, and become featured in the directory.
            </p>
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors text-sm">
              Claim Your Business →
            </button>
          </div>
        </div>
      </div>

      {/* Listing Detail Modal */}
      {selectedListing && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-slate-700 rounded-xl flex items-center justify-center text-3xl">
                    {categories.find(c => c.id === selectedListing.category)?.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedListing.name}</h2>
                    <p className="text-slate-400 text-sm">{selectedListing.subcategory}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedListing(null)}
                  className="text-slate-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedListing.verified && (
                  <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">✓ Verified</span>
                )}
                {selectedListing.expatApproved && (
                  <span className="text-xs bg-emerald-600 text-white px-2 py-1 rounded-full">⭐ Expat Approved</span>
                )}
                <span className={`text-xs px-2 py-1 rounded-full ${
                  selectedListing.englishLevel === 'Fluent' ? 'bg-emerald-900/50 text-emerald-300' :
                  selectedListing.englishLevel === 'Good' ? 'bg-blue-900/50 text-blue-300' :
                  'bg-slate-700 text-slate-400'
                }`}>
                  🇬🇧 {selectedListing.englishLevel} English
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-4">
                {renderStars(selectedListing.rating)}
                <span className="text-slate-400">({selectedListing.reviews} reviews)</span>
              </div>

              {/* Description */}
              <p className="text-slate-300 mb-4">{selectedListing.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedListing.tags.map((tag, i) => (
                  <span key={i} className="text-xs bg-slate-700 text-slate-300 px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Contact Info */}
              <div className="bg-slate-700/50 rounded-xl p-4 mb-6 space-y-2">
                <div className="flex items-center gap-3 text-sm">
                  <span>📍</span>
                  <span className="text-slate-300">{selectedListing.address}</span>
                </div>
                {selectedListing.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <span>📞</span>
                    <a href={`tel:${selectedListing.phone}`} className="text-emerald-400 hover:underline">
                      {selectedListing.phone}
                    </a>
                  </div>
                )}
                {selectedListing.website && (
                  <div className="flex items-center gap-3 text-sm">
                    <span>🌐</span>
                    <a href={`https://${selectedListing.website}`} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">
                      {selectedListing.website}
                    </a>
                  </div>
                )}
              </div>

              {/* Top Review */}
              {selectedListing.topReview && (
                <div className="mb-6">
                  <h3 className="text-white font-semibold mb-3">Top Review</h3>
                  <div className="bg-slate-700/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-yellow-400">{'★'.repeat(selectedListing.topReview.rating)}</span>
                      <span className="text-slate-400 text-sm">{selectedListing.topReview.author}</span>
                      <span className="text-slate-500 text-xs">• {selectedListing.topReview.date}</span>
                    </div>
                    <p className="text-slate-300 text-sm italic">"{selectedListing.topReview.text}"</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl transition-colors font-medium">
                  Write a Review
                </button>
                <button className="px-4 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl transition-colors">
                  🔖 Save
                </button>
                <button className="px-4 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl transition-colors">
                  📤 Share
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Directory
