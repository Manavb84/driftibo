// SERVER component — exports metadata + renders package detail.
// Indexable detail page for each package with full JSON-LD + BreadcrumbList.
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPackage, getPackages, minTierPrice } from "@/lib/content";
import WhatsAppClose from "@/components/WhatsAppClose";
import CharterCallout from "@/components/CharterCallout";
import { waLink } from "@/lib/site";

const inr = (n: number) => n.toLocaleString("en-IN");

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getPackages()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getPackage(slug);
  if (!pkg) return {};
  const image = pkg.portraitImageUrl ?? "/og.jpg";
  return {
    title: `${pkg.name} · Packages · Driftibo`,
    description: pkg.blurb,
    alternates: { canonical: `/packages/${pkg.slug}` },
    openGraph: {
      title: `${pkg.name} · Driftibo`,
      description: pkg.blurb,
      images: [image],
      type: "website",
      url: `/packages/${pkg.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${pkg.name} · Driftibo`,
      description: pkg.blurb,
      images: [image],
    },
  };
}

type Pkg = NonNullable<Awaited<ReturnType<typeof getPackage>>>;

function packageJsonLd(pkg: Pkg) {
  // Use real tier prices so the Offer is valid (priceCurrency needs a price).
  // "From ₹X across N tiers" maps to an AggregateOffer with low/high price.
  const prices = pkg.tiers.map((t) => t.priceINR).filter((n) => n > 0);
  const offers = prices.length
    ? {
        "@type": "AggregateOffer",
        priceCurrency: "INR",
        lowPrice: Math.min(...prices),
        highPrice: Math.max(...prices),
        offerCount: pkg.tiers.length,
        availability: "https://schema.org/InStock",
      }
    : { "@type": "Offer", name: pkg.name, availability: "https://schema.org/InStock" };
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: pkg.name,
    description: pkg.blurb,
    touristType: pkg.kicker,
    url: `https://driftibo.com/packages/${pkg.slug}`,
    ...(pkg.portraitImageUrl ? { image: pkg.portraitImageUrl } : {}),
    offers,
    provider: {
      "@type": "Organization",
      name: "Driftibo",
      url: "https://driftibo.com",
    },
  };
}

function packageBreadcrumb(pkg: Pkg) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://driftibo.com" },
      { "@type": "ListItem", position: 2, name: "Packages", item: "https://driftibo.com/packages" },
      {
        "@type": "ListItem",
        position: 3,
        name: pkg.name,
        item: `https://driftibo.com/packages/${pkg.slug}`,
      },
    ],
  };
}

