"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";

// NEXT_PUBLIC_* vars are inlined at build time. When NEXT_PUBLIC_RAZORPAY_KEY_ID
// is absent the component renders null — fully inert with zero UI or console noise.
const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

export type DepositButtonProps = {
  destinationSlug?: string;
  captureId?: string;
  email?: string;
  /** Amount in paise. Defaults to 200000 (INR 2,000) — mirrors /api/deposit default. */
  amount?: number;
};

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).Razorpay) { resolve(); return; }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Razorpay script load failed"));
    document.head.appendChild(s);
  });
}

export default function DepositButton({
  destinationSlug,
  captureId,
  email,
  amount,
}: DepositButtonProps) {
  const [loading, setLoading] = useState(false);

  // Hidden when Razorpay key not configured at build time
  if (!RAZORPAY_KEY) return null;

  async function handleClick() {
    if (loading) return;
    track("deposit_click", { destinationSlug });
    setLoading(true);
    try {
      const res = await fetch("/api/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, destinationSlug, captureId, email }),
      });
      // 503 = not configured server-side; any error -> silent no-op
      if (!res.ok) { setLoading(false); return; }
      const { orderId, amount: orderAmount, currency, keyId, bookingId } =
        (await res.json()) as {
          orderId: string;
          amount: number;
          currency: string;
          keyId: string;
          bookingId: string;
        };
      await loadRazorpayScript();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp = new (window as any).Razorpay({
        key: keyId,
        order_id: orderId,
        amount: orderAmount,
        currency,
        name: "Driftibo",
        ...(email ? { prefill: { email } } : {}),
        handler: async (resp: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          const verify = await fetch("/api/deposit/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...resp, bookingId }),
          });
          if (verify.ok) track("deposit_success", { destinationSlug, amount: orderAmount });
        },
      });
      rzp.open();
    } catch {
      // network / script-load failure — stay silent, don't break the funnel
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "12px 24px",
        borderRadius: "var(--persona-radius)",
        background: "var(--pk-accent-deep)",
        color: "#fff",
        fontFamily: "var(--font-jakarta, sans-serif)",
        fontWeight: 700,
        fontSize: "0.92rem",
        border: "none",
        cursor: loading ? "wait" : "pointer",
        opacity: loading ? 0.7 : 1,
        transition: "opacity 0.2s",
        width: "100%",
        maxWidth: 340,
        justifyContent: "center",
      }}
    >
      {loading ? "Opening…" : "Hold my dates — INR 2,000 deposit"}
    </button>
  );
}
