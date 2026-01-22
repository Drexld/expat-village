import { Link } from 'react-router-dom'
import { useState } from 'react'

function Rewards() {
  const [activeTab, setActiveTab] = useState('overview') // overview, badges, leaderboard, history

  // Mock user data
  const user = {
    name: 'Jude',
    username: '@jude',
    points: 2450,
    level: 'Village Regular',
    nextLevel: 'Village Elder',
    pointsToNext: 550,
    rank: 47,
    totalUsers: 8247,
    joinDate: 'November 2025',
    tribe: { name: 'Manchester United', emoji: '🔴' },
    badges: ['early-adopter', 'first-review', 'helpful-neighbor', 'verified-local', 'quiz-master'],
  }

  // All available badges
  const allBadges = [
    // Milestone badges
    { id: 'early-adopter', name: 'Early Adopter', emoji: '🌟', description: 'Joined during beta', category: 'milestone', rarity: 'legendary', earned: true },
    { id: 'founding-member', name: 'Founding Member', emoji: '🏛️', description: 'First 100 members', category: 'milestone', rarity: 'legendary', earned: false },
    { id: 'one-year', name: 'One Year Strong', emoji: '🎂', description: '1 year in the Village', category: 'milestone', rarity: 'rare', earned: false },
    
    // Contribution badges
    { id: 'first-review', name: 'First Review', emoji: '✍️', description: 'Wrote your first review', category: 'contribution', rarity: 'common', earned: true },
    { id: 'review-pro', name: 'Review Pro', emoji: '📝', description: 'Wrote 10 reviews', category: 'contribution', rarity: 'uncommon', earned: false },
    { id: 'review-master', name: 'Review Master', emoji: '🏆', description: 'Wrote 50 reviews', category: 'contribution', rarity: 'rare', earned: false },
    { id: 'helpful-neighbor', name: 'Helpful Neighbor', emoji: '🤝', description: '10 helpful answers in Town Hall', category: 'contribution', rarity: 'uncommon', earned: true },
    { id: 'village-guide', name: 'Village Guide', emoji: '🧭', description: 'Helped 50 newcomers', category: 'contribution', rarity: 'rare', earned: false },
    
    // Verification badges
    { id: 'verified-local', name: 'Verified Local', emoji: '📍', description: 'Verified Warsaw resident', category: 'verification', rarity: 'uncommon', earned: true },
    { id: 'verified-student', name: 'Verified Student', emoji: '🎓', description: 'Verified university student', category: 'verification', rarity: 'uncommon', earned: false },
    { id: 'verified-business', name: 'Business Owner', emoji: '🏢', description: 'Verified business owner', category: 'verification', rarity: 'rare', earned: false },
    
    // Activity badges
    { id: 'quiz-master', name: 'Quiz Master', emoji: '🧠', description: '5/5 on personality quiz', category: 'activity', rarity: 'uncommon', earned: true },
    { id: 'town-hall-regular', name: 'Town Hall Regular', emoji: '🎙️', description: 'Attended 10 live sessions', category: 'activity', rarity: 'uncommon', earned: false },
    { id: 'vibes-voter', name: 'Vibes Voter', emoji: '🎵', description: 'Voted 30 days in a row', category: 'activity', rarity: 'rare', earned: false },
    { id: 'night-owl', name: 'Night Owl', emoji: '🦉', description: 'Active after midnight 10 times', category: 'activity', rarity: 'common', earned: false },
    { id: 'early-bird', name: 'Early Bird', emoji: '🐦', description: 'Active before 6 AM 10 times', category: 'activity', rarity: 'common', earned: false },
    
    // Tribe badges
    { id: 'tribe-leader', name: 'Tribe Leader', emoji: '👑', description: 'Most active in your tribe', category: 'tribe', rarity: 'legendary', earned: false },
    { id: 'tribe-champion', name: 'Tribe Champion', emoji: '🏅', description: 'Top 10 in your tribe', category: 'tribe', rarity: 'rare', earned: false },
    
    // Special badges
    { id: 'bug-hunter', name: 'Bug Hunter', emoji: '🐛', description: 'Reported a bug that got fixed', category: 'special', rarity: 'rare', earned: false },
    { id: 'idea-maker', name: 'Idea Maker', emoji: '💡', description: 'Suggested a feature that was built', category: 'special', rarity: 'legendary', earned: false },
  ]

  // Points history
  const pointsHistory = [
    { action: 'Wrote a review for Millennium Bank', points: 50, date: '2 hours ago' },
    { action: 'Answered question in Town Hall', points: 25, date: 'Yesterday' },
    { action: 'Voted in Village Vibes', points: 5, date: 'Yesterday' },
    { action: 'Completed personality quiz', points: 100, date: '3 days ago' },
    { action: 'Invited a friend who joined', points: 200, date: '1 week ago' },
    { action: 'First login streak bonus (7 days)', points: 50, date: '1 week ago' },
    { action: 'Review marked as helpful (x5)', points: 25, date: '2 weeks ago' },
  ]

  // Leaderboard
  const leaderboard = [
    { rank: 1, name: 'Anna K.', username: '@annak', points: 12450, level: 'Village Elder', tribe: '🇺🇦', badges: 15 },
    { rank: 2, name: 'Michael T.', username: '@miket', points: 11200, level: 'Village Elder', tribe: '🇬🇧', badges: 14 },
    { rank: 3, name: 'Sofia R.', username: '@sofiar', points: 10800, level: 'Village Elder', tribe: '🇪🇸', badges: 12 },
    { rank: 4, name: 'Ahmed M.', username: '@ahmedm', points: 9650, level: 'Village Elder', tribe: '🇪🇬', badges: 13 },
    { rank: 5, name: 'Chen W.', username: '@chenw', points: 8900, level: 'Village Regular', tribe: '🇨🇳', badges: 11 },
    { rank: 6, name: 'Priya S.', username: '@priyas', points: 7800, level: 'Village Regular', tribe: '🇮🇳', badges: 10 },
    { rank: 7, name: 'James L.', username: '@jamesl', points: 7200, level: 'Village Regular', tribe: '🇺🇸', badges: 9 },
    { rank: 8, name: 'Maria G.', username: '@mariag', points: 6500, level: 'Village Regular', tribe: '🇧🇷', badges: 8 },
    { rank: 9, name: 'Tom H.', username: '@tomh', points: 5800, level: 'Village Regular', tribe: '🇦🇺', badges: 8 },
    { rank: 10, name: 'Elena P.', username: '@elenap', points: 5200, level: 'Village Regular', tribe: '🇷🇴', badges: 7 },
  ]

  // How to earn points
  const earnMethods = [
    { action: 'Write a review', points: 50, icon: '✍️' },
    { action: 'Review marked helpful', points: 5, icon: '👍' },
    { action: 'Answer in Town Hall', points: 25, icon: '💬' },
    { action: 'Answer marked helpful', points: 10, icon: '✅' },
    { action: 'Vote in Village Vibes', points: 5, icon: '🎵' },
    { action: 'Daily login', points: 10, icon: '📅' },
    { action: '7-day streak', points: 50, icon: '🔥' },
    { action: 'Invite friend who joins', points: 200, icon: '👥' },
    { action: 'Complete checklist item', points: 15, icon: '✅' },
    { action: 'Attend Town Hall session', points: 20, icon: '🎙️' },
  ]

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-600 to-orange-600 border-yellow-500'
      case 'rare': return 'from-purple-600 to-pink-600 border-purple-500'
      case 'uncommon': return 'from-blue-600 to-cyan-600 border-blue-500'
      default: return 'from-slate-600 to-slate-700 border-slate-500'
    }
  }

  const getRarityLabel = (rarity) => {
    switch (rarity) {
      case 'legendary': return { text: 'Legendary', color: 'text-yellow-400' }
      case 'rare': return { text: 'Rare', color: 'text-purple-400' }
      case 'uncommon': return { text: 'Uncommon', color: 'text-blue-400' }
      default: return { text: 'Common', color: 'text-slate-400' }
    }
  }

  const earnedBadges = allBadges.filter(b => user.badges.includes(b.id))
  const lockedBadges = allBadges.filter(b => !user.badges.includes(b.id))

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
          <span className="text-4xl">🏆</span>
          <div>
            <h1 className="text-3xl font-bold text-white">Rewards</h1>
            <p className="text-slate-400">Earn points, unlock badges, climb the ranks</p>
          </div>
        </div>
      </header>

      {/* User Stats Card */}
      <div className="bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border border-emerald-700/50 rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center text-3xl">
              {user.tribe.emoji}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{user.name}</h2>
              <p className="text-emerald-400">{user.level}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-white">{user.points.toLocaleString()}</p>
            <p className="text-slate-400 text-sm">points</p>
          </div>
        </div>

        {/* Progress to next level */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-400">Progress to {user.nextLevel}</span>
            <span className="text-emerald-400">{user.pointsToNext} points to go</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all"
              style={{ width: `${((3000 - user.pointsToNext) / 3000) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-white">#{user.rank}</p>
            <p className="text-slate-400 text-sm">Global Rank</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{earnedBadges.length}</p>
            <p className="text-slate-400 text-sm">Badges Earned</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{user.joinDate}</p>
            <p className="text-slate-400 text-sm">Member Since</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {['overview', 'badges', 'leaderboard', 'history'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === tab
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {tab === 'overview' && '📊 Overview'}
            {tab === 'badges' && '🎖️ Badges'}
            {tab === 'leaderboard' && '🏅 Leaderboard'}
            {tab === 'history' && '📜 History'}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Recent Badges */}
          <section>
            <h3 className="text-lg font-bold text-white mb-4">Your Badges</h3>
            <div className="flex flex-wrap gap-3">
              {earnedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className={`bg-gradient-to-br ${getRarityColor(badge.rarity)} p-0.5 rounded-xl`}
                >
                  <div className="bg-slate-900 rounded-xl px-4 py-3 flex items-center gap-3">
                    <span className="text-2xl">{badge.emoji}</span>
                    <div>
                      <p className="text-white font-medium text-sm">{badge.name}</p>
                      <p className={`text-xs ${getRarityLabel(badge.rarity).color}`}>
                        {getRarityLabel(badge.rarity).text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <Link
                to="#"
                onClick={() => setActiveTab('badges')}
                className="bg-slate-800 border border-dashed border-slate-600 rounded-xl px-4 py-3 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                <span>+{lockedBadges.length}</span>
                <span className="text-sm">more to unlock</span>
              </Link>
            </div>
          </section>

          {/* How to Earn */}
          <section>
            <h3 className="text-lg font-bold text-white mb-4">How to Earn Points</h3>
            <div className="grid grid-cols-2 gap-3">
              {earnMethods.map((method, i) => (
                <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{method.icon}</span>
                    <span className="text-slate-300 text-sm">{method.action}</span>
                  </div>
                  <span className="text-emerald-400 font-bold">+{method.points}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Activity */}
          <section>
            <h3 className="text-lg font-bold text-white mb-4">Recent Points</h3>
            <div className="space-y-2">
              {pointsHistory.slice(0, 5).map((item, i) => (
                <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-slate-300 text-sm">{item.action}</p>
                    <p className="text-slate-500 text-xs">{item.date}</p>
                  </div>
                  <span className="text-emerald-400 font-bold">+{item.points}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Badges Tab */}
      {activeTab === 'badges' && (
        <div className="space-y-8">
          {/* Earned Badges */}
          <section>
            <h3 className="text-lg font-bold text-white mb-4">
              Earned <span className="text-emerald-400">({earnedBadges.length})</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {earnedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className={`bg-gradient-to-br ${getRarityColor(badge.rarity)} p-0.5 rounded-xl`}
                >
                  <div className="bg-slate-900 rounded-xl p-4 flex items-center gap-4">
                    <span className="text-4xl">{badge.emoji}</span>
                    <div>
                      <p className="text-white font-semibold">{badge.name}</p>
                      <p className="text-slate-400 text-sm">{badge.description}</p>
                      <p className={`text-xs mt-1 ${getRarityLabel(badge.rarity).color}`}>
                        {getRarityLabel(badge.rarity).text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Locked Badges */}
          <section>
            <h3 className="text-lg font-bold text-white mb-4">
              Locked <span className="text-slate-500">({lockedBadges.length})</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {lockedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center gap-4 opacity-60"
                >
                  <span className="text-4xl grayscale">🔒</span>
                  <div>
                    <p className="text-white font-semibold">{badge.name}</p>
                    <p className="text-slate-400 text-sm">{badge.description}</p>
                    <p className={`text-xs mt-1 ${getRarityLabel(badge.rarity).color}`}>
                      {getRarityLabel(badge.rarity).text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === 'leaderboard' && (
        <div>
          {/* Top 3 Podium */}
          <div className="flex justify-center items-end gap-4 mb-8">
            {/* 2nd Place */}
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-2">
                {leaderboard[1].tribe}
              </div>
              <div className="bg-slate-700 rounded-t-xl p-4 w-24 h-20">
                <p className="text-2xl font-bold text-slate-300">🥈</p>
                <p className="text-white text-sm font-medium truncate">{leaderboard[1].name}</p>
              </div>
            </div>
            
            {/* 1st Place */}
            <div className="text-center">
              <div className="w-20 h-20 bg-yellow-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-2 ring-4 ring-yellow-500/50">
                {leaderboard[0].tribe}
              </div>
              <div className="bg-gradient-to-t from-yellow-700 to-yellow-600 rounded-t-xl p-4 w-28 h-28">
                <p className="text-3xl font-bold text-white">👑</p>
                <p className="text-white font-medium">{leaderboard[0].name}</p>
                <p className="text-yellow-200 text-sm">{leaderboard[0].points.toLocaleString()} pts</p>
              </div>
            </div>
            
            {/* 3rd Place */}
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-700 rounded-full flex items-center justify-center text-2xl mx-auto mb-2">
                {leaderboard[2].tribe}
              </div>
              <div className="bg-amber-800 rounded-t-xl p-4 w-24 h-16">
                <p className="text-2xl font-bold text-amber-300">🥉</p>
                <p className="text-white text-sm font-medium truncate">{leaderboard[2].name}</p>
              </div>
            </div>
          </div>

          {/* Full Leaderboard */}
          <div className="space-y-2">
            {leaderboard.map((entry, i) => (
              <div 
                key={i}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                  entry.rank <= 3 
                    ? 'bg-gradient-to-r from-slate-800 to-slate-800/50 border border-yellow-700/30'
                    : 'bg-slate-800 border border-slate-700'
                }`}
              >
                <span className={`text-xl font-bold w-8 ${
                  entry.rank === 1 ? 'text-yellow-400' :
                  entry.rank === 2 ? 'text-slate-400' :
                  entry.rank === 3 ? 'text-amber-600' :
                  'text-slate-500'
                }`}>
                  #{entry.rank}
                </span>
                <span className="text-2xl">{entry.tribe}</span>
                <div className="flex-1">
                  <p className="text-white font-medium">{entry.name}</p>
                  <p className="text-slate-500 text-sm">{entry.level} • {entry.badges} badges</p>
                </div>
                <div className="text-right">
                  <p className="text-emerald-400 font-bold">{entry.points.toLocaleString()}</p>
                  <p className="text-slate-500 text-xs">points</p>
                </div>
              </div>
            ))}
          </div>

          {/* Your Position */}
          <div className="mt-6 bg-emerald-900/30 border border-emerald-700/50 rounded-xl p-4">
            <div className="flex items-center gap-4">
              <span className="text-xl font-bold text-emerald-400">#{user.rank}</span>
              <span className="text-2xl">{user.tribe.emoji}</span>
              <div className="flex-1">
                <p className="text-white font-medium">You ({user.name})</p>
                <p className="text-slate-400 text-sm">{user.level} • {earnedBadges.length} badges</p>
              </div>
              <div className="text-right">
                <p className="text-emerald-400 font-bold">{user.points.toLocaleString()}</p>
                <p className="text-slate-500 text-xs">points</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-2">
          {pointsHistory.map((item, i) => (
            <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-slate-300">{item.action}</p>
                <p className="text-slate-500 text-sm">{item.date}</p>
              </div>
              <span className="text-emerald-400 font-bold text-lg">+{item.points}</span>
            </div>
          ))}
          
          <div className="text-center py-8">
            <p className="text-slate-500">That's all your recent activity!</p>
          </div>
        </div>
      )}

      {/* Invite Friends CTA */}
      <div className="mt-8 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-700/50 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <span className="text-3xl">👥</span>
          <div className="flex-1">
            <h3 className="text-white font-semibold mb-1">Invite Friends, Earn Points!</h3>
            <p className="text-slate-300 text-sm mb-3">
              Get 200 points for every friend who joins Expat Village. They get 100 bonus points too!
            </p>
            <div className="flex gap-3">
              <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                Copy Invite Link
              </button>
              <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                Share on WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Rewards
