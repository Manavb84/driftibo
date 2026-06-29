// The 83-place informational catalogue — the reference dataset behind Explore.
// Source of truth is docs/research/playbook/destinations-data.json, copied to
// lib/catalog.json so the app imports it at build time (no DB migration for the 78
// info-only places — only the 5 bookable ones live in Supabase `destinations`).
// ponytail: import JSON at build time; server components only — don't import this
// from a client component or the ~900KB JSON lands in the browser bundle.
import raw from "./catalog.json";

export type Catalog =
  | "international"
  | "india-popular"
  | "india-offbeat"
  | "india-spiritual";

export type ClimateMonth = {
  m: string;
  hi: number;
  lo: number;
  rate: string; // "ideal" | "ok" | "avoid"
  note?: string;
};

// One place in the catalogue. Mirrors the JSON; `operator` is sales-internal
// (cost band / who-to-send) and is intentionally NOT surfaced on Explore.
export type Place = {
  slug: string;
  name: string;
  region: string;
  pitch: string;
  bestMonths: string[];
  climate: ClimateMonth[];
  whyGo: string;
  sights: string[];
  activities: string[];
  itineraries: { "3"?: string[]; "5"?: string[]; "7"?: string[] };
  stay: string;
  dayTrips?: string[];
  pack?: string;
  gettingThere: { air?: string; rail?: string; road?: string };
  permits: string;
  catches: string[];
  operator?: { costBand?: string; whoToSend?: string; pairsWith?: string };
  section?: string;
};

export type PlaceWithCatalog = Place & { catalog: Catalog };

export const CATALOG_ORDER: Catalog[] = [
  "international",
  "india-popular",
  "india-offbeat",
  "india-spiritual",
];

export const CATALOG_LABEL: Record<Catalog, string> = {
  international: "International",
  "india-popular": "India · Popular",
  "india-offbeat": "India · Offbeat",
  "india-spiritual": "India · Spiritual",
};

// One-line section blurbs for the Explore index. "Looks like abroad" lives ONLY
// here, inside the International bucket — never as the site masthead.
export const CATALOG_BLURB: Record<Catalog, string> = {
  international: "Beyond India — visa-easy escapes that look like abroad because they are.",
  "india-popular": "The names India already loves — the classics, done well.",
  "india-offbeat": "Under-the-radar India — the surprise-trip home turf.",
  "india-spiritual": "Temple trails and pilgrim circuits, the offbeat ones included.",
};

const data = raw as unknown as Record<Catalog, Place[]>;

// The 5 places that are actually bookable today (Supabase `destinations`). Everyone
// else in the catalogue is info-only on Explore — no price, no package.
export const bookableSlugs = new Set<string>([
  "chopta",
  "spiti",
  "ziro",
  "gokarna",
  "char-dham",
]);

// Bookable place slug → the package where you pick a tier & price.
export const DEST_TO_PACKAGE: Record<string, string> = {
  chopta: "temple-ridge",
  spiti: "cold-desert",
  ziro: "rice-and-fog",
  gokarna: "slow-coast",
  "char-dham": "char-dham-circuit",
};

export function getCatalog(cat: Catalog): Place[] {
  return data[cat] ?? [];
}

// All 83 places, each tagged with its catalog. Order follows CATALOG_ORDER.
export function allPlaces(): PlaceWithCatalog[] {
  return CATALOG_ORDER.flatMap((cat) =>
    getCatalog(cat).map((p) => ({ ...p, catalog: cat })),
  );
}

// slug → place (+ its catalog). Slugs are unique across the 4 catalogs in the
// dataset, so first match wins.
export function getPlace(slug: string): PlaceWithCatalog | null {
  return allPlaces().find((p) => p.slug === slug) ?? null;
}

export function catalogCounts(): Record<Catalog, number> {
  return Object.fromEntries(
    CATALOG_ORDER.map((c) => [c, getCatalog(c).length]),
  ) as Record<Catalog, number>;
}

// Three-letter month abbreviations, index-aligned to Date#getMonth() (0 = Jan).
export const MONTH_ABBR = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

// The current month's abbreviation, e.g. "Jun". Resolves at request time on a
// dynamic page; freezes at build time on a static one (see destinations/page note).
export function currentMonthAbbr(): string {
  return MONTH_ABBR[new Date().getMonth()];
}

// Every place whose climate is rated "ideal" in month `m` (e.g. "Jun"), tagged with
// its catalog. The seasonal heartbeat shared by Explore's default view and the
// calendar — one definition of "in season", reused in both.
export function idealInMonth(m: string): PlaceWithCatalog[] {
  return allPlaces().filter((p) => {
    const c = p.climate.find((x) => x.m === m);
    return !!c && (c.rate || "").toLowerCase() === "ideal";
  });
}

// The 3 committed landmark photos for a place, as public URLs.
// /visual-bank/<catalog>/<slug>-{1,2,3}.jpg
export function images(slug: string, catalog: Catalog): [string, string, string] {
  const base = `/visual-bank/${catalog}/${slug}`;
  return [`${base}-1.jpg`, `${base}-2.jpg`, `${base}-3.jpg`];
}

// ponytail self-check: catalogue is well-formed (slug uniqueness + 83 total).
if (process.env.NODE_ENV !== "production") {
  const all = allPlaces();
  const slugs = new Set(all.map((p) => p.slug));
  console.assert(all.length === 83, `catalog: expected 83 places, got ${all.length}`);
  console.assert(slugs.size === all.length, "catalog: duplicate slug across catalogs");
}
