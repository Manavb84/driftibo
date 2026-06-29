"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useIntent } from "./IntentProvider";
import { INTENTS, INTENT_LABEL, INTENT_GLYPH, INTENT_LINE, type Intent } from "@/lib/intent";

// The single shared trip-intent chooser. Two modes:
//   "overlay" — first-visit / "change?" modal, rendered by IntentProvider. Picking
//               sets the intent and closes; you stay where you are. Skippable.
//   "page"    — inline on /start (the deep-link / link-in-bio front door). Picking
//               sets the intent AND routes to /destinations?intent=<intent>.
// Tiles reuse .play-card + .play-card.is-on; nothing here is hand-rolled.

function Tiles({ onPick, picked }: { onPick: (i: Intent) => void; picked: Intent | null }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14 }}>
      {INTENTS.map((it) => (
        <button
          key={it}
          type="button"
          onClick={() => onPick(it)}
          className={`play-card${picked === it ? " is-on" : ""}`}
          aria-pressed={picked === it}
          style={{ textAlign: "left", cursor: "pointer", border: 0, padding: 22, gap: 6 }}
        >
          <span
            className="display"
            style={{ fontSize: "1.9rem", color: "var(--pk-accent-deep)", lineHeight: 1 }}
            aria-hidden="true"
          >
            {INTENT_GLYPH[it]}
          </span>
          <span className="display" style={{ fontSize: "1.35rem" }}>
            {INTENT_LABEL[it]}
          </span>
          <span style={{ color: "var(--pk-muted)", fontSize: "0.9rem", lineHeight: 1.5 }}>
            {INTENT_LINE[it]}
          </span>
          <span className="play-go" style={{ marginTop: 4 }}>
            {picked === it ? "Taking you there…" : "Show me these →"}
          </span>
        </button>
      ))}
    </div>
  );
}

export default function IntentChooser({ mode }: { mode: "overlay" | "page" }) {
  const { intent, setIntent, closeChooser } = useIntent();
  const router = useRouter();

  function pick(i: Intent) {
    setIntent(i); // persists + updates chip + closes overlay
    if (mode === "page") router.push(`/destinations?intent=${i}`);
  }

  if (mode === "page") {
    return (
      <main
        className="mesh"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "96px 20px 64px",
        }}
      >
        <div style={{ width: "100%", maxWidth: 640 }}>
          <div
            className="glass-panel"
            style={{ textAlign: "center", marginBottom: 26, borderRadius: "var(--r-lg)", padding: "26px 22px 28px", boxShadow: "var(--pk-shadow-sm)" }}
          >
            <span className="seal t-coral breathe" style={{ width: 60, margin: "0 auto" }}>
              <span className="ring" />
              <span className="star" />
            </span>
            <p className="kicker" style={{ marginTop: 16 }}>
              Travel by your own star
            </p>
            <h1 className="display-mega" style={{ fontSize: "clamp(2.2rem,7vw,3.4rem)", margin: "8px 0", lineHeight: 1 }}>
              What kind of trip?
            </h1>
            <p className="lede" style={{ maxWidth: "44ch", margin: "0 auto", color: "var(--pk-text)" }}>
              Pick one. We&apos;ll point you straight at the right places — honest briefs, best
              seasons, real photos.
            </p>
          </div>

          <Tiles onPick={pick} picked={intent} />

          <div style={{ textAlign: "center", marginTop: 26, display: "grid", gap: 8 }}>
            <Link href="/destinations" style={{ fontFamily: "var(--ui)", fontWeight: 600, fontSize: "0.86rem", color: "var(--pk-accent-deep)", textDecoration: "none" }}>
              Just show me everything →
            </Link>
            <Link href="/" style={{ fontSize: "0.8rem", color: "var(--pk-ink)", opacity: 0.85, textDecoration: "none" }}>
              or back home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ── overlay ──
  return (
    <div
      className="glass-panel"
      style={{ position: "fixed", inset: 0, zIndex: 200, display: "grid", placeItems: "center", padding: 20 }}
      role="dialog"
      aria-modal="true"
      aria-label="What kind of trip?"
    >
      <div
        style={{
          position: "relative",
          background: "var(--pk-card)",
          borderRadius: "var(--r-lg)",
          boxShadow: "var(--pk-shadow-lg)",
          maxWidth: 620,
          width: "100%",
          padding: "38px 30px 32px",
        }}
      >
        <button
          onClick={closeChooser}
          aria-label="Close"
          style={{
            position: "absolute",
            top: 14,
            right: 16,
            border: 0,
            background: "var(--pk-panel)",
            color: "var(--pk-muted)",
            width: 34,
            height: 34,
            borderRadius: "var(--r-pill)",
            cursor: "pointer",
            fontSize: "1rem",
            lineHeight: 1,
          }}
        >
          ✕
        </button>
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <span className="seal t-coral breathe" style={{ width: 60, margin: "0 auto" }}>
            <span className="ring" />
            <span className="star" />
          </span>
          <p className="kicker" style={{ marginTop: 16 }}>
            Before your star spins
          </p>
          <h2 className="display" style={{ fontSize: "clamp(1.8rem,5vw,2.4rem)", margin: "4px 0 6px" }}>
            What kind of trip?
          </h2>
          <p className="lede" style={{ maxWidth: "40ch", margin: "0 auto" }}>
            Pick a lane and the whole site points you at the right places.
          </p>
        </div>

        <Tiles onPick={pick} picked={intent} />

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button
            onClick={closeChooser}
            style={{
              background: "none",
              border: 0,
              color: "var(--pk-muted)",
              fontFamily: "var(--ui)",
              fontWeight: 600,
              fontSize: "0.82rem",
              cursor: "pointer",
              textDecoration: "underline",
              textUnderlineOffset: 3,
            }}
          >
            Skip — show me everything
          </button>
        </div>
      </div>
    </div>
  );
}
