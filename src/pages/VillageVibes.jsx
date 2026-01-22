import { Link } from 'react-router-dom'
import { useState } from 'react'

function VillageVibes() {
  const [activeTab, setActiveTab] = useState('song') // song, album, movie
  const [hasVotedSong, setHasVotedSong] = useState(false)
  const [hasVotedAlbum, setHasVotedAlbum] = useState(false)
  const [hasVotedMovie, setHasVotedMovie] = useState(false)
  const [votedSongId, setVotedSongId] = useState(null)
  const [votedAlbumId, setVotedAlbumId] = useState(null)
  const [votedMovieId, setVotedMovieId] = useState(null)

  // Current winners (would come from backend)
  const currentWinners = {
    song: {
      title: "APT.",
      artist: "ROSÉ & Bruno Mars",
      votes: 2847,
      theme: "pink",
      themeColors: "from-pink-900/40 to-purple-900/40",
      borderColor: "border-pink-700/50",
      artwork: "🎀",
      quote: "The Village chose romance today 💕"
    },
    album: {
      title: "GNX",
      artist: "Kendrick Lamar",
      votes: 1243,
      artwork: "🔥",
      month: "January 2026"
    },
    movie: {
      title: "Squid Game S2",
      type: "Series",
      votes: 3102,
      artwork: "🦑",
      month: "January 2026"
    }
  }

  // Song nominations for today
  const [songNominations, setSongNominations] = useState([
    { id: 1, title: "APT.", artist: "ROSÉ & Bruno Mars", votes: 2847, genre: "Pop", artwork: "🎀" },
    { id: 2, title: "Die With A Smile", artist: "Lady Gaga & Bruno Mars", votes: 2234, genre: "Ballad", artwork: "🌹" },
    { id: 3, title: "Luther", artist: "Kendrick Lamar ft. SZA", votes: 1987, genre: "Hip-Hop", artwork: "🎤" },
    { id: 4, title: "Taste", artist: "Sabrina Carpenter", votes: 1654, genre: "Pop", artwork: "☕" },
    { id: 5, title: "Birds of a Feather", artist: "Billie Eilish", votes: 1432, genre: "Alternative", artwork: "🪶" },
  ])

  // Album nominations for the month
  const [albumNominations, setAlbumNominations] = useState([
    { id: 1, title: "GNX", artist: "Kendrick Lamar", votes: 1243, genre: "Hip-Hop", artwork: "🔥" },
    { id: 2, title: "Brat", artist: "Charli XCX", votes: 1102, genre: "Pop", artwork: "💚" },
    { id: 3, title: "Hit Me Hard and Soft", artist: "Billie Eilish", votes: 987, genre: "Alternative", artwork: "💙" },
    { id: 4, title: "Short n' Sweet", artist: "Sabrina Carpenter", votes: 876, genre: "Pop", artwork: "🍒" },
    { id: 5, title: "COWBOY CARTER", artist: "Beyoncé", votes: 834, genre: "Country", artwork: "🤠" },
  ])

  // Movie/Series nominations for the month
  const [movieNominations, setMovieNominations] = useState([
    { id: 1, title: "Squid Game S2", type: "Series", votes: 3102, genre: "Thriller", artwork: "🦑" },
    { id: 2, title: "Nosferatu", type: "Movie", votes: 2456, genre: "Horror", artwork: "🧛" },
    { id: 3, title: "Severance S2", type: "Series", votes: 2134, genre: "Sci-Fi", artwork: "🧠" },
    { id: 4, title: "The Brutalist", type: "Movie", votes: 1876, genre: "Drama", artwork: "🏛️" },
    { id: 5, title: "Adolescence", type: "Series", votes: 1654, genre: "Drama", artwork: "📺" },
  ])

  const handleVoteSong = (id) => {
    if (hasVotedSong) return
    setSongNominations(prev => prev.map(song => 
      song.id === id ? { ...song, votes: song.votes + 1 } : song
    ).sort((a, b) => b.votes - a.votes))
    setVotedSongId(id)
    setHasVotedSong(true)
  }

  const handleVoteAlbum = (id) => {
    if (hasVotedAlbum) return
    setAlbumNominations(prev => prev.map(album => 
      album.id === id ? { ...album, votes: album.votes + 1 } : album
    ).sort((a, b) => b.votes - a.votes))
    setVotedAlbumId(id)
    setHasVotedAlbum(true)
  }

  const handleVoteMovie = (id) => {
    if (hasVotedMovie) return
    setMovieNominations(prev => prev.map(movie => 
      movie.id === id ? { ...movie, votes: movie.votes + 1 } : movie
    ).sort((a, b) => b.votes - a.votes))
    setVotedMovieId(id)
    setHasVotedMovie(true)
  }

  // Theme styles based on current winner
  const themeStyles = {
    pink: { bg: "from-pink-900/30 to-purple-900/30", border: "border-pink-700/50", accent: "text-pink-400" },
    green: { bg: "from-green-900/30 to-emerald-900/30", border: "border-green-700/50", accent: "text-green-400" },
    blue: { bg: "from-blue-900/30 to-indigo-900/30", border: "border-blue-700/50", accent: "text-blue-400" },
    orange: { bg: "from-orange-900/30 to-red-900/30", border: "border-orange-700/50", accent: "text-orange-400" },
    purple: { bg: "from-purple-900/30 to-violet-900/30", border: "border-purple-700/50", accent: "text-purple-400" },
  }

  const currentTheme = themeStyles[currentWinners.song.theme] || themeStyles.pink

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
          <span className="text-4xl">🎵</span>
          <div>
            <h1 className="text-3xl font-bold text-white">Village Vibes</h1>
            <p className="text-slate-400">The community picks the culture</p>
          </div>
        </div>
      </header>

      {/* Current Winners Banner */}
      <div className={`bg-gradient-to-r ${currentTheme.bg} ${currentTheme.border} border rounded-xl p-6 mb-8`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">🔥 Today's Vibe</h2>
          <span className="text-slate-400 text-sm">Voted by {currentWinners.song.votes.toLocaleString()} villagers</span>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-5xl">{currentWinners.song.artwork}</span>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white">{currentWinners.song.title}</h3>
            <p className={currentTheme.accent}>{currentWinners.song.artist}</p>
          </div>
          <div className="text-right">
            <span className="text-slate-500 text-sm block">Theme of the day</span>
            <span className={`${currentTheme.accent} font-medium capitalize`}>{currentWinners.song.theme} vibes</span>
          </div>
        </div>
        
        <p className="text-slate-400 text-sm mt-4 italic">"{currentWinners.song.quote}"</p>
      </div>

      {/* Monthly Winners */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">💿</span>
            <h3 className="font-semibold text-white">Album of the Month</h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{currentWinners.album.artwork}</span>
            <div>
              <p className="font-bold text-white">{currentWinners.album.title}</p>
              <p className="text-slate-400 text-sm">{currentWinners.album.artist}</p>
            </div>
          </div>
          <p className="text-slate-500 text-xs mt-3">{currentWinners.album.votes.toLocaleString()} votes • {currentWinners.album.month}</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🎬</span>
            <h3 className="font-semibold text-white">Watch of the Month</h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{currentWinners.movie.artwork}</span>
            <div>
              <p className="font-bold text-white">{currentWinners.movie.title}</p>
              <p className="text-slate-400 text-sm">{currentWinners.movie.type}</p>
            </div>
          </div>
          <p className="text-slate-500 text-xs mt-3">{currentWinners.movie.votes.toLocaleString()} votes • {currentWinners.movie.month}</p>
        </div>
      </div>

      {/* Vote Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('song')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'song' 
              ? 'bg-emerald-600 text-white' 
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          🎵 Song of the Day
        </button>
        <button
          onClick={() => setActiveTab('album')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'album' 
              ? 'bg-emerald-600 text-white' 
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          💿 Album of the Month
        </button>
        <button
          onClick={() => setActiveTab('movie')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'movie' 
              ? 'bg-emerald-600 text-white' 
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          🎬 Movie/Series
        </button>
      </div>

      {/* Song Voting */}
      {activeTab === 'song' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Vote for Tomorrow's Vibe</h2>
            {hasVotedSong && (
              <span className="text-emerald-400 text-sm">✓ You voted!</span>
            )}
          </div>
          <p className="text-slate-400 text-sm mb-6">
            Voting ends at midnight. Winner sets the Village theme for tomorrow!
          </p>
          <div className="space-y-3">
            {songNominations.map((song, index) => (
              <div 
                key={song.id}
                className={`bg-slate-800 border rounded-xl p-4 transition-all ${
                  votedSongId === song.id 
                    ? 'border-emerald-500 bg-emerald-900/20' 
                    : 'border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl w-8 text-center">
                    {index === 0 ? '👑' : song.artwork}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white">{song.title}</h3>
                      {index === 0 && (
                        <span className="text-xs bg-yellow-600 text-white px-2 py-0.5 rounded-full">Leading</span>
                      )}
                    </div>
                    <p className="text-slate-400 text-sm">{song.artist}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">{song.votes.toLocaleString()}</p>
                    <p className="text-slate-500 text-xs">votes</p>
                  </div>
                  <button
                    onClick={() => handleVoteSong(song.id)}
                    disabled={hasVotedSong}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      votedSongId === song.id
                        ? 'bg-emerald-600 text-white'
                        : hasVotedSong
                        ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                        : 'bg-slate-700 hover:bg-emerald-600 text-white'
                    }`}
                  >
                    {votedSongId === song.id ? '✓ Voted' : 'Vote'}
                  </button>
                </div>
                {/* Vote bar */}
                <div className="mt-3 w-full bg-slate-700 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full transition-all ${
                      index === 0 ? 'bg-yellow-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${(song.votes / songNominations[0].votes) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Nominate */}
          <div className="mt-6 bg-slate-800/50 border border-dashed border-slate-700 rounded-xl p-6 text-center">
            <span className="text-2xl mb-2 block">💡</span>
            <p className="text-slate-400 mb-3">Don't see your vibe? Nominate a song!</p>
            <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors">
              + Nominate Song
            </button>
          </div>
        </div>
      )}

      {/* Album Voting */}
      {activeTab === 'album' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Vote for Album of the Month</h2>
            {hasVotedAlbum && (
              <span className="text-emerald-400 text-sm">✓ You voted!</span>
            )}
          </div>
          <p className="text-slate-400 text-sm mb-6">
            January 2026 voting. Winner gets featured all month!
          </p>
          <div className="space-y-3">
            {albumNominations.map((album, index) => (
              <div 
                key={album.id}
                className={`bg-slate-800 border rounded-xl p-4 transition-all ${
                  votedAlbumId === album.id 
                    ? 'border-emerald-500 bg-emerald-900/20' 
                    : 'border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl w-8 text-center">
                    {index === 0 ? '👑' : album.artwork}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white">{album.title}</h3>
                      {index === 0 && (
                        <span className="text-xs bg-yellow-600 text-white px-2 py-0.5 rounded-full">Leading</span>
                      )}
                    </div>
                    <p className="text-slate-400 text-sm">{album.artist} • {album.genre}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">{album.votes.toLocaleString()}</p>
                    <p className="text-slate-500 text-xs">votes</p>
                  </div>
                  <button
                    onClick={() => handleVoteAlbum(album.id)}
                    disabled={hasVotedAlbum}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      votedAlbumId === album.id
                        ? 'bg-emerald-600 text-white'
                        : hasVotedAlbum
                        ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                        : 'bg-slate-700 hover:bg-emerald-600 text-white'
                    }`}
                  >
                    {votedAlbumId === album.id ? '✓ Voted' : 'Vote'}
                  </button>
                </div>
                <div className="mt-3 w-full bg-slate-700 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full transition-all ${
                      index === 0 ? 'bg-yellow-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${(album.votes / albumNominations[0].votes) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Movie/Series Voting */}
      {activeTab === 'movie' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Vote for Watch of the Month</h2>
            {hasVotedMovie && (
              <span className="text-emerald-400 text-sm">✓ You voted!</span>
            )}
          </div>
          <p className="text-slate-400 text-sm mb-6">
            What should the Village be watching? Movies & Series welcome!
          </p>
          <div className="space-y-3">
            {movieNominations.map((movie, index) => (
              <div 
                key={movie.id}
                className={`bg-slate-800 border rounded-xl p-4 transition-all ${
                  votedMovieId === movie.id 
                    ? 'border-emerald-500 bg-emerald-900/20' 
                    : 'border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl w-8 text-center">
                    {index === 0 ? '👑' : movie.artwork}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white">{movie.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        movie.type === 'Series' ? 'bg-purple-600' : 'bg-blue-600'
                      } text-white`}>
                        {movie.type}
                      </span>
                      {index === 0 && (
                        <span className="text-xs bg-yellow-600 text-white px-2 py-0.5 rounded-full">Leading</span>
                      )}
                    </div>
                    <p className="text-slate-400 text-sm">{movie.genre}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">{movie.votes.toLocaleString()}</p>
                    <p className="text-slate-500 text-xs">votes</p>
                  </div>
                  <button
                    onClick={() => handleVoteMovie(movie.id)}
                    disabled={hasVotedMovie}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      votedMovieId === movie.id
                        ? 'bg-emerald-600 text-white'
                        : hasVotedMovie
                        ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                        : 'bg-slate-700 hover:bg-emerald-600 text-white'
                    }`}
                  >
                    {votedMovieId === movie.id ? '✓ Voted' : 'Vote'}
                  </button>
                </div>
                <div className="mt-3 w-full bg-slate-700 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full transition-all ${
                      index === 0 ? 'bg-yellow-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${(movie.votes / movieNominations[0].votes) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Watch Party Promo */}
          <div className="mt-6 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-700/50 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <span className="text-3xl">🍿</span>
              <div>
                <h3 className="font-semibold text-white mb-1">Watch Party This Saturday!</h3>
                <p className="text-slate-400 text-sm mb-3">
                  Join the Village at Cinema City Mokotów for Squid Game S2 screening. 47 villagers going!
                </p>
                <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                  Join Watch Party →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Village Stats */}
      <div className="mt-10 bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">📊 Village Culture Stats</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-emerald-400">8,247</p>
            <p className="text-slate-500 text-sm">Votes Today</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-400">127</p>
            <p className="text-slate-500 text-sm">Songs Nominated</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-400">31</p>
            <p className="text-slate-500 text-sm">Days This Month</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-400">K-Pop</p>
            <p className="text-slate-500 text-sm">Top Genre Jan</p>
          </div>
        </div>
      </div>

      {/* Past Winners */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-white mb-4">🏆 Recent Winners</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <p className="text-slate-500 text-xs mb-1">Yesterday</p>
            <p className="text-white font-medium">Die With A Smile</p>
            <p className="text-slate-400 text-sm">Gaga & Bruno</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <p className="text-slate-500 text-xs mb-1">2 days ago</p>
            <p className="text-white font-medium">Luther</p>
            <p className="text-slate-400 text-sm">Kendrick ft. SZA</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <p className="text-slate-500 text-xs mb-1">3 days ago</p>
            <p className="text-white font-medium">Taste</p>
            <p className="text-slate-400 text-sm">Sabrina Carpenter</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VillageVibes
