import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

import { PLAN_PRICE_ID, stripe } from '../../../lib/stripe'
import { getUserSession } from '@/lib/core/session'

export async function POST(request) {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')

    const formData = await request.formData()
    const planName = formData.get('price_id')
    const stripePriceId = PLAN_PRICE_ID[planName];

    const user = await getUserSession();

    // Validate: user role must match plan type
    if (!user) {
      return NextResponse.json({ error: 'You must be signed in to purchase a plan.' }, { status: 401 })
    }
    const planRole = planName.startsWith('seeker_') ? 'seeker' : planName.startsWith('recruiter_') ? 'recruiter' : null;
    if (planRole && user.role !== planRole) {
      return NextResponse.json(
        { error: `Only ${planRole}s can purchase this plan.` },
        { status: 403 }
      )
    }
    if (!stripePriceId) {
      return NextResponse.json({ error: 'Invalid plan selected.' }, { status: 400 })
    }

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      customer_email: user?.email,
      line_items: [
        {
          // Provide the exact Price ID (for example, price_1234) of the product you want to sell
          price: stripePriceId,
          quantity: 1
        },
      ],
      mode: 'subscription',
      metadata: {
        planId: planName
      },
      success_url: `${origin}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
    });
    return NextResponse.redirect(session.url, 303)
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    )
  }
}