"use client";

import { useEffect, useRef, useState } from "react";
import { PERSONA } from "@/lib/persona";
import { submitCapture } from "@/lib/actions";
import WhatsAppClose from "@/components/WhatsAppClose";
import type { Destination } from "@/lib/content";

// ─── types ────────────────────────────────────────────────────────────────────
type Stage = "input" | "dreaming" | "result";

// ─── pill group helpers ────────────────────────────────────────────────────────
function PillGroup({
  label,
  options,
  selected,
  onPick,
}: {
  label: string;
  options: string[];
  selected: string;
  onPick: (v: string) => void;
}) {
  return (
    <>
      <p className="kicker" style={{ margin: "24px 0 10px" }}>
        {label}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
        {options.map((opt) => (
          <span
            key={opt}
            className={`pill${selected === opt ? " is-on" : ""}`}
            onClick={() => onPick(opt)}
            style={{ cursor: "pointer" }}
          >
            {opt}
          </span>
        ))}
      </div>
    </>
  );
}

function BudgetTiers({
  options,
  selected,
  onPick,
}: {
  options: string[];
  selected: string;
  onPick: (v: string) => void;
}) {
  const baseStyle: React.CSSProperties = {
    flex: 1,
    fontFamily: "var(--ui)",
    fontWeight: 700,
    fontSize: "0.85rem",
    padding: 13,
    borderRadius: "var(--r-md)",
    cursor: "pointer",
    transition: "transform .16s ease",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "var(--pk-line)",
  };
  return (
    <>
      <p
        style={{
          fontFamily: "var(--ui)",
          fontWeight: 700,
          fontSize: "0.7rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          margin: "24px 0 10px",
        }}
      >
        The budget{" "}
        <span
          style={{
            color: "var(--pk-muted)",
            fontWeight: 400,
            textTransform: "none",
            letterSpacing: 0,
          }}
        >
          — stays private
        </span>
      </p>
      <div style={{ display: "flex", gap: 9 }}>
        {options.map((opt) => {
          const isOn = selected === opt;
          return (
            <button
              key={opt}
              style={
                isOn
                  ? {
                      ...baseStyle,
                      background: "var(--pk-ink)",
                      color: "var(--pk-on-ink)",
                      borderColor: "transparent",
                      boxShadow: "0 0 0 2px var(--persona-accent)",
                    }
                  : {
                      ...baseStyle,
                      background: "var(--pk-paper)",
                      color: "var(--pk-text)",
                    }
              }
              onClick={() => onPick(opt)}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </>
  );
}

// ─── main component ────────────────────────────────────────────────────────────
export default function DreamClient({ destinations }: { destinations: Destination[] }) {
  const persona = PERSONA;
  // The reveal gallery is drawn from the live catalogue (first four published places),
  // not a hardcoded set — so it grows with the DB and never names a place we dropped.
  const gallery = destinations.slice(0, 4);

  const [stage, setStage] = useState<Stage>("input");
  const [energy, setEnergy] = useState("Wild & remote");
  const [budget, setBudget] = useState("Comfortable");
  const [when, setWhen] = useState("A weekend soon");

  // prefers-reduced-motion gate (read after mount to avoid SSR mismatch)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function dream() {
    setStage("dreaming");
    const delay = prefersReducedMotion ? 0 : 2200;
    timerRef.current = setTimeout(async () => {
      setStage("result");
      await submitCapture({
        kind: "dream",
        persona,
        data: { energy, budget, when },
      });
    }, delay);
  }

  function again() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setStage("input");
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <main
      style={{
        padding: "90px 20px 72px",
        maxWidth: 660,
        margin: "0 auto",
        minHeight: "100vh",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <p
          className="kicker"
          style={{ color: "var(--persona-accent,var(--pk-accent-deep))" }}
        >
          Dream My Trip
        </p>
      </div>

      {/* ── STATE A · INPUT ── */}
      {stage === "input" && (
        <div
          style={{
            background: "var(--pk-card)",
            borderRadius: "var(--persona-radius)",
            boxShadow: "var(--pk-shadow)",
            padding: "32px 26px",
          }}
        >
          <h1
            className="display-mega"
            style={{ fontSize: "clamp(2rem,7vw,3rem)" }}
          >
            Tell me the feeling.
          </h1>
          <p
            style={{
              color: "var(--pk-muted)",
              fontSize: "1.02rem",
              margin: "10px 0 4px",
              maxWidth: "46ch",
            }}
          >
            Three quick choices and we&apos;ll conjure somewhere that fits the
            feeling you&apos;re after.
          </p>

          <PillGroup
            label="The energy"
            options={["Wild & remote", "Slow & soft", "Social & alive", "Sacred & still"]}
            selected={energy}
            onPick={setEnergy}
          />

          <BudgetTiers
            options={["Easy", "Comfortable", "No limits"]}
            selected={budget}
            onPick={setBudget}
          />

          <PillGroup
            label="When"
            options={["This month", "A weekend soon", "Just dreaming"]}
            selected={when}
            onPick={setWhen}
          />

          <button
            onClick={dream}
            className="btn btn-accent btn-lg"
            style={{ marginTop: 28, width: "100%", justifyContent: "center" }}
          >
            ✦ Dream it for me
          </button>
        </div>
      )}

      {/* ── STATE B · DREAMING ── */}
      {stage === "dreaming" && (
        <div
          className="mesh"
          style={{
            borderRadius: 24,
            padding: "56px 24px",
            display: "grid",
            placeItems: "center",
            gap: 18,
            textAlign: "center",
            minHeight: 380,
          }}
        >
          <div
            className={`seal t-coral breathe${prefersReducedMotion ? "" : " spin-loop"}`}
            style={{ width: 88 }}
          >
            <div className="ring" />
            <div className="star" />
          </div>
          <p
            style={{
              fontFamily: "var(--display)",
              fontStyle: "italic",
              fontSize: "1.5rem",
              color: "#fff",
              textShadow: "0 2px 14px oklch(0.3 0.06 225 / .5)",
            }}
          >
            finding your place…
          </p>
          <div style={{ display: "flex", gap: 10, width: "100%", maxWidth: 420 }}>
            <div
              className="shimmer-sweep"
              style={{
                flex: 1,
                height: 64,
                borderRadius: 12,
                overflow: "hidden",
                position: "relative",
                background: "oklch(1 0 0 / .14)",
              }}
            />
            <div
              className="shimmer-sweep"
              style={{
                flex: 1,
                height: 64,
                borderRadius: 12,
                overflow: "hidden",
                position: "relative",
                background: "oklch(1 0 0 / .14)",
              }}
            />
            <div
              className="shimmer-sweep"
              style={{
                flex: 1,
                height: 64,
                borderRadius: 12,
                overflow: "hidden",
                position: "relative",
                background: "oklch(1 0 0 / .14)",
              }}
            />
          </div>
          <p style={{ color: "oklch(1 0 0 / .7)", fontSize: "0.8rem" }}>
            reading your energy · {energy} · {budget} · {when}
          </p>
        </div>
      )}

      {/* ── STATE C · RESULT ── */}
      {stage === "result" && (
        <article
          style={{
            background: "var(--pk-card)",
            borderRadius: 24,
            overflow: "hidden",
            boxShadow: "var(--pk-shadow-lg)",
          }}
        >
          <div
            className="mesh"
            style={{
              position: "relative",
              minHeight: 340,
              display: "flex",
              alignItems: "flex-end",
              padding: 24,
            }}
          >
            <span
              className="sticker float"
              style={{ position: "absolute", top: 18, right: 16 }}
            >
              ✦ dreamed for you
            </span>
            <div
              style={{
                position: "relative",
                textShadow: "0 2px 20px oklch(0.28 0.06 225 / .55)",
              }}
            >
              <p className="kicker" style={{ color: "#fff" }}>
                A hint of where
              </p>
              <h2
                className="display"
                style={{
                  fontSize: "clamp(2rem,8vw,3.2rem)",
                  color: "#fff",
                  margin: "4px 0 8px",
                }}
              >
                A real place, dreamed for you.
              </h2>
              <p
                style={{
                  color: "oklch(0.98 0.01 210 / .92)",
                  fontSize: "0.96rem",
                  maxWidth: "40ch",
                }}
              >
                A real corner of India that matches your energy — close to your
                budget, far from the crowds.{" "}
                <em style={{ fontStyle: "italic" }}>
                  We&apos;ll name it on WhatsApp.
                </em>
              </p>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 6,
              padding: 6,
              background: "var(--pk-panel)",
            }}
          >
            {gallery.map((d) => (
              <div
                key={d.id}
                className={`well ${d.scene}`}
                style={{
                  aspectRatio: "1",
                  borderRadius: 10,
                  ...(d.portraitImageUrl
                    ? {
                        backgroundImage: `url(${d.portraitImageUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : {}),
                }}
                data-label=""
              />
            ))}
          </div>

          <div style={{ padding: 24, display: "grid", gap: 18 }}>
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
                    fontSize: "0.64rem",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "var(--pk-muted)",
                  }}
                >
                  Looks like a lakh
                </p>
                <p style={{ fontFamily: "var(--display)", fontSize: "1.7rem" }}>
                  ≈ ₹6,800{" "}
                  <span style={{ fontSize: "0.8rem", color: "var(--pk-muted)" }}>
                    / person / day
                  </span>
                </p>
              </div>
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "var(--pk-muted)",
                  maxWidth: "22ch",
                  textAlign: "right",
                }}
              >
                Stay, transfers, a guided day. Verified, never inflated.
              </p>
            </div>

            <WhatsAppClose
              eyebrow="Make it real"
              heading="Want us to make it real?"
              sub="We name the place, lock the dates, and send the full itinerary on chat."
              context="the place you dreamed up for me on Dream My Trip"
            />

            <button
              onClick={again}
              style={{
                justifySelf: "center",
                background: "none",
                border: 0,
                color: "var(--pk-muted)",
                fontFamily: "var(--ui)",
                fontWeight: 600,
                fontSize: "0.84rem",
                cursor: "pointer",
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
            >
              ↻ Dream a different one
            </button>
          </div>
        </article>
      )}
    </main>
  );
}
