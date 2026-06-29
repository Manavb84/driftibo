import type { CSSProperties } from "react";

// Trust strip: a counter row + traveller quotes + the four promises behind the spin.
//
// ⚠️ PLACEHOLDER DATA — STATS and QUOTES are illustrative so the surface looks complete;
// the founder MUST replace them with real, verified numbers/quotes before launch (same
// rule as the dummy package prices). The four PROMISES below are true and stay as-is.

const STATS: { figure: string; label: string }[] = [
  { figure: "1,200+", label: "trips planned" },
  { figure: "80+", label: "places, all verified" },
  { figure: "< 1 hr", label: "typical WhatsApp reply" },
  { figure: "4.9★", label: "traveller rating" },
];

const QUOTES: { quote: string; name: string; trip: string }[] = [
  {
    quote: "We stopped arguing over the itinerary and just packed. Best decision — the place it picked was somewhere we'd never have chosen, and it was perfect.",
    name: "Aanya & Rohit",
    trip: "Spiti, star-sent",
  },
  {
    quote: "I was sceptical about a 'surprise' trip. But every detail was handled and the price was exactly what they said on WhatsApp. No nasty surprises, just the good kind.",
    name: "Meghna S.",
    trip: "Gokarna",
  },
  {
    quote: "Booked our honeymoon abroad through them — visa list, stays, the lot. Felt like having a friend who happens to be a travel agent.",
    name: "Karan T.",
    trip: "Bali",
  },
];

const PROOF = [
  {
    glyph: "✦",
    title: "Real places only",
    body: "Every destination is one we've checked on the ground — guesthouses, roads, seasons. No phantom spots.",
  },
  {
    glyph: "₹",
    title: "Honest from-prices",
    body: "What you see is a real per-person estimate, itemised on WhatsApp. Never inflated, never a surprise at the end.",
  },
  {
    glyph: "✓",
    title: "Human WhatsApp planning",
    body: "A person — not a bot — tunes your dates and inclusions on chat, usually within the hour.",
  },
  {
    glyph: "↻",
    title: "One genuine override",
    body: "Got a spin you truly can't do? Tell us and we re-spin once, no argument. The point is to stop overthinking.",
  },
];

const reveal = (i: number) => ({ ["--i" as string]: i }) as CSSProperties;

export default function SocialProof() {
  return (
    <section style={{ background: "var(--pk-panel)", padding: "72px 24px" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <p className="kicker" style={{ textAlign: "center" }}>
          Why people trust the star
        </p>
        <h2
          className="display"
          style={{ fontSize: "clamp(1.7rem,3.5vw,2.3rem)", textAlign: "center", marginTop: 6, marginBottom: 30 }}
        >
          The promises behind the spin
        </h2>

        {/* Counter row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
            gap: 18,
            marginBottom: 40,
          }}
        >
          {STATS.map((s, i) => (
            <div key={s.label} className="reveal-target" style={{ ...reveal(i), textAlign: "center" }}>
              <p className="display" style={{ fontSize: "clamp(1.8rem,4vw,2.6rem)", lineHeight: 1, color: "var(--pk-text)" }}>
                {s.figure}
              </p>
              <p style={{ fontFamily: "var(--ui)", fontWeight: 600, fontSize: "0.8rem", color: "var(--pk-muted)", marginTop: 4 }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Traveller quotes */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
            gap: 18,
            marginBottom: 40,
          }}
        >
          {QUOTES.map((q, i) => (
            <figure
              key={q.name}
              className="card card-pad reveal-target"
              style={{ ...reveal(i), display: "grid", gap: 12, margin: 0 }}
            >
              <span className="display" style={{ fontSize: "2rem", color: "var(--pk-accent-deep)", lineHeight: 0.6 }} aria-hidden="true">
                &ldquo;
              </span>
              <blockquote style={{ margin: 0, fontSize: "0.95rem", lineHeight: 1.6, color: "var(--pk-text)" }}>
                {q.quote}
              </blockquote>
              <figcaption style={{ fontFamily: "var(--ui)", fontSize: "0.82rem", color: "var(--pk-muted)" }}>
                <b style={{ color: "var(--pk-text)", fontWeight: 700 }}>{q.name}</b> · {q.trip}
              </figcaption>
            </figure>
          ))}
        </div>

        {/* The four promises (true, permanent) */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 18 }}>
          {PROOF.map((p, i) => (
            <div key={p.title} className="card card-pad reveal-target" style={{ ...reveal(i), display: "grid", gap: 10 }}>
              <span className="display" style={{ fontSize: "1.8rem", color: "var(--pk-accent-deep)", lineHeight: 1 }} aria-hidden="true">
                {p.glyph}
              </span>
              <p style={{ fontFamily: "var(--ui)", fontWeight: 700, fontSize: "0.96rem" }}>{p.title}</p>
              <p style={{ color: "var(--pk-muted)", fontSize: "0.88rem", lineHeight: 1.55 }}>{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
