"use client";

import { useState, useEffect } from "react";
import type { CSSProperties } from "react";

type Block = { text: string; isHeading: boolean };
type Doc = { title: string; blocks: Block[] };

const DOCS: Doc[] = [
  {
    title: "Privacy Notice",
    blocks: [
      { text: "What we collect", isHeading: true },
      { text: "Your email and WhatsApp number, only when you explicitly submit them to unlock an itinerary or contact us. Consent is never pre-ticked.", isHeading: false },
      { text: "Why", isHeading: true },
      { text: "To send your itinerary, verify your email by a one-time code, and continue the conversation on WhatsApp. We do not sell your data.", isHeading: false },
      { text: "How long", isHeading: true },
      { text: "We keep lead details only as long as the conversation is live, plus a short window after. Ask us to wipe it sooner and we will.", isHeading: false },
      { text: "Your rights", isHeading: true },
      { text: "Access or delete your data any time at privacy@driftibo.com. No forms, no runaround.", isHeading: false },
    ],
  },
  {
    title: "Terms of Use",
    blocks: [
      { text: "What Driftibo is", isHeading: true },
      { text: "A travel-inspiration and planning service. The star game is for delight; the trip itself is arranged by humans over WhatsApp after you reach out.", isHeading: false },
      { text: "Prices & quotes", isHeading: true },
      { text: "Any figure shown is an honest per-head estimate, not an offer. The real quote comes on chat, with what is included spelled out — no hidden booking forms.", isHeading: false },
      { text: "The surprise stays a surprise", isHeading: true },
      { text: "Mystery-mode trips are revealed on our schedule by design. By choosing blackout you accept that is the point.", isHeading: false },
      { text: "Changes", isHeading: true },
      { text: "We may update these terms; material changes get a notice. Continuing to use Driftibo means you are good with the current version.", isHeading: false },
    ],
  },
  {
    title: "Refund Policy",
    blocks: [
      { text: "Your deposit", isHeading: true },
      { text: "A deposit confirms your booking and holds your dates. It is adjusted into your final trip cost — never an extra charge.", isHeading: false },
      { text: "If you cancel", isHeading: true },
      { text: "Refunds are based on how far ahead you tell us, as a share of the amount you've paid:", isHeading: false },
      { text: "• 30+ days before departure — 75% refunded", isHeading: false },
      { text: "• 15–29 days before — 50% refunded", isHeading: false },
      { text: "• 7–14 days before — 25% refunded", isHeading: false },
      { text: "• 2–6 days before — 10% refunded", isHeading: false },
      { text: "• Under 48 hours, or a no-show — no refund", isHeading: false },
      { text: "Third-party costs already locked in for you (flights, permits, special-event or helicopter tickets) are non-refundable on top of the above. We always spell these out in your quote before you pay.", isHeading: false },
      { text: "If Driftibo cancels", isHeading: true },
      { text: "If we cancel your trip for any reason within our control, you get a full refund of everything paid, with no penalty. If a trip is stopped by weather, road closures, or other force majeure, we refund whatever we can recover from our partners and help you reschedule.", isHeading: false },
      { text: "How to request a refund", isHeading: true },
      { text: "Message us on WhatsApp or email refunds@driftibo.com with your booking name. Approved refunds are processed within 7–10 business days to your original payment method.", isHeading: false },
    ],
  },
];

const TAB_NAMES = ["Privacy", "Terms", "Refund policy"];

const HASH_TO_TAB: Record<string, number> = {
  "#privacy": 0,
  "#terms": 1,
  "#refund": 2,
};

const headingStyle: CSSProperties = {
  fontFamily: "var(--ui)",
  fontSize: "0.8125rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "var(--pk-text)",
  marginTop: 18,
};

const bodyStyle: CSSProperties = {
  color: "var(--pk-muted)",
  fontSize: "0.94rem",
};

export default function LegalTabs() {
  const [tab, setTab] = useState(0);

  useEffect(() => {
    // Read on mount (direct deep-link) AND on hashchange (same-page link, or a
    // hash-only URL change that doesn't remount this component).
    const applyHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash in HASH_TO_TAB) setTab(HASH_TO_TAB[hash]);
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  const doc = DOCS[tab];
  const articleId = tab === 2 ? "refund" : tab === 1 ? "terms" : "privacy";

  return (
    <div style={{ background: "var(--pk-card)", borderRadius: 20, boxShadow: "var(--pk-shadow-sm)", overflow: "hidden" }}>
      <nav
        style={{
          display: "flex",
          gap: 4,
          padding: "14px 18px",
          borderBottom: "1px solid var(--pk-line-soft)",
          flexWrap: "wrap",
        }}
      >
        {TAB_NAMES.map((label, i) => (
          <button
            key={label}
            onClick={() => setTab(i)}
            style={{
              fontSize: "0.8125rem",
              fontWeight: 600,
              padding: "7px 14px",
              borderRadius: 99,
              cursor: "pointer",
              border: "none",
              background: tab === i ? "var(--pk-ink)" : "transparent",
              color: tab === i ? "var(--pk-on-ink)" : "var(--pk-muted)",
            }}
          >
            {label}
          </button>
        ))}
      </nav>
      <article id={articleId} style={{ padding: 30, maxWidth: "64ch" }}>
        <h2 className="display" style={{ fontSize: "1.7rem" }}>{doc.title}</h2>
        <p className="eyebrow">Last updated 26 Jun 2026</p>
        <div style={{ display: "grid", gap: 4, marginTop: 14 }}>
          {doc.blocks.map((b, idx) => (
            <p key={idx} style={b.isHeading ? headingStyle : bodyStyle}>
              {b.text}
            </p>
          ))}
        </div>
      </article>
    </div>
  );
}
