// api/stripe/create-customer-portal.js
// Creates a Stripe Customer Portal session for subscription management

import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { userId, returnUrl } = req.body

    if (!userId) {
      return res.status(400).json({ error: 'Missing required field: userId' })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Get customer ID from subscriptions table
    const { data: subscription, error: fetchError } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single()

    if (fetchError || !subscription?.stripe_customer_id) {
      return res.status(404).json({
        data: null,
        error: 'No subscription found for this user'
      })
    }

    // Get the origin for return URL
    const origin = req.headers.origin || 'https://expat-village.vercel.app'

    // Create portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: returnUrl || `${origin}/settings`,
    })

    return res.status(200).json({
      data: { url: portalSession.url },
      error: null
    })
  } catch (error) {
    console.error('Customer portal error:', error)
    return res.status(500).json({
      data: null,
      error: error.message
    })
  }
}
