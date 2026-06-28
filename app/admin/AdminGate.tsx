"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useEmailOtp } from "@/lib/hooks/useEmailOtp";

// Shown when the visitor is not a signed-in admin. Two states: the email-OTP login,
// and a "not authorized" screen for a signed-in non-admin (with sign-out).
// OTP logic (signInWithOtp / verifyOtp / digit state) is sourced from the shared
// useEmailOtp hook; only stage and email remain as local state.
export default function AdminGate({ signedInEmail }: { signedInEmail: string | null }) {
  const router = useRouter();
  const [stage, setStage] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");

  const { digits, setDigit, handleKeyDown, refs, sending, sendError, verifying, verifyError, send, verify, reset } =
    useEmailOtp(() => router.refresh());

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    const ok = await send(email);
    if (ok) setStage("otp");
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    await verify(email);
    // onVerified callback passed to useEmailOtp drives router.refresh()
  }

  function handleBack() {
    setStage("email");
    reset();
  }

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  }

  const input: React.CSSProperties = {
    width: "100%",
    marginTop: 6,
    padding: "11px 13px",
    borderRadius: 10,
    border: "1px solid var(--pk-line)",
    background: "var(--pk-paper)",
    fontFamily: "var(--ui)",
    fontSize: "0.95rem",
    color: "var(--pk-text)",
    outline: "none",
  };

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 22 }}>
      <div className="card" style={{ width: "100%", maxWidth: 380, padding: 30, borderRadius: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 18 }}>
          <span className="seal t-ink" style={{ width: 28 }}>
            <span className="ring" />
            <span className="star" />
          </span>
          <b style={{ fontFamily: "var(--display)", fontSize: "1.25rem" }}>Driftibo Admin</b>
        </div>

        {/* Signed in but not on the allowlist */}
        {signedInEmail ? (
          <>
            <p style={{ color: "var(--pk-muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>
              <b style={{ color: "var(--pk-text)" }}>{signedInEmail}</b> isn&apos;t an admin account.
              Sign in with an allowlisted email, or ask to be added.
            </p>
            <button onClick={signOut} className="btn btn-ghost btn-sm" style={{ marginTop: 16 }}>
              Sign out
            </button>
          </>
        ) : stage === "email" ? (
          <form onSubmit={handleSendOtp}>
            <label style={{ fontSize: "0.82rem", fontWeight: 600 }}>
              Admin email
              <input
                type="email"
                required
                placeholder="travel@driftibo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={input}
              />
            </label>
            {sendError && (
              <p style={{ color: "var(--pk-coral, oklch(0.6 0.13 25))", fontSize: "0.82rem", marginTop: 8 }}>
                {sendError}
              </p>
            )}
            <button
              type="submit"
              disabled={sending}
              className="btn btn-primary"
              style={{ marginTop: 16, width: "100%", justifyContent: "center" }}
            >
              {sending ? "Sending…" : "Send login code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <p style={{ color: "var(--pk-muted)", fontSize: "0.85rem", marginBottom: 12 }}>
              Enter the 6-digit code sent to {email}.
            </p>
            {/* 6-box OTP input wired to hook */}
            <div style={{ display: "flex", gap: 6 }}>
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={(e) => setDigit(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  style={{
                    ...input,
                    width: "100%",
                    textAlign: "center",
                    fontSize: "1.3rem",
                    letterSpacing: 0,
                    padding: "10px 4px",
                    marginTop: 0,
                  }}
                />
              ))}
            </div>
            {verifyError && (
              <p style={{ color: "var(--pk-coral, oklch(0.6 0.13 25))", fontSize: "0.82rem", marginTop: 8 }}>
                {verifyError}
              </p>
            )}
            <button
              type="submit"
              disabled={verifying}
              className="btn btn-primary"
              style={{ marginTop: 16, width: "100%", justifyContent: "center" }}
            >
              {verifying ? "Verifying…" : "Enter"}
            </button>
            <button
              type="button"
              onClick={handleBack}
              style={{
                display: "block",
                marginTop: 12,
                background: "none",
                border: 0,
                color: "var(--pk-muted)",
                fontSize: "0.8rem",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              ← different email
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
