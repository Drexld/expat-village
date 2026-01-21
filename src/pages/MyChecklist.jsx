import { Link } from 'react-router-dom'
import { useState } from 'react'

function MyChecklist() {
  // In real app, this would come from user's saved data
  const [tasks, setTasks] = useState([
    // URGENT - First Week
    { id: 1, title: 'Get a Polish SIM card', category: 'urgent', required: true, completed: true, link: '/getting-around', note: 'Play, Orange, or Plus - all have English support' },
    { id: 2, title: 'Open a bank account', category: 'urgent', required: true, completed: true, link: '/get-things-done', note: 'Millennium or mBank recommended for expats' },
    { id: 3, title: 'Register your address (zameldowanie)', category: 'urgent', required: true, completed: false, link: '/get-things-done', note: 'Needed for PESEL - ask landlord for help' },
    { id: 4, title: 'Get your PESEL number', category: 'urgent', required: true, completed: false, link: '/get-things-done', note: 'Apply at Urząd Miasta - bring passport + lease' },
    
    // IMPORTANT - First Month
    { id: 5, title: 'Sign up for health insurance', category: 'important', required: true, completed: false, link: '/insurance-health', note: 'NFZ through employer or private (Medicover, LuxMed)' },
    { id: 6, title: 'Get a transport card', category: 'important', required: false, completed: true, link: '/getting-around', note: 'Monthly pass saves money if you commute daily' },
    { id: 7, title: 'Understand your rental contract', category: 'important', required: true, completed: false, link: '/housing', note: 'Use our Contract Analyzer tool' },
    { id: 8, title: 'Set up Jakdojade app', category: 'important', required: false, completed: true, link: '/getting-around', note: 'Best app for public transport in Poland' },
    { id: 9, title: 'Register for ZUS (if employed)', category: 'important', required: true, completed: false, link: '/get-things-done', note: 'Employer usually handles this' },
    { id: 10, title: 'Get NIP number (if freelancing)', category: 'important', required: false, completed: false, link: '/jobs-careers', note: 'Needed for B2B contracts' },
    
    // SETTLING IN - First 3 Months
    { id: 11, title: 'Apply for residency permit', category: 'settling', required: true, completed: false, link: '/get-things-done', note: 'If staying longer than 90 days (non-EU)' },
    { id: 12, title: 'Find a doctor/clinic', category: 'settling', required: false, completed: false, link: '/insurance-health', note: 'English-speaking doctors in directory' },
    { id: 13, title: 'Find a gym or fitness option', category: 'settling', required: false, completed: false, link: '/live-your-life', note: 'MultiSport card is great value' },
    { id: 14, title: 'Explore your neighborhood', category: 'settling', required: false, completed: false, link: '/live-your-life', note: 'Find your local Żabka, pharmacy, restaurants' },
    { id: 15, title: 'Join expat community events', category: 'settling', required: false, completed: false, link: '/town-hall', note: 'Check Town Hall for live sessions & meetups' },
    { id: 16, title: 'Start learning basic Polish', category: 'settling', required: false, completed: false, link: '/live-your-life', note: 'Even basics help a lot - Duolingo or italki' },
    { id: 17, title: 'Set up Polish streaming (Netflix/HBO)', category: 'settling', required: false, completed: false, link: null, note: 'Polish content helps with language learning' },
    
    // LONG TERM - First Year
    { id: 18, title: 'File your first Polish tax return', category: 'longterm', required: true, completed: false, link: '/jobs-careers', note: 'PIT deadline is April 30th' },
    { id: 19, title: 'Consider private health insurance', category: 'longterm', required: false, completed: false, link: '/insurance-health', note: 'Medicover, LuxMed, Enel-Med packages' },
    { id: 20, title: 'Build your professional network', category: 'longterm', required: false, completed: false, link: '/town-hall', note: 'LinkedIn Poland, expat meetups, industry events' },
    { id: 21, title: 'Open a savings account', category: 'longterm', required: false, completed: false, link: '/get-things-done', note: 'Consider PKO or foreign options' },
    { id: 22, title: 'Get home/renters insurance', category: 'longterm', required: false, completed: false, link: '/insurance-health', note: 'Protects your belongings' },
  ])

  const [activeFilter, setActiveFilter] = useState('all')
  const [showCompleted, setShowCompleted] = useState(true)

  const toggleTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ))
  }

  const categories = {
    urgent: { label: '🔴 First Week', color: 'red', description: 'Do these ASAP' },
    important: { label: '🟠 First Month', color: 'orange', description: 'Important but not urgent' },
    settling: { label: '🟡 First 3 Months', color: 'yellow', description: 'Getting comfortable' },
    longterm: { label: '🟢 First Year', color: 'green', description: 'Long-term setup' },
  }

  const filteredTasks = tasks.filter(task => {
    if (activeFilter !== 'all' && task.category !== activeFilter) return false
    if (!showCompleted && task.completed) return false
    return true
  })

  const completedCount = tasks.filter(t => t.completed).length
  const totalCount = tasks.length
  const progressPercent = Math.round((completedCount / totalCount) * 100)

  const requiredRemaining = tasks.filter(t => t.required && !t.completed).length
  const urgentRemaining = tasks.filter(t => t.category === 'urgent' && !t.completed).length

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
          <span className="text-4xl">✅</span>
          <div>
            <h1 className="text-3xl font-bold text-white">My Checklist</h1>
            <p className="text-slate-400">Your personal "New to Poland" tracker</p>
          </div>
        </div>
      </header>

      {/* Progress Card */}
      <div className="bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border border-emerald-700/50 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">{progressPercent}% Complete</h2>
            <p className="text-emerald-300">{completedCount} of {totalCount} tasks done</p>
          </div>
          <div className="text-right">
            {urgentRemaining > 0 ? (
              <p className="text-red-400 font-medium">🔴 {urgentRemaining} urgent tasks remaining</p>
            ) : (
              <p className="text-green-400 font-medium">✅ All urgent tasks complete!</p>
            )}
            {requiredRemaining > 0 && (
              <p className="text-orange-400 text-sm">{requiredRemaining} required tasks left</p>
            )}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        
        {/* Category Progress */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          {Object.entries(categories).map(([key, cat]) => {
            const catTasks = tasks.filter(t => t.category === key)
            const catDone = catTasks.filter(t => t.completed).length
            return (
              <div key={key} className="text-center">
                <p className="text-2xl">{cat.label.split(' ')[0]}</p>
                <p className="text-slate-300 text-sm">{catDone}/{catTasks.length}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Alerts */}
      {urgentRemaining > 0 && (
        <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="font-semibold text-red-400">Priority Tasks Need Attention</h3>
              <p className="text-slate-300 text-sm">
                You have {urgentRemaining} urgent task{urgentRemaining > 1 ? 's' : ''} in your first week checklist. 
                These are critical for settling in!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeFilter === 'all' 
                ? 'bg-emerald-600 text-white' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Tasks
          </button>
          {Object.entries(categories).map(([key, cat]) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeFilter === key 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        
        <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
          <input 
            type="checkbox" 
            checked={showCompleted}
            onChange={() => setShowCompleted(!showCompleted)}
            className="w-4 h-4 rounded"
          />
          Show completed
        </label>
      </div>

      {/* Task Lists by Category */}
      {activeFilter === 'all' ? (
        Object.entries(categories).map(([categoryKey, category]) => {
          const categoryTasks = filteredTasks.filter(t => t.category === categoryKey)
          if (categoryTasks.length === 0) return null
          
          return (
            <section key={categoryKey} className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-lg font-semibold text-white">{category.label}</h2>
                <span className="text-slate-500 text-sm">— {category.description}</span>
              </div>
              <div className="space-y-2">
                {categoryTasks.map((task) => (
                  <TaskItem key={task.id} task={task} onToggle={toggleTask} />
                ))}
              </div>
            </section>
          )
        })
      ) : (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-lg font-semibold text-white">{categories[activeFilter].label}</h2>
            <span className="text-slate-500 text-sm">— {categories[activeFilter].description}</span>
          </div>
          <div className="space-y-2">
            {filteredTasks.map((task) => (
              <TaskItem key={task.id} task={task} onToggle={toggleTask} />
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <span className="text-6xl mb-4 block">🎉</span>
          <h3 className="text-xl font-semibold text-white mb-2">
            {showCompleted ? 'No tasks here!' : 'All tasks completed!'}
          </h3>
          <p className="text-slate-400">
            {showCompleted 
              ? 'Select a different category to see more tasks.' 
              : 'Amazing work! Toggle "Show completed" to see your progress.'}
          </p>
        </div>
      )}

      {/* Add Custom Task */}
      <div className="mt-8 bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-3">➕ Add Your Own Task</h3>
        <p className="text-slate-400 text-sm mb-4">
          Got something specific you need to do? Add it to your checklist.
        </p>
        <div className="flex gap-3">
          <input 
            type="text" 
            placeholder="e.g., Find a good barber near Mokotow"
            className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg transition-colors">
            Add Task
          </button>
        </div>
      </div>

      {/* Share Progress */}
      <div className="mt-6 bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
        <p className="text-slate-400 mb-3">Share your progress and help other expats!</p>
        <button className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-lg transition-colors">
          📤 Share My Progress
        </button>
      </div>
    </div>
  )
}

// Task Item Component
function TaskItem({ task, onToggle }) {
  return (
    <div 
      className={`bg-slate-800 border rounded-xl p-4 transition-all ${
        task.completed 
          ? 'border-slate-700 opacity-60' 
          : task.required 
            ? 'border-emerald-700/50' 
            : 'border-slate-700'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(task.id)}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
            task.completed
              ? 'bg-emerald-600 border-emerald-600 text-white'
              : 'border-slate-500 hover:border-emerald-500'
          }`}
        >
          {task.completed && (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-medium ${task.completed ? 'text-slate-400 line-through' : 'text-white'}`}>
              {task.title}
            </h3>
            {task.required && !task.completed && (
              <span className="bg-emerald-900/50 text-emerald-400 text-xs px-2 py-0.5 rounded">Required</span>
            )}
          </div>
          <p className="text-slate-500 text-sm">{task.note}</p>
        </div>
        
        {/* Link */}
        {task.link && !task.completed && (
          <Link
            to={task.link}
            className="text-emerald-400 hover:text-emerald-300 text-sm whitespace-nowrap"
          >
            Learn more →
          </Link>
        )}
      </div>
    </div>
  )
}

export default MyChecklist
