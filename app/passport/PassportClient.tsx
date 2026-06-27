"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { submitCapture } from "@/lib/actions";
import { usePersona } from "@/components/PersonaProvider";

// ─── Badge data ───────────────────────────────────────────────────────────────
type Badge = {
  name: string;
  note: string;
  color: string;
  dim: boolean;
};

const BADGES: Badge[] = [
  { name: "First Light", note: "your first send", color: "oklch(0.85 0.09 85)", dim: false },
  { name: "The Leap", note: "booked within 24h", color: "oklch(0.7 0.13 25)", dim: false },
  { name: "Lone Star", note: "a solo send", color: "oklch(0.6 0.08 250)", dim: false },
  { name: "Wild Sent", note: "a Wild-vibe place", color: "oklch(0.65 0.12 150)", dim: true },
  { name: "Constellation", note: "8+ places", color: "oklch(0.75 0.1 320)", dim: true },
];

// ─── Countdown state ──────────────────────────────────────────────────────────
type Countdown = { dd: number; hh: string; mm: string; ss: string };

function computeCountdown(): Countdown {
  const now = new Date();
  const istMs = now.getTime() + now.getTimezoneOffset() * 60000 + 5.5 * 3600000;
  const ist = new Date(istMs);
  const target = new Date(istMs);
  let add = (4 - ist.getDay() + 7) % 7; // 4 = Thursday
  target.setDate(ist.getDate() + add);
  target.setHours(20, 0, 0, 0);
  if (target.getTime() <= istMs) target.setDate(target.getDate() + 7);
  let s = Math.max(0, Math.floor((target.getTime() - istMs) / 1000));
  const dd = Math.floor(s / 86400);
  const hh = Math.floor((s % 86400) / 3600);
  const mm = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return { dd, hh: pad(hh), mm: pad(mm), ss: pad(ss) };
}

// ─── Props ────────────────────────────────────────────────────────────────────
type Stamp = { slug: string; label: string };

type Props = {
  user: User | null;
  stamps: Stamp[];
};

// ─── Auth flow stages ─────────────────────────────────────────────────────────
type AuthStage = "email" | "otp" | "success";

