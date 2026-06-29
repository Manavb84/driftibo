"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import { track } from "@/lib/analytics";
import { useIntent } from "./IntentProvider";
import { LANE } from "@/lib/lane";
import type { Intent } from "@/lib/intent";

// Card geometry (positions/rotations) — index-aligned to the active lane's 4 scenes,
// so swapping lanes re-skins the same cluster without touching layout.
type Slot = { rot: string; pos: CSSProperties; width: string; delay: string };
const SLOTS: Slot[] = [
  { rot: "-6deg", pos: { top: "1%", left: "5%" }, width: "47%", delay: "0s" },
  { rot: "6deg", pos: { top: "6%", right: "3%" }, width: "43%", delay: "1.1s" },
  { rot: "5deg", pos: { bottom: "3%", left: "1%" }, width: "45%", delay: "2.2s" },
  { rot: "-5deg", pos: { bottom: "0%", right: "8%" }, width: "41%", delay: "3.3s" },
];

// `intent` is the SSR-resolved lane (from the cookie, via getIntent); the IntentProvider
// context takes over once hydrated so a chooser pick re-skins the hero live. Falls back
// to India for organic, undecided visitors.
export default function HeroStage({ intent }: { intent?: Intent | null }) {
  const ctx = useIntent();
  const active: Intent = ctx.intent ?? intent ?? "india";
  const laneData = LANE[active];
  const scenes = laneData.scenes;

  const [idx, setIdx] = useState(0);
  const [animate, setAnimate] = useState(true); // first name animates in on mount too
  const [spinKey, setSpinKey] = useState(0); // bump → remount the seal → replay the spin
  const [parallax, setParallax] = useState(0);

  // Auto-spin the seal shortly after mount (CSS disables the spin under reduced motion).
  useEffect(() => {
    const t = setTimeout(() => setSpinKey((k) => k + 1), 420);
    return () => clearTimeout(t);
  }, []);

  // When the lane changes, restart on its first scene with the name animating in.
  useEffect(() => {
    setIdx(0);
    setAnimate(true);
  }, [active]);

  // Cross-fade scenes + swap copy every 4.2s, unless the user prefers reduced motion.
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const iv = setInterval(() => {
      setAnimate(true);
      setIdx((i) => (i + 1) % scenes.length);
    }, 4200);
    return () => clearInterval(iv);
    // `active` in deps so the timer resets on lane change — scene 0 always gets a full slot.
  }, [active, scenes.length]);

  // Light scroll parallax on the scene layer — only while the hero is on screen.
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    // rAF-gate so we coalesce a burst of scroll events into one setState per frame.
    let rafPending = false;
    const onScroll = () => {
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(() => {
        rafPending = false;
        const y = window.scrollY;
        if (y < window.innerHeight) setParallax(y * 0.18);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scene = scenes[idx];

  return (
    <header
      style={{
        position: "relative",
        minHeight: "96vh",
        display: "flex",
        alignItems: "center",
        padding: "96px 24px 64px",
        overflow: "hidden",
      }}
    >
      {/* cross-fading destination scenes — real visual-bank photography, ken-burns + parallax */}
      {scenes.map((s, i) => (
        <div
          key={s.name}
          className="hero-scene"
          style={{
            opacity: i === idx ? 1 : 0,
            backgroundImage: `url(${s.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: `translateY(${parallax}px) scale(1.08)`,
          }}
        />
      ))}
      {/* readability scrim — darkens the copy side, keeps the cards colorful */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "linear-gradient(96deg, oklch(0.15 0.05 234 / .58) 0%, oklch(0.15 0.05 234 / .38) 38%, oklch(0.15 0.05 234 / .12) 64%)",
        }}
      />

      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          gap: 40,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* LEFT — copy */}
        <div style={{ flex: "1 1 420px", minWidth: 300, color: "var(--pk-on-ink)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 22 }}>
            <span
              key={spinKey}
              data-hero-seal
              onClick={() => setSpinKey((k) => k + 1)}
              className={`seal t-paper${spinKey > 0 ? " spinning" : ""}`}
              style={{ width: 50, cursor: "pointer", flexShrink: 0 }}
            >
              <div className="ring" />
              <span className="card-pt pn">N</span>
              <span className="card-pt pe">E</span>
              <span className="card-pt ps">S</span>
              <span className="card-pt pw">W</span>
              <div className="star" />
            </span>
            <p
              style={{
                fontFamily: "var(--ui)",
                fontWeight: 700,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                fontSize: "0.7rem",
                color: "oklch(0.98 0.01 210)",
                textShadow: "0 1px 8px oklch(0.2 0.05 232 / .6)",
              }}
            >
              Travel by your own star
            </p>
          </div>
          {/* Brand punch */}
          <p
            style={{
              fontFamily: "var(--display)",
              fontWeight: 600,
              fontSize: "clamp(1.2rem,2.8vw,1.6rem)",
              color: "#fff",
              textShadow: "0 1px 12px oklch(0.2 0.05 232 / .6)",
              marginBottom: 12,
            }}
          >
            Stop choosing. Start packing.
          </p>
          {/* Value-prop subhead — lane-aware */}
          <p
            style={{
              fontFamily: "var(--ui)",
              fontSize: "0.94rem",
              color: "oklch(0.98 0.01 210 / .80)",
              textShadow: "0 1px 10px oklch(0.2 0.05 232 / .5)",
              maxWidth: "44ch",
              lineHeight: 1.55,
              marginBottom: 14,
            }}
          >
            {laneData.heroSubhead}
          </p>
          <p
            className="eyebrow"
            style={{
              fontSize: "clamp(1.05rem,2.4vw,1.35rem)",
              color: "oklch(0.98 0.01 210 / .92)",
              textShadow: "0 1px 12px oklch(0.2 0.05 232 / .55)",
              marginBottom: 4,
            }}
          >
            {laneData.heroEyebrow}
          </p>
          <h1
            data-hero-name
            className="display-mega"
            style={{
              color: "#fff",
              textShadow: "0 4px 40px oklch(0.18 0.06 232 / .7)",
              fontSize: "clamp(3.2rem,10vw,6.5rem)",
              lineHeight: 0.92,
              paddingBottom: "0.14em",
            }}
          >
            <span key={`${active}-${idx}`} className={animate ? "name-in" : undefined} style={{ display: "inline-block" }}>
              {scene.name}
            </span>
          </h1>
          <p
            data-hero-tag
            style={{
              fontFamily: "var(--ui)",
              fontWeight: 700,
              letterSpacing: "0.04em",
              fontSize: "0.92rem",
              color: "oklch(1 0 0 / .9)",
              marginTop: 0,
              textShadow: "0 1px 10px oklch(0.2 0.05 232 / .6)",
            }}
          >
            {scene.tag}
          </p>
          <p
            data-hero-blurb
            style={{
              fontSize: "1.02rem",
              color: "oklch(0.98 0.01 210 / .92)",
              maxWidth: "46ch",
              marginTop: 16,
              lineHeight: 1.6,
              textShadow: "0 1px 12px oklch(0.2 0.05 232 / .5)",
            }}
          >
            {scene.blurb}
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 26 }}>
            <Link
              href="/game"
              className="btn btn-accent btn-lg"
              onClick={() => track("home_cta_click", { cta: "spin_my_star" })}
            >
              ✦ Spin my star
            </Link>
            <Link
              href="/start"
              className="btn btn-lg"
              style={{
                color: "#fff",
                background: "oklch(1 0 0 / .12)",
                WebkitBackdropFilter: "blur(8px)",
                backdropFilter: "blur(8px)",
                boxShadow: "inset 0 0 0 1px oklch(1 0 0 / .38)",
              }}
              onClick={() => track("home_cta_click", { cta: "find_my_kind_of_trip" })}
            >
              Find my kind of trip →
            </Link>
          </div>
          {/* Micro-trust line — the human-on-WhatsApp promise, right under the CTAs */}
          <p
            style={{
              fontFamily: "var(--ui)",
              fontSize: "0.8rem",
              fontWeight: 500,
              color: "oklch(1 0 0 / .82)",
              textShadow: "0 1px 8px oklch(0.2 0.05 232 / .55)",
              marginTop: 14,
              maxWidth: "44ch",
            }}
          >
            {laneData.microTrust}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 20 }}>
            {scenes.map((s, i) => (
              <span
                key={s.name}
                data-hero-dot
                style={{
                  width: 24,
                  height: 4,
                  borderRadius: "var(--r-pill)",
                  background: "#fff",
                  opacity: i === idx ? 1 : 0.35,
                  transition: "opacity .4s ease",
                }}
              />
            ))}
            <span style={{ fontSize: "0.74rem", color: "oklch(1 0 0 / .72)", fontWeight: 600, marginLeft: 6 }}>
              You don&apos;t pick. It does.
            </span>
          </div>
        </div>

        {/* RIGHT — floating card cluster (desktop) */}
        <div
          className="hero-card-cluster"
          style={{ flex: "1 1 340px", minWidth: 280, position: "relative", height: "clamp(380px,42vw,500px)" }}
        >
          {scenes.map((s, i) => {
            const slot = SLOTS[i];
            return (
              <div
                key={s.name}
                className={`hero-card hero-float${i === idx ? " is-current" : ""}`}
                data-card-idx={i}
                style={
                  {
                    "--rot": slot.rot,
                    position: "absolute",
                    ...slot.pos,
                    width: slot.width,
                    aspectRatio: "3/4",
                    borderRadius: "var(--r-lg)",
                    boxShadow: "var(--pk-shadow-lg)",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "flex-end",
                    padding: 15,
                    animationDelay: slot.delay,
                    backgroundImage: `url(${s.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  } as CSSProperties
                }
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(0deg, oklch(0.18 0.05 232 / .5), transparent 56%)",
                  }}
                />
                <div style={{ position: "relative" }}>
                  <p
                    style={{
                      fontFamily: "var(--ui)",
                      fontWeight: 700,
                      fontSize: "0.54rem",
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: "oklch(1 0 0 / .82)",
                    }}
                  >
                    ✦ star-sent
                  </p>
                  <p className="display" style={{ fontSize: "1.2rem", color: "#fff", lineHeight: 1.12 }}>
                    {s.name}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT — swipe carousel (mobile) */}
        <div className="hero-card-strip">
          {scenes.map((s) => (
            <div
              key={s.name}
              className="well"
              data-label={s.name}
              style={{ backgroundImage: `url(${s.image})`, backgroundSize: "cover", backgroundPosition: "center" }}
            />
          ))}
        </div>
      </div>
    </header>
  );
}
