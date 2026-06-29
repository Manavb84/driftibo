// Best-time-to-visit calendar. Static Server Component — for each month, every place
// whose climate is rated "ideal" that month, grouped by the 3 intents and rendered as
// image-led mini cards (no tables, no text-link lists). Reads ?intent to scope to one
// lane (e.g. arriving from /start or the nav chip). No client JS.
import type { Metadata } from "next";
import Link from "next/link";
import { allPlaces, images, type PlaceWithCatalog } from "@/lib/catalog";
import {
  INTENTS,
  INTENT_LABEL,
  INTENT_GLYPH,
  INTENT_TO_CATALOGS,
  normalizeIntent,
  type Intent,
} from "@/lib/intent";

export const metadata: Metadata = {
  title: "Best time to visit — month by month · Driftibo",
  description:
    "When to go where: every place we plan at its seasonal best, month by month. Pick a month, see what's ideal, open the brief.",
  alternates: { canonical: "/destinations/calendar" },
  openGraph: {
    title: "Best time to visit — month by month · Driftibo",
    description: "Every place at its seasonal best, month by month. Pick a month, see what's ideal.",
  },
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_FULL: Record<string, string> = {
  Jan: "January", Feb: "February", Mar: "March", Apr: "April", May: "May", Jun: "June",
  Jul: "July", Aug: "August", Sep: "September", Oct: "October", Nov: "November", Dec: "December",
};

// Compact image-led card — .well 3:4 + name + region, linking to the brief.
function MiniCard({ p }: { p: PlaceWithCatalog }) {
  const [img] = images(p.slug, p.catalog);
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
          backgroundImage: `url(${img})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div style={{ padding: "12px 14px 14px" }}>
        <h3 className="display" style={{ fontSize: "1.05rem", lineHeight: 1.1 }}>
          {p.name}
        </h3>
        <p style={{ fontSize: "0.72rem", color: "var(--pk-muted)", marginTop: 4 }}>
          {p.region.split("·")[0].trim()}
        </p>
      </div>
    </Link>
  );
}

type Props = { searchParams: Promise<{ intent?: string }> };

export default async function CalendarPage({ searchParams }: Props) {
  const { intent } = await searchParams;
  const scoped = normalizeIntent(intent) ?? undefined;

  const places = allPlaces().filter((p) =>
    scoped ? INTENT_TO_CATALOGS[scoped].includes(p.catalog) : true,
  );

  // month → places rated "ideal" that month, grouped by the 3 intents.
  const index = MONTHS.map((m) => {
    const ideal = places.filter((p) => {
      const c = p.climate.find((x) => x.m === m);
      return c && (c.rate || "").toLowerCase() === "ideal";
    });
    const groups = INTENTS.map((i) => ({
      intent: i,
      places: ideal.filter((p) => INTENT_TO_CATALOGS[i].includes(p.catalog)),
    })).filter((g) => g.places.length);
    return { m, groups, total: ideal.length };
  });

  return (
    <main style={{ padding: "96px 22px 72px", maxWidth: 1080, margin: "0 auto", minHeight: "100vh" }}>
      <p className="kicker">Explore · by season</p>
      <h1 className="display-mega" style={{ fontSize: "clamp(2.1rem,6.5vw,3.2rem)", margin: "4px 0 10px" }}>
        Best time to visit
      </h1>
      <p className="lede" style={{ maxWidth: "54ch", marginBottom: 14 }}>
        Every place at its seasonal best, month by month. Pick a month, see what&apos;s ideal, then open
        the brief.
      </p>
      <p style={{ marginBottom: 28, fontSize: "0.9rem" }}>
        {scoped ? (
          <>
            <span style={{ color: "var(--pk-muted)" }}>
              Showing <b style={{ color: "var(--pk-text)" }}>{INTENT_LABEL[scoped]}</b> only ·{" "}
            </span>
            <Link href="/destinations/calendar" style={{ color: "var(--pk-accent-deep)", textDecoration: "none" }}>
              show everything →
            </Link>
          </>
        ) : (
          <Link href="/destinations" style={{ color: "var(--pk-accent-deep)", textDecoration: "none", fontWeight: 600 }}>
            ← back to all places
          </Link>
        )}
      </p>

      <div style={{ display: "grid", gap: 48 }}>
        {index.map(({ m, groups, total }) => (
          <section key={m} style={{ scrollMarginTop: 90 }}>
            <p className="kicker">{total ? `${total} at their best` : "Shoulder season"}</p>
            <h2 className="display" style={{ fontSize: "clamp(1.8rem,4vw,2.6rem)", margin: "2px 0 18px" }}>
              {MONTH_FULL[m]}
            </h2>
            {total === 0 ? (
              <p style={{ color: "var(--pk-muted)", fontSize: "0.92rem" }}>
                Nothing at its peak — shoulder season everywhere.
              </p>
            ) : (
              <div style={{ display: "grid", gap: 26 }}>
                {groups.map(({ intent: i, places: ps }) => (
                  <div key={i}>
                    <p className="kicker" style={{ color: "var(--pk-muted)", marginBottom: 12 }}>
                      {INTENT_GLYPH[i]} {INTENT_LABEL[i]}
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 14 }}>
                      {ps.map((p) => (
                        <MiniCard key={p.slug} p={p} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>

      <p style={{ textAlign: "center", color: "var(--pk-muted)", fontSize: "0.8rem", marginTop: 32 }}>
        &quot;At their best&quot; = climate at its peak (dry, comfortable, open). Typical patterns as of June
        2026 — seasons shift; we reconfirm before we quote.
      </p>
    </main>
  );
}