// ─── Component ────────────────────────────────────────────────────────────────
export default function PassportClient({ user, stamps }: Props) {
  const router = useRouter();
  const { persona } = usePersona();

  // ── Countdown ──
  const [countdown, setCountdown] = useState<Countdown>({
    dd: 0,
    hh: "--",
    mm: "--",
    ss: "--",
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    setCountdown(computeCountdown());
    intervalRef.current = setInterval(() => {
      setCountdown(computeCountdown());
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // ── Auth state ──
  const [authStage, setAuthStage] = useState<AuthStage>("email");
  const [authEmail, setAuthEmail] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({ email: authEmail });
      if (error) {
        setAuthError(error.message);
      } else {
        setAuthStage("otp");
      }
    } catch (err) {
      setAuthError("Could not send code. Check your connection and try again.");
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.verifyOtp({
        email: authEmail,
        token: authCode,
        type: "email",
      });
      if (error) {
        setAuthError(error.message);
      } else {
        setAuthStage("success");
        router.refresh();
      }
    } catch (err) {
      setAuthError("Verification failed. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  }

  // ── Star Drop signup ──
  const [dropEmail, setDropEmail] = useState("");
  const [dropSubmitted, setDropSubmitted] = useState(false);
  const [dropError, setDropError] = useState<string | null>(null);

  async function handleDropSignup(e: React.FormEvent) {
    e.preventDefault();
    setDropError(null);
    const result = await submitCapture({
      kind: "star_drop",
      email: dropEmail,
      persona: persona ?? undefined,
    });
    if (result.ok) {
      setDropSubmitted(true);
    } else {
      setDropError(result.error ?? "Something went wrong.");
    }
  }

  // ── Shared input style ──
  const inputStyle: React.CSSProperties = {
    display: "block",
    width: "100%",
    marginTop: 6,
    padding: "11px 13px",
    borderRadius: 10,
    border: "1px solid var(--pk-line)",
    background: "var(--pk-paper)",
    fontFamily: "var(--ui)",
    fontSize: "0.9rem",
    color: "var(--pk-text)",
    outline: "none",
  };

  return (
    <main
      style={{
        padding: "96px 22px 72px",
        maxWidth: 820,
        margin: "0 auto",
        minHeight: "100vh",
        display: "grid",
        gap: 32,
      }}
    >
      {/* ── 1. Header ── */}
      <div style={{ textAlign: "center" }}>
        <p className="kicker">The movement</p>
        <h1
          className="display-mega"
          style={{ fontSize: "clamp(2.2rem,7vw,3.2rem)", marginTop: 6, marginBottom: 6 }}
        >
          Your Star Passport
        </h1>
        <p className="lede" style={{ maxWidth: "46ch", margin: "0 auto" }}>
          Every place the star sent you, stamped. Badges you earn by fate, not by grinding. And a
          door that only opens on Thursdays.
        </p>
      </div>

      {/* ── 2. Passport callout-ink card ── */}
      <div className="callout-ink" style={{ borderRadius: 22, padding: 28 }}>
        {!user ? (
          /* ── Sign-in panel ── */
          <div style={{ maxWidth: 400, margin: "0 auto" }}>
            {authStage === "email" && (
              <form onSubmit={handleSendOtp}>
                <p className="kicker" style={{ marginBottom: 10 }}>
                  Sign in to your passport
                </p>
                <h2
                  className="display"
                  style={{ fontSize: "1.5rem", color: "var(--pk-on-ink)", marginBottom: 14 }}
                >
                  Enter your email
                </h2>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: "var(--pk-on-ink)",
                  }}
                >
                  Email
                  <input
                    type="email"
                    required
                    placeholder="aanya@email.com"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    style={{ ...inputStyle, background: "oklch(1 0 0 / .08)", color: "var(--pk-on-ink)", border: "1px solid oklch(1 0 0 / .2)" }}
                  />
                </label>
                {authError && (
                  <p style={{ color: "oklch(0.80 0.085 32)", fontSize: "0.82rem", marginTop: 8 }}>
                    {authError}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={authLoading}
                  className="btn btn-accent"
                  style={{ marginTop: 16, width: "100%", justifyContent: "center" }}
                >
                  {authLoading ? "Sending…" : "Send code"}
                </button>
              </form>
            )}

            {authStage === "otp" && (
              <form onSubmit={handleVerifyOtp}>
                <p className="kicker" style={{ marginBottom: 10 }}>
                  Check your inbox
                </p>
                <h2
                  className="display"
                  style={{ fontSize: "1.5rem", color: "var(--pk-on-ink)", marginBottom: 14 }}
                >
                  Enter the code
                </h2>
                <p
                  style={{
                    color: "oklch(1 0 0 / .65)",
                    fontSize: "0.85rem",
                    marginBottom: 14,
                  }}
                >
                  We sent a one-time code to {authEmail}.
                </p>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: "var(--pk-on-ink)",
                  }}
                >
                  Code
                  <input
                    type="text"
                    required
                    placeholder="123456"
                    value={authCode}
                    onChange={(e) => setAuthCode(e.target.value)}
                    style={{ ...inputStyle, background: "oklch(1 0 0 / .08)", color: "var(--pk-on-ink)", border: "1px solid oklch(1 0 0 / .2)", letterSpacing: "0.18em" }}
                  />
                </label>
                {authError && (
                  <p style={{ color: "oklch(0.80 0.085 32)", fontSize: "0.82rem", marginTop: 8 }}>
                    {authError}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={authLoading}
                  className="btn btn-accent"
                  style={{ marginTop: 16, width: "100%", justifyContent: "center" }}
                >
                  {authLoading ? "Verifying…" : "Verify"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthStage("email");
                    setAuthCode("");
                    setAuthError(null);
                  }}
                  style={{
                    display: "block",
                    marginTop: 12,
                    background: "none",
                    border: 0,
                    color: "oklch(1 0 0 / .55)",
                    fontFamily: "var(--ui)",
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    textDecoration: "underline",
                    textUnderlineOffset: 3,
                  }}
                >
                  ← Use a different email
                </button>
              </form>
            )}

            {authStage === "success" && (
              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <span className="seal t-coral" style={{ width: 52, margin: "0 auto" }}>
                  <span className="ring" />
                  <span className="star" />
                </span>
                <p
                  className="display"
                  style={{ fontSize: "1.4rem", color: "var(--pk-on-ink)", marginTop: 14 }}
                >
                  Signed in — refreshing your passport…
                </p>
              </div>
            )}
          </div>
        ) : (
          /* ── Passport (logged in) ── */
          <div>
            {/* Header row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <div>
                <p className="kicker">Star Passport</p>
                <p
                  style={{
                    fontFamily: "var(--display)",
                    fontSize: "1.1rem",
                    color: "var(--pk-on-ink)",
                    marginTop: 2,
                  }}
                >
                  {user.user_metadata?.full_name ?? user.email}
                </p>
              </div>
              <span className="seal t-ink" style={{ width: 44 }}>
                <span className="ring" />
                <span className="star" />
              </span>
            </div>

            {/* Stamps grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(96px,1fr))",
                gap: 16,
                marginTop: 20,
              }}
            >
              {stamps.length === 0 && (
                <>
                  <LockedSlot />
                  <LockedSlot />
                </>
              )}
              {stamps.map((stamp) => (
                <div
                  key={stamp.slug}
                  style={{
                    textAlign: "center",
                    fontSize: "0.72rem",
                    color: "oklch(1 0 0 / .75)",
                    display: "grid",
                    gap: 6,
                  }}
                >
                  <div
                    className="well mask-circle"
                    style={{ width: "100%" }}
                    data-label={stamp.label}
                  />
                  <span>{stamp.label}</span>
                </div>
              ))}
              {/* Always show 2 locked slots at the end */}
              <LockedSlot />
              <LockedSlot />
            </div>

            {/* Footer */}
            <p
              style={{
                color: "oklch(1 0 0 / .6)",
                fontSize: "0.78rem",
                marginTop: 16,
              }}
            >
              {stamps.length} of ∞ stamped &middot; the locked slots fill only when your star
              sends you somewhere new.
            </p>
          </div>
        )}
      </div>

      {/* ── 3. Badges section ── */}
      <div>
        <p className="kicker">Fate-earned badges</p>
        <p style={{ color: "var(--pk-muted)", fontSize: "0.88rem", margin: "4px 0 14px" }}>
          Earned by what the star sends — never by grinding.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))",
            gap: 14,
          }}
        >
          {BADGES.map((badge) => (
            <div
              key={badge.name}
              style={{
                background: "var(--pk-card)",
                borderRadius: 16,
                padding: 18,
                boxShadow: "var(--pk-shadow-sm)",
                textAlign: "center",
                display: "grid",
                gap: 4,
                opacity: badge.dim ? 0.45 : 1,
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  margin: "0 auto",
                  marginBottom: 6,
                  background: badge.color,
                  clipPath:
                    "polygon(50% 0%,56% 44%,100% 50%,56% 56%,50% 100%,44% 56%,0% 50%,44% 44%)",
                }}
              />
              <b style={{ fontFamily: "var(--display)", fontWeight: 400, fontSize: "1.05rem" }}>
                {badge.name}
              </b>
              <span style={{ color: "var(--pk-muted)", fontSize: "0.76rem" }}>{badge.note}</span>
            </div>
          ))}
        </div>
        <p
          style={{
            fontSize: "0.78rem",
            color: "var(--pk-muted)",
            marginTop: 12,
            textAlign: "center",
          }}
        >
          Tiers: Star Traveler → Gold → Star Native → Constellation (8+, founder&apos;s WhatsApp).
        </p>
      </div>

      {/* ── 4. Oath card ── */}
      <div>
        <p className="kicker">Booking = initiation</p>
        <div
          style={{
            borderRadius: 22,
            boxShadow: "var(--pk-shadow)",
            padding: 36,
            textAlign: "center",
            display: "grid",
            gap: 8,
            justifyItems: "center",
            marginTop: 12,
          }}
          className="card"
        >
          <span className="seal t-coral" style={{ width: 56 }}>
            <span className="ring" />
            <span className="star" />
          </span>
          <p className="kicker" style={{ marginTop: 14 }}>
            Your star has chosen
          </p>
          <p
            className="poetry"
            style={{ fontSize: "1.7rem", maxWidth: "24ch" }}
          >
            You said yes. Welcome to the Drift.
          </p>
          <p style={{ color: "var(--pk-muted)", fontSize: "0.85rem" }}>
            Chopta &middot; sent 26 Jun &middot; you leave 14 Jul
          </p>
          <button className="btn btn-ghost btn-sm" style={{ marginTop: 6 }}>
            Share my oath card
          </button>
        </div>
      </div>

      {/* ── 5. Star Drop section ── */}
      <div
        id="star-drop"
        style={{
          background:
            "linear-gradient(150deg,oklch(0.44 0.06 224),oklch(0.34 0.06 228))",
          borderRadius: 22,
          padding: 32,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        {/* Left: info + signup */}
        <div style={{ maxWidth: "34ch" }}>
          <p className="kicker" style={{ color: "var(--pk-accent)" }}>
            Star Drop
          </p>
          <p
            className="poetry on-ink"
            style={{ fontSize: "1.5rem", color: "var(--pk-on-ink)", marginTop: 4 }}
          >
            Thursday &middot; 8:00pm IST
          </p>
          <p
            style={{
              color: "oklch(1 0 0 / .65)",
              fontSize: "0.85rem",
              marginTop: 8,
              lineHeight: 1.6,
            }}
          >
            A 24-hour mystery-destination window. Priority slots = one post a week. The whole
            community spins together.
          </p>

          {/* Email signup */}
          <div style={{ marginTop: 18 }}>
            {dropSubmitted ? (
              <p
                style={{
                  color: "var(--pk-accent)",
                  fontWeight: 600,
                  fontSize: "0.88rem",
                }}
              >
                ✦ You&apos;re on the list.
              </p>
            ) : (
              <form
                onSubmit={handleDropSignup}
                style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
              >
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  aria-label="Email for Star Drop"
                  value={dropEmail}
                  onChange={(e) => setDropEmail(e.target.value)}
                  style={{
                    flex: 1,
                    minWidth: 160,
                    fontFamily: "var(--ui)",
                    fontSize: "0.9rem",
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1px solid oklch(1 0 0 / .2)",
                    background: "oklch(1 0 0 / .08)",
                    color: "var(--pk-on-ink)",
                    outline: "none",
                  }}
                />
                <button
                  type="submit"
                  className="btn btn-accent btn-sm"
                  style={{ whiteSpace: "nowrap" }}
                >
                  Notify me
                </button>
              </form>
            )}
            {dropError && (
              <p
                style={{
                  color: "oklch(0.80 0.085 32)",
                  fontSize: "0.78rem",
                  marginTop: 6,
                }}
              >
                {dropError}
              </p>
            )}
          </div>
        </div>

        {/* Right: countdown */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: "var(--display)",
              fontSize: "2.4rem",
              color: "var(--pk-accent)",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ fontSize: "1.5rem" }}>{countdown.dd}d</span>{" "}
            {countdown.hh}
            <small style={{ opacity: 0.5 }}>:</small>
            {countdown.mm}
            <small style={{ opacity: 0.5 }}>:</small>
            {countdown.ss}
          </div>
          <p
            style={{
              color: "oklch(1 0 0 / .55)",
              fontSize: "0.78rem",
              marginTop: 6,
              fontFamily: "var(--ui)",
            }}
          >
            until the next drop
          </p>
        </div>
      </div>
    </main>
  );
}

// ─── LockedSlot ───────────────────────────────────────────────────────────────
function LockedSlot() {
  return (
    <div
      style={{
        textAlign: "center",
        fontSize: "0.72rem",
        color: "oklch(1 0 0 / .75)",
        display: "grid",
        gap: 6,
      }}
    >
      <div
        className="mask-circle"
        style={{
          width: "100%",
          display: "grid",
          placeItems: "center",
          background: "oklch(1 0 0 / .08)",
          border: "1px dashed oklch(1 0 0 / .3)",
          color: "oklch(1 0 0 / .5)",
          fontFamily: "var(--display)",
          fontSize: "1.1rem",
        }}
      >
        ???
      </div>
    </div>
  );
}
