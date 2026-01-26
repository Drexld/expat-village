// src/pages/MyChecklist.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

function MyChecklist() {
  const { user, isAuthenticated, openAuthModal } = useAuth()
  const [checkedItems, setCheckedItems] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const categories = [
    {
      id: 'first-week',
      title: '🚀 First Week in Poland',
      tasks: [
        { id: 'sim-card', label: 'Get a Polish SIM card', guide: '/get-things-done' },
        { id: 'bank-account', label: 'Open a bank account', guide: '/get-things-done' },
        { id: 'transport-card', label: 'Get a transport card', guide: '/getting-around' },
        { id: 'grocery-store', label: 'Find your local grocery store', guide: '/live-your-life' },
        { id: 'neighborhood', label: 'Explore your neighborhood', guide: null },
      ]
    },
    {
      id: 'first-month',
      title: '📋 First Month Essentials',
      tasks: [
        { id: 'pesel', label: 'Get your PESEL number', guide: '/get-things-done' },
        { id: 'zameldowanie', label: 'Register your address (Zameldowanie)', guide: '/get-things-done' },
        { id: 'health-insurance', label: 'Sort out health insurance', guide: '/insurance-health' },
        { id: 'polish-basics', label: 'Learn basic Polish phrases', guide: null },
        { id: 'expat-groups', label: 'Join expat communities', guide: '/town-hall' },
        { id: 'emergency-numbers', label: 'Save emergency numbers', guide: null },
      ]
    },
    {
      id: 'settling-in',
      title: '🏠 Settling In',
      tasks: [
        { id: 'residence-permit', label: 'Apply for residence permit (if needed)', guide: '/get-things-done' },
        { id: 'tax-number', label: 'Get your NIP (tax number)', guide: '/get-things-done' },
        { id: 'doctor', label: 'Find an English-speaking doctor', guide: '/insurance-health' },
        { id: 'dentist', label: 'Find a dentist', guide: '/insurance-health' },
        { id: 'gym', label: 'Join a gym or fitness activity', guide: '/live-your-life' },
        { id: 'social-hobby', label: 'Find a social hobby or group', guide: '/live-your-life' },
      ]
    },
    {
      id: 'long-term',
      title: '🎯 Long-term Goals',
      tasks: [
        { id: 'polish-lessons', label: 'Start Polish language lessons', guide: null },
        { id: 'driving-license', label: 'Get Polish driving license (if needed)', guide: '/getting-around' },
        { id: 'apartment-own', label: 'Find your own apartment', guide: '/housing' },
        { id: 'build-network', label: 'Build professional network', guide: '/jobs-careers' },
        { id: 'travel-poland', label: 'Explore Poland (Kraków, Gdańsk, etc.)', guide: null },
      ]
    }
  ]

  // Load checklist - with proper error handling
  useEffect(() => {
    let isMounted = true
    
    const loadData = async () => {
      // Always start by loading from localStorage
      const saved = localStorage.getItem('expat-checklist')
      if (saved && isMounted) {
        try {
          setCheckedItems(JSON.parse(saved))
        } catch (e) {
          console.log('Could not parse localStorage checklist')
        }
      }

      // If authenticated, try to load from database
      if (isAuthenticated && user) {
        try {
          const { data, error } = await supabase
            .from('checklist_progress')
            .select('task_id, completed')
            .eq('user_id', user.id)

          if (!error && data && isMounted) {
            const checked = {}
            data.forEach(item => {
              if (item.completed) {
                checked[item.task_id] = true
              }
            })
            setCheckedItems(checked)
            // Also save to localStorage as backup
            localStorage.setItem('expat-checklist', JSON.stringify(checked))
          }
        } catch (error) {
          // Silently fail - just use localStorage data
          console.log('Using localStorage checklist (db unavailable)')
        }
      }

      if (isMounted) {
        setLoading(false)
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [isAuthenticated, user])

  const toggleTask = async (taskId) => {
    const newChecked = { ...checkedItems }
    const isNowChecked = !newChecked[taskId]
    
    if (isNowChecked) {
      newChecked[taskId] = true
    } else {
      delete newChecked[taskId]
    }
    
    setCheckedItems(newChecked)
    
    // Always save to localStorage first
    localStorage.setItem('expat-checklist', JSON.stringify(newChecked))

    // If authenticated, also save to database
    if (isAuthenticated && user) {
      setSaving(true)
      try {
        if (isNowChecked) {
          await supabase
            .from('checklist_progress')
            .upsert({
              user_id: user.id,
              task_id: taskId,
              completed: true,
              completed_at: new Date().toISOString()
            }, {
              onConflict: 'user_id,task_id'
            })
        } else {
          await supabase
            .from('checklist_progress')
            .update({ completed: false, completed_at: null })
            .eq('user_id', user.id)
            .eq('task_id', taskId)
        }
      } catch (error) {
        console.log('Saved to localStorage only')
      } finally {
        setSaving(false)
      }
    }
  }

  // Calculate progress
  const totalTasks = categories.reduce((sum, cat) => sum + cat.tasks.length, 0)
  const completedTasks = Object.keys(checkedItems).length
  const progressPercent = Math.round((completedTasks / totalTasks) * 100)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-slate-400">Loading your checklist...</div>
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

      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">✅</span>
          <h1 className="text-3xl font-bold text-white">My Checklist</h1>
          {saving && <span className="text-emerald-400 text-sm animate-pulse">Saving...</span>}
        </div>
        <p className="text-slate-400 text-lg">
          Track your expat journey. Check off tasks as you complete them.
        </p>
      </header>

      {!isAuthenticated && (
        <div className="bg-amber-900/30 border border-amber-700/50 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div>
              <p className="text-amber-200 font-medium">Sign in to save your progress!</p>
              <p className="text-slate-400 text-sm mt-1">
                Your checklist is saved locally, but signing in syncs it across devices.
              </p>
              <button
                onClick={() => openAuthModal('sign_up')}
                className="mt-2 bg-amber-600 hover:bg-amber-500 text-white px-4 py-1.5 rounded-lg text-sm transition-colors"
              >
                Sign Up Free
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Your Progress</h3>
          <span className="text-2xl font-bold text-emerald-400">{progressPercent}%</span>
        </div>
        <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-slate-400 text-sm mt-2">
          {completedTasks} of {totalTasks} tasks completed
        </p>
      </div>

      {/* Categories */}
      <div className="space-y-6">
        {categories.map((category) => {
          const categoryCompleted = category.tasks.filter(t => checkedItems[t.id]).length
          const categoryTotal = category.tasks.length

          return (
            <div key={category.id} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">{category.title}</h2>
                <span className="text-sm text-slate-400">
                  {categoryCompleted}/{categoryTotal}
                </span>
              </div>

              <div className="divide-y divide-slate-700/50">
                {category.tasks.map((task) => (
                  <div 
                    key={task.id}
                    className={`p-4 flex items-center gap-4 transition-colors ${
                      checkedItems[task.id] ? 'bg-emerald-900/10' : 'hover:bg-slate-700/30'
                    }`}
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                        checkedItems[task.id]
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-slate-600 hover:border-emerald-500'
                      }`}
                    >
                      {checkedItems[task.id] && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>

                    <span className={`flex-1 ${
                      checkedItems[task.id] ? 'text-slate-400 line-through' : 'text-white'
                    }`}>
                      {task.label}
                    </span>

                    {task.guide && (
                      <Link
                        to={task.guide}
                        className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors"
                      >
                        Guide →
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-8 text-center text-slate-500 text-sm">
        <p>Every checked box is a step toward feeling at home. 💪</p>
      </div>
    </div>
  )
}

export default MyChecklist
