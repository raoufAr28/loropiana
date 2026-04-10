import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
import { headers } from "next/headers";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" } as any)
  : null;

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

const supabase = (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : null;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  if (!stripe || !webhookSecret) {
    return new NextResponse("Webhook configuration missing", { status: 500 });
  }

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error: any) {
    console.error("[WEBHOOK_ERROR]", error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    // 1. Retrieve the order_id from metadata we passed to Stripe during checkout creation
    const orderId = session.metadata?.order_id;
    
    if (orderId && supabase) {
      // 2. Update Supabase order
      const { error } = await supabase
        .from('orders')
        .update({
          payment_status: 'paid',
          status: 'processing', // Payment confirmed, move to processing
          payment_method: 'card',
        })
        .eq('id', orderId);

      if (error) {
        console.error("[SUPABASE_UPDATE_ERROR]", error);
        return new NextResponse("Error updating database", { status: 500 });
      }
    } else if (orderId && !supabase) {
       console.error("[WEBHOOK_ERROR] Supabase client missing while processing paid order");
       return new NextResponse("Server configuration error", { status: 500 });
    }
  }

  // Handle cancelled or failed later if needed

  return new NextResponse(null, { status: 200 });
}
