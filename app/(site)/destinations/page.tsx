import type { Metadata } from "next";
import Link from "next/link";
import {
  allPlaces,
  images,
  bookableSlugs,
  currentMonthAbbr,
  idealInMonth,
  CATALOG_BLURB,
  type Catalog,
  type PlaceWithCatalog,
} from "@/lib/catalog";
import {
  INTENTS,
  INTENT_LABEL,
  INTENT_TO_CATALOGS,
  normalizeIntent,
  type Intent,
} from "@/lib/intent";
import { LANE } from "@/lib/lane";
import { waLink } from "@/lib/site";
import WhatsAppClose from "@/components/WhatsAppClose";
import CatalogTabs from "./CatalogTabs";

// A lane's WhatsApp handoff context — keeps the conversion band on-voice per lane.
const LANE_WA_CONTEXT: Record<Intent, string> = {
  international: "I'm dreaming of a trip abroad — visa-easy, five-star scenery",
  india: "I want a surprise trip to one of India's hidden corners",
  spiritual: "I want a temple trail / pilgrim journey planned for me",
};

export const metadata: Metadata = {
  title: "Where should your star send you? · Driftibo",
  description:
    "What's glowing this month, plus every place we plan — International, India (classic + offbeat), and Spiritual. Real landmark photos, best months to go.",
  alternates: { canonical: "/destinations" },
  openGraph: {
    title: "Where should your star send you? · Driftibo",
    description:
      "What's at its seasonal best right now, and every place we plan — grouped the way you'd choose one.",
  },
};

const MONTH_FULL: Record<string, string> = {
  Jan: "January", Feb: "February", Mar: "March", Apr: "April", May: "May", Jun: "June",
  Jul: "July", Aug: "August", Sep: "September", Oct: "October", Nov: "November", Dec: "December",
};

// catalog → the intent lane it belongs to (for the seasonal grid's kicker).
function intentOf(c: Catalog): Intent {
  if (c === "international") return "international";
  if (c === "india-spiritual") return "spiritual";
  return "india";
}

// Best-season chip text: "Nov–Mar" from first/last best months.
function seasonChip(months: string[]): string {
  if (!months.length) return "Year-round";
  if (months.length === 1) return months[0];
  return `${months[0]}–${months[months.length - 1]}`;
}

// One place card. `kicker` overrides the region label (used by the seasonal grid
// to show the intent lane instead, so a mixed grid stays legible).
function PlaceCard({ p, kicker }: { p: PlaceWithCatalog; kicker?: string }) {
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
        <p className="kicker">{kicker ?? p.region.split("·")[0].trim()}</p>
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
function CardGrid({ places, showIntent }: { places: PlaceWithCatalog[]; showIntent?: boolean }) {
  return (
    // minmax(150px) keeps a real 2-up on mobile (≈360px) and scales to 4–5 on desktop.
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 16 }}>
      {places.map((p, i) => (
        <div key={p.slug} className="reveal-target" style={{ ["--i" as string]: Math.min(i, 6) } as React.CSSProperties}>
          <PlaceCard p={p} kicker={showIntent ? INTENT_LABEL[intentOf(p.catalog)] : undefined} />
        </div>
      ))}
    </div>
  );
}

// A labelled sub-band inside a filtered lane (e.g. "Ready to book", "Classics").
function SubBand({
  head,
  blurb,
  places,
}: {
  head: string;
  blurb?: string;
  places: PlaceWithCatalog[];
}) {
  if (!places.length) return null;
  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <p className="kicker" style={{ color: "var(--pk-muted)" }}>
          {head}
        </p>
        {blurb && (
          <p style={{ color: "var(--pk-muted)", fontSize: "0.88rem", maxWidth: "56ch" }}>{blurb}</p>
        )}
      </div>
      <CardGrid places={places} />
    </div>
  );
}

// Horizontal "Bookable now" strip — the 5 places you can actually book today.
function BookableStrip({ places }: { places: PlaceWithCatalog[] }) {
  if (!places.length) return null;
  return (
    <section style={{ marginBottom: 56 }}>
      <p className="kicker">Bookable now</p>
      <h2 className="display" style={{ fontSize: "clamp(1.4rem,3vw,1.9rem)", margin: "2px 0 16px" }}>
        Ready when you are
      </h2>
      <div
        style={{
          display: "flex",
          gap: 18,
          overflowX: "auto",
          paddingBottom: 8,
          margin: "0 -22px",
          paddingLeft: 22,
          paddingRight: 22,
          scrollbarWidth: "none",
        }}
      >
        {places.map((p) => (
          <div key={p.slug} style={{ flex: "0 0 220px", maxWidth: 220 }}>
            <PlaceCard p={p} />
          </div>
        ))}
      </div>
    </section>
  );
}

// Full-width WhatsApp conversion band — the "no dead-end" promise on every lane.
function WaBand({ lane }: { lane: Intent }) {
  const href = waLink(LANE_WA_CONTEXT[lane]);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="callout-ink"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap",
        padding: "22px 26px",
        textDecoration: "none",
        margin: "0 -22px",
      }}
    >
      <div style={{ padding: "0 22px" }}>
        <p className="kicker">Nothing fits? Tell us what you want</p>
        <p style={{ fontFamily: "var(--display)", fontSize: "clamp(1.3rem,3vw,1.7rem)", color: "var(--pk-on-ink)", marginTop: 2 }}>
          A real person plans it with you on WhatsApp.
        </p>
      </div>
      <span className="btn btn-accent" style={{ margin: "0 22px", textDecoration: "none", flexShrink: 0 }}>
        Chat with us ✦
      </span>
    </a>
  );
}

