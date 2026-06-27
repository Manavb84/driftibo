"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Shown when the visitor is not a signed-in admin. Two states: the email-OTP login,
// and a "not authorized" screen for a signed-in non-admin (with sign-out).
export default function AdminGate({ signedInEmail }: { signedInEmail: string | null }) {
  const router = useRouter();
  const [stage, setStage] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({ email });
    setBusy(false);
    if (error) setErr(error.message);
    else setStage("otp");
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({ email, token: code, type: "email" });
    setBusy(false);
    if (error) setErr(error.message);
    else router.refresh();
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
          <form onSubmit={sendOtp}>
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
            {err && <p style={{ color: "var(--pk-coral, oklch(0.6 0.13 25))", fontSize: "0.82rem", marginTop: 8 }}>{err}</p>}
            <button type="submit" disabled={busy} className="btn btn-primary" style={{ marginTop: 16, width: "100%", justifyContent: "center" }}>
              {busy ? "Sending…" : "Send login code"}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyOtp}>
            <p style={{ color: "var(--pk-muted)", fontSize: "0.85rem", marginBottom: 12 }}>
              Enter the code sent to {email}.
            </p>
            <label style={{ fontSize: "0.82rem", fontWeight: 600 }}>
              Code
              <input
                type="text"
                required
                inputMode="numeric"
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                style={{ ...input, letterSpacing: "0.2em" }}
              />
            </label>
            {err && <p style={{ color: "var(--pk-coral, oklch(0.6 0.13 25))", fontSize: "0.82rem", marginTop: 8 }}>{err}</p>}
            <button type="submit" disabled={busy} className="btn btn-primary" style={{ marginTop: 16, width: "100%", justifyContent: "center" }}>
              {busy ? "Verifying…" : "Enter"}
            </button>
            <button type="button" onClick={() => { setStage("email"); setCode(""); setErr(null); }} style={{ display: "block", marginTop: 12, background: "none", border: 0, color: "var(--pk-muted)", fontSize: "0.8rem", cursor: "pointer", textDecoration: "underline" }}>
              ← different email
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
