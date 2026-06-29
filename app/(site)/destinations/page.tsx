import type { Metadata } from "next";
import Link from "next/link";
import {
  allPlaces,
  images,
  bookableSlugs,
  CATALOG_BLURB,
  type Catalog,
  type PlaceWithCatalog,
} from "@/lib/catalog";
import {
  INTENTS,
  INTENT_LABEL,
  INTENT_GLYPH,
  INTENT_TO_CATALOGS,
  normalizeIntent,
  type Intent,
} from "@/lib/intent";
import CatalogTabs from "./CatalogTabs";

export const metadata: Metadata = {
  title: "Where should your star send you? · Driftibo",
  description:
    "Browse every place we plan — International, India (classic + offbeat), and Spiritual. Honest briefs, real landmark photos, best months to go. Pricing lives in Packages.",
  alternates: { canonical: "/destinations" },
  openGraph: {
    title: "Where should your star send you? · Driftibo",
    description:
      "Every place we plan, grouped the way you'd choose one — International, India, Spiritual. Honest briefs and real landmark photos.",
  },
};

// Invitational one-liners per intent (not the taxonomy voice).
const INTENT_BLURB: Record<Intent, string> = {
  international: "Beyond India — visa-easy escapes that look like abroad because they are.",
  india: "The names you love and the corners you don't — classics and the offbeat.",
  spiritual: "Temple trails and pilgrim circuits — the offbeat ones included.",
};

// Best-season chip text: "Nov–Mar" from first/last best months.
function seasonChip(months: string[]): string {
  if (!months.length) return "Year-round";
  if (months.length === 1) return months[0];
  return `${months[0]}–${months[months.length - 1]}`;
}

// One place card — 3:4 portrait .well, .pill season, .sticker bookable, .kicker region.
function PlaceCard({ p }: { p: PlaceWithCatalog }) {
  const [img] = images(p.slug, p.catalog);
  const bookable = bookableSlugs.has(p.slug);
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
          position: "relative",
        }}
      >
        <span className="pill" style={{ position: "absolute", top: 10, left: 10, cursor: "inherit" }}>
          ☼ {seasonChip(p.bestMonths)}
        </span>
        {bookable && (
          <span className="sticker" style={{ position: "absolute", top: 12, right: 10 }}>
            Bookable
          </span>
        )}
      </div>
      <div className="card-pad">
        <p className="kicker">{p.region.split("·")[0].trim()}</p>
        <h3 className="display" style={{ fontSize: "1.2rem", marginTop: 4 }}>
          {p.name}
        </h3>
        <p
          style={{
            color: "var(--pk-muted)",
            fontSize: "0.84rem",
            lineHeight: 1.5,
            marginTop: 6,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {p.pitch}
        </p>
      </div>
    </Link>
  );
}

// A grid of place cards (a section body or an India sub-band body).
function CardGrid({ places }: { places: PlaceWithCatalog[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(210px,1fr))", gap: 20 }}>
      {places.map((p) => (
        <PlaceCard key={p.slug} p={p} />
      ))}
    </div>
  );
}

type Props = { searchParams: Promise<{ intent?: string }> };

export default async function DestinationsPage({ searchParams }: Props) {
  const { intent } = await searchParams;
  const places = allPlaces();
  const validIntent = normalizeIntent(intent) ?? undefined;

  const inIntent = (i: Intent) => places.filter((p) => INTENT_TO_CATALOGS[i].includes(p.catalog));
  const inCatalog = (c: Catalog) => places.filter((p) => p.catalog === c);

  // ItemList JSON-LD over all 83 places (honest reference, no offers/prices here).
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Driftibo — places we plan",
    numberOfItems: places.length,
    itemListElement: places.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.name,
      url: `https://driftibo.com/destinations/${p.slug}`,
    })),
  };

  const tabs = INTENTS.map((i) => ({ key: i, label: INTENT_LABEL[i], count: inIntent(i).length }));

  return (
    <main style={{ padding: "96px 22px 80px", maxWidth: 1080, margin: "0 auto", minHeight: "100vh" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      <p className="kicker">Explore</p>
      <h1 className="display-mega" style={{ fontSize: "clamp(2.2rem,7vw,3.4rem)", margin: "4px 0 10px" }}>
        Where should your star send you?
      </h1>
      <p className="lede" style={{ maxWidth: "52ch", marginBottom: 16 }}>
        Every place we plan — honest briefs, real landmark photos, and the best months to go. Pick a
        lane below, or just wander. Pricing lives in{" "}
        <Link href="/packages" style={{ color: "var(--pk-accent-deep)" }}>
          Packages
        </Link>
        .
      </p>
      <Link href="/destinations/calendar" className="btn btn-ghost btn-sm">
        ☼ See what&apos;s in season →
      </Link>

      <CatalogTabs tabs={tabs} initialIntent={validIntent} />

      {INTENTS.map((i) => {
        const intentItems = inIntent(i);
        if (!intentItems.length) return null;
        return (
          <section key={i} id={i} style={{ scrollMarginTop: 124, marginBottom: 64 }}>
            <div style={{ marginBottom: 22 }}>
              <p className="kicker">
                {INTENT_GLYPH[i]} {INTENT_LABEL[i]} · {intentItems.length}
              </p>
              <p className="display" style={{ fontSize: "clamp(1.4rem,3vw,1.9rem)", marginTop: 4 }}>
                {INTENT_LABEL[i]}
              </p>
              <p style={{ color: "var(--pk-muted)", fontSize: "0.95rem", maxWidth: "58ch", marginTop: 4 }}>
                {INTENT_BLURB[i]}
              </p>
            </div>

            {i === "india" ? (
              // India splits into two labeled sub-bands: Classic + Offbeat (the signature).
              <div style={{ display: "grid", gap: 36 }}>
                {([
                  ["india-popular", "Classic"],
                  ["india-offbeat", "Offbeat"],
                ] as const).map(([cat, label]) => {
                  const sub = inCatalog(cat);
                  if (!sub.length) return null;
                  return (
                    <div key={cat}>
                      <div style={{ marginBottom: 14 }}>
                        <p className="kicker" style={{ color: "var(--pk-muted)" }}>
                          {label} · {sub.length}
                        </p>
                        <p style={{ color: "var(--pk-muted)", fontSize: "0.88rem", maxWidth: "56ch" }}>
                          {CATALOG_BLURB[cat]}
                        </p>
                      </div>
                      <CardGrid places={sub} />
                    </div>
                  );
                })}
              </div>
            ) : (
              <CardGrid places={intentItems} />
            )}
          </section>
        );
      })}

      <p style={{ textAlign: "center", color: "var(--pk-muted)", fontSize: "0.84rem", marginTop: 8 }}>
        Reference figures as of June 2026 · seasons and access change — we reconfirm before we quote.{" "}
        <Link href="/start" style={{ color: "var(--pk-accent-deep)", textDecoration: "none" }}>
          Not sure where to start? →
        </Link>
      </p>
    </main>
  );
}
