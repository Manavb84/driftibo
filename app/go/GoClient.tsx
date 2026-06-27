"use client";

import { useState } from "react";
import Link from "next/link";
import { SITE } from "@/lib/site";

// ─── types ────────────────────────────────────────────────────────────────────
type Terrain = "Mountains" | "Coast" | "Desert" | "Culture";

interface Suggestion {
  region: string;
  place: string;
  line: string;
}

// ─── data (faithful to source SUG map) ─────────────────────────────────────────
const SUG: Record<Terrain, Suggestion> = {
  Mountains: {
    region: "Uttarakhand",
    place: "Chopta",
    line: "Mini-Switzerland under Tungnath ridge.",
  },
  Coast: {
    region: "Karnataka",
    place: "Gokarna",
    line: "Goa’s quieter coast — five cliff beaches.",
  },
  Desert: {
    region: "Himachal",
    place: "Spiti",
    line: "Iceland greys, monastery silence.",
  },
  Culture: {
    region: "Karnataka",
    place: "Hampi",
    line: "Boulder temples, an empire in ruins.",
  },
};

const TERRAINS: Terrain[] = ["Mountains", "Coast", "Desert", "Culture"];

// ─── inline style constants (from source renderVals) ───────────────────────────
const linkPrimaryStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  textDecoration: "none",
  background: "var(--pk-ink)",
  color: "var(--pk-on-ink)",
  borderRadius: 16,
  padding: "16px 20px",
  boxShadow: "var(--pk-shadow-sm)",
};

const linkStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  textDecoration: "none",
  color: "var(--pk-text)",
  background: "var(--pk-card)",
  borderRadius: 16,
  padding: "16px 20px",
  boxShadow: "var(--pk-shadow-sm)",
};

const jrowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  textDecoration: "none",
  color: "var(--pk-text)",
  background: "var(--pk-card)",
  borderRadius: 14,
  padding: 10,
  boxShadow: "var(--pk-shadow-sm)",
};

// ─── portrait images for terrain suggestions ───────────────────────────────────
const PLACE_PORTRAIT: Record<string, string> = {
  Chopta: "chopta-portrait",
  Gokarna: "gokarna-portrait",
  Spiti: "spiti-portrait",
};

