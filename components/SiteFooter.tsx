import Link from "next/link";
import type { CSSProperties } from "react";

const fl: CSSProperties = {
  display: "block",
  color: "var(--pk-on-ink)",
  opacity: 0.78,
  fontSize: "0.84rem",
  textDecoration: "none",
  fontWeight: 500,
  transition: "opacity .15s ease",
};

const kicker: CSSProperties = { color: "var(--pk-accent)", marginBottom: 4 };

function Col({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div style={{ display: "grid", gap: 8, alignContent: "start" }}>
      <p className="kicker" style={kicker}>
        {title}
      </p>
      {links.map(([href, label]) => (
        <Link key={label} href={href} style={fl}>
          {label}
        </Link>
      ))}
    </div>
  );
}

export default function SiteFooter() {
  return (
    <footer className="callout-ink" style={{ borderRadius: 0, padding: "56px 22px 40px" }}>
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 40,
        }}
      >
        <div style={{ maxWidth: 300 }}>
          <span className="seal t-ink" style={{ width: 48 }}>
            <span className="ring" />
            <span className="star" />
          </span>
          <p
            className="poetry"
            style={{ color: "var(--pk-on-ink)", fontSize: "1.45rem", marginTop: 14, lineHeight: 1.25 }}
          >
            The best trips aren&apos;t planned. They&apos;re sent.
          </p>
          <Link href="/game" className="btn btn-accent btn-sm" style={{ marginTop: 18 }}>
            ✦ Spin my star
          </Link>
        </div>
        <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
          <Col
            title="Play"
            links={[
              ["/play", "Play"],
              ["/game", "The star game"],
              ["/dream", "Dream My Trip"],
              ["/quiz", "Vibe quiz"],
              ["/starbook", "Starbook"],
              ["/starbook#star-drop", "Star Drop"],
            ]}
          />
          <Col
            title="Plan"
            links={[
              ["/offerings", "Surprise me"],
              ["/offerings", "Custom & honeymoon"],
              ["/offerings", "Concierge"],
              ["/offerings", "Corporate"],
              ["/packages", "Packages"],
            ]}
          />
          <Col
            title="Read"
            links={[
              ["/destinations", "Destinations"],
              ["/journal", "Journal"],
              ["/about", "About"],
              ["/go", "Link in bio"],
            ]}
          />
          <Col
            title="Legal"
            links={[
              ["/legal", "Privacy"],
              ["/legal", "Terms"],
              ["/legal#ai-disclosure", "AI disclosure"],
            ]}
          />
        </div>
      </div>
      <div
        style={{
          maxWidth: 1180,
          margin: "36px auto 0",
          paddingTop: 20,
          borderTop: "1px solid oklch(1 0 0 / .12)",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          color: "oklch(1 0 0 / .55)",
          fontSize: "0.76rem",
        }}
      >
        <span>© 2026 Driftibo · Travel by your own star · #StarSent</span>
        <span>Made in India · Loved across 9 states</span>
      </div>
    </footer>
  );
}
