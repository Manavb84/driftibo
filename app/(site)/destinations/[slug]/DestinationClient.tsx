// Editorial detail view for any of the 83 catalogue places. SERVER component —
// no pricing, no inclusions (those live in /packages for the 5 bookable). Reads
// like a feature, not a fact sheet: pitch → whyGo pull-quote → photos → a CTA every
// page carries → the logistics, folded down. The 78 info-only places get a WhatsApp
// CTA up top; the 5 bookable get the package callout.
import Link from "next/link";
import type { PlaceWithCatalog } from "@/lib/catalog";
import { CATALOG_LABEL } from "@/lib/catalog";
import { waLink } from "@/lib/site";

function Bullets({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: "0 0 0 18px", display: "grid", gap: 7, fontSize: "0.9rem", color: "var(--pk-muted)" }}>
      {items.map((x) => (
        <li key={x} style={{ lineHeight: 1.5 }}>
          {x}
        </li>
      ))}
    </ul>
  );
}

// One prose temperature sentence from the best-month climate — replaces the 12-cell grid.
function tempSentence(place: PlaceWithCatalog): string | null {
  if (!place.bestMonths.length) return null;
  const entries = place.climate.filter((c) => place.bestMonths.includes(c.m));
  if (!entries.length) return null;
  const hi = Math.round(entries.reduce((s, c) => s + c.hi, 0) / entries.length);
  const lo = Math.round(entries.reduce((s, c) => s + c.lo, 0) / entries.length);
  return `In season, days sit around ${hi}° and nights near ${lo}°.`;
}

