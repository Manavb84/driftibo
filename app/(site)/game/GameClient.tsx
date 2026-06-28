"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PERSONA } from "@/lib/persona";
import { useEmailOtp } from "@/lib/hooks/useEmailOtp";
import { track } from "@/lib/analytics";
import { submitCapture, addStarbookStamp } from "@/lib/actions";
import WhatsAppClose from "@/components/WhatsAppClose";
import type { Destination } from "@/lib/content";

// The star "routes" to a real published destination from the user's terrain pick
// (vibe breaks the Forests tie). Not ML — an honest deterministic map over whatever
// is published, so the reveal/itinerary/share all reflect a place that fits the six.
const TERRAIN_TO_SLUG: Record<string, string> = {
  Mountains: "chopta",
  Forests: "ziro",
  "Deserts & Canyons": "spiti",
  "Coast & Islands": "gokarna",
  "Villages & Culture": "ziro",
};

function routeDestination(sel: Sel, destinations: Destination[]): Destination | null {
  if (destinations.length === 0) return null;
  const want = TERRAIN_TO_SLUG[sel.terrain];
  if (sel.terrain === "Mountains" && sel.vibe === "Wild") {
    const spiti = destinations.find((d) => d.slug === "spiti");
    if (spiti) return spiti;
  }
  return destinations.find((d) => d.slug === want) ?? destinations[0];
}

// ── FSM state type ──────────────────────────────────────────────────────────
type Stage =
  | "wizard"
  | "spin"
  | "reveal"
  | "tease"
  | "gate"
  | "otp"
  | "itinload"
  | "itin"
  | "report";

// ── Dimension definitions (from DCLogic.DIMS) ───────────────────────────────
const DIMS = [
  { key: "terrain", legend: "1 · Terrain",      options: ["Mountains", "Forests", "Deserts & Canyons", "Coast & Islands", "Villages & Culture"] },
  { key: "vibe",    legend: "2 · Trip vibe",     options: ["Wild", "Slow", "Social", "Spiritual"] },
  { key: "who",     legend: "3 · Who's coming",  options: ["Solo", "Partner", "Squad", "Family"] },
  { key: "long",    legend: "4 · How long",      options: ["3–4 days", "5–7 days", "10+ days"] },
  { key: "comfort", legend: "5 · Comfort (internal)", options: ["Shoestring", "Mid", "Premium"] },
  { key: "origin",  legend: "6 · Where from",    options: ["North", "West", "South", "East", "Central"] },
  { key: "reach",   legend: "+ How far",          options: ["Near", "Far", "Anywhere"] },
] as const;

type DimKey = (typeof DIMS)[number]["key"];
type Sel = Record<DimKey, string>;

// Stage ordering for the progress rail (mystery/pick3 removed — flow goes spin → reveal → tease)
const ORDER: Stage[] = ["wizard", "spin", "reveal", "tease", "gate", "otp", "itinload", "itin", "report"];
const RAIL_STEPS: Stage[] = ["wizard", "spin", "reveal", "tease", "itin"];
const LABELS: Record<Stage, string> = {
  wizard:   "Step 1 · your six",
  spin:     "The spin",
  reveal:   "The reveal",
  tease:    "The tease",
  gate:     "The gate",
  otp:      "Verify",
  itinload: "Writing…",
  itin:     "Your itinerary",
  report:   "Share it",
};

const DLAB: React.CSSProperties = {
  fontFamily: "var(--ui)",
  fontWeight: 700,
  fontSize: "0.7rem",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "var(--pk-accent-deep)",
  minWidth: 56,
  paddingTop: 4,
};

