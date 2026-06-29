// Honest trust strip — no invented quotes. The old stand-in testimonials (which
// rendered live before launch) were removed. Re-add a TESTIMONIALS block with real,
// verified quotes once we actually have them; until then we state only what is true.

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
    body: "A person — not a bot — tunes your dates and inclusions on chat, usually within minutes.",
  },
  {
    glyph: "↻",
    title: "One genuine override",
    body: "Got a spin you truly can't do? Tell us and we re-spin once, no argument. The point is to stop overthinking.",
  },
];

export default function SocialProof() {
  return (
    <section style={{ background: "var(--pk-panel)", padding: "72px 24px" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <p className="kicker" style={{ textAlign: "center" }}>
          Why people trust the star
        </p>
        <h2
          className="display"
          style={{
            fontSize: "clamp(1.7rem,3.5vw,2.3rem)",
            textAlign: "center",
            marginTop: 6,
            marginBottom: 36,
          }}
        >
          The promises behind the spin
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: 18,
          }}
        >
          {PROOF.map((p) => (
            <div key={p.title} className="card card-pad" style={{ display: "grid", gap: 10 }}>
              <span
                className="display"
                style={{
                  fontSize: "1.8rem",
                  color: "var(--pk-accent-deep)",
                  lineHeight: 1,
                }}
                aria-hidden="true"
              >
                {p.glyph}
              </span>
              <p style={{ fontFamily: "var(--ui)", fontWeight: 700, fontSize: "0.96rem" }}>
                {p.title}
              </p>
              <p style={{ color: "var(--pk-muted)", fontSize: "0.88rem", lineHeight: 1.55 }}>
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
