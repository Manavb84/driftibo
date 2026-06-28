import { createHmac } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// ponytail: anon-key writes are gated by signature verification — tighten to service-role when payments go live
export async function POST(req: NextRequest) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    return NextResponse.json({ ok: false, error: "Deposits not configured" }, { status: 503 });
  }

  const body = await req.json().catch(() => ({}));
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !bookingId) {
    return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
  }

  // Verify HMAC-SHA256(order_id + "|" + payment_id, secret) === signature
  const expected = createHmac("sha256", secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expected !== razorpay_signature) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const supabase = await createClient();

  // Bind the (valid) signature to THIS booking: a valid signature only proves *some*
  // order was paid. Require the booking's stored order id to match, and that it hasn't
  // already been settled — otherwise a valid triplet from one payment could mark a
  // different (victim's) bookingId paid.
  const { data: booking } = await supabase
    .from("bookings")
    .select("provider_order_id, status")
    .eq("id", bookingId)
    .single();

  if (!booking || booking.provider_order_id !== razorpay_order_id || booking.status !== "created") {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { error } = await supabase
    .from("bookings")
    .update({ status: "paid", deposit_paid_at: new Date().toISOString() })
    .eq("id", bookingId);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