type Props = { searchParams: Promise<{ intent?: string }> };

export default async function DestinationsPage({ searchParams }: Props) {
  const { intent } = await searchParams;
  const places = allPlaces();
  const validIntent = normalizeIntent(intent) ?? undefined;

  const inIntent = (i: Intent) => places.filter((p) => INTENT_TO_CATALOGS[i].includes(p.catalog));
  const inCatalog = (c: Catalog) => places.filter((p) => p.catalog === c);

  // ItemList JSON-LD over ALL 83 places — stays complete regardless of filter state,
  // so the canonical /destinations always enumerates the full reference set.
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

  const tabs = INTENTS.map((i) => ({ key: i, label: INTENT_LABEL[i] }));

  // ── Default (no intent): season-first curated view ──
  const month = currentMonthAbbr();
  const seasonal = validIntent ? [] : idealInMonth(month);
  const bookablePlaces = places.filter((p) => bookableSlugs.has(p.slug));

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
      <p className="lede" style={{ maxWidth: "54ch", marginBottom: 18 }}>
        {validIntent
          ? LANE[validIntent].exploreBlurb
          : `Start with what's glowing right now — the places at their seasonal best this ${MONTH_FULL[month]}. Or pick a lane and see all of it.`}
      </p>

      <CatalogTabs tabs={tabs} activeIntent={validIntent} />

      {validIntent ? (
        // ── Selected intent: real product first (Ready to book), then a curated
        //    editorial pick, a WhatsApp conversion band, and the rest of the lane. ──
        <section style={{ marginBottom: 56 }}>
          {(() => {
            const items = inIntent(validIntent);
            const book = items.filter((p) => bookableSlugs.has(p.slug));
            const rest = items.filter((p) => !bookableSlugs.has(p.slug));
            // Curated editorial picks (info-only is fine) — distinct from the bookable strip.
            const editorialSet = new Set(LANE[validIntent].editorialSlugs);
            const editorial = LANE[validIntent].editorialSlugs
              .map((s) => items.find((p) => p.slug === s))
              .filter((p): p is PlaceWithCatalog => !!p && !bookableSlugs.has(p.slug));
            const restMinusEditorial = rest.filter((p) => !editorialSet.has(p.slug));
            return (
              <div style={{ display: "grid", gap: 40 }}>
                <SubBand head="Ready to book" blurb="Real trips with tiers and from-prices — pick one and we close it on chat." places={book} />
                <WaBand lane={validIntent} />
                {editorial.length > 0 && (
                  <SubBand head={LANE[validIntent].editorialHead} blurb={LANE[validIntent].editorialBlurb} places={editorial} />
                )}
                {validIntent === "india" ? (
                  <>
                    <SubBand
                      head="Classics"
                      blurb={CATALOG_BLURB["india-popular"]}
                      places={inCatalog("india-popular").filter((p) => !bookableSlugs.has(p.slug) && !editorialSet.has(p.slug))}
                    />
                    <SubBand
                      head="Offbeat"
                      blurb={CATALOG_BLURB["india-offbeat"]}
                      places={inCatalog("india-offbeat").filter((p) => !bookableSlugs.has(p.slug) && !editorialSet.has(p.slug))}
                    />
                  </>
                ) : (
                  <SubBand head="More to explore" blurb="Every place in this lane — info, best seasons and real photos." places={restMinusEditorial} />
                )}
              </div>
            );
          })()}
          <div style={{ marginTop: 44 }}>
            <WhatsAppClose
              eyebrow="Or skip the browsing"
              heading="Let a human plan it with you."
              sub="Tell us your dates and limits on WhatsApp — we send 2–3 options and a full quote, usually within the hour."
              context={LANE_WA_CONTEXT[validIntent]}
            />
          </div>
        </section>
      ) : (
        // ── Default: in-season grid + bookable strip + by-season link ──
        <>
          <section style={{ marginBottom: 56 }}>
            <p className="kicker">At their best</p>
            <h2 className="display" style={{ fontSize: "clamp(1.6rem,3.4vw,2.2rem)", margin: "2px 0 8px" }}>
              In season this {MONTH_FULL[month]}
            </h2>
            <p style={{ color: "var(--pk-muted)", fontSize: "0.95rem", maxWidth: "58ch", marginBottom: 18 }}>
              The places at their seasonal peak right now — dry, comfortable, open. Across every lane.
            </p>
            {seasonal.length ? (
              <CardGrid places={seasonal} showIntent />
            ) : (
              <p style={{ color: "var(--pk-muted)", fontSize: "0.95rem" }}>
                Shoulder season almost everywhere this month — pick a lane above, or{" "}
                <Link href="/destinations/calendar" style={{ color: "var(--pk-accent-deep)" }}>
                  browse by season
                </Link>
                .
              </p>
            )}
          </section>

          <BookableStrip places={bookablePlaces} />

          <p style={{ color: "var(--pk-muted)", fontSize: "0.9rem", marginBottom: 8 }}>
            <Link href="/destinations/calendar" style={{ color: "var(--pk-accent-deep)", textDecoration: "none", fontWeight: 600 }}>
              Browse every place by season →
            </Link>
          </p>
        </>
      )}

      <p style={{ textAlign: "center", color: "var(--pk-muted)", fontSize: "0.84rem", marginTop: 32 }}>
        <Link href="/start" style={{ color: "var(--pk-accent-deep)", textDecoration: "none" }}>
          Not sure where to start? →
        </Link>
      </p>
    </main>
  );
}
