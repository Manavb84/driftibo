"use client";

import { useState } from "react";
import Link from "next/link";
import { PERSONA } from "@/lib/persona";
import { submitCapture } from "@/lib/actions";
import { SITE } from "@/lib/site";

// ─── Questions (verbatim from source) ────────────────────────────────────────
type QuestionOption = {
  label: string;
  sub: string;
  sw?: string; // swatch gradient (palette questions only)
};
type Question = {
  prompt: string;
  palette?: boolean;
  options: QuestionOption[];
};

const Q: Question[] = [
  {
    prompt: "Pick a morning.",
    options: [
      { label: "Mist on a ridge", sub: "cold air, no one around" },
      { label: "Salt on your lip", sub: "first swim before chai" },
      { label: "Drums in a square", sub: "a town already awake" },
      { label: "Incense & bells", sub: "a courtyard at dawn" },
    ],
  },
  {
    prompt: "Choose a soundtrack.",
    options: [
      { label: "Wind, nothing else", sub: "" },
      { label: "Waves + a scooter", sub: "" },
      { label: "A crowd that knows the words", sub: "" },
      { label: "A single temple bell", sub: "" },
    ],
  },
  {
    prompt: "Which palette is yours?",
    palette: true,
    options: [
      {
        label: "Pine & slate",
        sub: "",
        sw: "linear-gradient(120deg,oklch(0.55 0.06 200),oklch(0.42 0.05 230))",
      },
      {
        label: "Blue & sand",
        sub: "",
        sw: "linear-gradient(120deg,oklch(0.70 0.09 220),oklch(0.86 0.06 80))",
      },
      {
        label: "Neon & coral",
        sub: "",
        sw: "linear-gradient(120deg,oklch(0.72 0.16 28),oklch(0.70 0.14 320))",
      },
      {
        label: "Ochre & saffron",
        sub: "",
        sw: "linear-gradient(120deg,oklch(0.72 0.12 70),oklch(0.66 0.13 40))",
      },
    ],
  },
  {
    prompt: "Pick a night.",
    options: [
      { label: "Stars, no signal", sub: "a sky you can read" },
      { label: "A beach fire", sub: "someone has a guitar" },
      { label: "Rooftop till 4am", sub: "the city refuses to sleep" },
      { label: "A lamplit courtyard", sub: "slow, candle-warm" },
    ],
  },
  {
    prompt: "What comes home with you?",
    options: [
      { label: "A pinecone", sub: "" },
      { label: "A shell", sub: "" },
      { label: "A festival band", sub: "" },
      { label: "A blessing thread", sub: "" },
    ],
  },
];

// ─── Archetypes (verbatim from source) ───────────────────────────────────────
type Archetype = {
  name: string;
  line: string;
  place: string;
  blurb: string;
  tint: string;
};

const ARCH: Archetype[] = [
  {
    name: "The Ridge Hermit",
    line: "You collect silence the way others collect stamps.",
    place: "Chopta",
    blurb:
      "Cold air, deodar forest, a temple in the clouds. You want the world turned down — and a meadow nobody geotags.",
    tint: "filter:hue-rotate(0deg)",
  },
  {
    name: "The Coast Drifter",
    line: "You measure a good day in tides, not hours.",
    place: "Gokarna",
    blurb:
      "Five quiet beaches, a scooter, and absolutely no plan. You drift until the light goes gold.",
    tint: "filter:hue-rotate(150deg) saturate(1.1)",
  },
  {
    name: "The Festival Comet",
    line: "You travel toward the noise on purpose.",
    place: "Ziro",
    blurb:
      "Rice terraces by day, a music valley by night. You want people, sound, and a story to bring back.",
    tint: "filter:hue-rotate(-40deg) saturate(1.3)",
  },
  {
    name: "The Temple Pilgrim",
    line: "You go looking for the still point.",
    place: "Spiti",
    blurb:
      "High-desert monasteries and prayer flags in thin air. You want meaning more than a checklist.",
    tint: "filter:hue-rotate(40deg)",
  },
];

// ─── Archetype tally logic (mirrors source) ───────────────────────────────────
function computeArchetype(answers: number[]): Archetype {
  const tally = [0, 0, 0, 0];
  answers.forEach((a) => {
    tally[a]++;
  });
  let best = 0;
  for (let i = 1; i < 4; i++) if (tally[i] > tally[best]) best = i;
  return ARCH[best];
}

// ─── Stage type ───────────────────────────────────────────────────────────────
type Stage = "intro" | "q" | "result";

