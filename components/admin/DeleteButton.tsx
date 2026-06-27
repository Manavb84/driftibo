"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface DeleteButtonProps {
  id: string;
  onDelete: (id: string) => Promise<{ ok: boolean; error?: string }>;
  afterHref?: string;
  label?: string;
}

export default function DeleteButton({
  id,
  onDelete,
  afterHref,
  label = "Delete",
}: DeleteButtonProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleClick() {
    if (!window.confirm("Delete this? This can't be undone.")) return;
    setBusy(true);
    try {
      const result = await onDelete(id);
      if (result.ok) {
        if (afterHref) {
          router.push(afterHref);
        } else {
          router.refresh();
        }
      } else {
        alert(result.error ?? "Delete failed.");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Unexpected error.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      className="btn btn-ghost btn-sm"
      style={{
        color: "oklch(0.5 0.15 20)",
        opacity: busy ? 0.5 : 1,
      }}
    >
      {busy ? "Deleting…" : label}
    </button>
  );
}
