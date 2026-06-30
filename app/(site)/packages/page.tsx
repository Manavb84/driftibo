import type { Metadata } from "next";
import Link from "next/link";
import { getPackages, minTierPrice } from "@/lib/content";
import { getIntent } from "@/lib/intent-server";
import { lane as laneOf } from "@/lib/lane";
import { INTENT_LABEL } from "@/lib/intent";

// Lane-personalized via the cookie — render per request so a lane pick (router.refresh)
// reorients it, and ?all=1 can break out to every trip.
export const dynamic = "force-dynamic";

// Lane-aware <head>, consistent with home + about.
export async function generateMetadata(): Promise<Metadata> {
  const intent = await getIntent();
  const titles: Record<string, string> = {
    international: "Trips abroad · Packages · Driftibo",
    india: "India packages · Driftibo",
    spiritual: "Pilgrim journeys · Packages · Driftibo",
  };
  return { title: intent ? titles[intent] : "Packages · Driftibo" };
}

const inr = (n: number) => n.toLocaleString("en-IN");

type Props = { searchParams: Promise<{ all?: string }> };

export default async function PackagesPage({ searchParams }: Props) {
  // Lane-scoped: each intent sees its own trips. The cookie owns the scope; ?all=1 is
  // the deliberate escape to every trip; undecided visitors see all by default.
  const { all } = await searchParams;
  const intent = await getIntent();
  const showAll = all === "1" || !intent;
  const laneData = laneOf(showAll ? null : intent);
  const PACKS = await getPackages(showAll ? undefined : intent);
  return (
    <>
      <section style={{ padding: "104px 22px 40px", maxWidth: 1080, margin: "0 auto", textAlign: "center" }}>
        <p className="kicker" style={{ color: "var(--persona-accent,var(--pk-accent-deep))" }}>Done-for-you drifts{intent && !showAll ? ` · ${INTENT_LABEL[intent]}` : ""}</p>
        <h1 className="display-mega" style={{ fontSize: "clamp(2.2rem,7vw,3.4rem)", margin: "6px 0 8px" }}>{laneData.packagesHead}</h1>
        <p className="lede" style={{ maxWidth: "48ch", margin: "0 auto" }}>Not a pricing grid. Finished ideas you can take as-is or bend to your dates — each one with options from budget to luxury. Every card shows a from-price; the full quote comes on chat.</p>
        {intent && (
          <p style={{ marginTop: 14, fontSize: "0.85rem", color: "var(--pk-muted)" }}>
            {showAll ? (
              <>Showing all packages · <Link href="/packages" style={{ color: "var(--pk-accent-deep)", textDecoration: "none", fontWeight: 600 }}>back to {INTENT_LABEL[intent]} →</Link></>
            ) : (
              <>Browsing: {INTENT_LABEL[intent]} · <Link href="/packages?all=1" style={{ color: "var(--pk-accent-deep)", textDecoration: "none", fontWeight: 600 }}>see all packages →</Link></>
            )}
          </p>
        )}
      </section>

      {PACKS.map((p, i) => {
        const from = minTierPrice(p);
        return (
        <section
          key={p.id}
          style={{
            scrollSnapAlign: "start",
            padding: "48px 22px",
            display: "flex",
            alignItems: "center",
            minHeight: "88vh",
            background: i % 2 ? "var(--pk-panel)" : "var(--pk-paper)",
          }}
        >
          <div
            style={{
              maxWidth: 1040,
              margin: "0 auto",
              width: "100%",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
              gap: "clamp(24px,5vw,56px)",
              alignItems: "center",
            }}
          >
            <div
              className={`well ${p.wellScene} ${p.glow}`}
              style={{
                borderRadius: "var(--r-lg)",
                aspectRatio: "4/5",
                minHeight: 340,
                order: i % 2 ? 2 : 0,
                ...(p.portraitImageUrl ? { backgroundImage: `url(${p.portraitImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" } : {}),
              }}
              data-label={p.photo}
            />
            <div>
              <p className="kicker">{p.kicker}</p>
              <h2 className="display" style={{ fontSize: "clamp(2rem,6vw,3rem)", margin: "4px 0 6px" }}>{p.name}</h2>
              <p className="poetry" style={{ color: "var(--pk-muted)", fontSize: "1.1rem" }}>{p.region}</p>
              <p style={{ color: "var(--pk-text)", fontSize: "1rem", margin: "16px 0", maxWidth: "46ch" }}>{p.blurb}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
                {p.tags.map((t) => (
                  <span key={t} className="pill">{t}</span>
                ))}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                  flexWrap: "wrap",
                  background: "var(--pk-panel)",
                  borderRadius: "var(--r-md)",
                  padding: "16px 20px",
                  marginBottom: 18,
                }}
              >
                <div>
                  <p style={{ fontFamily: "var(--ui)", fontWeight: 700, fontSize: "0.62rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--pk-muted)" }}>{from != null ? "From, per person" : "Looks like a lakh"}</p>
                  <p style={{ fontFamily: "var(--display)", fontSize: "1.6rem" }}>{from != null ? `₹${inr(from)}` : p.rate} <span style={{ fontSize: "0.78rem", color: "var(--pk-muted)" }}>{from != null ? "all-in" : "/ person / day"}</span></p>
                </div>
                <p style={{ fontSize: "0.78rem", color: "var(--pk-muted)", maxWidth: "22ch", textAlign: "right" }}>{p.departures ? p.departures : `${p.nights} · stay, transfers, a guided day. Verified.`}</p>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Link href={`/packages/${p.slug}`} className="btn btn-ghost">
                  See the trip →
                </Link>
              </div>
            </div>
          </div>
        </section>
        );
      })}
    </>
  );
}
