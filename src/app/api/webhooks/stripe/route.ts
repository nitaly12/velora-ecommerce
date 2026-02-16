import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Stripe webhook secret (add to .env.local)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: Request) {
    const payload = await req.text()
    const sig = req.headers.get('stripe-signature')

    // In a real implementation, you would use stripe.webhooks.constructEvent
    // For this project, we'll scaffold the logic for order status updates.

    console.log('Stripe Webhook Received')

    // Example Logic:
    // if (event.type === 'checkout.session.completed') {
    //   const session = event.data.object
    //   const orderId = session.metadata.orderId
    //
    //   const supabase = await createClient()
    //   await supabase
    //     .from('orders')
    //     .update({ status: 'PAID', stripe_payment_id: session.payment_intent })
    //     .eq('id', orderId)
    // }

    return NextResponse.json({ received: true })
}
