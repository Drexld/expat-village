// src/pages/MyChecklist.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import Icon from '../components/Icon'

function MyChecklist() {
  const { user, isAuthenticated, openAuthModal } = useAuth()
  const [checkedItems, setCheckedItems] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const categories = [
    {
      id: 'first-week',
      title: 'First Week in Poland',
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
      title: 'First Month Essentials',
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
      title: 'Settling In',
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
      title: 'Long-term Goals',
      tasks: [
        { id: 'polish-lessons', label: 'Start Polish language lessons', guide: null },
        { id: 'driving-license', label: 'Get Polish driving license (if needed)', guide: '/getting-around' },
        { id: 'apartment-own', label: 'Find your own apartment', guide: '/housing' },
        { id: 'build-network', label: 'Build professional network', guide: '/jobs-careers' },
        { id: 'travel-poland', label: 'Explore Poland (Krakow, Gdansk, etc.)', guide: null },
      ]
    }
  ]

  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      const saved = localStorage.getItem('expat-checklist')
      if (saved && isMounted) {
        try {
          setCheckedItems(JSON.parse(saved))
        } catch {
          console.log('Could not parse localStorage checklist')
        }
      }

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
            localStorage.setItem('expat-checklist', JSON.stringify(checked))
          }
        } catch {
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
    localStorage.setItem('expat-checklist', JSON.stringify(newChecked))

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
      } catch {
        console.log('Saved to localStorage only')
      } finally {
        setSaving(false)
      }
    }
  }

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
    <div className="min-h-screen space-y-8">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
        <Icon name="arrowLeft" size={16} />
        Back to Home
      </Link>

      <header className="glass-panel rounded-3xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="glass-panel flex h-12 w-12 items-center justify-center rounded-2xl">
            <Icon name="checklist" size={22} className="text-slate-100" />
          </div>
          <h1 className="text-3xl font-semibold text-white">My Checklist</h1>
          {saving && <span className="text-emerald-200 text-sm animate-pulse">Saving...</span>}
        </div>
        <p className="text-slate-400 text-lg">
          Track your expat journey. Check off tasks as you complete them.
        </p>
      </header>

      {!isAuthenticated && (
        <div className="glass-panel rounded-2xl p-4 border border-amber-500/30">
          <div className="flex items-start gap-3">
            <div className="glass-panel flex h-10 w-10 items-center justify-center rounded-xl">
              <Icon name="warning" size={18} className="text-amber-200" />
            </div>
            <div>
              <p className="text-amber-200 font-medium">Sign in to save your progress</p>
              <p className="text-slate-400 text-sm mt-1">
                Your checklist is saved locally, but signing in syncs it across devices.
              </p>
              <button
                onClick={() => openAuthModal('sign_up')}
                className="mt-3 rounded-full border border-amber-400/40 bg-amber-500/20 px-4 py-1.5 text-sm text-amber-100 hover:bg-amber-500/30"
              >
                Sign Up Free
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="glass-3d rounded-3xl p-6 hover-tilt">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Your Progress</h3>
          <span className="text-2xl font-semibold text-emerald-200">{progressPercent}%</span>
        </div>
        <div className="h-4 bg-slate-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-slate-400 text-sm mt-2">
          {completedTasks} of {totalTasks} tasks completed
        </p>
      </div>

      <div className="space-y-6">
        {categories.map((category) => {
          const categoryCompleted = category.tasks.filter(t => checkedItems[t.id]).length
          const categoryTotal = category.tasks.length

          return (
            <div key={category.id} className="glass-panel rounded-2xl overflow-hidden border border-white/10">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">{category.title}</h2>
                <span className="text-sm text-slate-400">
                  {categoryCompleted}/{categoryTotal}
                </span>
              </div>

              <div className="divide-y divide-white/5">
                {category.tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 flex items-center gap-4 transition-colors ${
                      checkedItems[task.id] ? 'bg-emerald-900/10' : 'hover:bg-white/5'
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
                        className="text-emerald-200 hover:text-emerald-100 text-sm transition-colors inline-flex items-center gap-1"
                      >
                        Guide <Icon name="arrowRight" size={12} />
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="text-center text-slate-500 text-sm">
        Every checked box is a step toward feeling at home.
      </div>
    </div>
  )
}

export default MyChecklist
