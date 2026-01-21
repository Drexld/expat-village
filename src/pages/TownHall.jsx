import { Link } from 'react-router-dom'
import { useState } from 'react'

function TownHall() {
  const [activeView, setActiveView] = useState('main') // main, room, live-session
  const [activeRoom, setActiveRoom] = useState(null)
  const [activeLiveSession, setActiveLiveSession] = useState(null)

  // Live sessions - the WOW factor
  const liveSessions = [
    {
      id: 'live-1',
      status: 'live',
      title: 'Ask Me Anything: Polish Taxes for Freelancers',
      host: {
        name: 'Marta K.',
        badge: '💎 Village Elder',
        avatar: '👩‍💼',
        verified: true
      },
      listeners: 47,
      speakers: 3,
      startedAt: '18 min ago',
      tags: ['Taxes', 'B2B', 'Freelancing'],
      description: 'Tax advisor answering your questions about B2B, PIT, VAT, and everything in between.'
    },
    {
      id: 'live-2',
      status: 'live',
      title: 'Newcomers Welcome Circle - January Edition',
      host: {
        name: 'James T.',
        badge: '🥇 Trusted Local',
        avatar: '👨',
        verified: true
      },
      listeners: 23,
      speakers: 5,
      startedAt: '42 min ago',
      tags: ['Newcomers', 'Community', 'Q&A'],
      description: 'Weekly hangout for people who just arrived. Ask anything, meet others, get tips.'
    }
  ]

  const scheduledSessions = [
    {
      id: 'scheduled-1',
      title: 'Housing Scams: How I Almost Lost 5000 PLN',
      host: { name: 'Daniel R.', badge: '🥈 Contributor', avatar: '👨‍🦱' },
      date: 'Tomorrow',
      time: '19:00 CET',
      interested: 89,
      tags: ['Housing', 'Scams', 'Story Time']
    },
    {
      id: 'scheduled-2',
      title: 'Immigration Lawyer Q&A: Work Permits 2025',
      host: { name: 'Kancelaria Nowak', badge: '✅ Verified Partner', avatar: '⚖️' },
      date: 'Thursday',
      time: '18:00 CET',
      interested: 156,
      tags: ['Immigration', 'Legal', 'Work Permits']
    },
    {
      id: 'scheduled-3',
      title: 'Polish Language Exchange - Beginners Welcome',
      host: { name: 'Anna M.', badge: '🥇 Trusted Local', avatar: '👩‍🏫' },
      date: 'Saturday',
      time: '15:00 CET',
      interested: 67,
      tags: ['Polish', 'Language', 'Learning']
    }
  ]

  const rooms = [
    {
      id: 'newcomers',
      icon: '👋',
      title: 'Newcomers Corner',
      shortDesc: 'Just arrived? Start here. Ask anything.',
      members: '2.4k',
      activity: 'Very Active',
      activityColor: 'text-green-400',
      unread: 12,
      lastMessage: {
        user: 'Sophie L.',
        text: 'Just got my PESEL! The guide here saved me hours...',
        time: '2 min ago'
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
      unread: 8,
      lastMessage: {
        user: 'Mike D.',
        text: '⚠️ SCAM ALERT: Fake listing on OLX, same photos as...',
        time: '5 min ago'
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
      unread: 3,
      lastMessage: {
        user: 'Tomek W.',
        text: 'My company is hiring React devs, B2B 25-30k, DM me',
        time: '12 min ago'
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
      unread: 21,
      lastMessage: {
        user: 'Events Bot',
        text: '🍻 Friday drinks at Pawilony - 34 people going!',
        time: '1 min ago'
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
      unread: 5,
      lastMessage: {
        user: 'Rachel K.',
        text: 'Best Mexican ingredients in Warsaw? Need real tortillas!',
        time: '8 min ago'
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
      unread: 0,
      lastMessage: {
        user: 'Emma T.',
        text: 'International school applications open next week!',
        time: '23 min ago'
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
      unread: 2,
      lastMessage: {
        user: 'Chris P.',
        text: 'Finally understood a full conversation! 6 months in 🎉',
        time: '15 min ago'
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
      unread: 0,
      lastMessage: {
        user: 'Moving Out Mike',
        text: 'FREE: IKEA KALLAX shelf, Mokotow pickup',
        time: '34 min ago'
      }
    }
  ]

  const liveSessionDetail = {
    id: 'live-1',
    title: 'Ask Me Anything: Polish Taxes for Freelancers',
    host: {
      name: 'Marta Kowalczyk',
      badge: '💎 Village Elder',
      avatar: '👩‍💼',
      bio: 'Tax advisor with 8 years helping expats. Fluent in English, Polish, German.',
      verified: true
    },
    coHosts: [
      { name: 'Tax Expert PL', avatar: '📊', badge: '✅ Partner' },
      { name: 'Accountant Anna', avatar: '👩‍💻', badge: '🥇 Trusted' }
    ],
    listeners: 47,
    speakers: [
      { name: 'Marta K.', avatar: '👩‍💼', speaking: true },
      { name: 'John D.', avatar: '👨', speaking: false },
      { name: 'Lisa M.', avatar: '👩', speaking: false }
    ],
    queue: [
      { name: 'Peter R.', avatar: '👨‍🦰', question: 'IP Box eligibility?' },
      { name: 'Sarah K.', avatar: '👩‍🦱', question: 'VAT registration timing' }
    ],
    chat: [
      { user: 'Tom B.', message: 'This is so helpful! 🙏', time: '2m' },
      { user: 'Anna W.', message: 'Can you explain ZUS ulga na start again?', time: '1m' },
      { user: 'Mod', message: '📌 Resources mentioned: kalkulator-b2b.pl', time: 'now', pinned: true }
    ]
  }

  // Main Town Hall View
  const renderMainView = () => (
    <>
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">🏛️</span>
          <h1 className="text-3xl font-bold text-white">Town Hall</h1>
        </div>
        <p className="text-slate-400 text-lg">
          Real expats, real conversations, real-time. Your community hub.
        </p>
      </header>

      {/* LIVE NOW - The WOW factor */}
      {liveSessions.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <h2 className="text-xl font-bold text-white">Live Now</h2>
          </div>
          
          <div className="space-y-4">
            {liveSessions.map((session) => (
              <button
                key={session.id}
                onClick={() => {
                  setActiveLiveSession(session)
                  setActiveView('live-session')
                }}
                className="w-full text-left bg-gradient-to-r from-red-900/40 to-orange-900/40 border border-red-700/50 hover:border-red-500 rounded-xl p-5 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                      LIVE
                    </span>
                    <span className="text-slate-400 text-sm">{session.startedAt}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-slate-300">👥 {session.listeners} listening</span>
                    <span className="text-slate-400">🎤 {session.speakers} speaking</span>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-white group-hover:text-red-300 transition-colors mb-2">
                  {session.title}
                </h3>
                
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{session.host.avatar}</span>
                  <span className="text-slate-300">{session.host.name}</span>
                  <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded">{session.host.badge}</span>
                </div>
                
                <p className="text-slate-400 text-sm mb-3">{session.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {session.tags.map((tag, i) => (
                    <span key={i} className="text-xs bg-red-900/50 text-red-300 px-2 py-1 rounded">{tag}</span>
                  ))}
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-red-400 text-sm group-hover:text-red-300">Tap to join →</span>
                  <div className="flex -space-x-2">
                    <span className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center text-xs">👤</span>
                    <span className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center text-xs">👤</span>
                    <span className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center text-xs">👤</span>
                    <span className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-xs text-slate-300">+{session.listeners - 3}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Sessions */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">📅 Upcoming Sessions</h2>
          <button className="text-emerald-400 text-sm hover:text-emerald-300 transition-colors">
            + Host a Session
          </button>
        </div>
        
        <div className="space-y-3">
          {scheduledSessions.map((session) => (
            <div
              key={session.id}
              className="bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-xl p-4 transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-white mb-1">{session.title}</h3>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-400">{session.host.avatar}</span>
                    <span className="text-slate-300">{session.host.name}</span>
                    <span className="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded">{session.host.badge}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-emerald-400 font-medium">{session.date}</p>
                  <p className="text-slate-400 text-sm">{session.time}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-3">
                <div className="flex flex-wrap gap-2">
                  {session.tags.map((tag, i) => (
                    <span key={i} className="text-xs bg-slate-700 text-slate-400 px-2 py-1 rounded">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 text-sm">🔔 {session.interested} interested</span>
                  <button className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm px-3 py-1 rounded-lg transition-colors">
                    Remind Me
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Community Rooms */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">💬 Community Rooms</h2>
        
        <div className="space-y-2">
          {rooms.map((room) => (
            <button
              key={room.id}
              onClick={() => {
                setActiveRoom(room)
                setActiveView('room')
              }}
              className="w-full text-left bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-slate-600 rounded-xl p-4 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <span className="text-2xl">{room.icon}</span>
                  {room.unread > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {room.unread}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                      {room.title}
                    </h3>
                    <span className={`text-xs ${room.activityColor}`}>● {room.activity}</span>
                  </div>
                  <p className="text-slate-500 text-sm truncate">
                    <span className="text-slate-400">{room.lastMessage.user}:</span> {room.lastMessage.text}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-slate-500 text-xs">{room.lastMessage.time}</p>
                  <p className="text-slate-600 text-xs">{room.members} members</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Host CTA */}
      <section className="bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border border-emerald-700/50 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <span className="text-4xl">🎙️</span>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">Host Your Own Session</h3>
            <p className="text-slate-300 mb-4">
              Got expertise to share? Host a live session and help fellow expats. 
              Tax tips, apartment hunting stories, language exchange - anything goes.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg transition-colors font-medium">
                Start Live Now
              </button>
              <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors">
                Schedule for Later
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Community Stats */}
      <section className="mt-8 grid grid-cols-3 gap-4">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-white">8.2k+</p>
          <p className="text-slate-400 text-sm">Community Members</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-emerald-400">156</p>
          <p className="text-slate-400 text-sm">Sessions This Month</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-white">24/7</p>
          <p className="text-slate-400 text-sm">Active Community</p>
        </div>
      </section>
    </>
  )

  // Live Session Detail View - The REAL Town Hall Experience
  const renderLiveSession = () => (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      {/* Session Header */}
      <div className="bg-gradient-to-r from-red-900/60 to-orange-900/60 border border-red-700/50 rounded-t-xl p-4">
        <button 
          onClick={() => setActiveView('main')}
          className="text-slate-300 hover:text-white mb-3 text-sm flex items-center gap-1"
        >
          ← Leave quietly
        </button>
        
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            LIVE
          </span>
          <span className="text-slate-300 text-sm">Started 18 min ago</span>
          <span className="text-slate-400 text-sm">• 👥 47 listening</span>
        </div>
        
        <h1 className="text-xl font-bold text-white mb-2">{liveSessionDetail.title}</h1>
        
        <div className="flex items-center gap-2">
          <span className="text-2xl">{liveSessionDetail.host.avatar}</span>
          <div>
            <p className="text-white font-medium">{liveSessionDetail.host.name}</p>
            <p className="text-slate-400 text-xs">{liveSessionDetail.host.bio}</p>
          </div>
          <span className="bg-slate-700 text-slate-300 text-xs px-2 py-0.5 rounded ml-2">{liveSessionDetail.host.badge}</span>
        </div>
      </div>

      {/* Speakers Section */}
      <div className="bg-slate-800 border-x border-slate-700 p-4">
        <h3 className="text-sm font-semibold text-slate-400 mb-3">🎤 Speakers</h3>
        <div className="flex flex-wrap gap-4">
          {liveSessionDetail.speakers.map((speaker, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className={`relative w-14 h-14 rounded-full flex items-center justify-center text-2xl ${
                speaker.speaking 
                  ? 'bg-emerald-900 border-2 border-emerald-400 animate-pulse' 
                  : 'bg-slate-700 border-2 border-slate-600'
              }`}>
                {speaker.avatar}
                {speaker.speaking && (
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-xs">🎤</span>
                  </span>
                )}
              </div>
              <p className="text-slate-300 text-xs mt-1">{speaker.name}</p>
            </div>
          ))}
          
          {/* Raise Hand Button */}
          <button className="flex flex-col items-center justify-center w-14 h-14 rounded-full bg-slate-700 hover:bg-slate-600 border-2 border-dashed border-slate-500 transition-colors">
            <span className="text-xl">✋</span>
          </button>
        </div>
      </div>

      {/* Queue Section */}
      {liveSessionDetail.queue.length > 0 && (
        <div className="bg-slate-800/50 border-x border-slate-700 p-4">
          <h3 className="text-sm font-semibold text-slate-400 mb-2">📋 Question Queue</h3>
          <div className="space-y-2">
            {liveSessionDetail.queue.map((person, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="text-slate-400">{i + 1}.</span>
                <span>{person.avatar}</span>
                <span className="text-slate-300">{person.name}</span>
                <span className="text-slate-500">-</span>
                <span className="text-slate-400 italic">"{person.question}"</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live Chat */}
      <div className="flex-1 bg-slate-900 border-x border-slate-700 p-4 overflow-y-auto">
        <div className="space-y-3">
          {liveSessionDetail.chat.map((msg, i) => (
            <div key={i} className={`${msg.pinned ? 'bg-emerald-900/30 border border-emerald-700/50 rounded-lg p-2' : ''}`}>
              <span className={`font-medium ${msg.pinned ? 'text-emerald-400' : 'text-slate-300'}`}>{msg.user}: </span>
              <span className="text-slate-400">{msg.message}</span>
              <span className="text-slate-600 text-xs ml-2">{msg.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="bg-slate-800 border border-slate-700 rounded-b-xl p-4">
        <div className="flex items-center gap-3">
          <input 
            type="text" 
            placeholder="Send a message..."
            className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
          <button className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg transition-colors">
            ✋ Raise Hand
          </button>
          <button className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-colors">
            Leave
          </button>
        </div>
      </div>
    </div>
  )

  // Room Chat View
  const renderRoom = () => (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      {/* Room Header */}
      <div className="bg-slate-800 border border-slate-700 rounded-t-xl p-4">
        <button 
          onClick={() => setActiveView('main')}
          className="text-slate-400 hover:text-white mb-3 text-sm flex items-center gap-1"
        >
          ← Back to Town Hall
        </button>
        
        <div className="flex items-center gap-3">
          <span className="text-3xl">{activeRoom?.icon}</span>
          <div>
            <h1 className="text-xl font-bold text-white">{activeRoom?.title}</h1>
            <p className="text-slate-400 text-sm">{activeRoom?.members} members • {activeRoom?.activity}</p>
          </div>
        </div>
      </div>

      {/* Placeholder Chat Area */}
      <div className="flex-1 bg-slate-900 border-x border-slate-700 p-4 flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl mb-4 block">💬</span>
          <h3 className="text-xl font-semibold text-white mb-2">Community Chat Coming Soon</h3>
          <p className="text-slate-400 max-w-md">
            Real-time messaging with fellow expats. Share tips, ask questions, help others.
            Sign up to be notified when this launches!
          </p>
          <button className="mt-4 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg transition-colors">
            Get Notified
          </button>
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-slate-800 border border-slate-700 rounded-b-xl p-4">
        <div className="flex items-center gap-3">
          <input 
            type="text" 
            placeholder="Sign up to send messages..."
            disabled
            className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-slate-400 placeholder-slate-500 cursor-not-allowed"
          />
          <button disabled className="bg-slate-600 text-slate-400 px-4 py-2 rounded-lg cursor-not-allowed">
            Send
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen">
      {/* Back Navigation - only show on main view */}
      {activeView === 'main' && (
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
        >
          ← Back to Home
        </Link>
      )}

      {activeView === 'main' && renderMainView()}
      {activeView === 'live-session' && renderLiveSession()}
      {activeView === 'room' && renderRoom()}
    </div>
  )
}

export default TownHall
