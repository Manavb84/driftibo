"use client";

import { useRouter } from "next/navigation";
import { useIntent } from "./IntentProvider";
import { INTENTS, INTENT_LABEL, INTENT_GLYPH, INTENT_LINE, type Intent } from "@/lib/intent";

// Home "What kind of trip?" section — the up-front intent entry on the homepage
// (the founder's chief complaint: the chooser was never visible). Picking sets the
// intent and routes into Explore focused on that lane. Reuses .play-card; no new CSS.
export default function HomeIntent() {
  const router = useRouter();
  const { intent, setIntent } = useIntent();

  function pick(i: Intent) {
    setIntent(i);
    router.push(`/destinations?intent=${i}`);
  }

  return (
    <section style={{ maxWidth: 1080, margin: "0 auto", padding: "72px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <p className="kicker">Start here</p>
        <h2 className="display" style={{ fontSize: "clamp(1.7rem,3.6vw,2.4rem)", marginTop: 6 }}>
          What kind of trip?
        </h2>
        <p className="lede" style={{ maxWidth: "46ch", margin: "8px auto 0" }}>
          Pick a lane and the whole site points you at the right places. Change it anytime from the nav.
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16 }}>
        {INTENTS.map((it) => (
          <button
            key={it}
            type="button"
            onClick={() => pick(it)}
            className={`play-card${intent === it ? " is-on" : ""}`}
            aria-pressed={intent === it}
            style={{ textAlign: "left", cursor: "pointer", border: 0, padding: 24, gap: 6 }}
          >
            <span className="display" style={{ fontSize: "2rem", color: "var(--pk-accent-deep)", lineHeight: 1 }} aria-hidden="true">
              {INTENT_GLYPH[it]}
            </span>
            <span className="display" style={{ fontSize: "1.4rem" }}>
              {INTENT_LABEL[it]}
            </span>
            <span style={{ color: "var(--pk-muted)", fontSize: "0.92rem", lineHeight: 1.5 }}>
              {INTENT_LINE[it]}
            </span>
            <span className="play-go" style={{ marginTop: 4 }}>
              Show me these →
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
