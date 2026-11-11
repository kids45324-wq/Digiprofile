// Supabase Edge Function: razorpay-webhook
// Securely verifies Razorpay HMAC SHA256 signatures

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";
import { hmac } from "https://deno.land/x/hmac@v2.0.1/mod.ts";

const RAZORPAY_WEBHOOK_SECRET = Deno.env.get("RAZORPAY_WEBHOOK_SECRET") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const razorpaySignature = req.headers.get("x-razorpay-signature");
  if (!razorpaySignature) {
    return new Response("Missing Razorpay signature header", { status: 400 });
  }

  const rawBody = await req.text();

  // Validate HMAC SHA256 signature
  const expectedSignature = hmac("sha256", RAZORPAY_WEBHOOK_SECRET, rawBody, "utf8", "hex");
  if (razorpaySignature !== expectedSignature) {
    return new Response("Invalid Razorpay webhook signature", { status: 403 });
  }

  const payload = JSON.parse(rawBody);

  if (payload.event === "payment.captured") {
    const payment = payload.payload.payment.entity;
    const orderId = payment.notes?.order_id;
    const paymentId = payment.id;

    if (orderId) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      await supabase
        .from("orders")
        .update({
          status: "paid",
          payment_id: paymentId,
        })
        .eq("id", orderId);
    }
  }

  return new Response(JSON.stringify({ status: "success" }), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
});