// ─── Component ────────────────────────────────────────────────────────────────
export default function QuizClient() {
  const effectivePersona = PERSONA;

  const [stage, setStage] = useState<Stage>("intro");
  const [qi, setQi] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);

  function start() {
    setStage("q");
    setQi(0);
    setAnswers([]);
  }

  function answer(i: number) {
    const next = answers.slice(0, qi);
    next[qi] = i;
    const nextQi = qi + 1;
    if (nextQi >= Q.length) {
      setAnswers(next);
      setStage("result");
      // fire capture
      const arch = computeArchetype(next);
      submitCapture({
        kind: "quiz",
        persona: effectivePersona,
        data: { answers: next, archetype: arch.name },
      });
      try {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch {}
    } else {
      setAnswers(next);
      setQi(nextQi);
      try {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch {}
    }
  }

  function back() {
    setQi(Math.max(0, qi - 1));
  }

  function restart() {
    setStage("intro");
    setQi(0);
    setAnswers([]);
    setEmail("");
    setConsent(false);
  }

  // fires when the user clicks the WhatsApp button — sends email capture if consent given
  async function handleWaCapture() {
    if (consent && email) {
      const arch = computeArchetype(answers);
      await submitCapture({
        kind: "quiz",
        email,
        persona: effectivePersona,
        data: { answers, archetype: arch.name, saveCard: true },
      });
    }
  }

  // ── current question & derived UI values ──
  const q = Q[qi] ?? Q[0];
  const arch = computeArchetype(answers);

  const qrail = Q.map((_, i) => {
    const active = i <= qi;
    const dotStyle: React.CSSProperties = {
      width: 8,
      height: 8,
      borderRadius: "50%",
      transition: "all .25s ease",
      background: active ? "var(--pk-accent)" : "var(--pk-line)",
      transform: active ? "scale(1.15)" : undefined,
      display: "inline-block",
    };
    return { dotStyle };
  });

  const optSty: React.CSSProperties = {
    cursor: "pointer",
    textAlign: "left",
    background: "var(--pk-card)",
    border: "1px solid var(--pk-line-soft)",
    borderRadius: 18,
    padding: 18,
    display: "flex",
    flexDirection: "column",
    gap: 3,
    boxShadow: "var(--pk-shadow-sm)",
    transition: "transform .15s ease,border-color .15s ease",
  };

  const fiStyle: React.CSSProperties = {
    display: "block",
    width: "100%",
    marginTop: 6,
    padding: "11px 13px",
    borderRadius: 10,
    border: "1px solid var(--pk-line)",
    background: "var(--pk-paper)",
    fontFamily: "var(--ui)",
    fontSize: "0.9rem",
  };

  // whatsapp href mirrors source
  const msg = `Hi Driftibo ✦ — my travel soul is ${arch.name} and my star leans toward ${arch.place}. Send my card?`;
  const waHref = `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(msg)}`;

  // tint string from source is like "filter:hue-rotate(0deg)" or "filter:hue-rotate(150deg) saturate(1.1)"
  // extract the filter value
  const archFilter = arch.tint.startsWith("filter:") ? arch.tint.slice("filter:".length).trim() : undefined;
  const archTintStyle: React.CSSProperties = archFilter ? { filter: archFilter } : {};

  return (
    <main
      style={{
        padding: "92px 20px 72px",
        maxWidth: 660,
        margin: "0 auto",
        minHeight: "100vh",
      }}
    >
      {/* ── INTRO ── */}
      {stage === "intro" && (
        <div style={{ textAlign: "center" }}>
          <span
            className="seal t-coral breathe"
            style={{ width: 72, margin: "0 auto" }}
          >
            <span className="ring" />
            <span className="star" />
          </span>
          <p
            className="kicker"
            style={{
              marginTop: 18,
              color: "var(--persona-accent,var(--pk-accent-deep))",
            }}
          >
            The Good-Life Vibe Quiz
          </p>
          <h1
            className="display-mega"
            style={{
              fontSize: "clamp(2.2rem,7vw,3.2rem)",
              margin: "6px 0 10px",
            }}
          >
            What&apos;s your travel soul?
          </h1>
          <p
            className="lede"
            style={{ maxWidth: "42ch", margin: "0 auto 26px" }}
          >
            Five questions. No right answers — only taste. We read the pattern
            and name the kind of drifter you are.
          </p>
          <button onClick={start} className="btn btn-accent btn-lg">
            ✦ Begin
          </button>
        </div>
      )}

      {/* ── QUESTION ── */}
      {stage === "q" && (
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            {qrail.map((d, i) => (
              <span key={i} style={d.dotStyle} />
            ))}
            <span
              style={{
                fontFamily: "var(--ui)",
                fontWeight: 700,
                fontSize: "0.66rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--pk-muted)",
                marginLeft: 8,
              }}
            >
              Q{qi + 1} / {Q.length}
            </span>
          </div>

          <h2
            className="display"
            style={{
              fontSize: "clamp(1.6rem,4.5vw,2.2rem)",
              textAlign: "center",
              marginBottom: 22,
            }}
          >
            {q.prompt}
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            {q.options.map((o, i) => (
              <button key={o.label} onClick={() => answer(i)} style={optSty}>
                {q.palette && o.sw && (
                  <span
                    style={{
                      display: "block",
                      height: 34,
                      borderRadius: 10,
                      marginBottom: 4,
                      background: o.sw,
                    }}
                  />
                )}
                <span className="display" style={{ fontSize: "1.15rem" }}>
                  {o.label}
                </span>
                {o.sub && (
                  <span style={{ color: "var(--pk-muted)", fontSize: "0.8rem" }}>
                    {o.sub}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 18 }}>
            <button
              onClick={back}
              style={{
                background: "none",
                border: 0,
                color: "var(--pk-muted)",
                fontFamily: "var(--ui)",
                fontWeight: 600,
                fontSize: "0.8rem",
                cursor: "pointer",
                visibility: qi === 0 ? "hidden" : "visible",
              }}
            >
              ← back
            </button>
          </div>
        </div>
      )}

      {/* ── RESULT ── */}
      {stage === "result" && (
        <div>
          <p
            className="lede"
            style={{ textAlign: "center", marginBottom: 16 }}
          >
            Your travel soul is —
          </p>

          {/* screenshot-ready card */}
          <div
            style={{
              position: "relative",
              borderRadius: 24,
              overflow: "hidden",
              boxShadow: "var(--pk-shadow-lg)",
              color: "#fff",
              textShadow: "0 2px 16px oklch(0.28 0.06 225 / .5)",
            }}
          >
            <div
              className="well bg"
              style={{ position: "absolute", inset: 0, ...archTintStyle }}
            />
            <div style={{ position: "relative", padding: "32px 28px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span className="seal t-paper" style={{ width: 34 }}>
                  <span className="ring" />
                  <span className="star" />
                </span>
                <span
                  style={{
                    fontFamily: "var(--ui)",
                    fontWeight: 700,
                    fontSize: "0.7rem",
                    letterSpacing: "0.12em",
                  }}
                >
                  #StarSent
                </span>
              </div>
              <p
                style={{
                  fontFamily: "var(--ui)",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  fontSize: "0.66rem",
                  opacity: 0.9,
                  marginTop: 26,
                }}
              >
                You are
              </p>
              <h2
                className="display-xl"
                style={{
                  fontSize: "clamp(2.4rem,9vw,3.4rem)",
                  color: "#fff",
                  lineHeight: 1,
                }}
              >
                {arch.name}
              </h2>
              <p
                className="poetry"
                style={{
                  color: "#fff",
                  fontSize: "1.15rem",
                  marginTop: 10,
                  maxWidth: "30ch",
                }}
              >
                {arch.line}
              </p>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 18,
                  background: "oklch(1 0 0 / .16)",
                  backdropFilter: "blur(6px)",
                  WebkitBackdropFilter: "blur(6px)",
                  border: "1px solid oklch(1 0 0 / .3)",
                  padding: "8px 14px",
                  borderRadius: 99,
                  fontWeight: 600,
                  fontSize: "0.78rem",
                  textShadow: "none",
                }}
              >
                Your star leans toward <strong>{arch.place}</strong>
              </div>
            </div>
          </div>

          <p
            style={{
              textAlign: "center",
              color: "var(--pk-muted)",
              fontSize: "0.95rem",
              margin: "20px auto",
              maxWidth: "48ch",
            }}
          >
            {arch.blurb}
          </p>

          {/* capture */}
          <div
            className="card card-pad"
            style={{ maxWidth: 460, margin: "0 auto" }}
          >
            <p className="kicker">Keep your card</p>
            <h3
              className="display"
              style={{ fontSize: "1.4rem", margin: "4px 0 12px" }}
            >
              Want it saved + a place to match?
            </h3>
            <label
              style={{
                display: "block",
                fontSize: "0.8125rem",
                fontWeight: 600,
                marginBottom: 12,
              }}
            >
              Email
              <input
                type="email"
                placeholder="aanya@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={fiStyle}
              />
            </label>
            <label
              style={{
                display: "flex",
                gap: 10,
                fontSize: "0.72rem",
                color: "var(--pk-muted)",
                lineHeight: 1.5,
                marginBottom: 14,
              }}
            >
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                style={{ marginTop: 3, accentColor: "var(--pk-ink)" }}
              />
              <span>
                Send me my card &amp; a matching trip idea —{" "}
                <Link
                  href="/legal"
                  style={{ color: "var(--pk-accent-deep)" }}
                >
                  Privacy
                </Link>
                .{" "}
                <em
                  style={{
                    fontStyle: "normal",
                    color: "var(--pk-accent-deep)",
                    fontWeight: 600,
                  }}
                >
                  Not pre-ticked.
                </em>
              </span>
            </label>
            <a
              href={waHref}
              target="_blank"
              rel="noopener"
              onClick={handleWaCapture}
              className="btn"
              style={{
                width: "100%",
                justifyContent: "center",
                background: "oklch(0.72 0.13 150)",
                color: "oklch(0.2 0.05 150)",
                textDecoration: "none",
                display: "flex",
              }}
            >
              ✦ Get my card on WhatsApp
            </a>
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: 22,
            }}
          >
            <button onClick={restart} className="btn btn-ghost btn-sm">
              ↻ Retake
            </button>
            <Link href="/game" className="btn btn-accent btn-sm">
              Now let my star send me ✦
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
