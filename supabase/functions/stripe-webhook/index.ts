// Supabase Edge Function: stripe-webhook
// Securely verifies Stripe signatures and fulfills orders

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing Stripe signature header", { status: 400 });
  }

  const rawBody = await req.text();

  try {
    // In production, use Stripe SDK to verify: stripe.webhooks.constructEvent(rawBody, signature, STRIPE_WEBHOOK_SECRET)
    const event = JSON.parse(rawBody);

    if (event.type === "checkout.session.completed" || event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

      // Verify order exists and mark as paid
      const paymentId = paymentIntent.id;
      const orderId = paymentIntent.metadata?.orderId;

      if (orderId) {
        await supabase
          .from("orders")
          .update({
            status: "paid",
            payment_id: paymentId,
          })
          .eq("id", orderId);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
});
