"use client";

import { type FormEvent, useState } from "react";
import { submitCapture } from "@/lib/actions";
import { INTENT_GLYPH, INTENT_LABEL, INTENTS, type Intent } from "@/lib/intent";

type LaneChoice = Intent | "unsure";

const INSTAGRAM_HANDLE = "driftibo"; // Confirm this exact Instagram handle before launch.
const INSTAGRAM_URL = `https://instagram.com/${INSTAGRAM_HANDLE}`;

const LANE_OPTIONS: { value: LaneChoice; label: string }[] = [
  ...INTENTS.map((intent) => ({
    value: intent,
    label: `${INTENT_LABEL[intent]} ${INTENT_GLYPH[intent]}`,
  })),
  { value: "unsure", label: "Not sure yet — surprise me" },
];

const fieldStyle = {
  width: "100%",
  border: "1px solid var(--pk-line-strong)",
  borderRadius: 10,
  background: "oklch(0.995 0.004 210 / 0.82)",
  color: "var(--pk-text)",
  fontFamily: "var(--ui)",
  fontSize: "1rem",
  padding: "13px 14px",
  outline: "none",
} as const;

const labelStyle = {
  display: "grid",
  gap: 7,
  color: "var(--pk-text)",
  fontSize: "0.86rem",
  fontWeight: 700,
  textAlign: "left",
} as const;

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [lane, setLane] = useState<LaneChoice>("unsure");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // ponytail: waitlist leads are tagged via data.source='waitlist' (not a dedicated
      // kind); upgrade path is adding a 'waitlist' kind via migration later if admin
      // filtering needs it.
      const result = await submitCapture({
        kind: "lead",
        email: email.trim(),
        data: { source: "waitlist", lane },
      });

      if (result.ok) {
        setSubmitted(true);
      } else {
        setError(result.error ?? "Something went wrong.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div
        role="status"
        style={{
          width: "min(100%, 520px)",
          margin: "30px auto 0",
          padding: "22px",
          border: "1px solid var(--pk-line-soft)",
          borderRadius: "var(--r-md)",
          background: "oklch(0.995 0.004 210 / 0.72)",
          boxShadow: "var(--pk-shadow-sm)",
        }}
      >
        <p className="lede" style={{ color: "var(--pk-text)", marginBottom: 18 }}>
          You&apos;re on the list ✦ Follow @{INSTAGRAM_HANDLE} so you don&apos;t miss the drop.
        </p>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-accent"
          style={{ justifyContent: "center" }}
        >
          Follow @{INSTAGRAM_HANDLE}
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        width: "min(100%, 520px)",
        margin: "30px auto 0",
        display: "grid",
        gap: 14,
        padding: "20px",
        border: "1px solid var(--pk-line-soft)",
        borderRadius: "var(--r-md)",
        background: "oklch(0.995 0.004 210 / 0.72)",
        boxShadow: "var(--pk-shadow-sm)",
      }}
    >
      <label style={labelStyle}>
        Email
        <input
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={loading}
          style={fieldStyle}
        />
      </label>
      <label style={labelStyle}>
        Where does your wander pull you?
        <select
          value={lane}
          onChange={(event) => setLane(event.target.value as LaneChoice)}
          disabled={loading}
          style={fieldStyle}
        >
          {LANE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <button
        type="submit"
        disabled={loading}
        className="btn btn-accent"
        style={{
          justifyContent: "center",
          width: "100%",
          opacity: loading ? 0.72 : 1,
        }}
      >
        {loading ? "Joining…" : "Join the list"}
      </button>
      {error && (
        <p role="alert" style={{ color: "var(--pk-accent-deep)", fontSize: "0.86rem" }}>
          {error}
        </p>
      )}
    </form>
  );
}
