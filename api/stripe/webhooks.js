// api/stripe/webhooks.js
// Handles Stripe webhook events for subscription lifecycle

/* global process, Buffer */
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET

// Map Stripe subscription status to our status values
const STATUS_MAP = {
  active: 'active',
  past_due: 'past_due',
  canceled: 'canceled',
  unpaid: 'past_due',
  trialing: 'trialing',
  incomplete: 'incomplete',
  incomplete_expired: 'canceled',
}

// Map price IDs to plan names
function getPlanFromPriceId(priceId) {
  if (priceId === process.env.STRIPE_PRICE_BASIC_MONTHLY) return 'basic'
  if (priceId === process.env.STRIPE_PRICE_PREMIUM_MONTHLY) return 'premium'
  return 'basic' // fallback
}

export const config = {
  api: {
    bodyParser: false,
  },
}

// Helper to read raw body
async function getRawBody(req) {
  const chunks = []
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const rawBody = await getRawBody(req)
  const sig = req.headers['stripe-signature']

  let event

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).json({ error: `Webhook Error: ${err.message}` })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutComplete(supabase, event.data.object)
        break

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(supabase, event.data.object)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionCanceled(supabase, event.data.object)
        break

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(supabase, event.data.object)
        break

      case 'invoice.payment_failed':
        await handlePaymentFailed(supabase, event.data.object)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return res.status(200).json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return res.status(500).json({ error: 'Webhook handler failed' })
  }
}

async function handleCheckoutComplete(supabase, session) {
  const userId = session.metadata?.supabase_user_id
  const customerId = session.customer
  const subscriptionId = session.subscription

  console.log('handleCheckoutComplete called:', { userId, customerId, subscriptionId })

  if (!userId) {
    console.error('No user ID in checkout session metadata')
    return
  }

  if (!subscriptionId) {
    console.error('No subscription ID in session')
    return
  }

  // Fetch the subscription details from Stripe
  let subscription
  try {
    subscription = await stripe.subscriptions.retrieve(subscriptionId)
  } catch (err) {
    console.error('Error retrieving subscription from Stripe:', err)
    throw err
  }

  const priceId = subscription.items.data[0]?.price.id
  const plan = getPlanFromPriceId(priceId)

  console.log('Subscription details:', { priceId, plan, status: subscription.status })

  // First try to delete any existing subscription for this user (to avoid conflicts)
  await supabase
    .from('subscriptions')
    .delete()
    .eq('user_id', userId)

  // Build insert data with safe date handling
  const insertData = {
    user_id: userId,
    stripe_subscription_id: subscriptionId,
    stripe_customer_id: customerId,
    plan: plan,
    status: STATUS_MAP[subscription.status] || 'active',
    cancel_at_period_end: subscription.cancel_at_period_end || false,
  }

  // Only add period dates if they exist and are valid
  if (subscription.current_period_start) {
    insertData.current_period_start = new Date(subscription.current_period_start * 1000).toISOString()
  }
  if (subscription.current_period_end) {
    insertData.current_period_end = new Date(subscription.current_period_end * 1000).toISOString()
  }

  console.log('Inserting subscription data:', insertData)

  // Insert new subscription record
  const { error } = await supabase
    .from('subscriptions')
    .insert(insertData)

  if (error) {
    console.error('Error inserting subscription:', error)
    throw error
  }

  console.log(`Subscription created for user ${userId}: ${plan}`)
}

async function handleSubscriptionUpdate(supabase, subscription) {
  const userId = subscription.metadata?.supabase_user_id
  const priceId = subscription.items.data[0]?.price.id
  const plan = getPlanFromPriceId(priceId)

  // Try to find user by subscription ID if not in metadata
  let targetUserId = userId
  if (!targetUserId) {
    const { data: existing } = await supabase
      .from('subscriptions')
      .select('user_id')
      .eq('stripe_subscription_id', subscription.id)
      .single()

    if (existing) {
      targetUserId = existing.user_id
    } else {
      // Try by customer ID
      const { data: byCustomer } = await supabase
        .from('subscriptions')
        .select('user_id')
        .eq('stripe_customer_id', subscription.customer)
        .single()

      if (byCustomer) {
        targetUserId = byCustomer.user_id
      }
    }
  }

  if (!targetUserId) {
    console.error('Cannot find user for subscription update:', subscription.id)
    return
  }

  const { error } = await supabase
    .from('subscriptions')
    .update({
      plan: plan,
      status: STATUS_MAP[subscription.status] || subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end || false,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id)

  if (error) {
    console.error('Error updating subscription:', error)
    throw error
  }

  console.log(`Subscription updated: ${subscription.id} -> ${plan} (${subscription.status})`)
}

async function handleSubscriptionCanceled(supabase, subscription) {
  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id)

  if (error) {
    console.error('Error canceling subscription:', error)
    throw error
  }

  console.log(`Subscription canceled: ${subscription.id}`)
}

async function handlePaymentSucceeded(supabase, invoice) {
  if (!invoice.subscription) return // One-time payment, skip

  // Find user_id from subscription
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', invoice.customer)
    .single()

  const { error } = await supabase
    .from('payments')
    .insert({
      user_id: sub?.user_id,
      stripe_payment_intent_id: invoice.payment_intent,
      stripe_customer_id: invoice.customer,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      status: 'succeeded',
      description: `Subscription payment - ${invoice.lines?.data?.[0]?.description || 'Monthly'}`,
      metadata: {
        invoice_id: invoice.id,
        subscription_id: invoice.subscription,
      },
    })

  if (error) {
    console.error('Error recording payment:', error)
  } else {
    console.log(`Payment recorded: ${invoice.payment_intent}`)
  }
}

async function handlePaymentFailed(supabase, invoice) {
  // Find user_id from subscription
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', invoice.customer)
    .single()

  const { error } = await supabase
    .from('payments')
    .insert({
      user_id: sub?.user_id,
      stripe_payment_intent_id: invoice.payment_intent,
      stripe_customer_id: invoice.customer,
      amount: invoice.amount_due,
      currency: invoice.currency,
      status: 'failed',
      description: 'Payment failed',
      metadata: {
        invoice_id: invoice.id,
        subscription_id: invoice.subscription,
        failure_reason: invoice.last_finalization_error?.message,
      },
    })

  if (error) {
    console.error('Error recording failed payment:', error)
  } else {
    console.log(`Failed payment recorded: ${invoice.payment_intent}`)
  }
}
