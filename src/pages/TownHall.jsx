import { Link } from 'react-router-dom'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import {
  getTownHallRooms,
  joinRoomConversation,
  getConversationMessages,
  sendMessage,
  subscribeToMessages,
  unsubscribeFromChannel
} from '../services/townhall'

function TownHall() {
  const { user, isAuthenticated, openAuthModal } = useAuth()
  const [activeView, setActiveView] = useState('main') // main, room
  const [activeRoom, setActiveRoom] = useState(null)
  const [rooms, setRooms] = useState([])
  const [roomsLoading, setRoomsLoading] = useState(true)
  const [roomsError, setRoomsError] = useState(null)
  const [messages, setMessages] = useState([])
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [messageInput, setMessageInput] = useState('')
  const [sending, setSending] = useState(false)
  const channelRef = useRef(null)

  const activityLabel = useMemo(() => ({
    very_active: { label: 'Very Active', color: 'text-green-400' },
    active: { label: 'Active', color: 'text-blue-400' },
    moderate: { label: 'Moderate', color: 'text-yellow-400' },
    quiet: { label: 'Quiet', color: 'text-slate-400' },
  }), [])

  useEffect(() => {
    let isMounted = true
    async function loadRooms() {
      setRoomsLoading(true)
      const { data, error } = await getTownHallRooms()
      if (!isMounted) return
      if (error) {
        setRoomsError('Could not load rooms')
      } else {
        setRooms(data)
      }
      setRoomsLoading(false)
    }
    loadRooms()
    return () => { isMounted = false }
  }, [])

  useEffect(() => {
    if (!activeRoom?.conversation_id) return

    let isMounted = true
    async function loadMessages() {
      setMessagesLoading(true)
      const { data } = await getConversationMessages(activeRoom.conversation_id, 100)
      if (!isMounted) return
      setMessages(data)
      setMessagesLoading(false)
    }

    loadMessages()

    if (channelRef.current) {
      unsubscribeFromChannel(channelRef.current)
      channelRef.current = null
    }

    channelRef.current = subscribeToMessages(activeRoom.conversation_id, (msg) => {
      setMessages((prev) => {
        if (prev.find((m) => m.id === msg.id)) return prev
        return [...prev, msg]
      })
    })

    return () => {
      isMounted = false
      if (channelRef.current) {
        unsubscribeFromChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [activeRoom?.conversation_id])

  const handleJoinRoom = async (room) => {
    if (!isAuthenticated) {
      openAuthModal('sign_up')
      return
    }

    if (!room?.conversation_id) return
    await joinRoomConversation(room.conversation_id, user.id)
    setActiveRoom(room)
    setActiveView('room')
  }

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !activeRoom?.conversation_id) return
    if (!isAuthenticated) {
      openAuthModal('sign_up')
      return
    }

    setSending(true)
    const { error } = await sendMessage(activeRoom.conversation_id, user.id, messageInput)
    if (!error) {
      setMessageInput('')
    }
    setSending(false)
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

      {/* Community Rooms */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">💬 Community Rooms</h2>

        {roomsLoading ? (
          <div className="p-6 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 text-sm">
            Loading rooms...
          </div>
        ) : roomsError ? (
          <div className="p-6 rounded-xl bg-red-900/30 border border-red-700/50 text-red-300 text-sm">
            {roomsError}
          </div>
        ) : rooms.length === 0 ? (
          <div className="p-6 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 text-sm">
            No rooms available yet.
          </div>
        ) : (
          <div className="space-y-2">
            {rooms.map((room) => {
              const activity = activityLabel[room.activity_level] || activityLabel.active
              return (
                <button
                  key={room.id}
                  onClick={() => handleJoinRoom(room)}
                  className="w-full text-left bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-slate-600 rounded-xl p-4 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <span className="text-2xl">{room.icon || '💬'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                          {room.title}
                        </h3>
                        <span className={`text-xs ${activity.color}`}>● {activity.label}</span>
                      </div>
                      <p className="text-slate-500 text-sm truncate">
                        {room.description || 'Join the conversation'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-500 text-xs">Live chat</p>
                      <p className="text-slate-600 text-xs">Tap to join</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
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
          <span className="text-3xl">{activeRoom?.icon || '💬'}</span>
          <div>
            <h1 className="text-xl font-bold text-white">{activeRoom?.title}</h1>
            <p className="text-slate-400 text-sm">
              {activeRoom?.description || 'Live room'}
            </p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-slate-900 border-x border-slate-700 p-4 overflow-y-auto">
        {messagesLoading ? (
          <div className="text-center text-slate-400">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center">
            <span className="text-5xl mb-3 block">💬</span>
            <p className="text-slate-400">No messages yet. Start the conversation.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => {
              const senderName =
                msg.profiles?.display_name ||
                msg.profiles?.email?.split('@')[0] ||
                'Member'
              const isOwn = msg.sender_id === user?.id
              return (
                <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-xl px-3 py-2 text-sm ${
                    isOwn ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-200'
                  }`}>
                    {!isOwn && (
                      <p className="text-xs text-slate-400 mb-1">{senderName}</p>
                    )}
                    <p className="whitespace-pre-line">{msg.content}</p>
                    <p className="text-[10px] text-slate-300/70 mt-1">
                      {new Date(msg.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-slate-800 border border-slate-700 rounded-b-xl p-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder={isAuthenticated ? 'Send a message...' : 'Sign up to send messages...'}
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={!isAuthenticated || sending}
            className={`flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 placeholder-slate-500 ${
              !isAuthenticated ? 'text-slate-400 cursor-not-allowed' : 'text-white'
            }`}
          />
          <button
            onClick={handleSendMessage}
            disabled={!isAuthenticated || sending || !messageInput.trim()}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {sending ? 'Sending...' : 'Send'}
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
      {activeView === 'room' && renderRoom()}
    </div>
  )
}

export default TownHall
