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
        className={`inline-flex items-center gap-1.5 text-sm text-terra-ink-soft hover:text-terra-ink transition-colors ${className}`}
      >
        <Icon name="crown" className="w-4 h-4 text-terra-primary" />
        <span className="underline">{message}</span>
      </Link>
    )
  }

  // Banner variant - horizontal strip
  if (variant === 'banner') {
    return (
      <div className={`px-4 py-3 rounded-xl flex items-center justify-between action-card texture-layer texture-paper ${className}`}>
        <div className="flex items-center gap-2">
          <Icon name="crown" className="w-4 h-4 text-terra-primary" />
          <span className="text-terra-ink-soft text-sm">{message}</span>
        </div>
        <Link
          to="/pricing"
          className="px-4 py-1.5 rounded-lg text-terra-bg text-sm font-medium transition-colors hover-tilt"
          style={{ background: 'linear-gradient(135deg, #C76B55, #D07C63)' }}
        >
          Upgrade
        </Link>
      </div>
    )
  }

  // Card variant - prominent
  return (
    <div className={`p-5 rounded-2xl hero-card texture-layer texture-paper ${className}`}>
      <div className="flex items-start gap-4">
        <Icon name="crown" className="w-7 h-7 text-terra-primary" />
        <div className="flex-1">
          <h4 className="text-terra-ink font-semibold mb-1">Upgrade to {targetPlan === 'premium' ? 'Premium' : 'Basic'}</h4>
          <p className="text-terra-ink-soft text-sm mb-3">{message}</p>
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-terra-bg text-sm transition-all hover-tilt"
            style={{ background: 'linear-gradient(135deg, #C76B55, #D07C63)' }}
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