export default async function PackagePage({ params }: Props) {
  const { slug } = await params;
  const pkg = await getPackage(slug);
  if (!pkg) notFound();

  const fromPrice = minTierPrice(pkg);
  const inrFrom = fromPrice != null ? `₹${inr(fromPrice)}` : pkg.rate;
  // Cross-sell: other trips in the same lane (post-CTA "you might also like").
  const siblings = (await getPackages(pkg.lane)).filter((p) => p.slug !== pkg.slug).slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(packageJsonLd(pkg)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(packageBreadcrumb(pkg)) }}
      />

      <main
        style={{ padding: "96px 22px 72px", maxWidth: 1000, margin: "0 auto", minHeight: "100vh" }}
      >
        <Link
          href="/packages"
          style={{
            color: "var(--pk-muted)",
            fontFamily: "var(--ui)",
            fontWeight: 600,
            fontSize: "0.84rem",
            display: "inline-block",
            marginBottom: 14,
            textDecoration: "none",
          }}
        >
          ← all packages
        </Link>

        <article
          style={{
            background: "var(--pk-card)",
            borderRadius: "var(--r-lg)",
            overflow: "hidden",
            boxShadow: "var(--pk-shadow)",
          }}
        >
          {/* HERO — cinematic, near-full-height with a gradient vignette */}
          <header className="detail-hero">
            <div
              className={`detail-hero-img well ${pkg.wellScene} ${pkg.glow}`}
              style={
                pkg.portraitImageUrl
                  ? { backgroundImage: `url(${pkg.portraitImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
                  : {}
              }
              data-label={pkg.photo}
            />
            <div className="detail-hero-veil" />
            <div
              style={{
                position: "relative",
                padding: "32px 28px 36px",
                textShadow: "0 2px 18px oklch(0.3 0.06 225 / .5)",
              }}
            >
              <p className="kicker" style={{ color: "var(--pk-on-ink)" }}>
                {pkg.kicker} · {pkg.region}
              </p>
              <h1
                className="display-xl"
                style={{ fontSize: "clamp(2.6rem,8vw,4.4rem)", color: "var(--pk-on-ink)" }}
              >
                {pkg.name}
              </h1>
            </div>
          </header>

          {/* BODY */}
          <div style={{ padding: 30, display: "grid", gap: 24 }}>
            <p className="lede" style={{ maxWidth: "60ch" }}>
              {pkg.blurb}
            </p>

            {/* TAGS */}
            {pkg.tags.length > 0 && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {pkg.tags.map((t) => (
                  <span key={t} className="pill">
                    {t}
                  </span>
                ))}
              </div>
            )}

            {/* ABOVE-THE-FOLD: from-price + departures */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                flexWrap: "wrap",
                background: "var(--pk-panel)",
                borderRadius: "var(--r-md)",
                padding: "18px 20px",
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: "var(--ui)",
                    fontWeight: 700,
                    fontSize: "0.62rem",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "var(--pk-muted)",
                  }}
                >
                  {fromPrice != null ? "From, per person" : "Looks like a lakh"}
                </p>
                <p style={{ fontFamily: "var(--display)", fontSize: "1.7rem" }}>
                  {fromPrice != null ? `₹${inr(fromPrice)}` : pkg.rate}{" "}
                  <span style={{ fontSize: "0.78rem", color: "var(--pk-muted)" }}>
                    {fromPrice != null ? "all-in, this trip" : "/ person / day"}
                  </span>
                </p>
              </div>
              {pkg.departures && (
                <p
                  style={{
                    fontSize: "0.82rem",
                    color: "var(--pk-muted)",
                    maxWidth: "30ch",
                    textAlign: "right",
                  }}
                >
                  <b style={{ color: "var(--pk-text)" }}>Departures:</b> {pkg.departures}
                </p>
              )}
            </div>

            {/* TIER CARDS — budget → luxury, side-by-side, ✓/✗ */}
            {pkg.tiers.length > 0 && (
              <div>
                <p className="kicker">Choose your level</p>
                <div
                  className="tier-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
                    gap: 16,
                    marginTop: 12,
                  }}
                >
                  {pkg.tiers.map((t) => (
                    <div
                      key={t.key || t.label}
                      style={{
                        background: "var(--pk-card)",
                        border: "1px solid var(--pk-line-soft)",
                        borderRadius: "var(--r-lg)",
                        overflow: "hidden",
                        display: "grid",
                        gap: 12,
                        alignContent: "start",
                      }}
                    >
                      {/* Accommodation image — gives every tier a face, not a blank card */}
                      <div
                        className={`well ${pkg.wellScene} ${pkg.glow}`}
                        style={{
                          height: 150,
                          ...(pkg.portraitImageUrl
                            ? { backgroundImage: `url(${pkg.portraitImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
                            : {}),
                        }}
                        aria-hidden="true"
                      />
                      <div style={{ padding: "0 20px" }}>
                        <p
                          className="kicker"
                          style={{ color: "var(--persona-accent,var(--pk-accent-deep))" }}
                        >
                          {t.label}
                        </p>
                        <p style={{ fontFamily: "var(--display)", fontSize: "1.6rem", lineHeight: 1.1 }}>
                          ₹{inr(t.priceINR)}
                        </p>
                        <p style={{ fontSize: "0.78rem", color: "var(--pk-muted)" }}>
                          per person · {t.nights}
                        </p>
                      </div>
                      <div style={{ padding: "0 20px 20px", display: "grid", gap: 12 }}>
                      {t.blurb && (
                        <p style={{ fontSize: "0.92rem", color: "var(--pk-text)", lineHeight: 1.5 }}>
                          {t.blurb}
                        </p>
                      )}
                      {t.inclusions.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                          {t.inclusions.slice(0, 4).map((x) => (
                            <span
                              key={x}
                              className="pill"
                              style={{ cursor: "default", fontSize: "0.72rem" }}
                            >
                              {x}
                            </span>
                          ))}
                        </div>
                      )}
                      <a
                        href={waLink(`the ${pkg.name} — ${t.label} tier (₹${inr(t.priceINR)}, ${t.nights})`)}
                        target="_blank"
                        rel="noopener"
                        className="btn btn-primary btn-sm"
                        style={{ justifyContent: "center", textDecoration: "none" }}
                      >
                        Take {t.label} ✦
                      </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CHARTER ADD-ON (only on relevant packages) */}
            <CharterCallout slug={pkg.slug} />

            {/* WHATSAPP CTA */}
            <WhatsAppClose
              eyebrow="Take this one"
              heading={pkg.cta}
              sub="We'll confirm dates and what's included on chat — then it's yours."
              context={pkg.context}
            />

            {/* POST-CTA CROSS-SELL — more trips in the same lane */}
            {siblings.length > 0 && (
              <div>
                <p className="kicker">More like this</p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
                    gap: 16,
                    marginTop: 12,
                  }}
                >
                  {siblings.map((s, i) => {
                    const sFrom = minTierPrice(s);
                    return (
                      <Link
                        key={s.slug}
                        href={`/packages/${s.slug}`}
                        className="card reveal-target"
                        style={{ textDecoration: "none", color: "inherit", display: "block", ["--i" as string]: i } as React.CSSProperties}
                      >
                        <div
                          className={`well ${s.wellScene} ${s.glow}`}
                          style={{
                            height: 120,
                            ...(s.portraitImageUrl
                              ? { backgroundImage: `url(${s.portraitImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
                              : {}),
                          }}
                          data-label={s.name}
                        />
                        <div className="card-pad" style={{ padding: 16 }}>
                          <p className="kicker">{s.region}</p>
                          <h3 className="display" style={{ fontSize: "1.15rem", margin: "2px 0 6px" }}>{s.name}</h3>
                          {sFrom != null && <span className="pill is-on">from ₹{inr(sFrom)}</span>}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* STICKY PRICE BAR — the from-price + CTA stay reachable as you scroll the page.
            paddingRight clears the floating WhatsApp FAB (bottom-right) so the CTA is never
            obscured or click-blocked on mobile. */}
        <div style={{ position: "sticky", bottom: 18, zIndex: 40, display: "flex", justifyContent: "center", pointerEvents: "none", marginTop: 28, paddingRight: 76 }}>
          <div
            style={{
              pointerEvents: "auto",
              display: "flex",
              alignItems: "center",
              gap: 16,
              background: "var(--pk-ink)",
              color: "var(--pk-on-ink)",
              padding: "10px 12px 10px 22px",
              borderRadius: "var(--r-pill)",
              boxShadow: "var(--pk-shadow-lg)",
              maxWidth: "calc(100% - 16px)",
            }}
          >
            <span style={{ fontFamily: "var(--ui)", fontWeight: 700, fontSize: "0.92rem", whiteSpace: "nowrap" }}>
              {fromPrice != null ? "From " : ""}{inrFrom}
              <span style={{ opacity: 0.7, fontWeight: 500 }}> · {pkg.name}</span>
            </span>
            <a
              href={waLink(pkg.context)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-accent btn-sm"
              style={{ textDecoration: "none", flexShrink: 0 }}
            >
              Take this trip ✦
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
