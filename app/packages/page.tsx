import type { Metadata } from "next";
import WhatsAppClose from "@/components/WhatsAppClose";

export const metadata: Metadata = {
  title: "Packages · Driftibo",
};

const PACKS = [
  {
    kicker: "Drift 01 · Himachal",
    name: "The Cold Desert",
    region: "Spiti · 7 nights",
    photo: "Spiti · real anchored photo",
    glow: "glow-teal",
    rate: "≈ ₹7,400",
    nights: "7 nights",
    tags: ["High desert", "Monastery silence", "Big skies"],
    blurb:
      "Moonland switchbacks, thousand-year gompas, and nights so dark the Milky Way feels rude. The kind of quiet that resets you for a year.",
    cta: "Take The Cold Desert",
    context: "the Spiti — Cold Desert package (7 nights)",
    even: true,
    wellScene: "s-spiti",
  },
  {
    kicker: "Drift 02 · Karnataka",
    name: "Slow Coast",
    region: "Gokarna · 5 nights",
    photo: "Gokarna · real anchored photo",
    glow: "glow-coral",
    rate: "≈ ₹6,200",
    nights: "5 nights",
    tags: ["Five beaches", "No plan", "Scooter days"],
    blurb:
      "Goa’s quieter sibling — five beaches strung on a cliff path, temple town at the centre, and absolutely nowhere you have to be. Drift until the light turns gold.",
    cta: "Take Slow Coast",
    context: "the Gokarna — Slow Coast package (5 nights)",
    even: false,
    wellScene: "s-gokarna",
  },
  {
    kicker: "Drift 03 · Arunachal",
    name: "Rice & Fog",
    region: "Ziro · 6 nights",
    photo: "Ziro · real anchored photo",
    glow: "glow-teal",
    rate: "≈ ₹6,900",
    nights: "6 nights",
    tags: ["Apatani valley", "Music country", "Rice terraces"],
    blurb:
      "Bali-green terraces farmed the old way, pine hills, and a valley that turns into a festival once a year. People, sound, and a story worth bringing home.",
    cta: "Take Rice & Fog",
    context: "the Ziro — Rice & Fog package (6 nights)",
    even: true,
    wellScene: "s-ziro",
  },
  {
    kicker: "Drift 04 · Uttarakhand",
    name: "Temple Ridge",
    region: "Chopta · 5 nights",
    photo: "Chopta · real anchored photo",
    glow: "glow-coral",
    rate: "≈ ₹6,800",
    nights: "5 nights",
    tags: ["Mini-Switzerland", "Highest Shiva temple", "Meadow walks"],
    blurb:
      "A deodar ridge under Tungnath, the highest Shiva temple on earth, and a Chandrashila sunrise lining up four Himalayan giants. Slow, soft, sized for a squad.",
    cta: "Take Temple Ridge",
    context: "the Chopta — Temple Ridge package (5 nights)",
    even: false,
    wellScene: "s-chopta",
  },
] as const;

export default function PackagesPage() {
  return (
    <>
      <section style={{ padding: "104px 22px 40px", maxWidth: 1080, margin: "0 auto", textAlign: "center" }}>
        <p className="kicker" style={{ color: "var(--persona-accent,var(--pk-accent-deep))" }}>Done-for-you drifts</p>
        <h1 className="display-mega" style={{ fontSize: "clamp(2.2rem,7vw,3.4rem)", margin: "6px 0 8px" }}>Four trips, already dreamed up</h1>
        <p className="lede" style={{ maxWidth: "48ch", margin: "0 auto" }}>Not a pricing grid. Four finished ideas you can take as-is or bend to your dates. Prices stay calm — per head, verified, never shouted.</p>
      </section>

      {PACKS.map((p, i) => (
        <section
          key={p.name}
          style={{
            scrollSnapAlign: "start",
            padding: "48px 22px",
            display: "flex",
            alignItems: "center",
            minHeight: "88vh",
            background: i % 2 ? "var(--pk-panel)" : "var(--pk-paper)",
          }}
        >
          <div
            style={{
              maxWidth: 1040,
              margin: "0 auto",
              width: "100%",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
              gap: "clamp(24px,5vw,56px)",
              alignItems: "center",
            }}
          >
            <div
              className={`well ${p.wellScene} ${p.glow}`}
              style={{
                borderRadius: 24,
                aspectRatio: "4/5",
                minHeight: 340,
                order: i % 2 ? 2 : 0,
              }}
              data-label={p.photo}
            />
            <div>
              <p className="kicker">{p.kicker}</p>
              <h2 className="display-mega" style={{ fontSize: "clamp(2rem,6vw,3rem)", margin: "4px 0 6px" }}>{p.name}</h2>
              <p className="poetry" style={{ color: "var(--pk-muted)", fontSize: "1.1rem" }}>{p.region}</p>
              <p style={{ color: "var(--pk-text)", fontSize: "1rem", margin: "16px 0", maxWidth: "46ch" }}>{p.blurb}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
                {p.tags.map((t) => (
                  <span key={t} className="pill">{t}</span>
                ))}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                  flexWrap: "wrap",
                  background: "var(--pk-panel)",
                  borderRadius: 16,
                  padding: "16px 20px",
                  marginBottom: 18,
                }}
              >
                <div>
                  <p style={{ fontFamily: "var(--ui)", fontWeight: 700, fontSize: "0.62rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--pk-muted)" }}>Looks like a lakh</p>
                  <p style={{ fontFamily: "var(--display)", fontSize: "1.6rem" }}>{p.rate} <span style={{ fontSize: "0.78rem", color: "var(--pk-muted)" }}>/ person / day</span></p>
                </div>
                <p style={{ fontSize: "0.78rem", color: "var(--pk-muted)", maxWidth: "20ch", textAlign: "right" }}>{p.nights} · stay, transfers, a guided day. Verified.</p>
              </div>
              <WhatsAppClose
                eyebrow="Take this one"
                heading={p.cta}
                sub="We'll confirm dates and what's included on chat — then it's yours."
                context={p.context}
              />
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
