"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";

const FAQ_ITEMS = [
  {
    q: "How does the surprise destination actually work?",
    a: "You tap through seven quick preferences — terrain, trip vibe, who's coming, how long, comfort level, where you're starting from, and how far you'll go — and the star picks a real destination that fits all of them. You don't type a name or pick from a list. The place is revealed only after the star decides. We then confirm everything over WhatsApp, usually within a few minutes.",
  },
  {
    q: "What's included in the ≈ ₹6,800 / person / day price?",
    a: "The day-rate covers accommodation (verified, not inflated), all ground transfers, and at least one guided activity or site visit per day. Flights are separate — we factor in realistic flight costs when we quote the total, but we don't bundle them into the per-day figure because they vary too much by departure city. You'll get a clear, itemised breakdown on WhatsApp before you commit to anything.",
  },
  {
    q: "Are the destinations real places I can actually visit?",
    a: "Every single one. We don't invent places. Each destination in our pool has been verified on the ground — we know the guesthouses, the road conditions, the transfer times, the seasonal access windows. If a place isn't accessible in a given month, it won't appear in your spin that month. No phantom destinations, ever.",
  },
  {
    q: "What if I get a destination I genuinely can't do?",
    a: "Message us on WhatsApp immediately. If the destination doesn't work for a real reason — a medical constraint, a non-negotiable travel restriction, a genuine logistical blocker — we'll spin again for you, once, no argument. What we won't do is re-spin because you sort of had another place in mind. One honest override, used sparingly. The whole point is to break the overthinking habit.",
  },
  {
    q: "When do I pay and is my money safe?",
    a: "We ask for a small refundable deposit (via Razorpay, fully secured) to confirm your slot. The balance is due closer to departure. We work with established, licensed ground partners — your money is never sitting unaccounted. Cancellation terms are clear upfront: the closer to departure, the lower the refund, with full refunds available well in advance. You'll see the exact policy before any payment.",
  },
  {
    q: "I already have a place in mind. Can Driftibo still help?",
    a: "Yes — that's what the Custom & Honeymoon offering is for. You bring the destination (or a shortlist), we build the itinerary, book everything, and manage the logistics. Same WhatsApp-first approach, same honest pricing. Head to the Offerings page or message us directly and we'll take it from there.",
  },
];

export default function HomeFAQ() {
  const [open, setOpen] = useState<number | null>(null);

  function toggle(i: number) {
    const next = open === i ? null : i;
    setOpen(next);
    if (next !== null) track("faq_open", { question_index: i });
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <section style={{ maxWidth: 760, margin: "0 auto", padding: "72px 24px" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <p className="kicker" style={{ textAlign: "center" }}>
        Questions
      </p>
      <h2
        className="display"
        style={{
          fontSize: "clamp(1.7rem,3.5vw,2.3rem)",
          textAlign: "center",
          marginTop: 6,
          marginBottom: 32,
        }}
      >
        How Driftibo works
      </h2>
      <div style={{ display: "grid", gap: 4 }}>
        {FAQ_ITEMS.map((item, i) => (
          <div
            key={i}
            style={{
              background: open === i ? "var(--pk-panel)" : "transparent",
              borderRadius: 14,
              border: "1px solid var(--pk-line-soft)",
              overflow: "hidden",
              transition: "background .2s ease",
            }}
          >
            <button
              type="button"
              onClick={() => toggle(i)}
              aria-expanded={open === i}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 16,
                padding: "18px 20px",
                background: "none",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "var(--display)",
                fontSize: "1.05rem",
                color: "var(--pk-text)",
                lineHeight: 1.3,
              }}
            >
              <span>{item.q}</span>
              <span
                style={{
                  flexShrink: 0,
                  fontFamily: "var(--ui)",
                  fontSize: "1.25rem",
                  lineHeight: 1,
                  color: "var(--pk-muted)",
                  transform: open === i ? "rotate(45deg)" : "none",
                  transition: "transform .2s ease",
                  display: "inline-block",
                  userSelect: "none",
                }}
                aria-hidden="true"
              >
                +
              </span>
            </button>
            {open === i && (
              <p
                style={{
                  padding: "0 20px 20px",
                  color: "var(--pk-muted)",
                  fontSize: "0.95rem",
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {item.a}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
