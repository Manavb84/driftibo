import type { Metadata } from "next";
import Link from "next/link";
import HeroStage from "@/components/HeroStage";
import OtherIndiaRotator from "@/components/OtherIndiaRotator";
import HomeIntent from "@/components/HomeIntent";
import HomeFAQ from "@/components/HomeFAQ";
import PriceBadge from "@/components/PriceBadge";
import { getDestinations, getPackages, getOfferings, minTierPrice } from "@/lib/content";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const inr = (n: number) => n.toLocaleString("en-IN");

// Per-offering chip glyph/sticker for the home grid (the DB carries the copy and the
// image_url). The card image comes from the offering itself — never a destination scene —
// so the home grid matches /offerings. Unknown slugs fall back to DEFAULT.
const SURFACE_STYLE: Record<string, { glyph: string; sticker: string }> = {
  "/surprise": { glyph: "✦", sticker: "Hands-off" },
  "/custom": { glyph: "♡", sticker: "Yours, tailored" },
  "/concierge": { glyph: "◆", sticker: "White-glove" },
  "/corporate": { glyph: "◈", sticker: "For teams" },
  "/abroad": { glyph: "✈", sticker: "Beyond India" },
};
const DEFAULT_SURFACE = { glyph: "✦", sticker: "New lane" };

