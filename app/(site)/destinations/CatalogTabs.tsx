"use client";

import { useEffect, useState } from "react";
import { normalizeIntent } from "@/lib/intent";

// Sticky intent filter for the Explore index. The 3 intent sections are server-rendered
// with id={intent} anchors; these tabs just scroll to them and track which is active.
// On mount it honours ?intent (passed as initialIntent) or localStorage.driftiboIntent
// (normalized — legacy catalog values map to an intent) — a returning visitor lands
// focused on their lane, but nothing is hidden or forced.
// ponytail: scroll-to-anchor over show/hide state — every section stays in the DOM,
// crawlable, and the client stays tiny (no catalogue data shipped here).
type Tab = { key: string; label: string; count: number };

export default function CatalogTabs({
  tabs,
  initialIntent,
}: {
  tabs: Tab[];
  initialIntent?: string;
}) {
  const [active, setActive] = useState<string>(initialIntent || tabs[0]?.key);

  function jump(key: string) {
    setActive(key);
    const el = document.getElementById(key);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // First paint: if we arrived with an intent (param or stored), focus that lane.
  useEffect(() => {
    const intent = initialIntent || normalizeIntent(safeGet("driftiboIntent")) || "";
    if (intent && tabs.some((t) => t.key === intent)) {
      setActive(intent);
      const el = document.getElementById(intent);
      // rAF so layout is settled before we scroll.
      if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        position: "sticky",
        top: 62,
        zIndex: 20,
        background: "var(--pk-sky)",
        margin: "0 -22px 20px",
        padding: "10px 22px",
        boxShadow: "var(--pk-shadow-sm)",
        display: "flex",
        gap: 8,
        overflowX: "auto",
        whiteSpace: "nowrap",
        scrollbarWidth: "none",
      }}
    >
      {tabs.map((t) => (
        <button
          key={t.key}
          type="button"
          onClick={() => jump(t.key)}
          className={`pill${active === t.key ? " is-on" : ""}`}
          style={{ cursor: "pointer", border: 0, flexShrink: 0 }}
        >
          {t.label} <span style={{ opacity: 0.6 }}>· {t.count}</span>
        </button>
      ))}
    </div>
  );
}

function safeGet(k: string): string | null {
  try {
    return window.localStorage.getItem(k);
  } catch (_) {
    return null;
  }
}
