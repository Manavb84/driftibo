"use client";

import { useRouter } from "next/navigation";

// Real filter bar for Explore — not a scroll-spy. Each pill drives the URL:
// "In season" clears ?intent (the seasonal default view), an intent pill sets
// ?intent=<key> (the full filtered lane). The server reads ?intent and renders
// only what matches, so each state is a real, crawlable URL.
// ponytail: router.push over client show/hide — the server owns the filter, this
// island ships no catalogue data and stays a few lines.
type Tab = { key: string; label: string };

export default function CatalogTabs({
  tabs,
  activeIntent,
}: {
  tabs: Tab[];
  activeIntent?: string;
}) {
  const router = useRouter();
  // The leading "In season" pseudo-tab clears the filter; key "" = default view.
  const all: Tab[] = [{ key: "", label: "✦ In season" }, ...tabs];

  function go(key: string) {
    router.push(key ? `/destinations?intent=${key}` : "/destinations", {
      scroll: true,
    });
  }

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
      {all.map((t) => {
        const on = (activeIntent ?? "") === t.key;
        return (
          <button
            key={t.key || "season"}
            type="button"
            onClick={() => go(t.key)}
            className={`pill${on ? " is-on" : ""}`}
            style={{ cursor: "pointer", border: 0, flexShrink: 0 }}
            aria-pressed={on}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
