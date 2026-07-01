"use client";

import Link from "next/link";
import { useState } from "react";
import type { CSSProperties } from "react";
import { submitCapture } from "@/lib/actions";
import { useIntent } from "./IntentProvider";
import { lane as laneOf } from "@/lib/lane";

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

// ─── "Talk to us" lead capture form ───────────────────────────────────────────
function TalkToUs() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    // DPDP consent guard — no capture write until the box is ticked.
    if (!consent) {
      setError("Please tick the consent box so we can reply.");
      return;
    }
    setLoading(true);
    const result = await submitCapture({ kind: "lead", email });
    setLoading(false);
    if (result.ok) {
      setSubmitted(true);
    } else {
      setError(result.error ?? "Something went wrong.");
    }
  }

  return (
    <div style={{ maxWidth: 300 }}>
      <p className="kicker" style={kicker}>
        Talk to us
      </p>
      {submitted ? (
        <p style={{ color: "var(--pk-on-ink)", opacity: 0.78, fontSize: "0.84rem" }}>
          ✦ Got it — we&apos;ll be in touch on WhatsApp.
        </p>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 8, marginTop: 4 }}>
          <input
            type="email"
            required
            aria-label="Your email address"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              display: "block",
              width: "100%",
              padding: "9px 12px",
              borderRadius: 10,
              border: "1px solid oklch(1 0 0 / .2)",
              background: "oklch(1 0 0 / .08)",
              fontFamily: "var(--ui)",
              fontSize: "0.84rem",
              color: "var(--pk-on-ink)",
              outline: "none",
            }}
          />
          {/* DPDP: consent is opt-in (box starts unticked) — enforced in code, not labelled in the UI. */}
          <label style={{ display: "flex", gap: 8, fontSize: "0.72rem", color: "var(--pk-on-ink)", opacity: 0.78, lineHeight: 1.45 }}>
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              style={{ marginTop: 2, accentColor: "var(--pk-accent)" }}
            />
            <span>
              I agree Driftibo may contact me, per the{" "}
              <Link href="/legal#privacy" style={{ color: "var(--pk-accent)" }}>Privacy Notice</Link>.
            </span>
          </label>
          <button
            type="submit"
            disabled={loading || !consent}
            className="btn btn-accent btn-sm"
            style={{ width: "100%", justifyContent: "center" }}
          >
            {loading ? "Sending…" : "Send"}
          </button>
          {error && (
            <p style={{ color: "oklch(0.80 0.085 32)", fontSize: "0.78rem" }}>{error}</p>
          )}
        </form>
      )}
    </div>
  );
}

export default function SiteFooter() {
  const { intent } = useIntent();
  const laneData = laneOf(intent);
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
            <span className="card-pt pn">N</span>
            <span className="card-pt pe">E</span>
            <span className="card-pt ps">S</span>
            <span className="card-pt pw">W</span>
            <span className="star" />
          </span>
          <p
            className="poetry"
            style={{ color: "var(--pk-on-ink)", fontSize: "1.45rem", marginTop: 14, lineHeight: 1.25 }}
          >
            {laneData.footerTagline}
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
              ["/start", "What kind of trip?"],
              ["/offerings", "Plan with us"],
              ["/packages", "Packages"],
            ]}
          />
          <Col
            title="Discover"
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
              ["/legal", "Privacy & terms"],
              ["/legal#refund", "Refund policy"],
            ]}
          />
          <TalkToUs />
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
        <span>© 2026 Driftibo · Travel by your own star</span>
        <span>{laneData.footerFineprint}</span>
      </div>
    </footer>
  );
}
