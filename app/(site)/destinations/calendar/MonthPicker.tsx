"use client";

import { useState } from "react";
import Link from "next/link";

// Month-picker calendar. The server pre-computes, per month, the places at their
// seasonal best (scoped by ?intent) — already trimmed to {slug,name,region,img}, so
// no catalogue/JSON ships to the client. This island just flips between months.
// ponytail: client state, not a URL param — the month is a transient view toggle,
// not something worth a navigation; ?intent (the coarser scope) stays in the URL.
export type CalCard = { slug: string; name: string; region: string; img: string };
export type CalMonth = { m: string; full: string; descriptor: string; places: CalCard[] };

function MiniCard({ p }: { p: CalCard }) {
  return (
    <Link
      href={`/destinations/${p.slug}`}
      className="card"
      style={{ textDecoration: "none", color: "inherit", display: "block", padding: 0 }}
    >
      <div
        className="well"
        style={{
          aspectRatio: "3/4",
          backgroundImage: `url(${p.img})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div style={{ padding: "12px 14px 14px" }}>
        <h3 className="display" style={{ fontSize: "1.05rem", lineHeight: 1.1 }}>
          {p.name}
        </h3>
        <p style={{ fontSize: "0.72rem", color: "var(--pk-muted)", marginTop: 4 }}>{p.region}</p>
      </div>
    </Link>
  );
}

export default function MonthPicker({
  months,
  current,
}: {
  months: CalMonth[];
  current: string;
}) {
  const startIdx = Math.max(0, months.findIndex((x) => x.m === current));
  const [idx, setIdx] = useState(startIdx);
  const month = months[idx] ?? months[0];

  return (
    <div>
      {/* Month strip — J–D, one tap to switch */}
      <div
        style={{
          position: "sticky",
          top: 62,
          zIndex: 20,
          background: "var(--pk-sky)",
          margin: "0 -22px 24px",
          padding: "10px 22px",
          boxShadow: "var(--pk-shadow-sm)",
          display: "flex",
          gap: 8,
          overflowX: "auto",
          whiteSpace: "nowrap",
          scrollbarWidth: "none",
        }}
      >
        {months.map((mo, i) => (
          <button
            key={mo.m}
            type="button"
            onClick={() => setIdx(i)}
            className={`pill${i === idx ? " is-on" : ""}`}
            style={{ cursor: "pointer", border: 0, flexShrink: 0 }}
            aria-pressed={i === idx}
          >
            {mo.m}
            {mo.m === current && <span style={{ opacity: 0.6, marginLeft: 5 }}>· now</span>}
          </button>
        ))}
      </div>

      {/* Selected month — hero block + one curated grid */}
      <section style={{ minHeight: 360 }}>
        <p className="kicker">{month.places.length ? `${month.places.length} at their best` : "Shoulder season"}</p>
        <h2 className="display-mega" style={{ fontSize: "clamp(2rem,6vw,3.2rem)", margin: "2px 0 8px" }}>
          {month.full}
        </h2>
        <p className="lede" style={{ maxWidth: "52ch", marginBottom: 22 }}>
          {month.descriptor}
        </p>
        {month.places.length ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 16 }}>
            {month.places.map((p) => (
              <MiniCard key={p.slug} p={p} />
            ))}
          </div>
        ) : (
          <p style={{ color: "var(--pk-muted)", fontSize: "0.95rem" }}>
            Nothing at its peak this month — shoulder season. Try the month either side.
          </p>
        )}
      </section>
    </div>
  );
}
