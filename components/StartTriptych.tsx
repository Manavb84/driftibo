"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useIntent } from "./IntentProvider";
import { INTENTS, INTENT_LABEL, INTENT_GLYPH, INTENT_LINE, type Intent } from "@/lib/intent";
import { LANE } from "@/lib/lane";

// The /start front door, redesigned as an immersive full-viewport triptych (per D3):
// three edge-to-edge scene columns — Matterhorn / Spiti / Varanasi — that hover-expand
// on desktop and stack on mobile. Picking sets the lane and routes into its Explore.
// Replaces the old "Just show me everything" escape with "Let the star decide → /game".
export default function StartTriptych() {
  const { setIntent } = useIntent();
  const router = useRouter();

  function pick(i: Intent) {
    setIntent(i);
    router.push(`/destinations?intent=${i}`);
  }

  return (
    <main className="triptych-wrap">
      <style>{`
        .triptych-wrap { position: relative; min-height: 100vh; }
        .triptych { display: flex; height: 100vh; min-height: 560px; width: 100%; }
        .triptych-panel { position: relative; flex: 1; overflow: hidden; cursor: pointer;
          transition: flex .55s cubic-bezier(.2,.8,.2,1); display: flex; }
        .triptych-panel .tp-img { position: absolute; inset: 0; background-size: cover; background-position: center;
          transform: scale(1.04); transition: transform .8s cubic-bezier(.2,.8,.2,1); }
        .triptych-panel:hover { flex: 2.4; }
        .triptych-panel:hover .tp-img { transform: scale(1.12); }
        /* Keyboard parity: focus expands the panel and shows a high-contrast outline on the dark imagery. */
        .triptych-panel:focus-visible { flex: 2.4; outline: 3px solid #fff; outline-offset: -4px; }
        .triptych-panel:focus-visible .tp-img { transform: scale(1.12); }
        @media (max-width: 820px) {
          .triptych { flex-direction: column; height: auto; }
          .triptych-panel { min-height: 42vh; flex: 1 !important; }
          .triptych-panel:hover .tp-img { transform: scale(1.04); }
        }
        @media (prefers-reduced-motion: reduce) {
          .triptych-panel, .triptych-panel .tp-img { transition: none; }
        }
      `}</style>

      {/* Header overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 5,
          textAlign: "center",
          padding: "84px 20px 0",
          pointerEvents: "none",
        }}
      >
        <p className="kicker" style={{ color: "#fff", textShadow: "0 2px 12px oklch(0.18 0.06 232 / .7)" }}>
          Travel by your own star
        </p>
        <h1
          className="display-mega"
          style={{
            fontSize: "clamp(2rem,6vw,3.2rem)",
            color: "#fff",
            margin: "6px 0 0",
            lineHeight: 1,
            textShadow: "0 3px 28px oklch(0.18 0.06 232 / .75)",
          }}
        >
          What kind of trip?
        </h1>
      </div>

      <div className="triptych">
        {INTENTS.map((it) => (
          <button
            key={it}
            type="button"
            onClick={() => pick(it)}
            className="triptych-panel"
            aria-label={`${INTENT_LABEL[it]} — ${INTENT_LINE[it]}`}
          >
            <span
              className="tp-img"
              style={{ backgroundImage: `url(${LANE[it].scenes[0].image})` }}
              aria-hidden="true"
            />
            {/* bottom-up scrim for legible title */}
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(0deg, oklch(0.15 0.05 234 / .82) 0%, oklch(0.15 0.05 234 / .35) 42%, oklch(0.15 0.05 234 / .15) 100%)",
              }}
            />
            <span
              style={{
                position: "relative",
                marginTop: "auto",
                width: "100%",
                padding: "28px 26px 40px",
                textAlign: "left",
                color: "#fff",
                display: "block",
              }}
            >
              <span className="display" style={{ fontSize: "2rem", color: "#fff", lineHeight: 1, display: "block" }} aria-hidden="true">
                {INTENT_GLYPH[it]}
              </span>
              <span className="display-xl" style={{ fontSize: "clamp(1.8rem,3.6vw,2.6rem)", color: "#fff", display: "block", marginTop: 8 }}>
                {INTENT_LABEL[it]}
              </span>
              <span
                style={{
                  display: "block",
                  fontFamily: "var(--ui)",
                  fontSize: "0.92rem",
                  color: "oklch(1 0 0 / .9)",
                  lineHeight: 1.5,
                  maxWidth: "32ch",
                  marginTop: 8,
                  textShadow: "0 1px 10px oklch(0.18 0.06 232 / .6)",
                }}
              >
                {INTENT_LINE[it]}
              </span>
              <span
                className="play-go"
                style={{ color: "var(--pk-accent)", marginTop: 14, fontWeight: 800 }}
              >
                Show me these →
              </span>
            </span>
          </button>
        ))}
      </div>

      {/* Escape hatch — let the star decide, instead of "show me everything" */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 5,
          textAlign: "center",
          padding: "0 20px 22px",
        }}
      >
        <Link
          href="/game"
          style={{
            fontFamily: "var(--ui)",
            fontWeight: 700,
            fontSize: "0.9rem",
            color: "#fff",
            textDecoration: "none",
            background: "oklch(0.18 0.06 234 / .55)",
            WebkitBackdropFilter: "blur(8px)",
            backdropFilter: "blur(8px)",
            padding: "10px 18px",
            borderRadius: "var(--r-pill)",
            boxShadow: "inset 0 0 0 1px oklch(1 0 0 / .3)",
          }}
        >
          ✦ Can&apos;t decide? Let the star decide →
        </Link>
      </div>
    </main>
  );
}
