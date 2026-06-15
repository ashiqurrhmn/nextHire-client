import 'server-only'

import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const PLAN_PRICE_ID = {
    seeker_pro: "price_1TiKAB3pA2swKjtHCOXIL4bn",
    seeker_premium: "price_1TiT8G3pA2swKjtHSJJXzFZo",
    recruiter_growth: "price_1TiT8x3pA2swKjtHqiI1VYsn",
    recruiter_enterprise: "price_1TiT9b3pA2swKjtHGbuqI3mh",
}