// ─── component ────────────────────────────────────────────────────────────────
export default function GoClient() {
  const [pick, setPick] = useState<Terrain | null>(null);

  const sug = pick ? SUG[pick] : null;

  const sugWaLink = sug
    ? `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(
        `Hi Driftibo ✦ — send me ${sug.place} (${sug.region})?`,
      )}`
    : "#";

  return (
    <main style={{ padding: "84px 18px 64px", maxWidth: 480, margin: "0 auto", minHeight: "100vh" }}>
      {/* ── Header ── */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <span className="seal t-coral breathe" style={{ width: 64, margin: "0 auto" }}>
          <span className="ring" />
          <span className="star" />
        </span>
        <h1 className="display" style={{ fontSize: "1.7rem", marginTop: 12 }}>
          @driftibo
        </h1>
        <p className="poetry" style={{ color: "var(--pk-muted)" }}>
          Don&apos;t decide. Go where your star sends you.
        </p>
      </div>

      {/* ── CTAs ── */}
      <div style={{ display: "grid", gap: 11 }}>
        {/* Primary: Spin my star */}
        <Link href="/game" style={linkPrimaryStyle}>
          <span style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontFamily: "var(--display)", fontSize: "1.2rem" }}>
              ✦ Spin my star
            </span>
            <span style={{ fontSize: "0.78rem", opacity: 0.7 }}>the 6-tap surprise game</span>
          </span>
          <span style={{ fontSize: "1.1rem" }}>→</span>
        </Link>

        {/* Dream My Trip */}
        <Link href="/dream" style={linkStyle}>
          <span style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontFamily: "var(--display)", fontSize: "1.15rem" }}>Dream My Trip</span>
            <span style={{ fontSize: "0.78rem", color: "var(--pk-muted)" }}>
              describe a feeling, get a place
            </span>
          </span>
          <span style={{ color: "var(--pk-muted)" }}>→</span>
        </Link>

        {/* What's your travel soul? */}
        <Link href="/quiz" style={linkStyle}>
          <span style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontFamily: "var(--display)", fontSize: "1.15rem" }}>
              What&apos;s your travel soul?
            </span>
            <span style={{ fontSize: "0.78rem", color: "var(--pk-muted)" }}>
              the 5-question vibe quiz
            </span>
          </span>
          <span style={{ color: "var(--pk-muted)" }}>→</span>
        </Link>
      </div>

      {/* ── Destination Picker ── */}
      <div className="card card-pad" style={{ marginTop: 18 }}>
        <p className="kicker">Or tell us a terrain</p>
        <p style={{ fontSize: "0.86rem", color: "var(--pk-muted)", margin: "4px 0 12px" }}>
          Tap one — we&apos;ll name a real Indian twin on the spot.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {TERRAINS.map((t) => (
            <span
              key={t}
              className={`pill${pick === t ? " is-on" : ""}`}
              role="button"
              tabIndex={0}
              onClick={() => setPick(t)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setPick(t);
                }
              }}
              style={{ cursor: "pointer" }}
            >
              {t}
            </span>
          ))}
        </div>

        {sug && (
          <>
            <div
              style={{
                marginTop: 14,
                display: "flex",
                gap: 14,
                alignItems: "center",
                background: "var(--pk-panel)",
                borderRadius: 16,
                padding: 12,
                borderLeft: "3px solid var(--pk-accent)",
              }}
            >
              <div
                className="well mask-circle"
                style={{
                  width: 64,
                  flexShrink: 0,
                  ...(PLACE_PORTRAIT[sug.place] ? {
                    backgroundImage: `url(/images/${PLACE_PORTRAIT[sug.place]}.jpg)`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  } : {}),
                }}
                data-label=""
              />
              <div>
                <p className="kicker" style={{ color: "var(--pk-accent-deep)" }}>
                  {sug.region}
                </p>
                <p className="display" style={{ fontSize: "1.3rem" }}>
                  {sug.place}
                </p>
                <p style={{ fontSize: "0.82rem", color: "var(--pk-muted)" }}>{sug.line}</p>
              </div>
            </div>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, marginTop: 14 }}>
              Email me this one + a quote
              <input
                type="email"
                placeholder="aanya@email.com"
                style={{
                  display: "block",
                  width: "100%",
                  marginTop: 6,
                  padding: "11px 13px",
                  borderRadius: 10,
                  border: "1px solid var(--pk-line)",
                  background: "var(--pk-paper)",
                  fontFamily: "var(--ui)",
                  fontSize: "0.9rem",
                }}
              />
            </label>
            <a
              href={sugWaLink}
              target="_blank"
              rel="noopener"
              className="btn"
              style={{
                width: "100%",
                justifyContent: "center",
                marginTop: 10,
                background: "oklch(0.72 0.13 150)",
                color: "oklch(0.2 0.05 150)",
              }}
            >
              ✦ Send {sug.place} on WhatsApp
            </a>
          </>
        )}
      </div>

      {/* ── Chat with a human ── */}
      <a
        href={`https://wa.me/${SITE.whatsappNumber}?text=Hi%20Driftibo%20%E2%9C%A6%20where%20should%20my%20star%20send%20me%3F`}
        target="_blank"
        rel="noopener"
        style={{
          ...linkStyle,
          marginTop: 18,
          background: "oklch(0.72 0.13 150 / .14)",
          boxShadow: "inset 0 0 0 1px oklch(0.72 0.13 150 / .4)",
        }}
      >
        <span style={{ fontFamily: "var(--display)", fontSize: "1.15rem" }}>Chat with a human</span>
        <span style={{ fontSize: "0.78rem", color: "oklch(0.45 0.1 150)", fontWeight: 700 }}>
          WhatsApp →
        </span>
      </a>

      {/* ── From the journal ── */}
      <p className="kicker" style={{ margin: "26px 0 10px" }}>
        From the journal
      </p>
      <div style={{ display: "grid", gap: 10 }}>
        <Link href="/journal" style={jrowStyle}>
          <div
            className="well"
            style={{ width: 54, height: 54, borderRadius: 12, flexShrink: 0, backgroundImage: "url(/images/chopta-portrait.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}
          />
          <span style={{ fontFamily: "var(--display)", fontSize: "1rem", lineHeight: 1.2 }}>
            9 places in India that look like Switzerland
          </span>
        </Link>
        <Link href="/journal" style={jrowStyle}>
          <div
            className="well"
            style={{ width: 54, height: 54, borderRadius: 12, flexShrink: 0, backgroundImage: "url(/images/spiti-portrait.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}
          />
          <span style={{ fontFamily: "var(--display)", fontSize: "1rem", lineHeight: 1.2 }}>
            Why we stopped letting people choose
          </span>
        </Link>
      </div>
    </main>
  );
}
