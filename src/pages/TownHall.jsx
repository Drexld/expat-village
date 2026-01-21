import { Link } from 'react-router-dom'
import { useState } from 'react'

function TownHall() {
  const [activeRoom, setActiveRoom] = useState(null)

  const rooms = [
    {
      id: 'newcomers',
      icon: '👋',
      title: 'Newcomers Corner',
      shortDesc: 'Just arrived? Start here. Ask anything.',
      members: '2.4k',
      activity: 'Very Active',
      activityColor: 'text-green-400',
      content: {
        description: 'The first stop for anyone new to Poland. No question is too basic here. Ask about first steps, share your arrival experience, or just say hello. Our community of experienced expats loves helping newcomers settle in.',
        topics: [
          'First week survival tips',
          'What I wish I knew before moving',
          'Making friends as a newcomer',
          'Culture shock moments',
          'Best neighborhoods for expats'
        ],
        rules: [
          'All questions welcome - no judgment',
          'Share your experiences to help others',
          'Be patient with language barriers',
          'Point newcomers to relevant guides'
        ],
        featuredDiscussions: [
          { title: 'First month checklist - what to prioritize?', replies: 47, hot: true },
          { title: 'Moving from UK post-Brexit - my experience', replies: 32, hot: false },
          { title: 'Solo expat looking for social tips', replies: 28, hot: true },
          { title: 'Best way to learn basic Polish fast?', replies: 51, hot: false }
        ]
      }
    },
    {
      id: 'housing-chat',
      icon: '🏠',
      title: 'Housing & Rentals',
      shortDesc: 'Apartment hunting, roommates, landlord issues',
      members: '3.1k',
      activity: 'Very Active',
      activityColor: 'text-green-400',
      content: {
        description: 'Everything about finding and keeping a home in Poland. Share listings, warn about scams, ask for neighborhood advice, or vent about your landlord. Real experiences from real renters.',
        topics: [
          'Apartment recommendations',
          'Scam alerts and warnings',
          'Roommate finder',
          'Landlord/tenant issues',
          'Neighborhood reviews'
        ],
        rules: [
          'Always verify before sharing listings',
          'Report suspected scams immediately',
          'No agents promoting their services',
          'Be specific about locations and prices'
        ],
        featuredDiscussions: [
          { title: '⚠️ SCAM ALERT: Fake listings on OLX using stolen photos', replies: 89, hot: true },
          { title: 'Mokotów vs Praga - which for young professionals?', replies: 63, hot: false },
          { title: 'Landlord refusing to return deposit - advice?', replies: 41, hot: true },
          { title: 'Looking for roommate - Śródmieście, March', replies: 22, hot: false }
        ]
      }
    },
    {
      id: 'jobs-networking',
      icon: '💼',
      title: 'Jobs & Networking',
      shortDesc: 'Career chat, job leads, professional connections',
      members: '2.8k',
      activity: 'Active',
      activityColor: 'text-blue-400',
      content: {
        description: 'Connect with other professionals, share job opportunities, discuss workplace culture, and build your network. From IT to teaching to finance - all industries welcome.',
        topics: [
          'Job opportunities',
          'Salary discussions',
          'B2B vs employment advice',
          'Industry meetups',
          'Career transitions'
        ],
        rules: [
          'Job posts must include salary range',
          'No MLM or commission-only schemes',
          'Respect confidentiality',
          'Help others - karma comes back'
        ],
        featuredDiscussions: [
          { title: 'IT salaries 2025 - share yours anonymously', replies: 127, hot: true },
          { title: 'My company is hiring - Senior React devs (B2B 25-30k)', replies: 34, hot: false },
          { title: 'Switching from UoP to B2B - worth it?', replies: 56, hot: true },
          { title: 'Networking events in Warsaw this month', replies: 29, hot: false }
        ]
      }
    },
    {
      id: 'social-events',
      icon: '🎉',
      title: 'Social & Events',
      shortDesc: 'Meetups, activities, and making friends',
      members: '4.2k',
      activity: 'Very Active',
      activityColor: 'text-green-400',
      content: {
        description: 'The heart of Expat Village. Organize meetups, find activity partners, discover events, and build your social circle. From hiking groups to language exchanges to Friday drinks.',
        topics: [
          'Weekly meetups',
          'Sports & fitness groups',
          'Language exchange',
          'Cultural events',
          'Weekend trips'
        ],
        rules: [
          'All events must be inclusive',
          'No selling or promoting businesses',
          'Post event recaps to encourage others',
          'Be welcoming to newcomers'
        ],
        featuredDiscussions: [
          { title: '🍻 Friday drinks @ Pawilony - this week!', replies: 67, hot: true },
          { title: 'Hiking group - Kampinos Forest Saturday', replies: 43, hot: true },
          { title: 'Polish-English language exchange meetup', replies: 38, hot: false },
          { title: 'Board game night - looking for players', replies: 31, hot: false }
        ]
      }
    },
    {
      id: 'daily-life',
      icon: '☕',
      title: 'Daily Life',
      shortDesc: 'The everyday stuff - shopping, services, random questions',
      members: '3.5k',
      activity: 'Active',
      activityColor: 'text-blue-400',
      content: {
        description: 'For everything that doesn\'t fit elsewhere. Where to find specific products, service recommendations, random Poland questions, funny observations, and daily wins and struggles.',
        topics: [
          'Where to find...',
          'Service recommendations',
          'Polish quirks and observations',
          'Wins and struggles',
          'Random questions'
        ],
        rules: [
          'Search before asking common questions',
          'Be specific about location',
          'Share your discoveries',
          'Keep it friendly and helpful'
        ],
        featuredDiscussions: [
          { title: 'Where to find good Mexican ingredients in Warsaw?', replies: 44, hot: false },
          { title: 'Best English-speaking dentist? Reasonable prices?', replies: 52, hot: true },
          { title: 'Polish bureaucracy wins - share your victories', replies: 37, hot: false },
          { title: 'Things that still confuse me after 2 years here', replies: 91, hot: true }
        ]
      }
    },
    {
      id: 'parents-families',
      icon: '👨‍👩‍👧',
      title: 'Parents & Families',
      shortDesc: 'Kids, schools, family life in Poland',
      members: '1.8k',
      activity: 'Active',
      activityColor: 'text-blue-400',
      content: {
        description: 'For expat parents navigating family life in Poland. Schools, childcare, kid-friendly activities, parenting in a new culture, and connecting with other families.',
        topics: [
          'International schools',
          'Childcare and nannies',
          'Kid-friendly activities',
          'Healthcare for children',
          'Family meetups'
        ],
        rules: [
          'Respect different parenting styles',
          'Verify school/childcare recommendations',
          'Keep discussions supportive',
          'Protect children\'s privacy'
        ],
        featuredDiscussions: [
          { title: 'International schools comparison - our experience', replies: 58, hot: true },
          { title: 'Polish public school as an expat kid - AMA', replies: 42, hot: false },
          { title: 'Nanny rates in Warsaw 2025?', replies: 33, hot: false },
          { title: 'Weekend activities for kids - your favorites?', replies: 47, hot: true }
        ]
      }
    },
    {
      id: 'polish-language',
      icon: '🇵🇱',
      title: 'Polish Language',
      shortDesc: 'Learning Polish, translation help, language wins',
      members: '2.1k',
      activity: 'Active',
      activityColor: 'text-blue-400',
      content: {
        description: 'Learning Polish together. Share resources, ask for translations, celebrate your progress, and commiserate over the seven cases. From complete beginners to advanced learners.',
        topics: [
          'Learning resources',
          'Translation help',
          'Language schools',
          'Progress sharing',
          'Common mistakes'
        ],
        rules: [
          'No judgment on skill level',
          'Help with translations kindly',
          'Share free resources when possible',
          'Celebrate others\' progress'
        ],
        featuredDiscussions: [
          { title: 'Best apps/resources for learning Polish?', replies: 73, hot: true },
          { title: 'Finally had a full conversation in Polish! 🎉', replies: 29, hot: false },
          { title: 'Translation help: letter from ZUS', replies: 18, hot: false },
          { title: 'Language schools in Warsaw - worth it?', replies: 45, hot: true }
        ]
      }
    },
    {
      id: 'buy-sell',
      icon: '🛒',
      title: 'Buy, Sell, Give',
      shortDesc: 'Marketplace for expats - furniture, items, freebies',
      members: '2.9k',
      activity: 'Moderate',
      activityColor: 'text-yellow-400',
      content: {
        description: 'Expat marketplace. Sell furniture before you move, find second-hand items, or give away things you don\'t need. Trusted community, fair prices, English communication.',
        topics: [
          'Furniture',
          'Electronics',
          'Household items',
          'Free stuff',
          'ISO (In Search Of)'
        ],
        rules: [
          'Post clear photos and prices',
          'Mark items as sold when gone',
          'Meet in safe public places',
          'No commercial sellers'
        ],
        featuredDiscussions: [
          { title: 'GIVING AWAY: IKEA furniture, moving out', replies: 34, hot: true },
          { title: 'FS: MacBook Pro M2 - 4500 PLN', replies: 12, hot: false },
          { title: 'ISO: Desk chair, budget 200-300 PLN', replies: 8, hot: false },
          { title: 'Moving sale - everything must go by March', replies: 27, hot: true }
        ]
      }
    }
  ]

  const activeContent = rooms.find(r => r.id === activeRoom)

  return (
    <div className="min-h-screen">
      {/* Back Navigation */}
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
      >
        ← Back to Home
      </Link>

      {!activeRoom ? (
        <>
          {/* Section Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">🏛️</span>
              <h1 className="text-3xl font-bold text-white">Town Hall</h1>
            </div>
            <p className="text-slate-400 text-lg">
              Real expats, real conversations. Ask questions, share experiences, make connections.
            </p>
          </header>

          {/* Community Stats */}
          <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-700/50 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Welcome to the Community</h3>
                <p className="text-slate-300 text-sm">Connect with thousands of expats living in Poland</p>
              </div>
              <div className="flex gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">8.2k+</p>
                  <p className="text-xs text-slate-400">Members</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">24/7</p>
                  <p className="text-xs text-slate-400">Active</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">8</p>
                  <p className="text-xs text-slate-400">Rooms</p>
                </div>
              </div>
            </div>
          </div>

          {/* Coming Soon Notice */}
          <div className="bg-amber-900/30 border border-amber-700/50 rounded-xl p-5 mb-6">
            <div className="flex items-start gap-4">
              <span className="text-2xl">🚧</span>
              <div>
                <h3 className="text-lg font-semibold text-amber-400 mb-1">Community Features Coming Soon</h3>
                <p className="text-slate-300 text-sm">
                  We're building the full community experience. Soon you'll be able to post, reply, and connect with other expats. For now, explore the rooms and see what's planned!
                </p>
              </div>
            </div>
          </div>

          {/* Room List */}
          <div className="space-y-3">
            {rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => setActiveRoom(room.id)}
                className="w-full text-left bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-slate-600 rounded-xl p-5 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{room.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
                        {room.title}
                      </h3>
                      <span className={`text-xs ${room.activityColor}`}>● {room.activity}</span>
                    </div>
                    <p className="text-slate-400 text-sm">{room.shortDesc}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-300">{room.members}</p>
                    <p className="text-xs text-slate-500">members</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Join CTA */}
          <div className="mt-8 bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
            <h3 className="text-lg font-semibold text-white mb-2">Ready to Join the Conversation?</h3>
            <p className="text-slate-400 text-sm mb-4">
              Create a free account to post, reply, and connect with other expats.
            </p>
            <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg transition-colors">
              Sign Up Free
            </button>
          </div>
        </>
      ) : (
        /* Room Detail View */
        <article>
          {/* Room Header */}
          <header className="mb-8">
            <button 
              onClick={() => setActiveRoom(null)}
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors"
            >
              ← Back to Town Hall
            </button>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">{activeContent.icon}</span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold text-white">{activeContent.title}</h1>
                  <span className={`text-xs ${activeContent.activityColor}`}>● {activeContent.activity}</span>
                </div>
                <p className="text-slate-400">{activeContent.members} members</p>
              </div>
            </div>
          </header>

          {/* Room Description */}
          <section className="mb-8">
            <p className="text-slate-300 leading-relaxed">{activeContent.content.description}</p>
          </section>

          {/* Topics */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-emerald-400 mb-3">Popular Topics</h2>
            <div className="flex flex-wrap gap-2">
              {activeContent.content.topics.map((topic, index) => (
                <span 
                  key={index}
                  className="bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-sm"
                >
                  {topic}
                </span>
              ))}
            </div>
          </section>

          {/* Featured Discussions */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-emerald-400 mb-3">Featured Discussions</h2>
            <div className="space-y-3">
              {activeContent.content.featuredDiscussions.map((discussion, index) => (
                <div 
                  key={index}
                  className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {discussion.hot && (
                        <span className="text-orange-400 text-xs">🔥</span>
                      )}
                      <h3 className="text-white font-medium">{discussion.title}</h3>
                    </div>
                    <span className="text-slate-500 text-sm">{discussion.replies} replies</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-slate-500 text-sm mt-4 text-center">
              Full discussions coming soon - sign up to be notified!
            </p>
          </section>

          {/* Room Rules */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-emerald-400 mb-3">Room Guidelines</h2>
            <ul className="space-y-2">
              {activeContent.content.rules.map((rule, index) => (
                <li key={index} className="flex gap-2 text-slate-300">
                  <span className="text-emerald-400">✓</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Join CTA */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
            <h3 className="text-lg font-semibold text-white mb-2">Join This Room</h3>
            <p className="text-slate-400 text-sm mb-4">
              Create a free account to participate in discussions.
            </p>
            <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg transition-colors">
              Sign Up to Post
            </button>
          </section>
        </article>
      )}
    </div>
  )
}

export default TownHall
