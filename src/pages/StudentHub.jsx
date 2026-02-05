import { Link } from 'react-router-dom'
import { useState } from 'react'
import Icon from '../components/Icon'

function StudentHub() {
  const [activeTab, setActiveTab] = useState('universities')

  const universities = [
    { id: 'uw', name: 'University of Warsaw', shortName: 'UW', city: 'Warsaw', students: 847, icon: 'graduation', color: 'blue' },
    { id: 'sgh', name: 'SGH Warsaw School of Economics', shortName: 'SGH', city: 'Warsaw', students: 623, icon: 'graduation', color: 'green' },
    { id: 'pw', name: 'Warsaw University of Technology', shortName: 'PW', city: 'Warsaw', students: 534, icon: 'graduation', color: 'red' },
    { id: 'uj', name: 'Jagiellonian University', shortName: 'UJ', city: 'Krakow', students: 712, icon: 'graduation', color: 'blue' },
    { id: 'agh', name: 'AGH University of Science', shortName: 'AGH', city: 'Krakow', students: 489, icon: 'graduation', color: 'green' },
    { id: 'uwr', name: 'University of Wroclaw', shortName: 'UWr', city: 'Wroclaw', students: 356, icon: 'graduation', color: 'orange' },
    { id: 'pwr', name: 'Wroclaw University of Technology', shortName: 'PWr', city: 'Wroclaw', students: 298, icon: 'graduation', color: 'blue' },
    { id: 'ug', name: 'University of Gdansk', shortName: 'UG', city: 'Gdansk', students: 267, icon: 'graduation', color: 'blue' },
    { id: 'uam', name: 'Adam Mickiewicz University', shortName: 'UAM', city: 'Poznan', students: 234, icon: 'graduation', color: 'purple' },
    { id: 'kozminski', name: 'Kozminski University', shortName: 'KU', city: 'Warsaw', students: 189, icon: 'graduation', color: 'red' },
    { id: 'lazarski', name: 'Lazarski University', shortName: 'Lazarski', city: 'Warsaw', students: 156, icon: 'graduation', color: 'green' },
    { id: 'swps', name: 'SWPS University', shortName: 'SWPS', city: 'Warsaw', students: 134, icon: 'graduation', color: 'purple' },
  ]

  const roommateListings = [
    {
      id: 1,
      name: 'Maria',
      age: 22,
      university: 'SGH',
      program: 'MSc Finance',
      lookingFor: 'room',
      budget: '1500-2000 PLN',
      area: 'Mokotow, Ursynow',
      moveIn: 'February 2026',
      about: 'Quiet, tidy, non-smoker. Looking for a room in a shared flat. I study a lot but enjoy cooking together on weekends.',
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
      about: 'Have a 2-bedroom apartment, looking for a flatmate. Near metro, 10 min to campus. Gaming setup in living room.',
      languages: ['English', 'Arabic'],
      verified: true,
      posted: '1 day ago'
    },
    {
      id: 3,
      name: 'Emma and Lisa',
      age: 21,
      university: 'University of Warsaw',
      program: 'Erasmus - Psychology',
      lookingFor: 'apartment',
      budget: '3000-4000 PLN total',
      area: 'Srodmiescie, Powisle',
      moveIn: 'March 2026',
      about: 'Two Erasmus students from Germany looking for a 2-bedroom apartment for spring semester. We love exploring the city.',
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

  const discounts = [
    { id: 1, category: 'Transport', name: 'ZTM Student Pass', discount: '51% off', description: 'Monthly pass for 55 PLN instead of 110 PLN', icon: 'ticket', requirements: 'Valid student ID' },
    { id: 2, category: 'Transport', name: 'PKP Intercity', discount: '51% off', description: 'Train tickets across Poland', icon: 'train', requirements: 'ISIC or Polish student ID' },
    { id: 3, category: 'Food', name: 'Zabka Student Deals', discount: '10-20% off', description: 'Weekly changing offers on snacks and drinks', icon: 'utensils', requirements: 'appka app + student status' },
    { id: 4, category: 'Food', name: 'Student Canteens', discount: '50-70% off', description: 'Cheap meals at university cafeterias', icon: 'utensils', requirements: 'University ID' },
    { id: 5, category: 'Tech', name: 'Spotify Student', discount: '50% off', description: '12.99 PLN/month for Premium', icon: 'music', requirements: 'SheerID verification' },
    { id: 6, category: 'Tech', name: 'Apple Education', discount: 'Up to 10% off', description: 'MacBooks, iPads at student prices', icon: 'bolt', requirements: 'University email' },
    { id: 7, category: 'Tech', name: 'GitHub Student Pack', discount: 'Free', description: '$200+ worth of dev tools free', icon: 'document', requirements: 'University email' },
    { id: 8, category: 'Entertainment', name: 'Cinema City', discount: '30% off', description: 'Student tickets on weekdays', icon: 'star', requirements: 'Student ID' },
    { id: 9, category: 'Entertainment', name: 'Museums', discount: 'Free or 50% off', description: 'Most museums free on certain days', icon: 'star', requirements: 'Student ID' },
    { id: 10, category: 'Shopping', name: 'ISIC Card', discount: 'Various', description: 'International discounts worldwide', icon: 'badge', requirements: 'Apply through university' },
    { id: 11, category: 'Fitness', name: 'MultiSport Student', discount: '30% off', description: 'Cheaper than regular MultiSport', icon: 'dumbbell', requirements: 'Through university' },
    { id: 12, category: 'Services', name: 'Revolut Student', discount: 'Free Premium', description: '1 year free Premium account', icon: 'card', requirements: 'Student verification' },
  ]

  const studentGroups = [
    { id: 1, name: 'African Students in Poland', members: 1247, icon: 'community', description: 'Connect with African students across Poland', active: true },
    { id: 2, name: 'Asian Students Network', members: 892, icon: 'community', description: 'Community for students from Asia', active: true },
    { id: 3, name: 'Erasmus Poland', members: 2341, icon: 'community', description: 'All Erasmus exchange students', active: true },
    { id: 4, name: 'Indian Students Association', members: 567, icon: 'community', description: 'Indian students community and events', active: true },
    { id: 5, name: 'Latin American Students', members: 423, icon: 'community', description: 'Students from Latin America', active: false },
    { id: 6, name: 'Medical Students Poland', members: 1876, icon: 'community', description: 'For all medical program students', active: true },
    { id: 7, name: 'MBA and Business Students', members: 654, icon: 'community', description: 'MBA and business school network', active: true },
    { id: 8, name: 'Tech and Engineering', members: 1123, icon: 'community', description: 'CS, Engineering, IT students', active: true },
    { id: 9, name: 'PhD and Researchers', members: 345, icon: 'community', description: 'Doctoral students and researchers', active: false },
    { id: 10, name: 'LGBTQ+ Students', members: 289, icon: 'community', description: 'Safe space for LGBTQ+ students', active: true },
  ]

  const getColorClass = (color) => {
    const colors = {
      blue: 'bg-sky-500/80',
      green: 'bg-emerald-500/80',
      red: 'bg-rose-500/80',
      orange: 'bg-amber-500/80',
      purple: 'bg-violet-500/80',
    }
    return colors[color] || 'bg-slate-600'
  }

  return (
    <div className="min-h-screen space-y-8">
      <Link
        to="/town-hall"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
      >
        <Icon name="arrowLeft" size={16} />
        Back to Town Hall
      </Link>

      <header className="glass-panel rounded-3xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="glass-panel flex h-12 w-12 items-center justify-center rounded-2xl">
            <Icon name="graduation" size={22} className="text-slate-100" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-white">Student Hub</h1>
            <p className="text-slate-400">Connect with students across Polish universities</p>
          </div>
        </div>
      </header>

      <div className="glass-3d rounded-3xl p-6 hover-tilt">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-semibold text-white">4,839</p>
            <p className="text-slate-400 text-sm">Students</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-white">12</p>
            <p className="text-slate-400 text-sm">Universities</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-white">47</p>
            <p className="text-slate-400 text-sm">Countries</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-white">156</p>
            <p className="text-slate-400 text-sm">Looking for Rooms</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { id: 'universities', label: 'Universities' },
          { id: 'roommates', label: 'Find Roommates' },
          { id: 'discounts', label: 'Student Discounts' },
          { id: 'groups', label: 'Student Groups' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white/15 text-white border border-white/20'
                : 'bg-slate-900/40 text-slate-400 border border-white/10 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'universities' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Find Your University</h2>
            <span className="text-slate-400 text-sm">Click to join your uni community</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {universities.map((uni) => (
              <button
                key={uni.id}
                className="glass-panel hover-tilt rounded-2xl p-5 text-left transition-all border border-white/10"
              >
                <div className="flex items-start gap-4">
                  <div className="glass-panel flex h-12 w-12 items-center justify-center rounded-2xl">
                    <Icon name={uni.icon} size={20} className="text-slate-100" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white">{uni.shortName}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getColorClass(uni.color)} text-white`}>
                        {uni.city}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm mb-2">{uni.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-200 text-sm font-medium">{uni.students}</span>
                      <span className="text-slate-500 text-sm">students in Village</span>
                    </div>
                  </div>
                  <Icon name="arrowRight" size={16} className="text-slate-400" />
                </div>
              </button>
            ))}
          </div>

          <div className="glass-panel rounded-2xl p-6 text-center border border-dashed border-white/10">
            <div className="glass-panel inline-flex h-12 w-12 items-center justify-center rounded-2xl mb-2">
              <Icon name="spark" size={18} className="text-slate-100" />
            </div>
            <p className="text-slate-400 mb-3">Do not see your university?</p>
            <button className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20">
              Add Your University
            </button>
          </div>
        </div>
      )}

      {activeTab === 'roommates' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Find Roommates and Housing</h2>
            <button className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20">
              Post Listing
            </button>
          </div>
          <p className="text-slate-400 text-sm">
            Verified students looking for rooms, flatmates, or apartments. Safer than random Facebook posts.
          </p>

          <div className="space-y-4">
            {roommateListings.map((listing) => (
              <div key={listing.id} className="glass-panel rounded-2xl p-5 border border-white/10">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="glass-panel flex h-12 w-12 items-center justify-center rounded-full">
                      <Icon name="user" size={18} className="text-slate-100" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white">{listing.name}, {listing.age}</h3>
                        {listing.verified && (
                          <span className="glass-chip text-xs px-2 py-0.5 rounded-full text-emerald-100">Verified</span>
                        )}
                      </div>
                      <p className="text-slate-400 text-sm">{listing.university} - {listing.program}</p>
                    </div>
                  </div>
                  <span className="text-slate-500 text-xs">{listing.posted}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                  {[
                    { label: 'Looking for', value: listing.lookingFor },
                    { label: 'Budget', value: listing.budget },
                    { label: 'Area', value: listing.area },
                    { label: 'Move in', value: listing.moveIn }
                  ].map((item) => (
                    <div key={item.label} className="glass-chip rounded-lg p-2">
                      <p className="text-slate-500 text-xs">{item.label}</p>
                      <p className="text-white text-sm font-medium capitalize">{item.value}</p>
                    </div>
                  ))}
                </div>

                <p className="text-slate-300 text-sm mb-3">{listing.about}</p>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {listing.languages.map((lang, i) => (
                      <span key={i} className="glass-chip text-xs px-2 py-1 rounded">
                        {lang}
                      </span>
                    ))}
                  </div>
                  <button className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20">
                    Contact
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="glass-panel rounded-2xl p-4 border border-amber-500/30">
            <div className="flex items-start gap-3">
              <div className="glass-panel flex h-10 w-10 items-center justify-center rounded-xl">
                <Icon name="warning" size={18} className="text-amber-200" />
              </div>
              <div>
                <h4 className="font-medium text-amber-200 mb-1">Safety First</h4>
                <p className="text-slate-400 text-sm">
                  Always meet in public first. Verify student status. Do not send money before seeing the place.
                  Use our <Link to="/contract-analyzer" className="text-emerald-200 hover:underline">Contract Analyzer</Link> before signing.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'discounts' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-white">Student Discounts in Poland</h2>
            <p className="text-slate-400 text-sm">
              Save money with your student status. Most require valid student ID or ISIC card.
            </p>
          </div>

          {['Transport', 'Tech', 'Food', 'Entertainment', 'Shopping', 'Fitness', 'Services'].map((category) => {
            const categoryDiscounts = discounts.filter(d => d.category === category)
            if (categoryDiscounts.length === 0) return null

            return (
              <div key={category} className="space-y-3">
                <h3 className="text-lg font-semibold text-white">{category}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {categoryDiscounts.map((discount) => (
                    <div key={discount.id} className="glass-panel rounded-2xl p-4 border border-white/10">
                      <div className="flex items-start gap-3">
                        <div className="glass-panel flex h-10 w-10 items-center justify-center rounded-xl">
                          <Icon name={discount.icon} size={18} className="text-slate-100" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-white">{discount.name}</h4>
                            <span className="glass-chip text-xs px-2 py-0.5 rounded-full text-emerald-100">
                              {discount.discount}
                            </span>
                          </div>
                          <p className="text-slate-400 text-sm mb-2">{discount.description}</p>
                          <p className="text-slate-500 text-xs">{discount.requirements}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}

          <div className="glass-3d rounded-3xl p-6 hover-tilt">
            <div className="flex items-start gap-4">
              <div className="glass-panel flex h-12 w-12 items-center justify-center rounded-2xl">
                <Icon name="badge" size={20} className="text-slate-100" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Get Your ISIC Card</h3>
                <p className="text-slate-300 text-sm mb-3">
                  International Student Identity Card - recognized worldwide. Get discounts on travel, software, entertainment and more in 130+ countries.
                </p>
                <button className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20">
                  Apply for ISIC
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'groups' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Student Communities</h2>
            <p className="text-slate-400 text-sm">
              Find your people. Join groups based on your background, field, or interests.
            </p>
          </div>

          <div className="space-y-3">
            {studentGroups.map((group) => (
              <div key={group.id} className="glass-panel rounded-2xl p-5 border border-white/10">
                <div className="flex items-center gap-4">
                  <div className="glass-panel flex h-12 w-12 items-center justify-center rounded-2xl">
                    <Icon name={group.icon} size={20} className="text-slate-100" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white">{group.name}</h3>
                      {group.active && (
                        <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                      )}
                    </div>
                    <p className="text-slate-400 text-sm">{group.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-emerald-200 font-semibold">{group.members.toLocaleString()}</p>
                    <p className="text-slate-500 text-xs">members</p>
                  </div>
                  <button className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20">
                    Join
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="glass-panel rounded-2xl p-6 text-center border border-dashed border-white/10">
            <div className="glass-panel inline-flex h-12 w-12 items-center justify-center rounded-2xl mb-2">
              <Icon name="spark" size={18} className="text-slate-100" />
            </div>
            <p className="text-slate-400 mb-3">Start a community for your country, program, or interest.</p>
            <button className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20">
              Create Group
            </button>
          </div>
        </div>
      )}

      <div className="glass-panel rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="glass-panel flex h-12 w-12 items-center justify-center rounded-2xl">
            <Icon name="calendar" size={20} className="text-slate-100" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white mb-2">Upcoming Student Events</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Erasmus Welcome Party at SGH</span>
                <span className="text-slate-500">Feb 15</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">African Students Meetup</span>
                <span className="text-slate-500">Feb 22</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Career Fair at University of Warsaw</span>
                <span className="text-slate-500">Mar 5</span>
              </div>
            </div>
          </div>
          <button className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20">
            See All Events
          </button>
        </div>
      </div>
    </div>
  )
}

export default StudentHub