// Image well — a background-image block with a fixed aspect.
function Well({ src, alt, ratio }: { src: string; alt: string; ratio: string }) {
  return (
    <div
      className="well"
      style={{
        aspectRatio: ratio,
        height: "100%",
        borderRadius: "var(--r-md)",
        backgroundImage: `url(${src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      role="img"
      aria-label={alt}
    />
  );
}

export default function DestinationView({
  place,
  images,
  heroImageUrl,
  packageSlug,
}: {
  place: PlaceWithCatalog;
  images: string[];
  heroImageUrl: string;
  packageSlug: string | null;
}) {
  const region = place.region.split("·")[0].trim();
  const waHref = waLink(`tell me more about ${place.name} (${region})`);
  const temp = tempSentence(place);
  const gt = place.gettingThere;
  const hasLogistics = !!(gt.air || gt.rail || gt.road || place.permits || (place.dayTrips && place.dayTrips.length));
  const [feature, ...support] = images;

  return (
    <main style={{ padding: "96px 22px 72px", maxWidth: 1000, margin: "0 auto", minHeight: "100vh" }}>
      <Link
        href="/destinations"
        style={{
          color: "var(--pk-muted)",
          fontFamily: "var(--ui)",
          fontWeight: 600,
          fontSize: "0.84rem",
          marginBottom: 14,
          display: "inline-block",
          textDecoration: "none",
        }}
      >
        ← all places
      </Link>

      <article style={{ background: "var(--pk-card)", borderRadius: "var(--r-lg)", overflow: "hidden", boxShadow: "var(--pk-shadow)" }}>
        {/* 1 · HERO */}
        <header style={{ position: "relative", height: 380, display: "flex", alignItems: "flex-end" }}>
          <div
            className="well bg"
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${heroImageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(0deg, oklch(0.18 0.05 232 / .62), transparent 58%)",
            }}
          />
          <div style={{ position: "relative", padding: 28, textShadow: "0 2px 18px oklch(0.3 0.06 225 / .6)" }}>
            <p className="kicker" style={{ color: "var(--pk-on-ink)" }}>
              {CATALOG_LABEL[place.catalog]} · {region}
            </p>
            <h1 className="display-xl" style={{ fontSize: "clamp(2.4rem,7vw,3.6rem)", color: "var(--pk-on-ink)" }}>
              {place.name}
            </h1>
          </div>
        </header>

        {/* BODY */}
        <div style={{ padding: 30, display: "grid", gap: 28 }}>
          {/* 2 · PITCH */}
          <p className="lede" style={{ maxWidth: "62ch" }}>
            {place.pitch}
          </p>

          {/* 3 · WHY GO — full-width pull-quote (the editorial heart, lifted out of the grid) */}
          {place.whyGo && (
            <blockquote
              className="poetry"
              style={{
                margin: 0,
                fontSize: "clamp(1.3rem,2.8vw,1.85rem)",
                lineHeight: 1.34,
                maxWidth: "34ch",
                paddingLeft: 20,
                borderLeft: "2px solid var(--pk-accent)",
                color: "var(--pk-text)",
              }}
            >
              {place.whyGo}
            </blockquote>
          )}

          {/* 4 · PHOTOS — 2-up editorial (one feature + supporting), not an even grid */}
          {feature && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: support.length ? "1.6fr 1fr" : "1fr",
                gap: 12,
                minHeight: 280,
              }}
            >
              <Well src={feature} alt={`${place.name} — feature view`} ratio={support.length ? "4/3" : "16/9"} />
              {support.length > 0 && (
                <div style={{ display: "grid", gap: 12 }}>
                  {support.slice(0, 2).map((src, i) => (
                    <Well key={src} src={src} alt={`${place.name} — view ${i + 2}`} ratio="16/9" />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 5 · THE CTA EVERY PAGE CARRIES — package callout (bookable) or WhatsApp (rest) */}
          {packageSlug ? (
            <div
              className="callout-ink"
              style={{
                padding: "22px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <div>
                <p className="kicker">We package this one</p>
                <p style={{ fontFamily: "var(--display)", fontSize: "1.35rem", color: "var(--pk-on-ink)", marginTop: 4 }}>
                  Ready to book {place.name}?
                </p>
                <p style={{ fontSize: "0.86rem", color: "var(--pk-on-ink)", opacity: 0.78, marginTop: 2 }}>
                  See tiers, inclusions and from-prices.
                </p>
              </div>
              <Link href={`/packages/${packageSlug}`} className="btn btn-accent" style={{ textDecoration: "none" }}>
                See the package →
              </Link>
            </div>
          ) : (
            <div
              className="callout-ink"
              style={{
                padding: "22px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <div>
                <p className="kicker">Plan it with us</p>
                <p style={{ fontFamily: "var(--display)", fontSize: "1.35rem", color: "var(--pk-on-ink)", marginTop: 4 }}>
                  Want {place.name} shaped around you?
                </p>
                <p style={{ fontSize: "0.86rem", color: "var(--pk-on-ink)", opacity: 0.78, marginTop: 2 }}>
                  Tell us your dates — we&apos;ll build the trip.
                </p>
              </div>
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn btn-accent" style={{ textDecoration: "none" }}>
                Plan it on WhatsApp ✦
              </a>
            </div>
          )}

          {/* 6 · GO IN — best months + temperature (now below the lede + CTA) */}
          {place.bestMonths.length > 0 && (
            <div style={{ background: "var(--pk-panel)", borderRadius: "var(--r-md)", padding: 22 }}>
              <p className="kicker">Go in</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
                {place.bestMonths.map((m) => (
                  <span key={m} className="pill is-on">
                    {m}
                  </span>
                ))}
              </div>
              {temp && (
                <p style={{ fontSize: "0.84rem", color: "var(--pk-muted)", marginTop: 10, lineHeight: 1.55 }}>
                  {temp}
                </p>
              )}
            </div>
          )}

          {/* 7 · WHAT YOU'LL SEE & DO — merged, one heading + a bridge line */}
          {(place.sights.length > 0 || place.activities.length > 0) && (
            <div>
              <p className="kicker">What you&apos;ll see &amp; do</p>
              <p style={{ color: "var(--pk-muted)", fontSize: "0.92rem", margin: "8px 0 16px", maxWidth: "58ch" }}>
                The sights worth the trip, and how to spend the days around them.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 24 }}>
                {place.sights.length > 0 && (
                  <div>
                    <p className="kicker" style={{ color: "var(--pk-muted)", marginBottom: 10 }}>To see</p>
                    <Bullets items={place.sights.slice(0, 4)} />
                  </div>
                )}
                {place.activities.length > 0 && (
                  <div>
                    <p className="kicker" style={{ color: "var(--pk-muted)", marginBottom: 10 }}>To do</p>
                    <Bullets items={place.activities.slice(0, 4)} />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 8 · BEFORE YOU GO (catches, ≤3) */}
          {place.catches.length > 0 && (
            <div style={{ background: "var(--pk-panel)", borderRadius: "var(--r-md)", padding: 20 }}>
              <p className="kicker">Before you go</p>
              <ul style={{ margin: "10px 0 0 18px", display: "grid", gap: 7, fontSize: "0.88rem", color: "var(--pk-muted)" }}>
                {place.catches.slice(0, 3).map((x) => (
                  <li key={x} style={{ lineHeight: 1.55 }}>
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 9 · DAYS, ALREADY SHAPED (itineraries) */}
          {(place.itineraries["3"] || place.itineraries["5"] || place.itineraries["7"]) && (
            <div>
              <p className="kicker">Days, already shaped</p>
              <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
                {(["3", "5", "7"] as const).map((d) => {
                  const days = place.itineraries[d];
                  if (!days || !days.length) return null;
                  return (
                    <details key={d} style={{ background: "var(--pk-panel)", borderRadius: 12, padding: "12px 16px" }}>
                      <summary style={{ cursor: "pointer", fontFamily: "var(--display)", fontSize: "1.05rem", listStyle: "revert" }}>
                        {d}-day plan
                      </summary>
                      <ul style={{ margin: "10px 0 0 18px", display: "grid", gap: 6, fontSize: "0.88rem", color: "var(--pk-muted)" }}>
                        {days.map((line) => (
                          <li key={line} style={{ lineHeight: 1.55 }}>
                            {line}
                          </li>
                        ))}
                      </ul>
                    </details>
                  );
                })}
              </div>
            </div>
          )}

          {hasLogistics && (
            <details style={{ background: "var(--pk-panel)", borderRadius: 12, padding: "12px 16px" }}>
              <summary style={{ cursor: "pointer", fontFamily: "var(--display)", fontSize: "1.05rem", listStyle: "revert" }}>
                Getting there, permits & day trips
              </summary>
              <div style={{ display: "grid", gap: 14, marginTop: 12, fontSize: "0.88rem", color: "var(--pk-muted)", lineHeight: 1.6 }}>
                {(gt.air || gt.rail || gt.road) && (
                  <div style={{ display: "grid", gap: 6 }}>
                    {gt.air && <p><b style={{ color: "var(--pk-text)" }}>By air —</b> {gt.air}</p>}
                    {gt.rail && <p><b style={{ color: "var(--pk-text)" }}>By rail —</b> {gt.rail}</p>}
                    {gt.road && <p><b style={{ color: "var(--pk-text)" }}>By road —</b> {gt.road}</p>}
                    <p style={{ fontStyle: "italic" }}>On a Driftibo trip we handle the transfers.</p>
                  </div>
                )}
                {place.permits && (
                  <p><b style={{ color: "var(--pk-text)" }}>Permits & entry —</b> {place.permits}</p>
                )}
                {place.dayTrips && place.dayTrips.length > 0 && (
                  <div>
                    <p style={{ color: "var(--pk-text)", fontWeight: 600, marginBottom: 6 }}>Day trips nearby</p>
                    <Bullets items={place.dayTrips} />
                  </div>
                )}
              </div>
            </details>
          )}

          {/* 10 · CLOSER — calendar + a secondary WhatsApp, then one quiet line */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <Link href="/destinations/calendar" className="btn btn-ghost">
              When to go →
            </Link>
            <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              Or just message us ✦
            </a>
          </div>

          <p style={{ fontSize: "0.76rem", color: "var(--pk-muted)" }}>
            Seasons and access shift — we reconfirm every detail before we quote.
          </p>
        </div>
      </article>
    </main>
  );
}
