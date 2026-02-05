// src/pages/Settings.jsx
// User preferences and settings page

import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useSubscription } from '../hooks/useSubscription'
import { openCustomerPortal } from '../services/subscription'
import SubscriptionBadge from '../components/SubscriptionBadge'
import Icon from '../components/Icon'

const INTEREST_OPTIONS = [
  { id: 'events', label: 'Community Events', icon: 'calendar' },
  { id: 'housing', label: 'Housing & Rentals', icon: 'home' },
  { id: 'jobs', label: 'Jobs & Careers', icon: 'briefcase' },
  { id: 'legal', label: 'Legal & Visa', icon: 'document' },
  { id: 'health', label: 'Healthcare', icon: 'health' },
  { id: 'education', label: 'Education & Schools', icon: 'graduation' },
  { id: 'social', label: 'Social & Meetups', icon: 'community' },
  { id: 'food', label: 'Food & Restaurants', icon: 'utensils' },
  { id: 'transport', label: 'Transport & Travel', icon: 'train' },
  { id: 'finance', label: 'Finance & Banking', icon: 'briefcase' },
]

function Settings() {
  const navigate = useNavigate()
  const { user, profile, updateProfile, isAuthenticated } = useAuth()
  const { subscription, plan, loading: subLoading } = useSubscription()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState(null)
  const [portalLoading, setPortalLoading] = useState(false)

  const [trcExpiryDate, setTrcExpiryDate] = useState('')
  const [yearsInPoland, setYearsInPoland] = useState('')
  const [interests, setInterests] = useState([])
  const [reminderPrefs, setReminderPrefs] = useState({
    trcReminders: true,
    eventReminders: true,
    weeklyDigest: false,
  })

  useEffect(() => {
    if (profile) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTrcExpiryDate(profile.trc_expiry_date || '')
      setYearsInPoland(profile.years_in_poland?.toString() || '')
      setInterests(profile.interests || [])
      setReminderPrefs({
        trcReminders: profile.reminder_trc !== false,
        eventReminders: profile.reminder_events !== false,
        weeklyDigest: profile.reminder_weekly === true,
      })
    }
  }, [profile])

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const toggleInterest = (id) => {
    setInterests(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    )
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSaved(false)

    const updates = {
      trc_expiry_date: trcExpiryDate || null,
      years_in_poland: yearsInPoland ? parseInt(yearsInPoland) : null,
      interests: interests,
      reminder_trc: reminderPrefs.trcReminders,
      reminder_events: reminderPrefs.eventReminders,
      reminder_weekly: reminderPrefs.weeklyDigest,
      updated_at: new Date().toISOString(),
    }

    const { error: updateError } = await updateProfile(updates)

    if (updateError) {
      console.error('Failed to save settings:', updateError)
      setError('Failed to save settings. Please try again.')
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }

    setSaving(false)
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="max-w-lg mx-auto pb-8 space-y-8">
      <div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-terra-ink-soft hover:text-terra-ink mb-4 transition-colors"
        >
          <Icon name="arrowLeft" size={16} />
          Back
        </button>
        <h1 className="text-2xl font-bold text-terra-ink">Settings</h1>
        <p className="text-terra-ink-soft text-sm mt-1">
          Personalize your Expat Village experience
        </p>
      </div>

      <section>
        <h2 className="text-sm font-semibold text-terra-taupe uppercase tracking-wider mb-4 flex items-center gap-2">
          <Icon name="document" size={14} className="text-terra-taupe" /> Residence Permit (TRC)
        </h2>
        <div className="action-card texture-layer texture-paper">
          <label className="block text-sm text-terra-ink mb-2">
            TRC Expiry Date
          </label>
          <input
            type="date"
            value={trcExpiryDate}
            onChange={(e) => setTrcExpiryDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-terra-cream border border-black/10 text-terra-ink focus:outline-none focus:border-terra-primary transition-colors"
          />
          <p className="text-xs text-terra-taupe mt-2">
            We will remind you 60, 45, and 30 days before expiry
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-terra-taupe uppercase tracking-wider mb-4 flex items-center gap-2">
          <Icon name="globe" size={14} className="text-terra-taupe" /> Experience Level
        </h2>
        <div className="action-card texture-layer texture-paper">
          <label className="block text-sm text-terra-ink mb-2">
            How long have you been in Poland?
          </label>
          <select
            value={yearsInPoland}
            onChange={(e) => setYearsInPoland(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-terra-cream border border-black/10 text-terra-ink focus:outline-none focus:border-terra-primary transition-colors"
          >
            <option value="">Select...</option>
            <option value="0">Just arrived (less than 1 year)</option>
            <option value="1">1-2 years</option>
            <option value="3">3-5 years</option>
            <option value="5">5+ years</option>
            <option value="10">10+ years (veteran)</option>
          </select>
          <p className="text-xs text-terra-taupe mt-2">
            This helps us show you relevant content
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-terra-taupe uppercase tracking-wider mb-4 flex items-center gap-2">
          <Icon name="star" size={14} className="text-terra-taupe" /> Your Interests
        </h2>
        <p className="text-xs text-terra-taupe mb-4">
          Select topics you want to see updates about
        </p>
        <div className="grid grid-cols-2 gap-2">
          {INTEREST_OPTIONS.map((option) => {
            const isSelected = interests.includes(option.id)
            return (
              <button
                key={option.id}
                onClick={() => toggleInterest(option.id)}
                className={`flex items-center gap-2 px-3 py-3 rounded-xl transition-all text-left ${
                  isSelected ? 'glass-strong ring-1 ring-terra-primary/30' : 'glass-panel'
                }`}
              >
                <Icon name={option.icon} size={16} className="text-terra-ink" />
                <span className={`text-sm ${isSelected ? 'text-terra-ink' : 'text-terra-ink-soft'}`}>
                  {option.label}
                </span>
                {isSelected && (
                  <Icon name="success" size={14} className="text-terra-sage ml-auto" />
                )}
              </button>
            )
          })}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-terra-taupe uppercase tracking-wider mb-4 flex items-center gap-2">
          <Icon name="bell" size={14} className="text-terra-taupe" /> Notifications
        </h2>
        <div className="space-y-3">
          {[
            { key: 'trcReminders', label: 'TRC expiry reminders', desc: 'Get notified before your permit expires' },
            { key: 'eventReminders', label: 'Event reminders', desc: 'Updates about community events' },
            { key: 'weeklyDigest', label: 'Weekly digest', desc: 'Summary of what you missed' },
          ].map((pref) => (
            <div
              key={pref.key}
              className="flex items-center justify-between p-4 rounded-xl action-card texture-layer texture-paper"
            >
              <div>
                <p className="text-sm text-terra-ink">{pref.label}</p>
                <p className="text-xs text-terra-taupe">{pref.desc}</p>
              </div>
              <button
                onClick={() => setReminderPrefs(prev => ({
                  ...prev,
                  [pref.key]: !prev[pref.key]
                }))}
                className={`w-12 h-7 rounded-full transition-colors relative ${
                  reminderPrefs[pref.key] ? 'bg-terra-primary/30' : 'bg-terra-cream'
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-terra-bg rounded-full transition-transform ${
                    reminderPrefs[pref.key] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-terra-taupe uppercase tracking-wider mb-4 flex items-center gap-2">
          <Icon name="crown" size={14} className="text-terra-taupe" /> Subscription
        </h2>
        <div className="action-card texture-layer texture-paper">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-terra-ink font-medium">
                  {plan === 'free' ? 'Free Plan' : `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`}
                </p>
                <SubscriptionBadge />
              </div>
              {subscription?.current_period_end && (
                <p className="text-xs text-terra-taupe mt-1">
                  {subscription.status === 'active'
                    ? `Renews ${new Date(subscription.current_period_end).toLocaleDateString()}`
                    : `Expires ${new Date(subscription.current_period_end).toLocaleDateString()}`}
                </p>
              )}
            </div>
            {plan === 'free' ? (
              <Link
                to="/pricing"
                className="text-terra-bg px-4 py-2 rounded-lg text-sm font-medium transition-colors hover-tilt"
                style={{ background: 'linear-gradient(135deg, #C76B55, #D07C63)' }}
              >
                Upgrade
              </Link>
            ) : (
              <button
                onClick={async () => {
                  if (!user?.id) return
                  setPortalLoading(true)
                  const { data, error: portalError } = await openCustomerPortal(user.id)
                  if (data?.url) {
                    window.location.href = data.url
                  } else {
                    setError(portalError || 'Could not open subscription portal')
                  }
                  setPortalLoading(false)
                }}
                disabled={portalLoading || subLoading}
                className="text-terra-bg px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 hover-tilt"
                style={{ background: 'linear-gradient(135deg, #C76B55, #D07C63)' }}
              >
                {portalLoading ? 'Loading...' : 'Manage'}
              </button>
            )}
          </div>
          {plan !== 'free' && (
            <p className="text-xs text-terra-taupe">
              Manage your subscription, update payment methods, or cancel via the Stripe portal.
            </p>
          )}
        </div>
      </section>

      <div className="sticky bottom-20 pt-4">
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-100 border border-red-400/30 text-red-700 text-sm">
            {error}
          </div>
        )}
        {saved && (
          <div className="mb-4 p-3 rounded-xl action-card texture-layer texture-paper text-terra-sage text-sm flex items-center gap-2">
            <Icon name="success" size={16} className="text-terra-sage" />
            Settings saved
          </div>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-4 rounded-2xl font-semibold text-terra-bg transition-all disabled:opacity-50 hover-tilt"
          style={{ background: 'linear-gradient(135deg, #C76B55, #D07C63)' }}
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <section className="mt-8 pt-8 border-t border-black/10">
        <h2 className="text-sm font-semibold text-terra-taupe uppercase tracking-wider mb-4">
          Account
        </h2>
        <div className="action-card texture-layer texture-paper rounded-xl p-4">
          <p className="text-sm text-terra-taupe">Signed in as</p>
          <p className="text-terra-ink">{user?.email}</p>
        </div>
      </section>
    </div>
  )
}

export default Settings
