"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

interface FormShellProps {
  onSubmit: () => Promise<{ ok: boolean; error?: string; slug?: string }>;
  children: ReactNode;
  title: string;
  backHref: string;
  submitLabel?: string;
}

export default function FormShell({
  onSubmit,
  children,
  title,
  backHref,
  submitLabel = "Save",
}: FormShellProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const result = await onSubmit();
      if (result.ok) {
        router.push(backHref);
        router.refresh();
      } else {
        setError(result.error ?? "Something went wrong.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 720 }}>
      {/* Heading + back link */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 24,
        }}
      >
        <Link
          href={backHref}
          style={{
            color: "var(--pk-muted)",
            fontSize: "0.85rem",
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          ← Back
        </Link>
        <h1
          style={{
            fontFamily: "var(--display)",
            fontSize: "1.7rem",
            margin: 0,
          }}
        >
          {title}
        </h1>
      </div>

      {/* Fields */}
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {children}
      </div>

      {/* Error banner */}
      {error && (
        <div
          style={{
            marginTop: 18,
            padding: "10px 14px",
            background: "oklch(0.96 0.02 15)",
            border: "1px solid oklch(0.85 0.04 15)",
            borderRadius: 10,
            color: "oklch(0.4 0.12 20)",
            fontSize: "0.88rem",
            fontFamily: "var(--ui)",
          }}
        >
          {error}
        </div>
      )}

      {/* Actions */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginTop: 26,
        }}
      >
        <button
          type="submit"
          className="btn btn-accent"
          disabled={busy}
          style={{ opacity: busy ? 0.6 : 1 }}
        >
          {busy ? "Saving…" : submitLabel}
        </button>
        <Link href={backHref} className="btn btn-ghost">
          Cancel
        </Link>
      </div>
    </form>
  );
}
