"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePersona } from "@/components/PersonaProvider";
import { createClient } from "@/lib/supabase/client";
import { submitCapture } from "@/lib/actions";
import WhatsAppClose from "@/components/WhatsAppClose";
import { SITE } from "@/lib/site";

// ── FSM state type ──────────────────────────────────────────────────────────
type Stage =
  | "wizard"
  | "spin"
  | "reveal"
  | "mystery"
  | "pick3"
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

// Stage ordering for the progress rail
const ORDER: Stage[] = ["wizard", "spin", "reveal", "mystery", "pick3", "tease", "gate", "otp", "itinload", "itin", "report"];
const RAIL_STEPS: Stage[] = ["wizard", "spin", "reveal", "mystery", "tease", "itin"];
const LABELS: Record<Stage, string> = {
  wizard:   "Step 1 · your six",
  spin:     "The spin",
  reveal:   "The reveal",
  mystery:  "The mystery ladder",
  pick3:    "Pick 1 of 3",
  tease:    "The tease",
  gate:     "The gate",
  otp:      "Verify",
  itinload: "Writing…",
  itin:     "Your itinerary",
  report:   "Share it",
};

// Shared styles derived from renderVals()
const MYS_BTN: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 14,
  textAlign: "left",
  cursor: "pointer",
  background: "var(--pk-card)",
  border: "1px solid var(--pk-line-soft)",
  borderRadius: 18,
  padding: "20px 22px",
  boxShadow: "var(--pk-shadow-sm)",
  transition: "transform .15s ease,box-shadow .15s ease",
  width: "100%",
};

