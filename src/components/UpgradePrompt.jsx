// src/components/UpgradePrompt.jsx
// Inline upgrade prompt for contextual upsells

import { Link } from 'react-router-dom'
import { useSubscription } from '../hooks/useSubscription'
import Icon from './Icon'
/**
 * UpgradePrompt - Contextual upgrade prompt
 *
 * @param {string} variant - 'inline', 'banner', or 'card'
 * @param {string} message - Custom message
 * @param {string} targetPlan - 'basic' or 'premium'
 */
function UpgradePrompt({
  variant = 'inline',
  message = 'Upgrade to unlock more features',
  targetPlan = 'premium',
  className = ''
}) {
  const { plan, loading } = useSubscription()

  // Don't show if already on target plan or higher
  const planOrder = ['free', 'basic', 'premium']
  if (loading || planOrder.indexOf(plan) >= planOrder.indexOf(targetPlan)) {
    return null
  }

  // Inline variant - minimal
  if (variant === 'inline') {
    return (
      <Link
        to="/pricing"
        className={`inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-white transition-colors ${className}`}
      >
        <Icon name="crown" className="w-4 h-4" />
        <span className="underline">{message}</span>
      </Link>
    )
  }

  // Banner variant - horizontal strip
  if (variant === 'banner') {
    return (
      <div className={`px-4 py-3 rounded-xl flex items-center justify-between glass-panel ${className}`}>
        <div className="flex items-center gap-2">
          <Icon name="crown" className="w-4 h-4 text-slate-200" />
          <span className="text-slate-300 text-sm">{message}</span>
        </div>
        <Link
          to="/pricing"
          className="px-4 py-1.5 rounded-lg glass-3d text-white text-sm font-medium transition-colors"
        >
          Upgrade
        </Link>
      </div>
    )
  }

  // Card variant - prominent
  return (
    <div className={`p-5 rounded-2xl glass-strong ${className}`}>
      <div className="flex items-start gap-4">
        <Icon name="crown" className="w-7 h-7 text-slate-200" />
        <div className="flex-1">
          <h4 className="text-white font-semibold mb-1">Upgrade to {targetPlan === 'premium' ? 'Premium' : 'Basic'}</h4>
          <p className="text-slate-400 text-sm mb-3">{message}</p>
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white text-sm transition-all glass-3d"
          >
            See Plans
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default UpgradePrompt


