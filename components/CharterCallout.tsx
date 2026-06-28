import { waLink } from "@/lib/site";

// "Add a helicopter/charter leg" upsell — a small callout on relevant package pages.
// An add-on, never a nav tab (per the Playbook). Renders null for packages without one.
const CHARTERS: Record<string, { heading: string; sub: string; context: string }> = {
  "temple-ridge": {
    heading: "Add a helicopter leg",
    sub: "Short on days or knees? Add a Kedarnath/Char Dham helicopter hop and skip the long climbs.",
    context: "adding a helicopter leg to the Temple Ridge trip",
  },
  "cold-desert": {
    heading: "Add a charter leg",
    sub: "Skip a long road day — add a Manali–Kaza charter/heli leg for when the weather plays nice.",
    context: "adding a Manali–Kaza charter leg to the Spiti trip",
  },
  "char-dham-circuit": {
    heading: "Add helicopter darshan",
    sub: "Turn any tier into a heli yatra — fly the shrine hops and do all four in a week.",
    context: "adding helicopter legs to the Char Dham Circuit",
  },
};

export default function CharterCallout({ slug }: { slug: string }) {
  const c = CHARTERS[slug];
  if (!c) return null;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap",
        background: "var(--pk-panel)",
        border: "1px dashed var(--pk-accent, oklch(0.72 0.13 150))",
        borderRadius: 16,
        padding: "16px 20px",
      }}
    >
      <div style={{ maxWidth: "44ch" }}>
        <p className="kicker" style={{ color: "var(--pk-accent-deep)" }}>
          ✈ Charter add-on
        </p>
        <p style={{ fontFamily: "var(--display)", fontSize: "1.2rem", margin: "2px 0 4px" }}>
          {c.heading}
        </p>
        <p style={{ fontSize: "0.86rem", color: "var(--pk-muted)" }}>{c.sub}</p>
      </div>
      <a
        href={waLink(c.context)}
        target="_blank"
        rel="noopener"
        className="btn btn-sm"
        style={{
          whiteSpace: "nowrap",
          textDecoration: "none",
          background: "oklch(0.72 0.13 150)",
          color: "oklch(0.2 0.05 150)",
        }}
      >
        Ask about it →
      </a>
    </div>
  );
}
