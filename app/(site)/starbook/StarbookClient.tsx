"use client";

// PARKED: not imported anywhere — page.tsx renders StarbookComingSoon instead.
// This is the full Starbook (sign-in + stamps + badges + Star Drop), preserved
// for revival once the collection concept is made genuinely relevant.

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { submitCapture } from "@/lib/actions";
import { useEmailOtp } from "@/lib/hooks/useEmailOtp";
import { INPUT_STYLE } from "@/lib/styles";
import { PERSONA } from "@/lib/persona";

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
export default function StarbookClient({ user, stamps }: Props) {
  const router = useRouter();
  const persona = PERSONA;

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

  const otp = useEmailOtp(() => {
    setAuthStage("success");
    router.refresh();
  });

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    const ok = await otp.send(authEmail);
    if (ok) setAuthStage("otp");
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    // Navigation is driven by the onVerified callback passed to useEmailOtp
    await otp.verify(authEmail);
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

  // Dark-surface input overlay (spread on top of INPUT_STYLE)
  const darkInput: React.CSSProperties = {
    ...INPUT_STYLE,
    background: "oklch(1 0 0 / .08)",
    color: "var(--pk-on-ink)",
    border: "1px solid oklch(1 0 0 / .2)",
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
          Your Starbook
        </h1>
        <p className="lede" style={{ maxWidth: "46ch", margin: "0 auto" }}>
          Every place the star sent you, stamped. Badges you earn by fate, not by grinding. And a
          door that only opens on Thursdays.
        </p>
      </div>

      {/* ── 2. Starbook callout-ink card ── */}
      <div className="callout-ink" style={{ borderRadius: "var(--r-lg)", padding: 28 }}>
        {!user ? (
          /* ── Sign-in panel ── */
          <div style={{ maxWidth: 400, margin: "0 auto" }}>
            {authStage === "email" && (
              <form onSubmit={handleSendOtp}>
                <p className="kicker" style={{ marginBottom: 10 }}>
                  Sign in to your Starbook
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
                    style={darkInput}
                  />
                </label>
                {otp.sendError && (
                  <p style={{ color: "oklch(0.80 0.085 32)", fontSize: "0.82rem", marginTop: 8 }}>
                    {otp.sendError}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={otp.sending}
                  className="btn btn-accent"
                  style={{ marginTop: 16, width: "100%", justifyContent: "center" }}
                >
                  {otp.sending ? "Sending…" : "Send code"}
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
                <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                  {otp.digits.map((d, i) => (
                    <input
                      key={i}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={d}
                      onChange={(e) => otp.setDigit(i, e.target.value)}
                      onKeyDown={(e) => otp.handleKeyDown(i, e)}
                      ref={(el) => { otp.refs.current[i] = el; }}
                      style={{
                        ...darkInput,
                        width: 42,
                        marginTop: 0,
                        textAlign: "center",
                        letterSpacing: 0,
                        padding: "11px 0",
                        fontWeight: 700,
                        fontSize: "1.05rem",
                      }}
                    />
                  ))}
                </div>
                {otp.verifyError && (
                  <p style={{ color: "oklch(0.80 0.085 32)", fontSize: "0.82rem", marginTop: 8 }}>
                    {otp.verifyError}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={otp.verifying}
                  className="btn btn-accent"
                  style={{ marginTop: 16, width: "100%", justifyContent: "center" }}
                >
                  {otp.verifying ? "Verifying…" : "Verify"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthStage("email");
                    otp.reset();
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
                  Signed in — refreshing your Starbook…
                </p>
              </div>
            )}
          </div>
        ) : (
          /* ── Starbook (logged in) ── */
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
                <p className="kicker">Starbook</p>
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
                borderRadius: "var(--r-md)",
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
          {stamps.length === 0 ? (
            /* ── Empty state ── */
            <>
              <span className="seal t-paper" style={{ width: 56 }}>
                <span className="ring" />
                <span className="star" />
              </span>
              <p className="kicker" style={{ marginTop: 14 }}>
                No stamps yet
              </p>
              <p className="poetry" style={{ fontSize: "1.5rem", maxWidth: "28ch" }}>
                Your first drop will appear here
              </p>
              <p style={{ color: "var(--pk-muted)", fontSize: "0.85rem", maxWidth: "34ch" }}>
                Spin the star — when a destination chooses you, your oath card is stamped.
              </p>
            </>
          ) : (
            /* ── First stamp oath ── */
            <>
              <span className="seal t-coral" style={{ width: 56 }}>
                <span className="ring" />
                <span className="star" />
              </span>
              <p className="kicker" style={{ marginTop: 14 }}>
                Your star has chosen
              </p>
              <p className="poetry" style={{ fontSize: "1.7rem", maxWidth: "24ch" }}>
                You said yes. Welcome to the Drift.
              </p>
              <p style={{ color: "var(--pk-muted)", fontSize: "0.85rem" }}>
                {stamps[0].label}
              </p>
              <button
                className="btn btn-ghost btn-sm"
                style={{ marginTop: 6 }}
                onClick={async () => {
                  const text = `My star sent me to ${stamps[0].label} ✦ Where will yours send you?`;
                  const url = "https://driftibo.com/game";
                  try {
                    if (typeof navigator !== "undefined" && navigator.share) {
                      await navigator.share({ title: "Driftibo", text, url });
                    } else {
                      window.open(
                        `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
                        "_blank",
                        "noopener",
                      );
                    }
                  } catch {}
                }}
              >
                Share my oath card
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── 5. Star Drop section ── */}
      <div
        id="star-drop"
        className="callout-ink"
        style={{
          borderRadius: "var(--r-lg)",
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
                    ...INPUT_STYLE,
                    flex: 1,
                    minWidth: 160,
                    marginTop: 0,
                    background: "oklch(1 0 0 / .08)",
                    color: "var(--pk-on-ink)",
                    border: "1px solid oklch(1 0 0 / .2)",
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
