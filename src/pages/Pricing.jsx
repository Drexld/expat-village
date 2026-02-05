// src/pages/Pricing.jsx
// Premium tiers pricing page with Stripe Checkout integration

import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useSubscription } from '../hooks/useSubscription'
import { createCheckoutSession, PLAN_FEATURES } from '../services/subscription'

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    description: 'Perfect for getting started',
    features: PLAN_FEATURES.free.features,
    highlighted: false,
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 9,
    description: 'For active expats',
    features: PLAN_FEATURES.basic.features,
    highlighted: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 19,
    description: 'The complete experience',
    features: PLAN_FEATURES.premium.features,
    highlighted: true,
  },
]

function Pricing() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user, isAuthenticated, openAuthModal } = useAuth()
  const { plan: currentPlan, loading: subLoading } = useSubscription()
  const [loading, setLoading] = useState(null)
  const [error, setError] = useState(null)

  const canceled = searchParams.get('canceled')

  const handleSelectPlan = async (planId) => {
    console.log('Button clicked:', planId, { isAuthenticated, subLoading, currentPlan })

    if (planId === 'free') return

    if (!isAuthenticated) {
      openAuthModal('sign_up')
      return
    }

    setLoading(planId)
    setError(null)

    const { data, error: checkoutError } = await createCheckoutSession(
      planId,
      user.id,
      user.email
    )

    if (checkoutError) {
      setError(checkoutError)
      setLoading(null)
      return
    }

    // Redirect to Stripe Checkout
    if (data?.url) {
      // eslint-disable-next-line react-hooks/immutability
      window.location.href = data.url
    }
  }

  const isCurrentPlan = (planId) => currentPlan === planId
  const isUpgrade = (planId) => {
    const order = ['free', 'basic', 'premium']
    return order.indexOf(planId) > order.indexOf(currentPlan)
  }

  return (
    <div className="max-w-4xl mx-auto pb-24">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-terra-ink-soft hover:text-terra-ink mb-4 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h1 className="text-3xl font-bold text-terra-ink">Choose Your Plan</h1>
        <p className="text-terra-ink-soft text-lg mt-2">
          Unlock premium features to make the most of your expat journey
        </p>
      </div>

      {/* Canceled notice */}
      {canceled && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-100/60 border border-amber-300/60 text-amber-800">
          Checkout was canceled. Feel free to try again when you're ready.
        </div>
      )}

      {/* Error notice */}
      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-100/60 border border-rose-300/60 text-rose-700">
          {error}
        </div>
      )}

      {/* Pricing Cards */}
      <div className="space-y-4 mb-8">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-3xl p-6 transition-all ${
              plan.highlighted
                ? 'bg-terra-primary/10 border-2 border-terra-primary/40'
                : 'bg-terra-cream/70 border border-terra-taupe/40'
            }`}
          >
            {/* Popular badge */}
            {plan.highlighted && (
              <div className="absolute -top-3 left-6 px-4 py-1 bg-terra-primary rounded-full text-xs font-semibold text-white shadow-glass">
                Most Popular
              </div>
            )}

            <div className="flex items-start justify-between gap-4">
              {/* Plan info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-bold text-terra-ink">{plan.name}</h2>
                  {isCurrentPlan(plan.id) && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-terra-sage/15 text-terra-sage border border-terra-sage/40">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-terra-ink-soft text-sm mb-3">{plan.description}</p>

                {/* Features (collapsed on mobile) */}
                <ul className="space-y-1.5">
                  {plan.features.slice(0, 3).map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-terra-ink">
                      <svg className="w-4 h-4 text-terra-sage flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                  {plan.features.length > 3 && (
                    <li className="text-xs text-terra-taupe ml-6">
                      +{plan.features.length - 3} more features
                    </li>
                  )}
                </ul>
              </div>

              {/* Price & CTA */}
              <div className="text-right flex flex-col items-end">
                <div className="mb-3">
                  <span className="text-3xl font-bold text-terra-ink">
                    {plan.price === 0 ? 'Free' : `${plan.price} EUR`}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-terra-ink-soft text-sm">/mo</span>
                  )}
                </div>

                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={loading === plan.id || isCurrentPlan(plan.id) || subLoading}
                  className={`px-6 py-2.5 rounded-xl font-semibold transition-all text-sm whitespace-nowrap ${
                    isCurrentPlan(plan.id)
                      ? 'bg-terra-cream/60 text-terra-ink-soft cursor-default'
                      : plan.highlighted
                      ? 'bg-terra-primary text-white shadow-glass hover:opacity-95'
                      : 'bg-terra-cream/80 hover:bg-terra-cream text-terra-ink border border-terra-taupe/40'
                  }`}
                >
                  {loading === plan.id ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing
                    </span>
                  ) : isCurrentPlan(plan.id) ? (
                    'Current'
                  ) : isUpgrade(plan.id) ? (
                    'Upgrade'
                  ) : (
                    'Select'
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ / Guarantees */}
      <div className="p-6 rounded-2xl bg-terra-cream/70 border border-terra-taupe/40">
        <h3 className="text-lg font-semibold text-terra-ink mb-4">Frequently Asked Questions</h3>
        <div className="space-y-4 text-sm">
          <div>
            <p className="text-terra-ink font-medium">Can I cancel anytime?</p>
            <p className="text-terra-ink-soft">Yes! You can cancel your subscription at any time. You'll keep access until the end of your billing period.</p>
          </div>
          <div>
            <p className="text-terra-ink font-medium">What payment methods do you accept?</p>
            <p className="text-terra-ink-soft">We accept all major credit cards, debit cards, and many local payment methods through Stripe.</p>
          </div>
          <div>
            <p className="text-terra-ink font-medium">Is there a refund policy?</p>
            <p className="text-terra-ink-soft">We offer a 7-day money-back guarantee. If you're not satisfied, contact us for a full refund.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Pricing

