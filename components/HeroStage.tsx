"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import { track } from "@/lib/analytics";

type Scene = { name: string; tag: string; blurb: string };

const SCENES: Scene[] = [
  {
    name: "Chopta",
    tag: "Mini-Switzerland · Uttarakhand",
    blurb:
      "A deodar ridge under the highest Shiva temple on earth — pine, snow, and a sunrise that lines up four Himalayan giants.",
  },
  {
    name: "Spiti",
    tag: "Looks like Iceland · Himachal",
    blurb:
      "Cold high-desert moonland, thousand-year monasteries, and a night sky so dark it feels rude to speak.",
  },
  {
    name: "Ziro",
    tag: "Rice terraces to rival Bali · Arunachal",
    blurb:
      "Apatani paddy mosaics, pine hills, and a green valley that turns into a music festival once a year.",
  },
  {
    name: "Gokarna",
    tag: "Goa's quieter coast · Karnataka",
    blurb:
      "Five quiet beaches strung along a cliff path — the only schedule is the tide and the light going gold.",
  },
];

type Card = {
  scene: string;
  name: string;
  rot: string;
  pos: CSSProperties;
  width: string;
  delay: string;
};

const CARDS: Card[] = [
  { scene: "s-chopta", name: "Chopta", rot: "-6deg", pos: { top: "1%", left: "5%" }, width: "47%", delay: "0s" },
  { scene: "s-spiti", name: "Spiti", rot: "6deg", pos: { top: "6%", right: "3%" }, width: "43%", delay: "1.1s" },
  { scene: "s-ziro", name: "Ziro", rot: "5deg", pos: { bottom: "3%", left: "1%" }, width: "45%", delay: "2.2s" },
  { scene: "s-gokarna", name: "Gokarna", rot: "-5deg", pos: { bottom: "0%", right: "8%" }, width: "41%", delay: "3.3s" },
];

export default function HeroStage() {
  const [idx, setIdx] = useState(0);
  const [animate, setAnimate] = useState(false); // name-in only fires after the first advance
  const [spinKey, setSpinKey] = useState(0); // bump → remount the seal → replay the spin

  // Auto-spin the seal shortly after mount (CSS disables the spin under reduced motion).
  useEffect(() => {
    const t = setTimeout(() => setSpinKey((k) => k + 1), 420);
    return () => clearTimeout(t);
  }, []);

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
      setIdx((i) => (i + 1) % SCENES.length);
    }, 4200);
    return () => clearInterval(iv);
  }, []);

  const scene = SCENES[idx];

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
      {/* cross-fading destination scenes */}
      {CARDS.map((c, i) => (
        <div key={c.scene} className={`hero-scene ${c.scene}`} style={{ opacity: i === idx ? 1 : 0 }} />
      ))}
      {/* readability scrim — darkens the copy side, keeps the cards colorful */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "linear-gradient(96deg, oklch(0.15 0.05 234 / .42) 0%, oklch(0.15 0.05 234 / .28) 32%, transparent 56%)",
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
          {/* Value-prop subhead */}
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
            Surprise travel to India&apos;s hidden corners — you tell us your limits, we plan the trip and close it on WhatsApp.
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
            Your star could send you to —
          </p>
          <h1
            data-hero-name
            aria-live="polite"
            className="display-mega"
            style={{
              color: "#fff",
              textShadow: "0 4px 40px oklch(0.18 0.06 232 / .7)",
              fontSize: "clamp(3.2rem,10vw,6.5rem)",
              lineHeight: 0.92,
              paddingBottom: "0.14em",
            }}
          >
            <span key={idx} className={animate ? "name-in" : undefined} style={{ display: "inline-block" }}>
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
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 24 }}>
            {CARDS.map((c, i) => (
              <span
                key={c.scene}
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
          {CARDS.map((c, i) => (
            <div
              key={c.scene}
              className={`hero-card hero-float ${c.scene}${i === idx ? " is-current" : ""}`}
              data-card-idx={i}
              style={
                {
                  "--rot": c.rot,
                  position: "absolute",
                  ...c.pos,
                  width: c.width,
                  aspectRatio: "3/4",
                  borderRadius: "var(--r-lg)",
                  boxShadow: "var(--pk-shadow-lg)",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "flex-end",
                  padding: 15,
                  animationDelay: c.delay,
                } as CSSProperties
              }
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(0deg, oklch(0.18 0.05 232 / .38), transparent 56%)",
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
                  {c.name}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT — swipe carousel (mobile) */}
        <div className="hero-card-strip">
          {CARDS.map((c) => (
            <div key={c.scene} className={`well ${c.scene}`} data-label={c.name} />
          ))}
        </div>
      </div>
    </header>
  );
}
