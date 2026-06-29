// Best-time-to-visit calendar. Server Component computes, for each month, every place
// at its seasonal best (climate "ideal"), trimmed to a light shape and handed to the
// MonthPicker island — which shows one month at a time, defaulting to the current one.
// ?intent scopes to a single lane; the heavy catalogue/JSON never leaves the server.
import type { Metadata } from "next";
import Link from "next/link";
import { images, idealInMonth, currentMonthAbbr, MONTH_ABBR, type Catalog } from "@/lib/catalog";
import {
  INTENTS,
  INTENT_LABEL,
  INTENT_GLYPH,
  INTENT_TO_CATALOGS,
  normalizeIntent,
} from "@/lib/intent";
import MonthPicker, { type CalMonth } from "./MonthPicker";

export const metadata: Metadata = {
  title: "When to go where — month by month · Driftibo",
  description:
    "Pick a month, see every place at its seasonal best, open the brief. The whole catalogue, sorted by when it's actually worth going.",
  alternates: { canonical: "/destinations/calendar" },
  openGraph: {
    title: "When to go where — month by month · Driftibo",
    description: "Pick a month, see what's at its seasonal best, open the brief.",
  },
};

const MONTH_FULL: Record<string, string> = {
  Jan: "January", Feb: "February", Mar: "March", Apr: "April", May: "May", Jun: "June",
  Jul: "July", Aug: "August", Sep: "September", Oct: "October", Nov: "November", Dec: "December",
};

// One short, relevant descriptor per month — not a taxonomy label.
const MONTH_NOTE: Record<string, string> = {
  Jan: "Deep winter — deserts and beaches at their kindest.",
  Feb: "Crisp and clear, before the heat starts to build.",
  Mar: "Spring shoulder — blossom in the hills, warmth on the coast.",
  Apr: "The plains heat up; the high country begins to open.",
  May: "Pre-monsoon — head up, where the air still runs cool.",
  Jun: "Early monsoon below; peak season in the high Himalaya.",
  Jul: "Monsoon green — the rain-shadow valleys come into their own.",
  Aug: "High-altitude deserts at their best, lush everywhere else.",
  Sep: "The rain eases — clarity returns to the mountains.",
  Oct: "The big one — post-monsoon, almost everywhere is open.",
  Nov: "Clear skies, comfortable days — prime travelling weather.",
  Dec: "Crisp days, cold nights — winter's first full month.",
};

type Props = { searchParams: Promise<{ intent?: string }> };

export default async function CalendarPage({ searchParams }: Props) {
  const { intent } = await searchParams;
  const scoped = normalizeIntent(intent) ?? undefined;

  const inScope = (catalog: Catalog) =>
    scoped ? INTENT_TO_CATALOGS[scoped].includes(catalog) : true;

  // Per month → the scoped places at their seasonal best, trimmed for the client.
  const months: CalMonth[] = MONTH_ABBR.map((m) => ({
    m,
    full: MONTH_FULL[m],
    descriptor: MONTH_NOTE[m],
    places: idealInMonth(m)
      .filter((p) => inScope(p.catalog))
      .map((p) => ({
        slug: p.slug,
        name: p.name,
        region: p.region.split("·")[0].trim(),
        img: images(p.slug, p.catalog)[0],
      })),
  }));

  return (
    <main style={{ padding: "96px 22px 72px", maxWidth: 1080, margin: "0 auto", minHeight: "100vh" }}>
      <p className="kicker">Explore · by season</p>
      <h1 className="display-mega" style={{ fontSize: "clamp(2.1rem,6.5vw,3.2rem)", margin: "4px 0 10px" }}>
        When to go where
      </h1>
      <p className="lede" style={{ maxWidth: "54ch", marginBottom: 16 }}>
        Pick a month — see everything at its seasonal best, then open the brief.
      </p>

      {/* Lane chips — scope every month to one intent (reuse ?intent) */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 26 }}>
        <Link
          href="/destinations/calendar"
          className={`pill${scoped ? "" : " is-on"}`}
          style={{ textDecoration: "none" }}
        >
          ✦ Everywhere
        </Link>
        {INTENTS.map((i) => (
          <Link
            key={i}
            href={`/destinations/calendar?intent=${i}`}
            className={`pill${scoped === i ? " is-on" : ""}`}
            style={{ textDecoration: "none" }}
          >
            {INTENT_GLYPH[i]} {INTENT_LABEL[i]}
          </Link>
        ))}
      </div>

      <MonthPicker months={months} current={currentMonthAbbr()} />

      <p style={{ textAlign: "center", color: "var(--pk-muted)", fontSize: "0.8rem", marginTop: 40 }}>
        &quot;At their best&quot; = climate at its peak — dry, comfortable, open. Seasons shift; we
        reconfirm before we quote.
      </p>
    </main>
  );
}
