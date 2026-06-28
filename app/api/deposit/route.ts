import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// ponytail: anon-key writes are gated by signature verification — tighten to service-role when payments go live
export async function POST(req: NextRequest) {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !secret) {
    return NextResponse.json({ error: "Deposits not configured" }, { status: 503 });
  }

  const body = await req.json().catch(() => ({}));
  const amount: number = body.amount ?? 200000; // paise; default INR 2,000
  const destinationSlug: string | undefined = body.destinationSlug;
  const captureId: string | undefined = body.captureId;
  const receipt = `rcpt_${Date.now()}`;

  // Create Razorpay order via REST (HTTP Basic auth: keyId:secret)
  const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${keyId}:${secret}`).toString("base64")}`,
    },
    body: JSON.stringify({ amount, currency: "INR", receipt }),
  });
  if (!rzpRes.ok) {
    const rzpErr = await rzpRes.text().catch(() => rzpRes.statusText);
    return NextResponse.json({ error: `Razorpay: ${rzpErr}` }, { status: 502 });
  }
  const order = await rzpRes.json();

  // Insert bookings row (anon key + permissive RLS allows insert; verified by signature check on /verify)
  const supabase = await createClient();
  const { data: booking, error: bookingErr } = await supabase
    .from("bookings")
    .insert({
      capture_id: captureId ?? null,
      destination_slug: destinationSlug ?? null,
      amount,
      currency: "INR",
      status: "created",
      provider_order_id: order.id,
    })
    .select("id")
    .single();
  if (bookingErr) {
    return NextResponse.json({ error: bookingErr.message }, { status: 500 });
  }

  return NextResponse.json({
    orderId: order.id,
    amount,
    currency: "INR",
    keyId,
    bookingId: booking.id,
  });
}
