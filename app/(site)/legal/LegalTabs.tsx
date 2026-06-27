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
    title: "AI Disclosure",
    blocks: [
      { text: "Generated, and anchored", isHeading: true },
      { text: "Every location image on Driftibo is AI-generated. Each one is anchored to a real reference photo of that exact place, declared at upload.", isHeading: false },
      { text: "The spin pool", isHeading: true },
      { text: "A destination only enters the game once its real reference exists and the render is approved against it. We never invent a place.", isHeading: false },
      { text: "Copy & itineraries", isHeading: true },
      { text: "Itinerary text is drafted with AI assistance and checked by a human before it reaches you. Honest catches are written, not hidden.", isHeading: false },
      { text: "Spotted a drift?", isHeading: true },
      { text: "If a render strays from the real place, tell us and it leaves the pool. Boring, on purpose.", isHeading: false },
    ],
  },
];

const TAB_NAMES = ["Privacy", "Terms", "AI disclosure"];

const HASH_TO_TAB: Record<string, number> = {
  "#ai-disclosure": 2,
  "#privacy": 0,
  "#terms": 1,
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
  const articleId = tab === 2 ? "ai-disclosure" : tab === 1 ? "terms" : "privacy";

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
        <p className="eyebrow">DPDP-aligned · last updated 26 Jun 2026</p>
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
