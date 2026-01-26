// src/pages/Rewards.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function Rewards() {
  const { user, isAuthenticated, openAuthModal, profile } = useAuth()
  const [points, setPoints] = useState(0)
  const [pointsHistory, setPointsHistory] = useState([])
  const [earnedBadges, setEarnedBadges] = useState([])

  const badges = [
    // Getting Started
    { id: 'first-login', name: 'First Steps', icon: '👋', description: 'Logged in for the first time', points: 10, category: 'starter', rarity: 'common' },
    { id: 'profile-complete', name: 'All About Me', icon: '📝', description: 'Completed your profile', points: 20, category: 'starter', rarity: 'common' },
    { id: 'first-vote', name: 'Voice Heard', icon: '🗳️', description: 'Cast your first vote in Village Vibes', points: 10, category: 'starter', rarity: 'common' },
    { id: 'first-review', name: 'Critic', icon: '⭐', description: 'Wrote your first review', points: 25, category: 'starter', rarity: 'common' },
    
    // Checklist
    { id: 'checklist-25', name: 'Getting Started', icon: '📋', description: 'Completed 25% of checklist', points: 50, category: 'checklist', rarity: 'common' },
    { id: 'checklist-50', name: 'Halfway There', icon: '🎯', description: 'Completed 50% of checklist', points: 100, category: 'checklist', rarity: 'uncommon' },
    { id: 'checklist-75', name: 'Almost Local', icon: '🏠', description: 'Completed 75% of checklist', points: 150, category: 'checklist', rarity: 'rare' },
    { id: 'checklist-100', name: 'True Local', icon: '👑', description: 'Completed 100% of checklist', points: 300, category: 'checklist', rarity: 'legendary' },
    
    // Community
    { id: 'reviews-5', name: 'Regular Reviewer', icon: '✍️', description: 'Wrote 5 reviews', points: 75, category: 'community', rarity: 'uncommon' },
    { id: 'reviews-10', name: 'Trusted Voice', icon: '🎤', description: 'Wrote 10 reviews', points: 150, category: 'community', rarity: 'rare' },
    { id: 'votes-10', name: 'Active Voter', icon: '🗳️', description: 'Voted 10 times', points: 50, category: 'community', rarity: 'uncommon' },
    { id: 'helpful-5', name: 'Helpful', icon: '🤝', description: '5 people found your reviews helpful', points: 100, category: 'community', rarity: 'rare' },
    
    // Explorer
    { id: 'sections-all', name: 'Explorer', icon: '🧭', description: 'Visited all sections', points: 50, category: 'explorer', rarity: 'uncommon' },
    { id: 'town-hall', name: 'Community Member', icon: '🏛️', description: 'Joined a Town Hall session', points: 30, category: 'explorer', rarity: 'common' },
    { id: 'student-hub', name: 'Student Life', icon: '🎓', description: 'Explored Student Hub', points: 20, category: 'explorer', rarity: 'common' },
    
    // Special
    { id: 'early-adopter', name: 'Early Adopter', icon: '🚀', description: 'Joined during beta', points: 100, category: 'special', rarity: 'rare' },
    { id: 'og-member', name: 'OG Member', icon: '💎', description: 'One of the first 100 members', points: 200, category: 'special', rarity: 'legendary' },
    { id: 'bug-hunter', name: 'Bug Hunter', icon: '🐛', description: 'Reported a bug that was fixed', points: 150, category: 'special', rarity: 'rare' },
    { id: 'content-creator', name: 'Content Creator', icon: '📸', description: 'Submitted approved content', points: 100, category: 'special', rarity: 'rare' },
  ]

  const levels = [
    { name: 'Newcomer', minPoints: 0, icon: '🌱' },
    { name: 'Settler', minPoints: 100, icon: '🏕️' },
    { name: 'Resident', minPoints: 300, icon: '🏠' },
    { name: 'Local', minPoints: 600, icon: '🏘️' },
    { name: 'Trusted Local', minPoints: 1000, icon: '⭐' },
    { name: 'Village Elder', minPoints: 2000, icon: '👑' },
  ]

  useEffect(() => {
    loadPointsData()
  }, [isAuthenticated])

  const loadPointsData = () => {
    // Load from localStorage
    const savedPoints = localStorage.getItem('user-points')
    const savedHistory = localStorage.getItem('points-history')
    const savedBadges = localStorage.getItem('earned-badges')

    if (savedPoints) setPoints(parseInt(savedPoints))
    if (savedHistory) setPointsHistory(JSON.parse(savedHistory))
    if (savedBadges) setEarnedBadges(JSON.parse(savedBadges))

    // Auto-award first-login badge if authenticated and not already earned
    if (isAuthenticated) {
      const badges = savedBadges ? JSON.parse(savedBadges) : []
      if (!badges.includes('first-login')) {
        awardBadge('first-login')
      }
      if (!badges.includes('early-adopter')) {
        awardBadge('early-adopter')
      }
    }
  }

  const awardBadge = (badgeId) => {
    const badge = badges.find(b => b.id === badgeId)
    if (!badge) return

    // Check if already earned
    if (earnedBadges.includes(badgeId)) return

    // Award badge
    const newBadges = [...earnedBadges, badgeId]
    setEarnedBadges(newBadges)
    localStorage.setItem('earned-badges', JSON.stringify(newBadges))

    // Award points
    const newPoints = points + badge.points
    setPoints(newPoints)
    localStorage.setItem('user-points', newPoints.toString())

    // Add to history
    const historyEntry = {
      id: Date.now(),
      type: 'badge',
      description: `Earned "${badge.name}" badge`,
      points: badge.points,
      timestamp: new Date().toISOString()
    }
    const newHistory = [historyEntry, ...pointsHistory]
    setPointsHistory(newHistory)
    localStorage.setItem('points-history', JSON.stringify(newHistory))
  }

  const getCurrentLevel = () => {
    for (let i = levels.length - 1; i >= 0; i--) {
      if (points >= levels[i].minPoints) {
        return { ...levels[i], index: i }
      }
    }
    return { ...levels[0], index: 0 }
  }

  const getNextLevel = () => {
    const currentIndex = getCurrentLevel().index
    if (currentIndex < levels.length - 1) {
      return levels[currentIndex + 1]
    }
    return null
  }

  const currentLevel = getCurrentLevel()
  const nextLevel = getNextLevel()
  const progressToNext = nextLevel 
    ? ((points - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100
    : 100

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'from-slate-600 to-slate-700 border-slate-500'
      case 'uncommon': return 'from-green-800 to-emerald-900 border-green-500'
      case 'rare': return 'from-blue-800 to-indigo-900 border-blue-500'
      case 'legendary': return 'from-amber-700 to-orange-900 border-yellow-500'
      default: return 'from-slate-600 to-slate-700 border-slate-500'
    }
  }

  const getRarityLabel = (rarity) => {
    switch (rarity) {
      case 'common': return { text: 'Common', color: 'text-slate-400' }
      case 'uncommon': return { text: 'Uncommon', color: 'text-green-400' }
      case 'rare': return { text: 'Rare', color: 'text-blue-400' }
      case 'legendary': return { text: 'Legendary', color: 'text-yellow-400' }
      default: return { text: 'Common', color: 'text-slate-400' }
    }
  }

  if (!isAuthenticated) {
    return (
      <div>
        <nav className="mb-6">
          <Link to="/" className="text-slate-400 hover:text-white transition-colors">
            ← Back to Home
          </Link>
        </nav>

        <div className="text-center py-16">
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-3xl font-bold text-white mb-4">My Rewards</h1>
          <p className="text-slate-400 mb-8">Sign in to track your points and earn badges!</p>
          <button
            onClick={() => openAuthModal('sign_up')}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-xl font-medium transition-colors"
          >
            Sign Up to Start Earning
          </button>
        </div>
      </div>
    )
  }

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
          <span className="text-4xl">🏆</span>
          <h1 className="text-3xl font-bold text-white">My Rewards</h1>
        </div>
        <p className="text-slate-400 text-lg">
          Earn points by helping the community. Unlock badges and climb the ranks!
        </p>
      </header>

      {/* Points & Level Card */}
      <div className="bg-gradient-to-r from-emerald-900/50 to-teal-900/50 border border-emerald-700/50 rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-emerald-300 text-sm uppercase tracking-wide">Your Level</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-3xl">{currentLevel.icon}</span>
              <span className="text-2xl font-bold text-white">{currentLevel.name}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-emerald-300 text-sm uppercase tracking-wide">Total Points</p>
            <p className="text-4xl font-bold text-white">{points}</p>
          </div>
        </div>

        {nextLevel && (
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400">Progress to {nextLevel.name}</span>
              <span className="text-emerald-400">{nextLevel.minPoints - points} points to go</span>
            </div>
            <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                style={{ width: `${Math.min(progressToNext, 100)}%` }}
              />
            </div>
          </div>
        )}

        {!nextLevel && (
          <div className="text-center text-emerald-300 mt-2">
            🎉 You've reached the highest level!
          </div>
        )}
      </div>

      {/* How to Earn Points */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">💡 How to Earn Points</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl mb-1">✅</div>
            <p className="text-white font-medium">Complete Checklist</p>
            <p className="text-emerald-400 text-sm">Up to 300 pts</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">⭐</div>
            <p className="text-white font-medium">Write Reviews</p>
            <p className="text-emerald-400 text-sm">25 pts each</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">🗳️</div>
            <p className="text-white font-medium">Vote Daily</p>
            <p className="text-emerald-400 text-sm">10 pts each</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">🏛️</div>
            <p className="text-white font-medium">Join Town Hall</p>
            <p className="text-emerald-400 text-sm">30 pts</p>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">
          🎖️ Badges ({earnedBadges.length}/{badges.length})
        </h2>

        {/* Earned Badges */}
        {earnedBadges.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm text-emerald-400 uppercase tracking-wide mb-3">Earned</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {badges.filter(b => earnedBadges.includes(b.id)).map(badge => {
                const rarityLabel = getRarityLabel(badge.rarity)
                return (
                  <div 
                    key={badge.id}
                    className={`bg-gradient-to-br ${getRarityColor(badge.rarity)} border rounded-xl p-4 text-center`}
                  >
                    <div className="text-3xl mb-2">{badge.icon}</div>
                    <h4 className="text-white font-medium text-sm">{badge.name}</h4>
                    <p className={`text-xs ${rarityLabel.color}`}>{rarityLabel.text}</p>
                    <p className="text-emerald-400 text-xs mt-1">+{badge.points} pts</p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Locked Badges */}
        <div>
          <h3 className="text-sm text-slate-500 uppercase tracking-wide mb-3">Locked</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {badges.filter(b => !earnedBadges.includes(b.id)).map(badge => {
              const rarityLabel = getRarityLabel(badge.rarity)
              return (
                <div 
                  key={badge.id}
                  className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center opacity-60"
                >
                  <div className="text-3xl mb-2 grayscale">🔒</div>
                  <h4 className="text-slate-400 font-medium text-sm">{badge.name}</h4>
                  <p className={`text-xs ${rarityLabel.color} opacity-50`}>{rarityLabel.text}</p>
                  <p className="text-slate-500 text-xs mt-1">{badge.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Points History */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">📜 Points History</h2>
        {pointsHistory.length === 0 ? (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
            <p className="text-slate-400">No points earned yet. Start exploring!</p>
          </div>
        ) : (
          <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
            {pointsHistory.slice(0, 10).map(entry => (
              <div key={entry.id} className="flex items-center justify-between p-4 border-b border-slate-700 last:border-0">
                <div>
                  <p className="text-white">{entry.description}</p>
                  <p className="text-slate-500 text-sm">
                    {new Date(entry.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-emerald-400 font-bold">+{entry.points}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Leaderboard Teaser */}
      <div className="mt-8 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-700/50 rounded-xl p-6 text-center">
        <h3 className="text-lg font-semibold text-white mb-2">🏅 Leaderboard Coming Soon</h3>
        <p className="text-slate-400 text-sm">Compete with other expats and see who's the ultimate Village Elder!</p>
      </div>
    </div>
  )
}

export default Rewards
