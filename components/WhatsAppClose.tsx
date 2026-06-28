"use client";

import { useState } from "react";
import { waLink } from "@/lib/site";
import { track } from "@/lib/analytics";
import DepositButton from "@/components/DepositButton";

// Faithful port of WhatsAppClose.dc.html — the "handoff" card used by 5 pages
// (Game, Dream, Packages, Starbook, Offerings). Now a client component to support
// WhatsApp-click tracking, the post-tap reassurance line, and the DepositButton CTA.
export type WhatsAppCloseProps = {
  heading?: string;
  sub?: string;
  eyebrow?: string;
  context?: string;
  variant?: "card" | "ink";
  /** Optional deposit context — passed through to DepositButton (renders null when Razorpay not configured). */
  destinationSlug?: string;
  captureId?: string;
  email?: string;
};

export default function WhatsAppClose({
  heading = "Want us to make it real?",
  sub = "Tell us a date that works. We do the rest — stays, transfers, the lot.",
  eyebrow = "The handoff",
  context = "a trip my star sent me",
  variant = "card",
  destinationSlug,
  captureId,
  email,
}: WhatsAppCloseProps) {
  const [tapped, setTapped] = useState(false);
  const ink = variant === "ink";
  const waHref = waLink(context);
  const c = ink ? "var(--pk-on-ink)" : "var(--pk-text)";
  const muted = ink ? "oklch(1 0 0 / .68)" : "var(--pk-muted)";

  function handleWaClick() {
    track("whatsapp_click", { context, destinationSlug });
    setTapped(true);
  }

  return (
    <div
      className="glow-coral"
      style={{
        borderRadius: "var(--persona-radius)",
        padding: "30px 28px",
        textAlign: "center",
        display: "grid",
        gap: 13,
        justifyItems: "center",
        ...(ink
          ? { background: "var(--pk-ink)" }
          : { background: "var(--pk-card)", border: "1px solid var(--pk-line-soft)" }),
      }}
    >
      <p
        className="kicker"
        style={{ color: ink ? "var(--pk-accent)" : "var(--persona-accent,var(--pk-accent-deep))" }}
      >
        {eyebrow}
      </p>
      <p className="display" style={{ fontSize: "clamp(1.4rem,4vw,1.9rem)", color: c }}>
        {heading}
      </p>
      <p style={{ color: muted, fontSize: "0.96rem", maxWidth: "42ch" }}>{sub}</p>

      {/* Primary CTA */}
      <a
        href={waHref}
        target="_blank"
        rel="noopener"
        className="btn btn-accent btn-lg"
        style={{ textDecoration: "none" }}
        onClick={handleWaClick}
      >
        ✦ Continue on WhatsApp
      </a>

      {/* Post-tap reassurance — surfaces after the user taps the WhatsApp link */}
      {tapped && (
        <p
          style={{
            color: muted,
            fontSize: "0.85rem",
            fontStyle: "italic",
            margin: 0,
            animation: "fadeIn 0.3s ease",
          }}
        >
          You&apos;ll get 2–3 date options + a full quote within a day.
        </p>
      )}

      {/* Secondary CTA: deposit hold (renders null when NEXT_PUBLIC_RAZORPAY_KEY_ID absent) */}
      <DepositButton
        destinationSlug={destinationSlug}
        captureId={captureId}
        email={email}
      />

      {/* Travel insurance upsell — DRAFT — founder review */}
      <p style={{ color: muted, fontSize: "0.78rem", margin: 0 }}>
        Add travel insurance from INR X/day{" "}
        <span style={{ opacity: 0.65 }}>— [placeholder rate, founder review]</span>
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 7,
          justifyContent: "center",
          alignItems: "center",
          fontSize: "0.78rem",
          fontWeight: 600,
          color: muted,
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "var(--persona-accent, var(--pk-accent))",
            }}
          />{" "}
          We usually reply <b style={{ fontWeight: 800 }}>within the hour</b>
        </span>
        <span style={{ opacity: 0.6 }}>·</span>
        <span>then a quote — no booking forms, no rate card here.</span>
      </div>
    </div>
  );
}
