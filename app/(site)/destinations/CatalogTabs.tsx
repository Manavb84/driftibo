"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useIntent } from "@/components/IntentProvider";
import { INTENTS, INTENT_LABEL, INTENT_GLYPH, type Intent } from "@/lib/intent";

// Lane-ownership bar for Explore — not a scroll-spy. When a lane is active the whole
// site is scoped to it, so we show "Browsing: ✦ Spiritual" + a change control (reopens
// the modal, which writes the cookie and refreshes the server tree) + a deliberate
// escape to the cross-lane / in-season view. When undecided (or escaped via ?all=1) we
// show the three lanes as pick pills so the visitor can scope from here.
// ponytail: the cookie owns the filter; this island ships no catalogue data.

const BAR: React.CSSProperties = {
  position: "sticky",
  top: 62,
  zIndex: 20,
  background: "var(--pk-sky)",
  margin: "0 -22px 20px",
  padding: "10px 22px",
  boxShadow: "var(--pk-shadow-sm)",
  display: "flex",
  alignItems: "center",
  gap: 8,
  overflowX: "auto",
  whiteSpace: "nowrap",
  scrollbarWidth: "none",
};

export default function CatalogTabs({
  activeLane,
  seeAll,
}: {
  activeLane: Intent | null;
  seeAll: boolean;
}) {
  const router = useRouter();
  const { setIntent, openChooser } = useIntent();

  function pick(key: Intent) {
    // Write the cookie (and refresh) so the chosen lane sticks site-wide, then push the
    // crawlable scoped URL. The cookie wins over the param, so the two can't desync.
    setIntent(key);
    router.push(`/destinations?intent=${key}`, { scroll: true });
  }

  if (activeLane) {
    return (
      <div style={BAR}>
        <span className="pill is-on" style={{ flexShrink: 0 }}>
          Browsing: {INTENT_GLYPH[activeLane]} {INTENT_LABEL[activeLane]}
        </span>
        <button
          type="button"
          onClick={openChooser}
          className="pill"
          style={{ cursor: "pointer", border: 0, flexShrink: 0 }}
        >
          change
        </button>
        <Link
          href="/destinations?all=1"
          className="pill"
          style={{ textDecoration: "none", flexShrink: 0, marginLeft: "auto" }}
        >
          See all / In season →
        </Link>
      </div>
    );
  }

  return (
    <div style={BAR}>
      <span
        style={{
          fontFamily: "var(--ui)",
          fontWeight: 700,
          fontSize: "0.7rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--pk-muted)",
          flexShrink: 0,
        }}
      >
        {seeAll ? "All lanes · pick one" : "Pick a lane"}
      </span>
      {INTENTS.map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => pick(i)}
          className="pill"
          style={{ cursor: "pointer", border: 0, flexShrink: 0 }}
        >
          {INTENT_GLYPH[i]} {INTENT_LABEL[i]}
        </button>
      ))}
    </div>
  );
}
