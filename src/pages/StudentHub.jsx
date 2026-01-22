import { Link } from 'react-router-dom'
import { useState } from 'react'

function StudentHub() {
  const [activeTab, setActiveTab] = useState('universities') // universities, roommates, discounts, groups

  // Universities in Poland
  const universities = [
    { id: 'uw', name: 'University of Warsaw', shortName: 'UW', city: 'Warsaw', students: 847, icon: '🏛️', color: 'blue' },
    { id: 'sgh', name: 'SGH Warsaw School of Economics', shortName: 'SGH', city: 'Warsaw', students: 623, icon: '📊', color: 'green' },
    { id: 'pw', name: 'Warsaw University of Technology', shortName: 'PW', city: 'Warsaw', students: 534, icon: '⚙️', color: 'red' },
    { id: 'uj', name: 'Jagiellonian University', shortName: 'UJ', city: 'Kraków', students: 712, icon: '🎓', color: 'blue' },
    { id: 'agh', name: 'AGH University of Science', shortName: 'AGH', city: 'Kraków', students: 489, icon: '⛏️', color: 'green' },
    { id: 'uwr', name: 'University of Wrocław', shortName: 'UWr', city: 'Wrocław', students: 356, icon: '🏰', color: 'orange' },
    { id: 'pwr', name: 'Wrocław University of Technology', shortName: 'PWr', city: 'Wrocław', students: 298, icon: '🔧', color: 'blue' },
    { id: 'ug', name: 'University of Gdańsk', shortName: 'UG', city: 'Gdańsk', students: 267, icon: '⚓', color: 'blue' },
    { id: 'uam', name: 'Adam Mickiewicz University', shortName: 'UAM', city: 'Poznań', students: 234, icon: '📚', color: 'purple' },
    { id: 'kozminski', name: 'Kozminski University', shortName: 'KU', city: 'Warsaw', students: 189, icon: '💼', color: 'red' },
    { id: 'lazarski', name: 'Lazarski University', shortName: 'Lazarski', city: 'Warsaw', students: 156, icon: '⚖️', color: 'green' },
    { id: 'swps', name: 'SWPS University', shortName: 'SWPS', city: 'Warsaw', students: 134, icon: '🧠', color: 'purple' },
  ]

  // Roommate listings
  const roommateListings = [
    {
      id: 1,
      name: 'Maria',
      age: 22,
      university: 'SGH',
      program: 'MSc Finance',
      lookingFor: 'room',
      budget: '1500-2000 PLN',
      area: 'Mokotów, Ursynów',
      moveIn: 'February 2026',
      about: 'Quiet, tidy, non-smoker. Looking for a room in a shared flat. I study a lot but enjoy cooking together on weekends!',
      languages: ['English', 'Spanish'],
      verified: true,
      posted: '2 days ago'
    },
    {
      id: 2,
      name: 'Ahmed',
      age: 24,
      university: 'Warsaw University of Technology',
      program: 'PhD Computer Science',
      lookingFor: 'flatmate',
      budget: '1800-2200 PLN',
      area: 'Wola, Ochota',
      moveIn: 'ASAP',
      about: 'Have a 2-bedroom apartment, looking for a flatmate. Near metro, 10 min to campus. Gaming setup in living room 🎮',
      languages: ['English', 'Arabic'],
      verified: true,
      posted: '1 day ago'
    },
    {
      id: 3,
      name: 'Emma & Lisa',
      age: 21,
      university: 'University of Warsaw',
      program: 'Erasmus - Psychology',
      lookingFor: 'apartment',
      budget: '3000-4000 PLN total',
      area: 'Śródmieście, Powiśle',
      moveIn: 'March 2026',
      about: 'Two Erasmus students from Germany looking for a 2-bedroom apartment for spring semester. We love exploring the city!',
      languages: ['English', 'German'],
      verified: false,
      posted: '3 days ago'
    },
    {
      id: 4,
      name: 'Chen',
      age: 23,
      university: 'Kozminski University',
      program: 'MBA',
      lookingFor: 'room',
      budget: '2000-2500 PLN',
      area: 'Anywhere central',
      moveIn: 'February 2026',
      about: 'Clean, respectful, focused on studies. Early riser. Looking for professional/student flatmates.',
      languages: ['English', 'Mandarin'],
      verified: true,
      posted: '5 days ago'
    },
  ]

  // Student discounts
  const discounts = [
    { id: 1, category: 'Transport', name: 'ZTM Student Pass', discount: '51% off', description: 'Monthly pass for 55 PLN instead of 110 PLN', icon: '🚇', requirements: 'Valid student ID' },
    { id: 2, category: 'Transport', name: 'PKP Intercity', discount: '51% off', description: 'Train tickets across Poland', icon: '🚂', requirements: 'ISIC or Polish student ID' },
    { id: 3, category: 'Food', name: 'Żabka Student Deals', discount: '10-20% off', description: 'Weekly changing offers on snacks & drinks', icon: '🐸', requirements: 'Żappka app + student status' },
    { id: 4, category: 'Food', name: 'Student Canteens', discount: '50-70% off', description: 'Cheap meals at university cafeterias', icon: '🍽️', requirements: 'University ID' },
    { id: 5, category: 'Tech', name: 'Spotify Student', discount: '50% off', description: '12.99 PLN/month for Premium', icon: '🎵', requirements: 'SheerID verification' },
    { id: 6, category: 'Tech', name: 'Apple Education', discount: 'Up to 10% off', description: 'MacBooks, iPads at student prices', icon: '🍎', requirements: 'University email' },
    { id: 7, category: 'Tech', name: 'GitHub Student Pack', discount: 'Free', description: '$200+ worth of dev tools free', icon: '💻', requirements: 'University email' },
    { id: 8, category: 'Entertainment', name: 'Cinema City', discount: '30% off', description: 'Student tickets on weekdays', icon: '🎬', requirements: 'Student ID' },
    { id: 9, category: 'Entertainment', name: 'Museums', discount: 'Free/50% off', description: 'Most museums free on certain days', icon: '🏛️', requirements: 'Student ID' },
    { id: 10, category: 'Shopping', name: 'ISIC Card', discount: 'Various', description: 'International discounts worldwide', icon: '🌍', requirements: 'Apply through university' },
    { id: 11, category: 'Fitness', name: 'MultiSport Student', discount: '30% off', description: 'Cheaper than regular MultiSport', icon: '🏋️', requirements: 'Through university' },
    { id: 12, category: 'Services', name: 'Revolut Student', discount: 'Free Premium', description: '1 year free Premium account', icon: '💳', requirements: 'Student verification' },
  ]

  // Student groups/communities
  const studentGroups = [
    { id: 1, name: 'African Students in Poland', members: 1247, icon: '🌍', description: 'Connect with African students across Poland', active: true },
    { id: 2, name: 'Asian Students Network', members: 892, icon: '🌏', description: 'Community for students from Asia', active: true },
    { id: 3, name: 'Erasmus Poland', members: 2341, icon: '🇪🇺', description: 'All Erasmus exchange students', active: true },
    { id: 4, name: 'Indian Students Association', members: 567, icon: '🇮🇳', description: 'Indian students community & events', active: true },
    { id: 5, name: 'Latin American Students', members: 423, icon: '🌎', description: 'Students from Latin America', active: false },
    { id: 6, name: 'Medical Students Poland', members: 1876, icon: '⚕️', description: 'For all medical program students', active: true },
    { id: 7, name: 'MBA & Business Students', members: 654, icon: '💼', description: 'MBA and business school network', active: true },
    { id: 8, name: 'Tech & Engineering', members: 1123, icon: '💻', description: 'CS, Engineering, IT students', active: true },
    { id: 9, name: 'PhD & Researchers', members: 345, icon: '🔬', description: 'Doctoral students and researchers', active: false },
    { id: 10, name: 'LGBTQ+ Students', members: 289, icon: '🏳️‍🌈', description: 'Safe space for LGBTQ+ students', active: true },
  ]

  const getColorClass = (color) => {
    const colors = {
      blue: 'bg-blue-600',
      green: 'bg-green-600',
      red: 'bg-red-600',
      orange: 'bg-orange-600',
      purple: 'bg-purple-600',
    }
    return colors[color] || 'bg-slate-600'
  }

  return (
    <div className="min-h-screen">
      {/* Back Navigation */}
      <Link 
        to="/town-hall" 
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
      >
        ← Back to Town Hall
      </Link>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">🎓</span>
          <div>
            <h1 className="text-3xl font-bold text-white">Student Hub</h1>
            <p className="text-slate-400">Connect with students across Polish universities</p>
          </div>
        </div>
      </header>

      {/* Stats Banner */}
      <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-700/50 rounded-xl p-6 mb-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-white">4,839</p>
            <p className="text-indigo-300 text-sm">Students</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">12</p>
            <p className="text-indigo-300 text-sm">Universities</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">47</p>
            <p className="text-indigo-300 text-sm">Countries</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">156</p>
            <p className="text-indigo-300 text-sm">Looking for Rooms</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveTab('universities')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'universities' 
              ? 'bg-emerald-600 text-white' 
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          🏛️ Universities
        </button>
        <button
          onClick={() => setActiveTab('roommates')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'roommates' 
              ? 'bg-emerald-600 text-white' 
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          🏠 Find Roommates
        </button>
        <button
          onClick={() => setActiveTab('discounts')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'discounts' 
              ? 'bg-emerald-600 text-white' 
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          🏷️ Student Discounts
        </button>
        <button
          onClick={() => setActiveTab('groups')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'groups' 
              ? 'bg-emerald-600 text-white' 
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          👥 Student Groups
        </button>
      </div>

      {/* Universities Tab */}
      {activeTab === 'universities' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Find Your University</h2>
            <span className="text-slate-400 text-sm">Click to join your uni community</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {universities.map((uni) => (
              <button
                key={uni.id}
                className="bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-emerald-500 rounded-xl p-5 text-left transition-all group"
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{uni.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                        {uni.shortName}
                      </h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getColorClass(uni.color)} text-white`}>
                        {uni.city}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm mb-2">{uni.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 text-sm font-medium">{uni.students}</span>
                      <span className="text-slate-500 text-sm">students in Village</span>
                    </div>
                  </div>
                  <span className="text-slate-500 group-hover:text-emerald-400 transition-colors">→</span>
                </div>
              </button>
            ))}
          </div>
          
          {/* Don't see your uni */}
          <div className="mt-6 bg-slate-800/50 border border-dashed border-slate-700 rounded-xl p-6 text-center">
            <span className="text-2xl mb-2 block">🏫</span>
            <p className="text-slate-400 mb-3">Don't see your university?</p>
            <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors">
              + Add Your University
            </button>
          </div>
        </div>
      )}

      {/* Roommates Tab */}
      {activeTab === 'roommates' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Find Roommates & Housing</h2>
            <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg transition-colors text-sm">
              + Post Listing
            </button>
          </div>
          <p className="text-slate-400 text-sm mb-6">
            Verified students looking for rooms, flatmates, or apartments. Safer than random Facebook posts!
          </p>
          
          <div className="space-y-4">
            {roommateListings.map((listing) => (
              <div 
                key={listing.id}
                className="bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-xl p-5 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center text-xl">
                      👤
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white">{listing.name}, {listing.age}</h3>
                        {listing.verified && (
                          <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-full">✓ Verified</span>
                        )}
                      </div>
                      <p className="text-slate-400 text-sm">{listing.university} • {listing.program}</p>
                    </div>
                  </div>
                  <span className="text-slate-500 text-xs">{listing.posted}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                  <div className="bg-slate-700/50 rounded-lg p-2">
                    <p className="text-slate-500 text-xs">Looking for</p>
                    <p className="text-white text-sm font-medium capitalize">{listing.lookingFor}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-2">
                    <p className="text-slate-500 text-xs">Budget</p>
                    <p className="text-white text-sm font-medium">{listing.budget}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-2">
                    <p className="text-slate-500 text-xs">Area</p>
                    <p className="text-white text-sm font-medium">{listing.area}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-2">
                    <p className="text-slate-500 text-xs">Move in</p>
                    <p className="text-white text-sm font-medium">{listing.moveIn}</p>
                  </div>
                </div>

                <p className="text-slate-300 text-sm mb-3">{listing.about}</p>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {listing.languages.map((lang, i) => (
                      <span key={i} className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                        {lang}
                      </span>
                    ))}
                  </div>
                  <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                    Contact
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Safety note */}
          <div className="mt-6 bg-amber-900/20 border border-amber-700/50 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <h4 className="font-medium text-amber-400 mb-1">Safety First</h4>
                <p className="text-slate-400 text-sm">
                  Always meet in public first. Verify student status. Don't send money before seeing the place. 
                  Use our <Link to="/contract-analyzer" className="text-emerald-400 hover:underline">Contract Analyzer</Link> before signing!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Discounts Tab */}
      {activeTab === 'discounts' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Student Discounts in Poland</h2>
          </div>
          <p className="text-slate-400 text-sm mb-6">
            Save money with your student status! Most require valid student ID or ISIC card.
          </p>

          {/* Discounts by category */}
          {['Transport', 'Tech', 'Food', 'Entertainment', 'Shopping', 'Fitness', 'Services'].map((category) => {
            const categoryDiscounts = discounts.filter(d => d.category === category)
            if (categoryDiscounts.length === 0) return null
            
            return (
              <div key={category} className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">{category}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {categoryDiscounts.map((discount) => (
                    <div 
                      key={discount.id}
                      className="bg-slate-800 border border-slate-700 rounded-xl p-4"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{discount.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-white">{discount.name}</h4>
                            <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                              {discount.discount}
                            </span>
                          </div>
                          <p className="text-slate-400 text-sm mb-2">{discount.description}</p>
                          <p className="text-slate-500 text-xs">📋 {discount.requirements}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}

          {/* ISIC Promo */}
          <div className="bg-gradient-to-r from-blue-900/40 to-cyan-900/40 border border-blue-700/50 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <span className="text-3xl">🌍</span>
              <div>
                <h3 className="font-semibold text-white mb-1">Get Your ISIC Card</h3>
                <p className="text-slate-300 text-sm mb-3">
                  International Student Identity Card - recognized worldwide. Get discounts on travel, 
                  software, entertainment and more in 130+ countries.
                </p>
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                  Apply for ISIC →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Groups Tab */}
      {activeTab === 'groups' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Student Communities</h2>
          </div>
          <p className="text-slate-400 text-sm mb-6">
            Find your people. Join groups based on your background, field, or interests.
          </p>

          <div className="space-y-3">
            {studentGroups.map((group) => (
              <div 
                key={group.id}
                className="bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-xl p-5 transition-all"
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{group.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white">{group.name}</h3>
                      {group.active && (
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-slate-400 text-sm">{group.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-emerald-400 font-bold">{group.members.toLocaleString()}</p>
                    <p className="text-slate-500 text-xs">members</p>
                  </div>
                  <button className="bg-slate-700 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors">
                    Join
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Create group */}
          <div className="mt-6 bg-slate-800/50 border border-dashed border-slate-700 rounded-xl p-6 text-center">
            <span className="text-2xl mb-2 block">✨</span>
            <p className="text-slate-400 mb-3">Start a community for your country, program, or interest!</p>
            <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors">
              + Create Group
            </button>
          </div>
        </div>
      )}

      {/* Events Promo */}
      <div className="mt-10 bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <span className="text-3xl">🎉</span>
          <div className="flex-1">
            <h3 className="font-semibold text-white mb-2">Upcoming Student Events</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300">🎊 Erasmus Welcome Party @ SGH</span>
                <span className="text-slate-500">Feb 15</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300">🌍 African Students Meetup</span>
                <span className="text-slate-500">Feb 22</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300">💼 Career Fair @ University of Warsaw</span>
                <span className="text-slate-500">Mar 5</span>
              </div>
            </div>
          </div>
          <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg transition-colors text-sm">
            See All Events
          </button>
        </div>
      </div>
    </div>
  )
}

export default StudentHub
