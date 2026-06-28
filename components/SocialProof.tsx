// DRAFT — founder review / replace with real testimonials + verified trip count before launch

const TESTIMONIALS = [
  {
    // DRAFT — founder review: replace with a real quote
    quote:
      "[placeholder] I didn't think I'd end up in Ziro — but it was the most alive I've felt on a holiday in years. The star just knew.",
    name: "[placeholder name]",
    detail: "[placeholder — destination + month, e.g. Ziro · Apr 2026]",
    initials: "A",
    avatarBg: "oklch(0.50 0.09 200)",
  },
  {
    // DRAFT — founder review: replace with a real quote
    quote:
      "[placeholder] I'd been putting off Spiti for three years. The star picked it in 30 seconds. Went in October. Never looked back.",
    name: "[placeholder name]",
    detail: "[placeholder — destination + month]",
    initials: "R",
    avatarBg: "oklch(0.52 0.1 30)",
  },
  {
    // DRAFT — founder review: replace with a real quote
    quote:
      "[placeholder] It was our honeymoon. I told them that on WhatsApp and they handled absolutely everything. No spreadsheets, no stress.",
    name: "[placeholder name]",
    detail: "[placeholder — destination + month]",
    initials: "S",
    avatarBg: "oklch(0.48 0.08 150)",
  },
];

export default function SocialProof() {
  return (
    <section style={{ background: "var(--pk-panel)", padding: "72px 24px" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        {/* DRAFT — founder review: replace [placeholder] with verified trip count */}
        <p className="kicker" style={{ textAlign: "center" }}>
          Drifters, sent
        </p>
        <h2
          className="display"
          style={{
            fontSize: "clamp(1.7rem,3.5vw,2.3rem)",
            textAlign: "center",
            marginTop: 6,
            marginBottom: 6,
          }}
        >
          [placeholder] trips. A few voices.
        </h2>
        <p
          style={{
            textAlign: "center",
            fontFamily: "var(--ui)",
            fontSize: "0.72rem",
            letterSpacing: "0.1em",
            color: "oklch(0.7 0.05 30)",
            marginBottom: 36,
            textTransform: "uppercase",
          }}
        >
          DRAFT — founder review / replace with real testimonials before launch
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
            gap: 18,
          }}
        >
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="card card-pad"
              style={{ display: "grid", gap: 14 }}
            >
              <p
                className="poetry"
                style={{ fontSize: "1.02rem", color: "var(--pk-text)", lineHeight: 1.55, marginTop: 0 }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    background: t.avatarBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--display)",
                    fontSize: "1.1rem",
                    color: "#fff",
                    flexShrink: 0,
                  }}
                  aria-hidden="true"
                >
                  {t.initials}
                </div>
                <div>
                  <p style={{ fontFamily: "var(--ui)", fontWeight: 700, fontSize: "0.84rem" }}>
                    {t.name}
                  </p>
                  <p style={{ color: "var(--pk-muted)", fontSize: "0.76rem", marginTop: 1 }}>
                    {t.detail}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