const FI: React.CSSProperties = {
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

export default function GameClient({ destinations }: { destinations: Destination[] }) {
  const persona = PERSONA;
  const router = useRouter();

  // ── OTP hook (replaces inline otpDigits/refs/sending/error state + handlers) ──
  const {
    digits,
    setDigit,
    refs,
    sending,
    sendError,
    verifying,
    verifyError,
    send,
    verify,
    resend,
    reset,
    setSendError,
  } = useEmailOtp();

  // ── State ──────────────────────────────────────────────────────────────────
  const [stage, setStage] = useState<Stage>("wizard");
  const [sel, setSel] = useState<Sel>({
    terrain: "Mountains",
    vibe: "Slow",
    who: "Squad",
    long: "5–7 days",
    comfort: "Mid",
    origin: "West",
    reach: "Near",
  });
  // The routed destination + a one-line summary of the six, reused in the WhatsApp
  // handoff so the agent opens already knowing who this is and what they picked.
  const dest = useMemo(() => routeDestination(sel, destinations), [sel, destinations]);
  const selSummary = `${sel.terrain} · ${sel.vibe} · ${sel.who} · ${sel.long} · ${sel.comfort} · from ${sel.origin} (${sel.reach})`;
  const waContext = dest
    ? `my star sent me to ${dest.name}, ${dest.region} — ${selSummary}`
    : `the trip my star sent me — ${selSummary}`;
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [consent, setConsent] = useState(false);
  const [copied, setCopied] = useState(false);
  // Share loop: a referral link friends can follow back into the game, plus the
  // caption. The WhatsApp/Share buttons target the user's OWN contacts (no number).
  const shareUrl = `https://driftibo.com/r/${dest?.slug ?? "play"}`;
  const shareText = `My star sent me to ${dest?.name ?? "a real Indian place"} ✦ Where will yours send you?`;

  async function shareReport() {
    track("game_share");
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: "Driftibo", text: shareText, url: shareUrl });
      } else {
        await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }
    } catch {}
  }

  async function copyShareLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  }

  // OTP countdown (hook doesn't own this — it's UI state)
  const [countdown, setCountdown] = useState(588); // 9:48
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── go() helper ───────────────────────────────────────────────────────────
  function go(to: Stage, after?: Stage, ms?: number) {
    setStage(to);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (after && ms) {
      timerRef.current = setTimeout(() => setStage(after), ms);
    }
    try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch {}
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  // Track key stage entries
  useEffect(() => {
    if (stage === "reveal" && dest) track("game_reveal", { slug: dest.slug });
    if (stage === "gate") track("game_gate_view");
    if (stage === "itin") track("itinerary_view");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  // Start countdown when OTP stage entered
  useEffect(() => {
    if (stage === "otp") {
      setCountdown(588);
      if (countdownRef.current) clearInterval(countdownRef.current);
      countdownRef.current = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            clearInterval(countdownRef.current!);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    } else {
      if (countdownRef.current) clearInterval(countdownRef.current);
    }
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [stage]);

  // ── Derived values ────────────────────────────────────────────────────────
  const idx = ORDER.indexOf(stage);
  const stageLabel = LABELS[stage] ?? "";

  const rail = RAIL_STEPS.map((s) => {
    const on = idx >= ORDER.indexOf(s);
    return { on, key: s };
  });

  // ── Auth handlers ─────────────────────────────────────────────────────────
  async function handleSendOtp() {
    // DPDP consent guard — must be checked before any OTP send or capture write
    if (!consent) {
      setSendError("Please accept the consent checkbox to continue.");
      return;
    }
    const ok = await send(email);
    if (ok) {
      track("otp_sent");
      go("otp");
    }
  }

  async function handleVerifyOtp() {
    const ok = await verify(email);
    if (ok) {
      // Fire capture after successful OTP verification
      try {
        await submitCapture({
          kind: "game",
          email,
          persona,
          data: {
            limits: sel,
            whatsapp,
            resultDestination: dest?.name ?? "—",
            resultSlug: dest?.slug ?? null,
          },
        });
      } catch {}
      go("itinload", "itin", 1800);
    }
  }

  async function handleResendOtp() {
    await resend(email);
    setCountdown(588);
  }

  // OTP backspace navigation (hook handles forward focus; we handle backward)
  function handleOtpKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  }

  function formatCountdown(secs: number) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  // ── Render helpers ────────────────────────────────────────────────────────
  const revName = dest?.name ?? "your place";
  const revSub = dest ? `${dest.region} · ${dest.lookLike}` : "";
  const revPhoto = dest?.name ?? "";
  const revImage = dest?.heroImageUrl ?? dest?.portraitImageUrl ?? null;
  const days = dest?.days ?? [];

  return (
    <main style={{ padding: "84px 20px 72px", maxWidth: 860, margin: "0 auto", minHeight: "100vh" }}>

      {/* ── Flow rail ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, margin: "6px 0 22px", flexWrap: "wrap" }}>
        {rail.map((r) => (
          <span
            key={r.key}
            style={{
              width: 9,
              height: 9,
              borderRadius: "50%",
              transition: "all .25s ease",
              background: r.on ? "var(--pk-accent)" : "var(--pk-line)",
              transform: r.on ? "scale(1.15)" : "scale(1)",
              display: "inline-block",
            }}
          />
        ))}
        <span style={{ fontFamily: "var(--ui)", fontWeight: 700, fontSize: "0.66rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--pk-muted)", marginLeft: 8 }}>
          {stageLabel}
        </span>
      </div>

      {/* ░░ WIZARD ░░ */}
      {stage === "wizard" && (
        <div>
          <p className="kicker" style={{ textAlign: "center" }}>Tell your star your limits — not where to go</p>
          <h1 className="display" style={{ fontSize: "clamp(1.9rem,5vw,2.7rem)", textAlign: "center", margin: "6px 0 4px" }}>Six taps. Zero typing.</h1>
          <p className="lede" style={{ textAlign: "center", marginBottom: 24 }}>Tap one in each — your star needs them all.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16 }}>
            {DIMS.map((dim) => (
              <div
                key={dim.key}
                role="group"
                aria-labelledby={`dim-${dim.key}`}
                style={{
                  background: "var(--pk-card)",
                  borderRadius: 18,
                  padding: 20,
                  boxShadow: "var(--pk-shadow-sm)",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  alignContent: "flex-start",
                }}
              >
                <div id={`dim-${dim.key}`} style={{ fontFamily: "var(--ui)", fontWeight: 700, fontSize: "0.66rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--pk-muted)", width: "100%", marginBottom: 10 }}>
                  {dim.legend}
                </div>
                {dim.options.map((opt) => (
                  <button
                    type="button"
                    key={opt}
                    className={"pill" + (sel[dim.key] === opt ? " is-on" : "")}
                    onClick={() => setSel({ ...sel, [dim.key]: opt })}
                    style={{ cursor: "pointer" }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 26 }}>
            <button
              onClick={() => { track("game_spin"); go("spin", "reveal", 2600); }}
              className="btn btn-primary btn-lg"
            >
              ✦ Send me my star
            </button>
            <p style={{ fontSize: "0.75rem", color: "var(--pk-muted)", marginTop: 10 }}>Free reveal — no email yet.</p>
          </div>
        </div>
      )}

      {/* ░░ SPIN ░░ */}
      {stage === "spin" && (
        <div style={{ borderRadius: 24, display: "grid", placeItems: "center", padding: "72px 24px", textAlign: "center", background: "linear-gradient(165deg,oklch(0.46 0.06 222),oklch(0.34 0.06 227))" }}>
          <div className="seal t-ink spinning" style={{ width: 150 }}>
            <div className="ring" />
            <span className="card-pt pn">N</span>
            <span className="card-pt pe">E</span>
            <span className="card-pt ps">S</span>
            <span className="card-pt pw">W</span>
            <div className="star" />
          </div>
          <p className="poetry" style={{ color: "var(--pk-on-ink)", marginTop: 22, fontSize: "1.3rem" }}>Your star is choosing…</p>
          <p style={{ color: "oklch(1 0 0 / .6)", fontSize: "0.8rem", marginTop: 4 }}>drawing from the top 5 places that fit your six</p>
        </div>
      )}

      {/* ░░ REVEAL ░░ */}
      {stage === "reveal" && (
        <article className="pop" style={{ background: "var(--pk-card)", borderRadius: 22, overflow: "hidden", boxShadow: "var(--pk-shadow-lg)", maxWidth: 680, margin: "0 auto" }}>
          <div
            className={`well ${dest?.scene ?? ""}`}
            style={{
              aspectRatio: "16/10",
              ...(revImage
                ? { backgroundImage: `url(${revImage})`, backgroundSize: "cover", backgroundPosition: "center" }
                : {}),
            }}
            data-label={revPhoto}
          />
          <div style={{ padding: 28 }}>
            <p className="kicker">Your star sent you to</p>
            <h2 className="display" style={{ fontSize: "clamp(2rem,6vw,2.6rem)" }}>{revName}</h2>
            <p className="poetry" style={{ color: "var(--pk-muted)" }}>{revSub}</p>
            <p style={{ color: "var(--pk-text)", fontSize: "0.95rem", marginTop: 14, maxWidth: "52ch" }}>
              <strong style={{ color: "var(--pk-accent-deep)" }}>Why it fits you:</strong> {dest?.lede}
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
              <button onClick={() => go("tease")} className="btn btn-accent">I&apos;m going ✦</button>
              <button
                onClick={() => { track("game_spin"); go("spin", "reveal", 2600); }}
                className="btn btn-ghost"
              >
                ↻ Send me again
              </button>
            </div>
          </div>
        </article>
      )}

      {/* ░░ TEASE ░░ */}
      {stage === "tease" && (
        <div className="card" style={{ maxWidth: 540, margin: "0 auto" }}>
          <div className="card-pad">
            <p className="kicker">Your {dest?.dayCount ?? "5"}-day {revName} drift</p>
            <ol style={{ listStyle: "none", display: "grid", gap: 12, marginTop: 14 }}>
              {days.map((day, i) => (
                <li
                  key={i}
                  style={{ fontSize: "0.92rem", ...(i === 0 ? {} : { filter: "blur(3.5px)", userSelect: "none", opacity: 0.85 }) }}
                >
                  <b style={{ color: "var(--pk-accent-deep)" }}>{day.d}</b> — {i === 0 ? day.p : `${day.t}…`}
                </li>
              ))}
            </ol>
            <div style={{ textAlign: "center", marginTop: 18, paddingTop: 16, borderTop: "1px dashed var(--pk-line)" }}>
              <p className="poetry" style={{ fontSize: "1.15rem", marginBottom: 12 }}>The rest is written. Unlock it →</p>
              <button onClick={() => go("gate")} className="btn btn-accent">Unlock my itinerary</button>
            </div>
          </div>
        </div>
      )}

      {/* ░░ GATE ░░ */}
      {stage === "gate" && (
        <div className="card card-pad" style={{ maxWidth: 420, margin: "0 auto" }}>
          <p className="kicker">One step to your itinerary</p>
          <h3 className="display" style={{ fontSize: "1.6rem", margin: "4px 0 14px" }}>Where do we send it?</h3>
          <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: 14 }}>
            Email
            <input
              value={email}
              onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
              type="email"
              placeholder="aanya@email.com"
              style={FI}
            />
          </label>
          <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: 14 }}>
            WhatsApp
            <input
              type="tel"
              placeholder="+91 ·····"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              style={FI}
            />
          </label>
          <label style={{ display: "flex", gap: 10, fontSize: "0.72rem", color: "var(--pk-muted)", lineHeight: 1.5, marginBottom: 14 }}>
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              style={{ marginTop: 3, accentColor: "var(--pk-ink)" }}
            />
            <span>
              I agree Driftibo may contact me about this trip, per the{" "}
              <Link href="/legal" style={{ color: "var(--pk-accent-deep)" }}>Privacy Notice</Link>.{" "}
              <em style={{ fontStyle: "normal", color: "var(--pk-accent-deep)", fontWeight: 600 }}>DPDP — not pre-ticked.</em>
            </span>
          </label>
          {sendError && (
            <p style={{ fontSize: "0.82rem", color: "oklch(0.6 0.2 25)", marginBottom: 10 }}>{sendError}</p>
          )}
          <button
            onClick={handleSendOtp}
            disabled={!consent || sending}
            className="btn btn-primary"
            style={{ width: "100%", justifyContent: "center" }}
          >
            {sending ? "Sending…" : "Email me a code"}
          </button>
        </div>
      )}

      {/* ░░ OTP ░░ */}
      {stage === "otp" && (
        <div className="card card-pad" style={{ maxWidth: 420, margin: "0 auto", textAlign: "center" }}>
          <p className="kicker">Check your inbox</p>
          <h3 className="display" style={{ fontSize: "1.6rem", margin: "4px 0 14px" }}>Enter your 6-digit code</h3>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 10 }}>
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { refs.current[i] = el; }}
                value={digit}
                maxLength={1}
                inputMode="numeric"
                pattern="[0-9]*"
                onChange={(e) => setDigit(i, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                style={{
                  width: 44,
                  height: 54,
                  textAlign: "center",
                  fontFamily: "var(--display)",
                  fontSize: "1.5rem",
                  border: "1px solid var(--pk-line)",
                  borderRadius: 12,
                  background: "var(--pk-paper)",
                }}
              />
            ))}
          </div>
          <p style={{ fontSize: "0.75rem", color: "var(--pk-muted)" }}>
            Code expires in {formatCountdown(countdown)} ·{" "}
            <button
              type="button"
              style={{ color: "var(--pk-accent-deep)", cursor: "pointer", background: "none", border: 0, fontFamily: "inherit", fontSize: "inherit", padding: 0 }}
              onClick={handleResendOtp}
            >
              Resend
            </button>
          </p>
          {verifyError && (
            <p style={{ fontSize: "0.82rem", color: "oklch(0.6 0.2 25)", margin: "10px 0 0" }}>{verifyError}</p>
          )}
          <button
            onClick={handleVerifyOtp}
            disabled={verifying}
            className="btn btn-accent"
            style={{ width: "100%", justifyContent: "center", marginTop: 14 }}
          >
            {verifying ? "Verifying…" : "Unlock my itinerary ✦"}
          </button>
        </div>
      )}

      {/* ░░ ITINERARY LOADING ░░ */}
      {stage === "itinload" && (
        <div style={{ background: "var(--pk-panel)", borderRadius: 20, display: "grid", placeItems: "center", padding: 64, textAlign: "center" }}>
          <div className="seal t-coral spinning" style={{ width: 64 }}>
            <div className="ring" />
            <div className="star" />
          </div>
          <p className="poetry" style={{ marginTop: 16 }}>Your star is writing your days…</p>
        </div>
      )}

      {/* ░░ ITINERARY ░░ */}
      {stage === "itin" && (
        <article className="pop" style={{ background: "var(--pk-card)", borderRadius: 24, overflow: "hidden", boxShadow: "var(--pk-shadow)", maxWidth: 680, margin: "0 auto" }}>
          <header style={{ position: "relative", height: 240, display: "flex", alignItems: "flex-end" }}>
            <div className={`well bg ${dest?.scene ?? ""}`} style={{ position: "absolute", inset: 0, ...(revImage ? { backgroundImage: `url(${revImage})`, backgroundSize: "cover", backgroundPosition: "center" } : {}) }} />
            <div style={{ position: "relative", padding: 24, textShadow: "0 2px 18px oklch(0.3 0.06 225 / .5)" }}>
              <p className="kicker" style={{ color: "var(--pk-on-ink)" }}>{dest?.dayCount ?? "5"} days · sent by your star</p>
              <h1 className="display-xl" style={{ fontSize: "clamp(2.2rem,6vw,3.2rem)", color: "var(--pk-on-ink)" }}>{revName}</h1>
            </div>
          </header>
          <div style={{ padding: 28, display: "grid", gap: 22 }}>
            {days.map((day, i) => (
              <div key={i} style={{ display: "flex", gap: 18 }}>
                <span style={DLAB}>{day.d}</span>
                <div>
                  <h3 className="display" style={{ fontSize: "1.2rem" }}>{day.t}</h3>
                  <p style={{ color: "var(--pk-muted)", fontSize: "0.9rem", marginTop: 4 }}>{day.p}</p>
                </div>
              </div>
            ))}
            {dest && dest.catches.length > 0 && (
              <div style={{ background: "var(--pk-panel)", borderRadius: 16, padding: 20 }}>
                <p className="kicker">The honest catches</p>
                <ul style={{ margin: "10px 0 0 18px", fontSize: "0.875rem", display: "grid", gap: 6 }}>
                  {dest.catches.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}
            <WhatsAppClose
              variant="ink"
              eyebrow="Your star has chosen"
              heading="Say yes."
              sub="We talk dates and what's included on chat — there's no rate card here."
              context={waContext}
            />
            <button onClick={() => go("report")} className="btn btn-ghost" style={{ justifySelf: "center" }}>See my shareable report →</button>
          </div>
        </article>
      )}

      {/* ░░ REPORT ░░ */}
      {stage === "report" && (
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <h2 className="display" style={{ fontSize: "clamp(1.7rem,4vw,2.2rem)", textAlign: "center", marginBottom: 4 }}>Your star report</h2>
          <p className="lede" style={{ textAlign: "center", marginBottom: 24 }}>Screenshot it. Send it. Dare a friend.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24, justifyItems: "center" }}>
            <div style={{ position: "relative", aspectRatio: "4/5", maxWidth: 340, width: "100%", borderRadius: 22, overflow: "hidden", boxShadow: "var(--pk-shadow-lg)", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 20, textShadow: "0 2px 16px oklch(0.28 0.06 225 / .5)" }}>
              <div className={`well bg ${dest?.scene ?? ""}`} style={{ position: "absolute", inset: 0, ...(revImage ? { backgroundImage: `url(${revImage})`, backgroundSize: "cover", backgroundPosition: "center" } : {}) }} />
              <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="seal t-paper" style={{ width: 34 }}>
                  <span className="ring" />
                  <span className="star" />
                </span>
                <span style={{ fontFamily: "var(--ui)", fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.12em", color: "#fff" }}>#StarSent</span>
              </div>
              <div style={{ position: "relative" }}>
                <p style={{ fontFamily: "var(--ui)", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", fontSize: "0.65rem", color: "#fff", opacity: 0.92 }}>My star sent me to</p>
                <h2 className="display-xl" style={{ fontSize: "2.6rem", color: "#fff" }}>{revName}</h2>
                <div style={{ display: "inline-block", marginTop: 10, background: "oklch(1 0 0 / .16)", backdropFilter: "blur(6px)", border: "1px solid oklch(1 0 0 / .3)", color: "#fff", fontWeight: 600, fontSize: "0.7rem", padding: "7px 12px", borderRadius: 99, textShadow: "none" }}>
                  {sel.terrain} · {sel.vibe} · {sel.who} · {sel.long} ✦
                </div>
              </div>
              <p style={{ position: "relative", fontFamily: "var(--ui)", fontWeight: 600, fontSize: "0.72rem", color: "#fff", opacity: 0.9 }}>{shareUrl.replace("https://", "")}</p>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
              <button onClick={shareReport} className="btn btn-primary btn-sm">Share my result</button>
              <a
                className="btn btn-sm"
                href={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`}
                target="_blank"
                rel="noopener"
                style={{ background: "oklch(0.72 0.13 150)", color: "oklch(0.22 0.05 150)" }}
              >
                WhatsApp
              </a>
              <button onClick={copyShareLink} className="btn btn-ghost btn-sm">{copied ? "Copied ✓" : "Copy link"}</button>
              <Link href="/game" className="btn btn-accent btn-sm">Challenge a friend — where will your star send you?</Link>
            </div>
          </div>
          <p className="kicker" style={{ textAlign: "center", margin: "36px 0 14px" }}>IG Story · 3-frame template (9:16)</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
            <div style={{ position: "relative", aspectRatio: "9/16", borderRadius: 16, overflow: "hidden", boxShadow: "var(--pk-shadow)", display: "grid", placeItems: "center", textAlign: "center" }}>
              <div className={`well bg ${dest?.scene ?? ""}`} style={{ position: "absolute", inset: 0, ...(revImage ? { backgroundImage: `url(${revImage})`, backgroundSize: "cover", backgroundPosition: "center" } : {}) }} />
              <div style={{ position: "relative", padding: 14, textShadow: "0 2px 12px oklch(0.28 0.06 225 / .5)" }}>
                <p style={{ fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", fontSize: "0.6rem", color: "#fff" }}>I didn&apos;t pick this.</p>
                <h3 className="display" style={{ color: "#fff", fontSize: "1.5rem" }}>My star did.</h3>
              </div>
            </div>
            <div style={{ position: "relative", aspectRatio: "9/16", borderRadius: 16, overflow: "hidden", boxShadow: "var(--pk-shadow)", display: "grid", placeItems: "center", textAlign: "center" }}>
              <div className={`well bg ${dest?.scene ?? ""}`} style={{ position: "absolute", inset: 0, ...(revImage ? { backgroundImage: `url(${revImage})`, backgroundSize: "cover", backgroundPosition: "center" } : {}) }} />
              <div style={{ position: "relative", padding: 14, textShadow: "0 2px 12px oklch(0.28 0.06 225 / .5)" }}>
                <p style={{ fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", fontSize: "0.6rem", color: "#fff" }}>It sent me to</p>
                <h3 className="display" style={{ color: "#fff", fontSize: "1.8rem" }}>{revName}</h3>
              </div>
            </div>
            <div style={{ position: "relative", aspectRatio: "9/16", borderRadius: 16, overflow: "hidden", boxShadow: "var(--pk-shadow)", display: "grid", placeItems: "center", textAlign: "center", background: "var(--pk-ink)" }}>
              <div style={{ padding: 14 }}>
                <span className="seal t-ink" style={{ width: 50, margin: "0 auto" }}>
                  <span className="ring" />
                  <span className="star" />
                </span>
                <h3 className="display" style={{ color: "#fff", fontSize: "1.3rem", marginTop: 12 }}>Where will yours send you?</h3>
                <span className="btn btn-accent btn-sm" style={{ marginTop: 10 }}>driftibo.com</span>
              </div>
            </div>
          </div>
          <div style={{ textAlign: "center", marginTop: 28 }}>
            <button
              className="btn btn-ghost btn-sm"
              onClick={async () => {
                // Stamp the draw, then open the Starbook. No-ops gracefully if signed out.
                if (dest) await addStarbookStamp(dest.slug, dest.name);
                router.push("/starbook");
              }}
            >
              Add {revName} to my Starbook →
            </button>
          </div>
        </div>
      )}

      {/* ── Restart — full FSM reset ── */}
      <div style={{ textAlign: "center", marginTop: 30 }}>
        <button
          onClick={() => {
            reset();           // hook: clears digits, errors, sending/verifying
            setEmail("");
            setWhatsapp("");
            setConsent(false);
            setCountdown(588);
            go("wizard");
          }}
          style={{ background: "none", border: 0, color: "var(--pk-muted)", fontFamily: "var(--ui)", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3 }}
        >
          ✦ Start the game over
        </button>
      </div>

    </main>
  );
}
