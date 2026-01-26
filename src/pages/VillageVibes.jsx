// src/pages/VillageVibes.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

function VillageVibes() {
  const { user, isAuthenticated, openAuthModal } = useAuth()
  const [songs, setSongs] = useState([])
  const [userVotes, setUserVotes] = useState({})
  const [loading, setLoading] = useState(true)
  const [voting, setVoting] = useState(null)

  // Sample data - always available
  const sampleSongs = [
    { id: 'sample-1', title: 'Nie płacz Evie', artist: 'Męskie Granie', vote_count: 24 },
    { id: 'sample-2', title: 'Ostatni', artist: 'Sanah', vote_count: 18 },
    { id: 'sample-3', title: 'Gdzie jest biały węgorz?', artist: 'Cypis', vote_count: 31 },
    { id: 'sample-4', title: 'Melodia ulotna', artist: 'Daria Zawiałow', vote_count: 15 },
  ]

  useEffect(() => {
    // Load saved votes from localStorage
    const savedVotes = localStorage.getItem('vibes-votes')
    if (savedVotes) {
      setUserVotes(JSON.parse(savedVotes))
    }

    // Load saved song counts from localStorage
    const savedSongs = localStorage.getItem('vibes-songs')
    if (savedSongs) {
      setSongs(JSON.parse(savedSongs))
    } else {
      setSongs(sampleSongs)
    }

    setLoading(false)
  }, [])

  const handleVote = async (songId) => {
    if (!isAuthenticated) {
      openAuthModal('sign_up')
      return
    }

    setVoting(songId)

    const hasVoted = userVotes[songId]

    // Update songs
    const updatedSongs = songs.map(song => {
      if (song.id === songId) {
        return { ...song, vote_count: song.vote_count + (hasVoted ? -1 : 1) }
      }
      return song
    })
    setSongs(updatedSongs)
    localStorage.setItem('vibes-songs', JSON.stringify(updatedSongs))

    // Update user votes
    const updatedVotes = { ...userVotes }
    if (hasVoted) {
      delete updatedVotes[songId]
    } else {
      updatedVotes[songId] = true
    }
    setUserVotes(updatedVotes)
    localStorage.setItem('vibes-votes', JSON.stringify(updatedVotes))

    // Try to save to database (optional - won't block UI)
    if (user) {
      try {
        if (hasVoted) {
          await supabase.from('vibes_votes').delete().eq('user_id', user.id).eq('item_id', songId)
        } else {
          await supabase.from('vibes_votes').insert({ user_id: user.id, item_id: songId })
        }
      } catch (e) {
        // Silently fail - localStorage has the data
      }
    }

    setVoting(null)
  }

  // Sort by votes
  const sortedSongs = [...songs].sort((a, b) => b.vote_count - a.vote_count)
  const totalVotes = songs.reduce((sum, s) => sum + s.vote_count, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-slate-400">Loading vibes...</div>
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
      <header className="text-center mb-8">
        <div className="text-5xl mb-4">🎵</div>
        <h1 className="text-3xl font-bold text-white mb-2">Village Vibes</h1>
        <p className="text-slate-400">
          Vote for today's anthem! What's the expat community vibing to?
        </p>
      </header>

      {/* Today's Theme */}
      <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-700/50 rounded-xl p-6 mb-8 text-center">
        <p className="text-purple-300 text-sm uppercase tracking-wide mb-2">Today's Theme</p>
        <h2 className="text-2xl font-bold text-white">🇵🇱 Polish Bangers</h2>
        <p className="text-slate-400 mt-2">Songs that made us fall in love with Poland</p>
      </div>

      {/* Auth Notice */}
      {!isAuthenticated && (
        <div className="bg-amber-900/30 border border-amber-700/50 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-xl">🗳️</span>
            <div className="flex-1">
              <p className="text-amber-200 font-medium">Sign in to vote!</p>
              <p className="text-slate-400 text-sm">Join the community and make your voice heard.</p>
            </div>
            <button
              onClick={() => openAuthModal('sign_up')}
              className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Sign Up
            </button>
          </div>
        </div>
      )}

      {/* Voting Stats */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-slate-400">
          <span className="text-white font-semibold">{totalVotes}</span> votes today
        </div>
        <div className="text-slate-500 text-sm">
          Resets daily at midnight
        </div>
      </div>

      {/* Songs List */}
      <div className="space-y-3">
        {sortedSongs.map((song, index) => {
          const hasVoted = userVotes[song.id]
          const percentage = totalVotes > 0 ? Math.round((song.vote_count / totalVotes) * 100) : 0
          const isWinning = index === 0

          return (
            <div
              key={song.id}
              className={`relative bg-slate-800 border rounded-xl overflow-hidden transition-all ${
                hasVoted ? 'border-emerald-500' : 'border-slate-700 hover:border-slate-600'
              } ${isWinning ? 'ring-2 ring-yellow-500/50' : ''}`}
            >
              {/* Progress bar background */}
              <div
                className={`absolute inset-y-0 left-0 transition-all duration-500 ${
                  hasVoted ? 'bg-emerald-900/30' : 'bg-slate-700/30'
                }`}
                style={{ width: `${percentage}%` }}
              />

              <div className="relative p-4 flex items-center gap-4">
                {/* Rank */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  index === 0 ? 'bg-yellow-500 text-yellow-900' :
                  index === 1 ? 'bg-slate-400 text-slate-900' :
                  index === 2 ? 'bg-amber-600 text-amber-100' :
                  'bg-slate-700 text-slate-400'
                }`}>
                  {index + 1}
                </div>

                {/* Song Info */}
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold truncate ${hasVoted ? 'text-emerald-400' : 'text-white'}`}>
                    {song.title}
                  </h3>
                  <p className="text-slate-400 text-sm">{song.artist}</p>
                </div>

                {/* Vote Count */}
                <div className="text-right mr-2">
                  <div className="text-white font-bold">{song.vote_count}</div>
                  <div className="text-slate-500 text-xs">{percentage}%</div>
                </div>

                {/* Vote Button */}
                <button
                  onClick={() => handleVote(song.id)}
                  disabled={voting === song.id}
                  className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                    hasVoted
                      ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  } ${voting === song.id ? 'opacity-50' : ''}`}
                >
                  {voting === song.id ? '...' : hasVoted ? '✓ Voted' : 'Vote'}
                </button>
              </div>

              {/* Winning badge */}
              {isWinning && (
                <div className="absolute top-2 right-2">
                  <span className="bg-yellow-500 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">
                    🏆 LEADING
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* User's Voting Status */}
      {isAuthenticated && Object.keys(userVotes).length > 0 && (
        <div className="mt-6 bg-emerald-900/20 border border-emerald-700/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎉</span>
            <div>
              <p className="text-emerald-300 font-medium">You voted!</p>
              <p className="text-slate-400 text-sm">
                Thanks for sharing your vibe with the community.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Past Winners */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-white mb-4">🏆 Hall of Fame</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <p className="text-slate-500 text-xs uppercase tracking-wide">Last Week</p>
            <p className="text-white font-semibold mt-1">Gdzie jest biały węgorz?</p>
            <p className="text-slate-400 text-sm">Cypis • 847 votes</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <p className="text-slate-500 text-xs uppercase tracking-wide">Movie of the Month</p>
            <p className="text-white font-semibold mt-1">Zimna Wojna</p>
            <p className="text-slate-400 text-sm">Cold War • 623 votes</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <p className="text-slate-500 text-xs uppercase tracking-wide">Album of the Month</p>
            <p className="text-white font-semibold mt-1">Męskie Granie 2024</p>
            <p className="text-slate-400 text-sm">Various • 512 votes</p>
          </div>
        </div>
      </div>

      {/* Suggest a Song */}
      <div className="mt-8 text-center">
        <p className="text-slate-500 text-sm">
          Got a song that defines your Poland experience?
        </p>
        <button className="mt-2 text-emerald-400 hover:text-emerald-300 text-sm transition-colors">
          Suggest a song for tomorrow →
        </button>
      </div>
    </div>
  )
}

export default VillageVibes
