import { stripe } from '@/lib/stripe'
import { redirect } from 'next/navigation'
import SuccessClient from './SuccessClient'
import { createSubscription } from '@/lib/actions/subscription'

export default async function Success({ searchParams }) {
  const { session_id } = await searchParams

  // In development, if no session_id is provided, show a mock success page so the design can be previewed
  if (!session_id) {
    if (process.env.NODE_ENV === 'development') {
      return <SuccessClient customerEmail="test@nexthire.com" />
    }
    throw new Error('Please provide a valid session_id (`cs_test_...`)')
  }

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent']
  })

  const { status, customer_details, metadata } = session
  const customerEmail = customer_details?.email

  if (status === 'open') {
    return redirect('/')
  }

  if (status === 'complete') {
    // Update the user's plan in the database using metadata from the Stripe session
    const subsInfo = {
      email: customerEmail,
      planId: metadata?.planId
    }
    await createSubscription(subsInfo)

    return <SuccessClient customerEmail={customerEmail} />
  }
}