export default async function Home() {
  const [destinations, packages, offerings] = await Promise.all([
    getDestinations(),
    getPackages(),
    getOfferings(),
  ]);
  // Slice to 4 for the teaser sections; fall back gracefully to empty array
  const featuredDests = destinations.slice(0, 4);
  const featuredPacks = packages.slice(0, 4);
  // Home shows just two lanes — Surprise + Custom — and points the rest to /offerings.
  const homeOfferings = (() => {
    const pick = offerings.filter((o) => o.slug === "/surprise" || o.slug === "/custom");
    return pick.length >= 2 ? pick : offerings.slice(0, 2);
  })();

  return (
    <>
      <HeroStage />

      {/* DUPE STRIP — rotates 8 "other India" one-liners */}
      <OtherIndiaRotator />

      {/* WHAT KIND OF TRIP? — up-front intent entry (3 intents) */}
      <HomeIntent />

      {/* HOW IT WORKS */}
      <section style={{ maxWidth: 1080, margin: "0 auto", padding: "72px 24px" }}>
        <p className="kicker" style={{ textAlign: "center" }}>
          Three steps, then you pack
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: 30,
            marginTop: 30,
          }}
        >
          <div>
            <span className="step-num" style={{ fontFamily: "var(--display)", fontSize: "2.1rem" }}>
              01
            </span>
            <h3 className="display" style={{ fontSize: "1.35rem", marginTop: 2 }}>
              Tell it your limits
            </h3>
            <p style={{ color: "var(--pk-muted)", fontSize: "0.94rem", marginTop: 6 }}>
              Seven taps — terrain, vibe, who&apos;s coming, how long, comfort, where from, how far. No typing, no second-guessing.
            </p>
          </div>
          <div>
            <span className="step-num" style={{ fontFamily: "var(--display)", fontSize: "2.1rem" }}>
              02
            </span>
            <h3 className="display" style={{ fontSize: "1.35rem", marginTop: 2 }}>
              It sends you somewhere real
            </h3>
            <p style={{ color: "var(--pk-muted)", fontSize: "0.94rem", marginTop: 6 }}>
              The star draws a real place that fits. No phantom destinations.
            </p>
          </div>
          <div>
            <span className="step-num" style={{ fontFamily: "var(--display)", fontSize: "2.1rem" }}>
              03
            </span>
            <h3 className="display" style={{ fontSize: "1.35rem", marginTop: 2 }}>
              You just go
            </h3>
            <p style={{ color: "var(--pk-muted)", fontSize: "0.94rem", marginTop: 6 }}>
              We hand you the itinerary and close it on WhatsApp. You stop choosing. You start packing.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURED DESTINATIONS — moved UP: destination proof before any game.
          CMS-driven (getDestinations, up to 4). */}
      {featuredDests.length > 0 && (
        <section style={{ maxWidth: 1080, margin: "0 auto", padding: "8px 24px 64px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 14 }}>
            <div>
              <p className="kicker">Real places, star-sent</p>
              <h2 className="display" style={{ fontSize: "clamp(1.6rem,3.4vw,2.2rem)", marginTop: 6 }}>
                Same soul. A fraction of the price.
              </h2>
            </div>
            <Link href="/destinations" className="btn btn-ghost btn-sm">
              Explore all places →
            </Link>
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 18, marginTop: 24 }}
          >
            {featuredDests.map((dest) => (
              <Link
                key={dest.slug}
                href={`/destinations/${dest.slug}`}
                className="card"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div
                  className={`well ${dest.scene}`}
                  style={{
                    aspectRatio: "3/4",
                    ...(dest.portraitImageUrl
                      ? { backgroundImage: `url(${dest.portraitImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
                      : {}),
                  }}
                  data-label={dest.name}
                />
                <div className="card-pad">
                  <h3 className="display" style={{ fontSize: "1.2rem" }}>
                    {dest.name}
                  </h3>
                  <p style={{ color: "var(--pk-muted)", fontSize: "0.8rem", marginTop: 2, minHeight: "2.7rem" }}>
                    {dest.tag || dest.lookLike}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* VALUE-PROOF MOMENT — moved UP, right after the destination proof */}
      <section style={{ background: "var(--pk-panel)", padding: "72px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p className="kicker">The calm part nobody shouts</p>
          <p className="display" style={{ fontSize: "clamp(1.6rem,3.4vw,2.2rem)", margin: "8px 0 24px" }}>
            Looks like a lakh. Runs at ₹6,800 a day.
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 18,
              flexWrap: "wrap",
              background: "var(--pk-card)",
              borderRadius: "var(--r-md)",
              padding: "24px 26px",
              boxShadow: "var(--pk-shadow-sm)",
              textAlign: "left",
              maxWidth: 560,
              margin: "0 auto",
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: "var(--ui)",
                  fontWeight: 700,
                  fontSize: "0.64rem",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--pk-muted)",
                }}
              >
                Looks like a lakh
              </p>
              <p style={{ fontFamily: "var(--display)", fontSize: "2rem", lineHeight: 1.05, marginTop: 2 }}>
                <PriceBadge amount="6,800" unit="/ person / day" />
              </p>
            </div>
            <p style={{ fontSize: "0.82rem", color: "var(--pk-muted)", maxWidth: "20ch", textAlign: "right" }}>
              Stay, transfers, a guided day. Verified, never inflated. The surprise game stays price-free on purpose.
            </p>
          </div>
        </div>
      </section>

      {/* PACKAGES TEASER — CMS-driven (getPackages, up to 4), with from-price */}
      {featuredPacks.length > 0 && (
        <section style={{ background: "var(--pk-panel)", padding: "72px 24px" }}>
          <div style={{ maxWidth: 1080, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 14 }}>
              <div>
                <p className="kicker">Done-for-you drifts</p>
                <h2 className="display" style={{ fontSize: "clamp(1.7rem,3.5vw,2.3rem)", marginTop: 6 }}>
                  Trips, already dreamed up
                </h2>
              </div>
              <Link href="/packages" className="btn btn-ghost btn-sm">
                See all packages →
              </Link>
            </div>
            <div
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 18, marginTop: 28 }}
            >
              {featuredPacks.map((pack) => {
                const from = minTierPrice(pack);
                return (
                  <Link
                    key={pack.slug}
                    href={`/packages/${pack.slug}`}
                    className="card"
                    style={{ textDecoration: "none", color: "inherit", display: "block" }}
                  >
                    <div
                      className={`well ${pack.wellScene} ${pack.glow}`}
                      style={{
                        aspectRatio: "5/4",
                        ...(pack.portraitImageUrl
                          ? { backgroundImage: `url(${pack.portraitImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
                          : {}),
                      }}
                      data-label={pack.name}
                    />
                    <div className="card-pad">
                      <p className="kicker">{pack.region}</p>
                      <h3 className="display" style={{ fontSize: "1.3rem", margin: "4px 0 10px" }}>
                        {pack.name}
                      </h3>
                      {from != null ? (
                        <span className="pill is-on">from ₹{inr(from)}</span>
                      ) : pack.rate ? (
                        <span className="pill is-on">
                          <PriceBadge amount={pack.rate.replace(/[^\d,]/g, "")} unit="/ person / day" />
                        </span>
                      ) : null}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* OFFERINGS GRID — just the two headline lanes; the rest live on /offerings */}
      {homeOfferings.length > 0 && (
        <section style={{ maxWidth: 1080, margin: "0 auto", padding: "72px 24px" }}>
          <p className="kicker" style={{ textAlign: "center" }}>
            When you want a human, not a spin
          </p>
          <h2 className="display" style={{ fontSize: "clamp(1.7rem,3.5vw,2.3rem)", textAlign: "center", marginTop: 6 }}>
            Ways to be sent
          </h2>
          <div
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 20, marginTop: 28 }}
          >
            {homeOfferings.map((o) => {
              const s = SURFACE_STYLE[o.slug] ?? DEFAULT_SURFACE;
              // Image first; else the offering's own scene token (photo holds an s-*);
              // else the base .well gradient. Same precedence as /offerings.
              const sceneFallback = !o.imageUrl && o.photo?.startsWith("s-") ? o.photo : "";
              return (
                <Link key={o.id} href="/offerings" className="play-card">
                  <div
                    className={`well bg ${sceneFallback}`}
                    style={{
                      height: 128,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      padding: 16,
                      ...(o.imageUrl
                        ? { backgroundImage: `url(${o.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
                        : {}),
                    }}
                  >
                    <span
                      style={{
                        alignSelf: "flex-start",
                        fontFamily: "var(--ui)",
                        fontWeight: 800,
                        fontSize: "0.58rem",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "oklch(0.99 0.01 210)",
                        background: "oklch(0.26 0.06 250 / .45)",
                        WebkitBackdropFilter: "blur(4px)",
                        backdropFilter: "blur(4px)",
                        padding: "5px 10px",
                        borderRadius: "var(--r-pill)",
                      }}
                    >
                      {s.sticker}
                    </span>
                    <span
                      className="display"
                      style={{ fontSize: "2.4rem", color: "oklch(1 0 0 / .92)", lineHeight: 0.8, textShadow: "0 2px 16px oklch(0.2 0.05 250 / .5)" }}
                    >
                      {s.glyph}
                    </span>
                  </div>
                  <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 7, flex: 1 }}>
                    <h3 className="display" style={{ fontSize: "1.3rem" }}>
                      {o.name}
                    </h3>
                    <p style={{ color: "var(--pk-muted)", fontSize: "0.88rem" }}>{o.descr}</p>
                    <span className="play-go">Start →</span>
                  </div>
                </Link>
              );
            })}
          </div>
          <p style={{ textAlign: "center", marginTop: 28 }}>
            <Link href="/offerings" className="btn btn-ghost btn-sm">
              See all ways to drift →
            </Link>
          </p>
        </section>
      )}

      {/* PLAY TEASER — games are an add-on, so they sit near the bottom as one slim
          card linking the /play hub (the 3 games live there), not a headline band. */}
      <section style={{ maxWidth: 1080, margin: "0 auto", padding: "8px 24px 72px" }}>
        <Link
          href="/play"
          className="play-card"
          style={{ display: "block", textDecoration: "none", color: "inherit" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 18,
              flexWrap: "wrap",
              padding: 26,
            }}
          >
            <div style={{ maxWidth: "54ch" }}>
              <p className="kicker" style={{ color: "var(--pk-accent-deep)" }}>
                Not ready to commit?
              </p>
              <h2 className="display" style={{ fontSize: "clamp(1.5rem,3.2vw,2.1rem)", marginTop: 4 }}>
                Play for your next trip
              </h2>
              <p style={{ color: "var(--pk-muted)", fontSize: "0.92rem", marginTop: 6 }}>
                Three two-minute games — Spin my star, the Vibe Quiz, Dream My Trip — each ends on a real
                place. Just for fun, no pressure.
              </p>
            </div>
            <span className="play-go" style={{ fontSize: "1rem" }}>
              Enter the play room →
            </span>
          </div>
        </Link>
      </section>

      {/* FAQ */}
      <HomeFAQ />

      {/* CLOSING CTA — one confident band instead of trailing into an orphan line */}
      <section style={{ padding: "8px 24px 64px" }}>
        <div
          className="callout-ink"
          style={{
            maxWidth: 1080,
            margin: "0 auto",
            padding: "44px 32px",
            textAlign: "center",
            display: "grid",
            gap: 16,
            justifyItems: "center",
          }}
        >
          <p className="kicker">Stop choosing</p>
          <h2 className="display" style={{ fontSize: "clamp(1.9rem,4.2vw,2.8rem)", color: "var(--pk-on-ink)", maxWidth: "18ch" }}>
            Ready to let your star decide?
          </h2>
          <Link href="/game" className="btn btn-accent" style={{ textDecoration: "none" }}>
            Spin my star ✦
          </Link>
        </div>
      </section>
    </>
  );
}
