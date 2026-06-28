"use client";

import { useState } from "react";
import Link from "next/link";
import type { Destination } from "@/lib/content";
import WhatsAppClose from "@/components/WhatsAppClose";
import { waLink } from "@/lib/site";
import { track } from "@/lib/analytics";

type View = "detail" | "itin";

// Explore page → the package where you actually pick a tier & price.
const DEST_TO_PACKAGE: Record<string, string> = {
  chopta: "temple-ridge",
  spiti: "cold-desert",
  ziro: "rice-and-fog",
  gokarna: "slow-coast",
  "char-dham": "char-dham-circuit",
};

export default function DestinationClient({ dest }: { dest: Destination }) {
  const packageSlug = DEST_TO_PACKAGE[dest.slug];
  const [view, setView] = useState<View>("detail");
  const [copied, setCopied] = useState(false);

  const context = `${dest.name} (${dest.region}) — the ${dest.dayCount} sample drift`;
  const waHref = waLink(`I want to drift to ${dest.name} — ${dest.dayCount}`);

  function go(v: View) {
    setView(v);
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (_) {}
  }

  async function handleCopy() {
    track("share_click", { destination: dest.slug, method: "copy_link" });
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (_) {}
  }

  async function handleShare() {
    track("share_click", { destination: dest.slug, method: "native_or_whatsapp" });
    const url = window.location.href;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: dest.name, url });
        return;
      } catch (_) {}
    }
    // Fallback: open WhatsApp share
    window.open(waLink(`check out ${dest.name} on Driftibo`), "_blank", "noopener");
  }

  // ── DETAIL VIEW ───────────────────────────────────────────────────────────
  if (view === "detail") {
    return (
      <main
        style={{ padding: "96px 22px 72px", maxWidth: 1000, margin: "0 auto", minHeight: "100vh" }}
      >
        <Link
          href="/destinations"
          style={{
            background: "none",
            border: 0,
            color: "var(--pk-muted)",
            fontFamily: "var(--ui)",
            fontWeight: 600,
            fontSize: "0.84rem",
            cursor: "pointer",
            marginBottom: 14,
            display: "inline-block",
            textDecoration: "none",
          }}
        >
          ← all destinations
        </Link>

        <article
          style={{
            background: "var(--pk-card)",
            borderRadius: 24,
            overflow: "hidden",
            boxShadow: "var(--pk-shadow)",
          }}
        >
          {/* HERO HEADER */}
          <header
            style={{ position: "relative", height: 300, display: "flex", alignItems: "flex-end" }}
          >
            <div
              className={`well bg ${dest.scene}`}
              style={{ position: "absolute", inset: 0, ...(dest.heroImageUrl ? { backgroundImage: `url(${dest.heroImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" } : {}) }}
            />
            <div
              style={{
                position: "relative",
                padding: 28,
                textShadow: "0 2px 18px oklch(0.3 0.06 225 / .5)",
              }}
            >
              <p className="kicker" style={{ color: "var(--pk-on-ink)" }}>
                {dest.region} · {dest.alt}
              </p>
              <h1
                className="display-xl"
                style={{
                  fontSize: "clamp(2.4rem,7vw,3.6rem)",
                  color: "var(--pk-on-ink)",
                }}
              >
                {dest.name}
              </h1>
            </div>
          </header>

          {/* BODY */}
          <div style={{ padding: 30, display: "grid", gap: 24 }}>
            <p className="lede" style={{ maxWidth: "60ch" }}>
              {dest.lede}
            </p>

            {/* CATCHES + NUMBERS */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
                gap: 24,
              }}
            >
              <div>
                <p className="kicker">The catches</p>
                <ul
                  style={{
                    margin: "10px 0 0 18px",
                    fontSize: "0.9rem",
                    color: "var(--pk-muted)",
                    display: "grid",
                    gap: 6,
                  }}
                >
                  {dest.catches.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="kicker">Real numbers</p>
                <ul
                  style={{
                    margin: "10px 0 0 18px",
                    fontSize: "0.9rem",
                    color: "var(--pk-muted)",
                    display: "grid",
                    gap: 6,
                  }}
                >
                  {dest.numbers.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* PRICE BADGE */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                flexWrap: "wrap",
                background: "var(--pk-panel)",
                borderRadius: 16,
                padding: "18px 20px",
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: "var(--ui)",
                    fontWeight: 700,
                    fontSize: "0.62rem",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "var(--pk-muted)",
                  }}
                >
                  Looks like a lakh
                </p>
                <p style={{ fontFamily: "var(--display)", fontSize: "1.7rem" }}>
                  {dest.rate}{" "}
                  <span style={{ fontSize: "0.78rem", color: "var(--pk-muted)" }}>
                    / person / day
                  </span>
                </p>
              </div>
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "var(--pk-muted)",
                  maxWidth: "24ch",
                  textAlign: "right",
                }}
              >
                Stay, transfers, a guided day. Verified, never inflated.
              </p>
            </div>

            {/* INCLUSIONS / EXCLUSIONS — data-driven ✓/✗ */}
            {(dest.inclusions.length > 0 || dest.exclusions.length > 0) && (
              <div
                style={{
                  background: "var(--pk-panel)",
                  borderRadius: 16,
                  padding: 20,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
                  gap: 20,
                }}
              >
                {dest.inclusions.length > 0 && (
                  <div>
                    <p className="kicker">What&apos;s included</p>
                    <ul style={{ listStyle: "none", margin: "10px 0 0", padding: 0, display: "grid", gap: 6 }}>
                      {dest.inclusions.map((x) => (
                        <li key={x} style={{ fontSize: "0.86rem", display: "flex", gap: 8 }}>
                          <span style={{ color: "oklch(0.6 0.13 150)", fontWeight: 700 }}>✓</span>
                          <span>{x}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {dest.exclusions.length > 0 && (
                  <div>
                    <p className="kicker">Not included</p>
                    <ul style={{ listStyle: "none", margin: "10px 0 0", padding: 0, display: "grid", gap: 6 }}>
                      {dest.exclusions.map((x) => (
                        <li key={x} style={{ fontSize: "0.86rem", display: "flex", gap: 8, color: "var(--pk-muted)" }}>
                          <span style={{ color: "oklch(0.6 0.16 25)", fontWeight: 700 }}>✗</span>
                          <span>{x}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* See the priced package options */}
            {packageSlug && (
              <Link
                href={`/packages/${packageSlug}`}
                className="btn btn-primary btn-sm"
                style={{ justifySelf: "start", textDecoration: "none" }}
              >
                See package options &amp; prices →
              </Link>
            )}

            {/* MOOD ITINERARY */}
            <div
              style={{ background: "var(--pk-panel)", borderRadius: 16, padding: 22 }}
            >
              <p className="kicker">Mood itinerary</p>
              <p className="poetry" style={{ fontSize: "1.2rem", marginTop: 6 }}>
                {dest.mood}
              </p>
            </div>

            {/* CTA BUTTONS — WhatsApp is primary */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-accent"
                onClick={() => track("destination_whatsapp_click", { destination: dest.slug })}
              >
                Chat on WhatsApp ✦
              </a>
              <button
                onClick={() => go("itin")}
                className="btn btn-ghost"
              >
                See the full itinerary →
              </button>
            </div>
          </div>
        </article>
      </main>
    );
  }

  // ── ITINERARY VIEW ────────────────────────────────────────────────────────
  return (
    <main
      style={{ padding: "96px 22px 72px", maxWidth: 1000, margin: "0 auto", minHeight: "100vh" }}
    >
      <button
        onClick={() => go("detail")}
        style={{
          background: "none",
          border: 0,
          color: "var(--pk-muted)",
          fontFamily: "var(--ui)",
          fontWeight: 600,
          fontSize: "0.84rem",
          cursor: "pointer",
          marginBottom: 14,
        }}
      >
        ← back to {dest.name}
      </button>

      <article
        style={{
          background: "var(--pk-card)",
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "var(--pk-shadow)",
          maxWidth: 720,
          margin: "0 auto",
        }}
      >
        {/* ITINERARY HERO */}
        <header
          style={{ position: "relative", height: 240, display: "flex", alignItems: "flex-end" }}
        >
          <div
            className={`well bg ${dest.scene}`}
            style={{ position: "absolute", inset: 0, ...(dest.heroImageUrl ? { backgroundImage: `url(${dest.heroImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" } : {}) }}
          />
          <div
            style={{
              position: "relative",
              padding: 26,
              textShadow: "0 2px 18px oklch(0.3 0.06 225 / .5)",
            }}
          >
            <p className="kicker" style={{ color: "var(--pk-on-ink)" }}>
              {dest.dayCount} · sample drift · {dest.region}
            </p>
            <h1
              className="display-xl"
              style={{
                fontSize: "clamp(2.2rem,6vw,3.2rem)",
                color: "var(--pk-on-ink)",
              }}
            >
              {dest.name}
            </h1>
          </div>
        </header>

        {/* ITINERARY BODY */}
        <div style={{ padding: 28, display: "grid", gap: 22 }}>
          {/* SHARE ACTIONS */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleShare}
            >
              Share · IG Story
            </button>
            <a
              className="btn btn-sm"
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "oklch(0.72 0.13 150)",
                color: "oklch(0.22 0.05 150)",
              }}
              onClick={() => track("destination_whatsapp_click", { destination: dest.slug, source: "itinerary" })}
            >
              WhatsApp
            </a>
            <button className="btn btn-ghost btn-sm" onClick={handleCopy}>
              {copied ? "Copied ✓" : "Copy link"}
            </button>
          </div>

          {/* DAY BY DAY */}
          {dest.days.map((day) => (
            <div key={day.d} style={{ display: "flex", gap: 18 }}>
              <span
                style={{
                  fontFamily: "var(--ui)",
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--pk-accent-deep)",
                  minWidth: 60,
                  paddingTop: 4,
                }}
              >
                {day.d}
              </span>
              <div>
                <h3 className="display" style={{ fontSize: "1.2rem" }}>
                  {day.t}
                </h3>
                <p style={{ color: "var(--pk-muted)", fontSize: "0.9rem", marginTop: 4 }}>
                  {day.p}
                </p>
              </div>
            </div>
          ))}

          {/* HONEST CATCHES */}
          <div style={{ background: "var(--pk-panel)", borderRadius: 16, padding: 20 }}>
            <p className="kicker">The honest catches</p>
            <ul
              style={{
                margin: "10px 0 0 18px",
                fontSize: "0.875rem",
                display: "grid",
                gap: 6,
              }}
            >
              {dest.catches.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>

          {/* WHATSAPP CLOSE */}
          <WhatsAppClose
            variant="ink"
            eyebrow="Like this drift?"
            heading="Make it yours"
            sub="We'll tune the dates and what's included on chat — no rate card here."
            context={context}
          />
        </div>
      </article>
    </main>
  );
}
