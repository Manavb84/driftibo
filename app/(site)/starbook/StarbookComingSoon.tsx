"use client";

import { useState } from "react";
import { submitCapture } from "@/lib/actions";
import { INPUT_STYLE } from "@/lib/styles";
import { PERSONA } from "@/lib/persona";

// Calm, branded placeholder while the Starbook collection is parked.
// The real implementation lives in StarbookClient.tsx (kept on disk, unimported).
// The notify-me box reuses the star_drop capture so /starbook#star-drop still works.
export default function StarbookComingSoon() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleNotify(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const result = await submitCapture({
      kind: "star_drop",
      email,
      persona: PERSONA ?? undefined,
    });
    if (result.ok) setSubmitted(true);
    else setError(result.error ?? "Something went wrong.");
  }

  return (
    <main
      className="s-starbook"
      style={{
        position: "relative",
        minHeight: "100vh",
        padding: "120px 22px 96px",
        display: "grid",
        placeItems: "center",
      }}
    >
      {/* Full-bleed spotlight: darkens the centre so text stays legible over the
          bright Milky Way band — edge-to-edge ellipse, no visible box. */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(80% 60% at 50% 46%, oklch(0.08 0.03 285 / .62), transparent 72%)",
          pointerEvents: "none",
        }}
      />
      <div
        id="star-drop"
        style={{
          position: "relative",
          textAlign: "center",
          maxWidth: 480,
          display: "grid",
          gap: 14,
          justifyItems: "center",
        }}
      >
        <span className="seal t-coral" style={{ width: 64 }}>
          <span className="ring" />
          <span className="star" />
        </span>

        <p className="kicker" style={{ color: "var(--pk-accent)", textShadow: "0 1px 12px oklch(0 0 0 / .6)" }}>
          Coming soon
        </p>
        <h1
          className="display-mega"
          style={{
            fontSize: "clamp(2.2rem,7vw,3.2rem)",
            color: "var(--pk-on-ink)",
            margin: 0,
            textShadow: "0 2px 24px oklch(0 0 0 / .5)",
          }}
        >
          Your Starbook
        </h1>
        <p
          className="lede"
          style={{ color: "oklch(1 0 0 / .82)", maxWidth: "40ch", textShadow: "0 1px 16px oklch(0 0 0 / .5)" }}
        >
          Every place your star sends you, collected — we&apos;re building it. ✦
        </p>

        {/* Optional notify-me — reuses the Star Drop capture */}
        <div style={{ marginTop: 10, width: "100%", maxWidth: 380 }}>
          {submitted ? (
            <p style={{ color: "var(--pk-accent)", fontWeight: 600, fontSize: "0.9rem" }}>
              ✦ We&apos;ll let you know when it opens.
            </p>
          ) : (
            <form onSubmit={handleNotify} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <input
                type="email"
                required
                placeholder="your@email.com"
                aria-label="Email to be notified when Starbook opens"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  ...INPUT_STYLE,
                  flex: 1,
                  minWidth: 180,
                  marginTop: 0,
                  background: "oklch(1 0 0 / .1)",
                  color: "var(--pk-on-ink)",
                  border: "1px solid oklch(1 0 0 / .22)",
                }}
              />
              <button type="submit" className="btn btn-accent btn-sm" style={{ whiteSpace: "nowrap" }}>
                Notify me
              </button>
            </form>
          )}
          {error && (
            <p style={{ color: "oklch(0.82 0.085 32)", fontSize: "0.8rem", marginTop: 6 }}>{error}</p>
          )}
        </div>
      </div>
    </main>
  );
}
