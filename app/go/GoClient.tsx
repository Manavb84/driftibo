"use client";

import { useState } from "react";
import Link from "next/link";
import { SITE } from "@/lib/site";
import type { Destination, Article } from "@/lib/content";

// ─── types ────────────────────────────────────────────────────────────────────
type Terrain = "Mountains" | "Coast" | "Desert" | "Culture";

interface Suggestion {
  region: string;
  place: string;
  line: string;
  slug: string; // → /destinations/<slug> info page (all four now exist in the catalogue)
}

// ─── data (faithful to source SUG map) ─────────────────────────────────────────
const SUG: Record<Terrain, Suggestion> = {
  Mountains: {
    region: "Uttarakhand",
    place: "Chopta",
    line: "Mini-Switzerland under Tungnath ridge.",
    slug: "chopta",
  },
  Coast: {
    region: "Karnataka",
    place: "Gokarna",
    line: "Goa’s quieter coast — five cliff beaches.",
    slug: "gokarna",
  },
  Desert: {
    region: "Himachal",
    place: "Spiti",
    line: "Iceland greys, monastery silence.",
    slug: "spiti",
  },
  Culture: {
    region: "Karnataka",
    place: "Hampi",
    line: "Boulder temples, an empire in ruins.",
    slug: "hampi",
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
  borderRadius: "var(--r-md)",
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
  borderRadius: "var(--r-md)",
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
  borderRadius: "var(--r-md)",
  padding: 10,
  boxShadow: "var(--pk-shadow-sm)",
};

// ─── component ────────────────────────────────────────────────────────────────
export default function GoClient({
  destinations,
  articles,
}: {
  destinations: Destination[];
  articles: Article[];
}) {
  const [pick, setPick] = useState<Terrain | null>(null);

  // Terrain suggestion portrait + journal thumbs come from the live catalogue, so they
  // scale with it (a place we add gets its real portrait; Hampi has no place → gradient).
  const portraitByName = new Map(destinations.map((d) => [d.name, d.portraitImageUrl]));
  const journal = articles.slice(0, 2);

  const sug = pick ? SUG[pick] : null;
  const sugPortrait = sug ? portraitByName.get(sug.place) ?? null : null;

  const sugWaLink = sug
    ? `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(
        `Hi Driftibo ✦ — send me ${sug.place} (${sug.region})?`,
      )}`
    : "#";

  return (
    <main style={{ padding: "44px 18px 56px", maxWidth: 480, margin: "0 auto", minHeight: "100vh" }}>
      {/* ── Header ── */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <span className="seal t-coral breathe" style={{ width: 64, margin: "0 auto" }}>
          <span className="ring" />
          <span className="star" />
        </span>
        <h1 className="display-mega" style={{ fontSize: "clamp(1.9rem,7vw,2.6rem)", marginTop: 12 }}>
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
            <span style={{ fontSize: "0.78rem", opacity: 0.7 }}>the 7-tap surprise game</span>
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
                  ...(sugPortrait ? {
                    backgroundImage: `url(${sugPortrait})`,
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
            <a
              href={sugWaLink}
              target="_blank"
              rel="noopener"
              className="btn"
              style={{
                width: "100%",
                justifyContent: "center",
                marginTop: 14,
                background: "oklch(0.72 0.13 150)",
                color: "oklch(0.2 0.05 150)",
              }}
            >
              ✦ Send {sug.place} on WhatsApp
            </a>
            <Link
              href={`/destinations/${sug.slug}`}
              style={{
                display: "block",
                textAlign: "center",
                marginTop: 10,
                fontFamily: "var(--ui)",
                fontWeight: 600,
                fontSize: "0.82rem",
                color: "var(--pk-accent-deep)",
                textDecoration: "none",
              }}
            >
              See the full {sug.place} brief →
            </Link>
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
        {journal.map((a) => (
          <Link key={a.id} href={`/journal/${a.slug}`} style={jrowStyle}>
            <div
              className={`well ${a.scene}`}
              style={{
                width: 54,
                height: 54,
                borderRadius: 12,
                flexShrink: 0,
                ...(a.heroImageUrl
                  ? { backgroundImage: `url(${a.heroImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
                  : {}),
              }}
              data-label=""
            />
            <span style={{ fontFamily: "var(--display)", fontSize: "1rem", lineHeight: 1.2 }}>
              {a.title}
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