const DOOR_STY: React.CSSProperties = {
  cursor: "pointer",
  border: 0,
  borderRadius: 18,
  padding: "34px 10px",
  display: "grid",
  gap: 6,
  placeItems: "center",
  background: "linear-gradient(160deg,oklch(0.42 0.06 225),oklch(0.30 0.05 228))",
  boxShadow: "var(--pk-shadow)",
  transition: "transform .15s ease",
  width: "100%",
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

export default function GameClient() {
  const { persona } = usePersona();

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
  const [intl, setIntl] = useState(false);
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [consent, setConsent] = useState(false);
  // OTP boxes: 6 individual chars
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  // Auth state
  const [otpSending, setOtpSending] = useState(false);
  const [otpSendError, setOtpSendError] = useState<string | null>(null);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpVerifyError, setOtpVerifyError] = useState<string | null>(null);
  // OTP countdown
  const [countdown, setCountdown] = useState(588); // 9:48
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── go() helper (mirrors DCLogic.go) ─────────────────────────────────────
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

  // Start countdown when OTP state entered
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
    setOtpSendError(null);
    if (!email) { setOtpSendError("Please enter your email."); return; }
    setOtpSending(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) {
        setOtpSendError(error.message || "Could not send code. Try again.");
        setOtpSending(false);
        return;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not send code.";
      setOtpSendError(msg);
      setOtpSending(false);
      return;
    }
    setOtpSending(false);
    go("otp");
  }

  async function handleVerifyOtp() {
    const token = otpDigits.join("").trim();
    if (token.length < 6) { setOtpVerifyError("Enter all 6 digits."); return; }
    setOtpVerifying(true);
    setOtpVerifyError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.verifyOtp({ email, token, type: "email" });
      if (error) {
        setOtpVerifyError(error.message || "Invalid code. Try again.");
        setOtpVerifying(false);
        return;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not verify code.";
      setOtpVerifyError(msg);
      setOtpVerifying(false);
      return;
    }
    setOtpVerifying(false);
    // Fire capture
    try {
      await submitCapture({
        kind: "game",
        email,
        persona: persona ?? "mil",
        data: {
          limits: sel,
          resultDestination: intl ? "Gangtey" : "Chopta",
          itinerary: "chopta-5day",
        },
      });
    } catch {}
    go("itinload", "itin", 1800);
  }

  async function handleResendOtp() {
    setOtpSendError(null);
    setOtpVerifyError(null);
    try {
      const supabase = createClient();
      await supabase.auth.signInWithOtp({ email });
    } catch {}
    setCountdown(588);
  }

  // ── OTP digit input handling ──────────────────────────────────────────────
  function handleOtpDigit(i: number, val: string) {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...otpDigits];
    next[i] = digit;
    setOtpDigits(next);
    if (digit && i < 5) {
      otpRefs.current[i + 1]?.focus();
    }
  }

  function handleOtpKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otpDigits[i] && i > 0) {
      otpRefs.current[i - 1]?.focus();
    }
  }

  function formatCountdown(secs: number) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  // ── Render helpers ────────────────────────────────────────────────────────
  const revName = intl ? "Gangtey" : "Chopta";
  const revSub = intl ? "Bhutan · the glacial valley of black-necked cranes" : "Uttarakhand · India’s mini-Switzerland";
  const revPhoto = intl ? "Gangtey, Bhutan · real anchored photo" : "Chopta · real anchored photo";

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
              <fieldset
                key={dim.key}
                style={{
                  background: "var(--pk-card)",
                  border: 0,
                  borderRadius: 18,
                  padding: 20,
                  boxShadow: "var(--pk-shadow-sm)",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  alignContent: "flex-start",
                }}
              >
                <legend style={{ fontFamily: "var(--ui)", fontWeight: 700, fontSize: "0.66rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--pk-muted)", width: "100%", marginBottom: 10 }}>
                  {dim.legend}
                </legend>
                {dim.options.map((opt) => (
                  <span
                    key={opt}
                    className={"pill" + (sel[dim.key] === opt ? " is-on" : "")}
                    onClick={() => setSel({ ...sel, [dim.key]: opt })}
                    style={{ cursor: "pointer" }}
                  >
                    {opt}
                  </span>
                ))}
              </fieldset>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 26 }}>
            <button onClick={() => go("spin", "reveal", 2600)} className="btn btn-primary btn-lg">✦ Send me my star</button>
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
          <div className="well" style={{ aspectRatio: "16/10" }} data-label={revPhoto} />
          <div style={{ padding: 28 }}>
            <p className="kicker">Your star sent you to</p>
            <h2 className="display" style={{ fontSize: "clamp(2rem,6vw,2.6rem)" }}>{revName}</h2>
            <p className="poetry" style={{ color: "var(--pk-muted)" }}>{revSub}</p>
            {intl && (
              <div style={{ marginTop: 16, padding: 16, borderRadius: 14, background: "var(--pk-panel)", borderLeft: "3px solid var(--pk-accent)" }}>
                <p style={{ fontSize: "0.92rem" }}>This is <strong style={{ color: "var(--pk-accent-deep)" }}>Gangtey, Bhutan.</strong> Your India twin: <strong style={{ color: "var(--pk-accent-deep)" }}>Chopta.</strong> Same soul, 80% less — bookable now.</p>
                <button onClick={() => setIntl(false)} className="btn btn-primary btn-sm" style={{ marginTop: 10 }}>Show me the India version →</button>
              </div>
            )}
            {!intl && (
              <p style={{ color: "var(--pk-text)", fontSize: "0.95rem", marginTop: 14, maxWidth: "52ch" }}>
                <strong style={{ color: "var(--pk-accent-deep)" }}>Why it fits you:</strong>{" "}
                <span className="cz">slow, mid-comfort, squad-sized — a 5-day pine-and-snow ridge a night-train from you. it&apos;s giving main character.</span>
                <span className="cm">slow, mid-comfort, squad-sized — a 5-day pine-and-snow ridge a night-train from where you are.</span>
                <span className="ct">a slow, mid-comfort ridge for a small group — five days of pine and snow, a night&apos;s train away.</span>
              </p>
            )}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
              <button onClick={() => go("mystery")} className="btn btn-accent">I&apos;m going ✦</button>
              <button onClick={() => go("spin", "reveal", 2600)} className="btn btn-ghost">↻ Send me again</button>
              {!intl && (
                <button onClick={() => setIntl(true)} className="btn btn-ghost">Show the dream-anchor twin</button>
              )}
            </div>
          </div>
        </article>
      )}

      {/* ░░ MYSTERY LADDER ░░ */}
      {stage === "mystery" && (
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <p className="kicker">The mystery ladder</p>
          <h2 className="display" style={{ fontSize: "clamp(1.8rem,5vw,2.4rem)", margin: "6px 0 6px" }}>How much mystery can you handle?</h2>
          <p className="lede" style={{ marginBottom: 24 }}>The less you know before you go, the bigger the badge.</p>
          <div style={{ display: "grid", gap: 14 }}>
            <button onClick={() => go("tease")} style={MYS_BTN}>
              <div style={{ textAlign: "left" }}>
                <p className="display" style={{ fontSize: "1.3rem" }}>Reveal the city</p>
                <p style={{ color: "var(--pk-muted)", fontSize: "0.86rem" }}>You know it&apos;s Chopta. Plan freely, no surprises.</p>
              </div>
              <span className="pill">easy</span>
            </button>
            <button onClick={() => go("pick3")} style={MYS_BTN}>
              <div style={{ textAlign: "left" }}>
                <p className="display" style={{ fontSize: "1.3rem" }}>Pick 1 of 3</p>
                <p style={{ color: "var(--pk-muted)", fontSize: "0.86rem" }}>Three blacked-out doors. Choose by feeling alone.</p>
              </div>
              <span className="pill">medium</span>
            </button>
            <button onClick={() => go("tease")} style={MYS_BTN}>
              <div style={{ textAlign: "left" }}>
                <p className="display" style={{ fontSize: "1.3rem" }}>Full blackout</p>
                <p style={{ color: "var(--pk-muted)", fontSize: "0.86rem" }}>You find out at the airport. We pack the hints.</p>
              </div>
              <span className="pill" style={{ background: "var(--pk-ink)", color: "var(--pk-on-ink)" }}>hard ✦</span>
            </button>
          </div>
        </div>
      )}

      {/* ░░ PICK 1 OF 3 ░░ */}
      {stage === "pick3" && (
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <p className="kicker">Pick 1 of 3</p>
          <h2 className="display" style={{ fontSize: "clamp(1.8rem,5vw,2.3rem)", margin: "6px 0 22px" }}>Choose a door. No peeking.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
            {(["door one", "door two", "door three"] as const).map((label) => (
              <button key={label} onClick={() => go("tease")} style={DOOR_STY}>
                <span className="display" style={{ fontSize: "2.2rem", color: "var(--pk-on-ink)" }}>?</span>
                <span style={{ color: "oklch(1 0 0 / .55)", fontSize: "0.72rem" }}>{label}</span>
              </button>
            ))}
          </div>
          <p style={{ fontSize: "0.78rem", color: "var(--pk-muted)", marginTop: 16 }}>Whatever&apos;s behind it, you said yes first.</p>
        </div>
      )}

      {/* ░░ TEASE ░░ */}
      {stage === "tease" && (
        <div className="card" style={{ maxWidth: 540, margin: "0 auto" }}>
          <div className="card-pad">
            <p className="kicker">Your 5-day Chopta drift</p>
            <ol style={{ listStyle: "none", display: "grid", gap: 12, marginTop: 14 }}>
              <li style={{ fontSize: "0.92rem" }}><b style={{ color: "var(--pk-accent-deep)" }}>Day 1</b> — Night train to Haridwar, road to Chopta as the pine line begins.</li>
              <li style={{ fontSize: "0.92rem", filter: "blur(3.5px)", userSelect: "none", opacity: 0.85 }}><b style={{ color: "var(--pk-accent-deep)" }}>Day 2</b> — Dawn climb to Tungnath, the world&apos;s highest Shiva temple, then…</li>
              <li style={{ fontSize: "0.92rem", filter: "blur(3.5px)", userSelect: "none", opacity: 0.85 }}><b style={{ color: "var(--pk-accent-deep)" }}>Day 3</b> — A meadow most people never reach, where…</li>
              <li style={{ fontSize: "0.92rem", filter: "blur(3.5px)", userSelect: "none", opacity: 0.85 }}><b style={{ color: "var(--pk-accent-deep)" }}>Day 4</b> — ████████ ████ ██████ ███████.</li>
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
          {otpSendError && (
            <p style={{ fontSize: "0.82rem", color: "oklch(0.6 0.2 25)", marginBottom: 10 }}>{otpSendError}</p>
          )}
          <button
            onClick={handleSendOtp}
            disabled={otpSending}
            className="btn btn-primary"
            style={{ width: "100%", justifyContent: "center" }}
          >
            {otpSending ? "Sending…" : "Email me a code"}
          </button>
        </div>
      )}

      {/* ░░ OTP ░░ */}
      {stage === "otp" && (
        <div className="card card-pad" style={{ maxWidth: 420, margin: "0 auto", textAlign: "center" }}>
          <p className="kicker">Check your inbox</p>
          <h3 className="display" style={{ fontSize: "1.6rem", margin: "4px 0 14px" }}>Enter your 6-digit code</h3>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 10 }}>
            {otpDigits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { otpRefs.current[i] = el; }}
                value={digit}
                maxLength={1}
                inputMode="numeric"
                pattern="[0-9]*"
                onChange={(e) => handleOtpDigit(i, e.target.value)}
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
            <span
              style={{ color: "var(--pk-accent-deep)", cursor: "pointer" }}
              onClick={handleResendOtp}
            >
              Resend
            </span>
          </p>
          {otpVerifyError && (
            <p style={{ fontSize: "0.82rem", color: "oklch(0.6 0.2 25)", margin: "10px 0 0" }}>{otpVerifyError}</p>
          )}
          <button
            onClick={handleVerifyOtp}
            disabled={otpVerifying}
            className="btn btn-accent"
            style={{ width: "100%", justifyContent: "center", marginTop: 14 }}
          >
            {otpVerifying ? "Verifying…" : "Unlock my itinerary ✦"}
          </button>
          <p style={{ fontSize: "0.72rem", color: "var(--pk-muted)", marginTop: 8 }}>Demo — any code works.</p>
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
            <div className="well bg" style={{ position: "absolute", inset: 0 }} />
            <div style={{ position: "relative", padding: 24, textShadow: "0 2px 18px oklch(0.3 0.06 225 / .5)" }}>
              <p className="kicker" style={{ color: "var(--pk-on-ink)" }}>5 days · sent by your star</p>
              <h1 className="display-xl" style={{ fontSize: "clamp(2.2rem,6vw,3.2rem)", color: "var(--pk-on-ink)" }}>Chopta</h1>
            </div>
          </header>
          <div style={{ padding: 28, display: "grid", gap: 22 }}>
            <div style={{ display: "flex", gap: 18 }}>
              <span style={DLAB}>Day 1</span>
              <div>
                <h3 className="display" style={{ fontSize: "1.2rem" }}>Into the pines</h3>
                <p style={{ color: "var(--pk-muted)", fontSize: "0.9rem", marginTop: 4 }}>Night train to Haridwar, road up as the deodar line begins. Settle in at a ridge-side stay; first chai with a Tungnath view.</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 18 }}>
              <span style={DLAB}>Day 2</span>
              <div>
                <h3 className="display" style={{ fontSize: "1.2rem" }}>Tungnath at dawn</h3>
                <p style={{ color: "var(--pk-muted)", fontSize: "0.9rem", marginTop: 4 }}>Climb to the highest Shiva temple on earth, push to Chandrashila for the Himalayan crown line. Slow afternoon.</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 18 }}>
              <span style={DLAB}>Day 3</span>
              <div>
                <h3 className="display" style={{ fontSize: "1.2rem" }}>The meadow nobody geotags</h3>
                <p style={{ color: "var(--pk-muted)", fontSize: "0.9rem", marginTop: 4 }}>A guided walk to Deoria Tal, reflections of Chaukhamba on still water. Picnic, no rush.</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 18 }}>
              <span style={DLAB}>Day 4–5</span>
              <div>
                <h3 className="display" style={{ fontSize: "1.2rem" }}>Drift back, slowly</h3>
                <p style={{ color: "var(--pk-muted)", fontSize: "0.9rem", marginTop: 4 }}>Forest village morning, hand-back to road. Buffer day built in — the star never over-packs.</p>
              </div>
            </div>
            <div style={{ background: "var(--pk-panel)", borderRadius: 16, padding: 20 }}>
              <p className="kicker">The honest catches</p>
              <ul style={{ margin: "10px 0 0 18px", fontSize: "0.875rem", display: "grid", gap: 6 }}>
                <li>Permits not required; carry ID for forest checkposts.</li>
                <li>Network drops past Ukhimath — that&apos;s the point.</li>
                <li>Best Apr–Jun &amp; Sep–Nov; winter snows the road.</li>
              </ul>
            </div>
            <WhatsAppClose
              variant="ink"
              eyebrow="Your star has chosen"
              heading="Say yes."
              sub="We talk dates and what's included on chat — there's no rate card here."
              context="Chopta, 5 days — the itinerary my star wrote"
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
              <div className="well bg" style={{ position: "absolute", inset: 0 }} />
              <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="seal t-paper" style={{ width: 34 }}>
                  <span className="ring" />
                  <span className="star" />
                </span>
                <span style={{ fontFamily: "var(--ui)", fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.12em", color: "#fff" }}>#StarSent</span>
              </div>
              <div style={{ position: "relative" }}>
                <p style={{ fontFamily: "var(--ui)", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", fontSize: "0.65rem", color: "#fff", opacity: 0.92 }}>My star sent me to</p>
                <h2 className="display-xl" style={{ fontSize: "2.6rem", color: "#fff" }}>Chopta</h2>
                <div style={{ display: "inline-block", marginTop: 10, background: "oklch(1 0 0 / .16)", backdropFilter: "blur(6px)", border: "1px solid oklch(1 0 0 / .3)", color: "#fff", fontWeight: 600, fontSize: "0.7rem", padding: "7px 12px", borderRadius: 99, textShadow: "none" }}>
                  Mountains · Slow · Squad · 5–7d · West→Near ✦
                </div>
              </div>
              <p style={{ position: "relative", fontFamily: "var(--ui)", fontWeight: 600, fontSize: "0.72rem", color: "#fff", opacity: 0.9 }}>driftibo.com/r/ch0pta-92</p>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
              <button className="btn btn-primary btn-sm">IG Story</button>
              <a
                className="btn btn-sm"
                href={`https://wa.me/${SITE.whatsappNumber}?text=My%20star%20sent%20me%20to%20Chopta%20%E2%9C%A6`}
                target="_blank"
                rel="noopener"
                style={{ background: "oklch(0.72 0.13 150)", color: "oklch(0.22 0.05 150)" }}
              >
                WhatsApp
              </a>
              <button className="btn btn-ghost btn-sm">Copy link</button>
              <Link href="/game" className="btn btn-accent btn-sm">Challenge a friend — where will your star send you?</Link>
            </div>
          </div>
          <p className="kicker" style={{ textAlign: "center", margin: "36px 0 14px" }}>IG Story · 3-frame template (9:16)</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
            <div style={{ position: "relative", aspectRatio: "9/16", borderRadius: 16, overflow: "hidden", boxShadow: "var(--pk-shadow)", display: "grid", placeItems: "center", textAlign: "center" }}>
              <div className="well bg" style={{ position: "absolute", inset: 0 }} />
              <div style={{ position: "relative", padding: 14, textShadow: "0 2px 12px oklch(0.28 0.06 225 / .5)" }}>
                <p style={{ fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", fontSize: "0.6rem", color: "#fff" }}>I didn&apos;t pick this.</p>
                <h3 className="display" style={{ color: "#fff", fontSize: "1.5rem" }}>My star did.</h3>
              </div>
            </div>
            <div style={{ position: "relative", aspectRatio: "9/16", borderRadius: 16, overflow: "hidden", boxShadow: "var(--pk-shadow)", display: "grid", placeItems: "center", textAlign: "center" }}>
              <div className="well bg" style={{ position: "absolute", inset: 0 }} />
              <div style={{ position: "relative", padding: 14, textShadow: "0 2px 12px oklch(0.28 0.06 225 / .5)" }}>
                <p style={{ fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", fontSize: "0.6rem", color: "#fff" }}>It sent me to</p>
                <h3 className="display" style={{ color: "#fff", fontSize: "1.8rem" }}>Chopta</h3>
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
            <Link href="/passport" className="btn btn-ghost btn-sm">Add Chopta to my Star Passport →</Link>
          </div>
        </div>
      )}

      {/* ── Restart ── */}
      <div style={{ textAlign: "center", marginTop: 30 }}>
        <button
          onClick={() => go("wizard")}
          style={{ background: "none", border: 0, color: "var(--pk-muted)", fontFamily: "var(--ui)", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3 }}
        >
          ✦ Start the game over
        </button>
      </div>

    </main>
  );
}
