import { waLink } from "@/lib/site";

// Faithful port of WhatsAppClose.dc.html — the "handoff" card used by 5 pages
// (Game, Dream, Packages, Starbook, Offerings). Stateless: the wa.me href is
// computed at render from `context`, so this works in server or client trees.
export type WhatsAppCloseProps = {
  heading?: string;
  sub?: string;
  eyebrow?: string;
  context?: string;
  variant?: "card" | "ink";
};

export default function WhatsAppClose({
  heading = "Want us to make it real?",
  sub = "Tell us a date that works. We do the rest — stays, transfers, the lot.",
  eyebrow = "The handoff",
  context = "a trip my star sent me",
  variant = "card",
}: WhatsAppCloseProps) {
  const ink = variant === "ink";
  const waHref = waLink(context);
  const c = ink ? "var(--pk-on-ink)" : "var(--pk-text)";
  const muted = ink ? "oklch(1 0 0 / .68)" : "var(--pk-muted)";

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
      <a
        href={waHref}
        target="_blank"
        rel="noopener"
        className="btn btn-accent btn-lg"
        style={{ textDecoration: "none" }}
      >
        ✦ Continue on WhatsApp
      </a>
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
              background: "oklch(0.72 0.16 150)",
              boxShadow: "0 0 0 4px oklch(0.72 0.16 150 / .25)",
            }}
          />{" "}
          We reply in under <b style={{ fontWeight: 800 }}>60 seconds</b>
        </span>
        <span style={{ opacity: 0.6 }}>·</span>
        <span>then a quote — no booking forms, no rate card here.</span>
      </div>
    </div>
  );
}
