import type { Metadata } from "next";
import Link from "next/link";
import { getIntent } from "@/lib/intent-server";

const SITE_URL = "https://driftibo.com";

// Lane-aware <head> — the description leads with the chosen lane's promise.
export async function generateMetadata(): Promise<Metadata> {
  const intent = await getIntent();
  const desc: Record<string, string> = {
    international: "Driftibo plans visa-easy escapes beyond India — five-star scenery, three-star prices. You set the limits; we plan the trip and close it on WhatsApp.",
    india: "Driftibo plans surprise trips to India's hidden corners. You tell the star your limits — we handle everything else, start to finish, on WhatsApp.",
    spiritual: "Driftibo plans temple trails and pilgrim circuits — the offbeat ones included. You set the limits; we plan the journey and close it on WhatsApp.",
  };
  const description = desc[intent ?? "india"];
  return {
    title: "About · Driftibo",
    description,
    alternates: { canonical: `${SITE_URL}/about` },
    openGraph: {
      title: "About Driftibo — Travel by your own star",
      description,
      url: `${SITE_URL}/about`,
      images: [{ url: `${SITE_URL}/og.jpg`, width: 1200, height: 630, alt: "Driftibo — Travel by your own star" }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "About Driftibo",
      description,
      images: [`${SITE_URL}/og.jpg`],
    },
  };
}

export default function AboutPage() {
  return (
    <main
      style={{
        padding: "96px 22px 72px",
        maxWidth: 820,
        margin: "0 auto",
        minHeight: "100vh",
        display: "grid",
        gap: 24,
      }}
    >
      <section
        className="callout-ink"
        style={{ borderRadius: "var(--r-md)", padding: "clamp(32px,6vw,52px)", display: "grid", gap: 16 }}
      >
        <span className="seal t-ink" style={{ width: 64 }}>
          <span className="ring"></span>
          <span className="card-pt pn">N</span>
          <span className="card-pt pe">E</span>
          <span className="card-pt ps">S</span>
          <span className="card-pt pw">W</span>
          <span className="star"></span>
        </span>
        <p className="kicker" style={{ marginTop: 8 }}>
          The movement
        </p>
        <h1
          className="display-mega"
          style={{ color: "var(--pk-on-ink)", fontSize: "clamp(2.2rem,6vw,3.4rem)", maxWidth: "18ch" }}
        >
          The best trips aren&apos;t planned. They&apos;re sent.
        </h1>
        <p className="lede" style={{ color: "var(--pk-on-ink)", maxWidth: "56ch" }}>
          You don&apos;t need more options. You need permission to stop choosing. Tell the star your limits — it sends you
          somewhere real, and you&apos;re proud you obeyed.
        </p>
        <p className="poetry" style={{ color: "var(--pk-on-ink)", fontSize: "1.35rem" }}>
          Don&apos;t decide. Just go where your star sends you.
        </p>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16 }}>
        <div className="card card-pad">
          <p className="kicker">We believe</p>
          <p className="display" style={{ fontSize: "1.3rem", marginTop: 4 }}>
            Choice is the enemy of the trip.
          </p>
          <p style={{ color: "var(--pk-muted)", fontSize: "0.9rem", marginTop: 6 }}>
            Forty open tabs is not freedom. It&apos;s how the trip dies. We close the tabs for you.
          </p>
        </div>
        <div className="card card-pad">
          <p className="kicker">We promise</p>
          <p className="display" style={{ fontSize: "1.3rem", marginTop: 4 }}>
            Real places, honest prices.
          </p>
          <p style={{ color: "var(--pk-muted)", fontSize: "0.9rem", marginTop: 6 }}>
            No phantom destinations, no inflated rates. Per head, verified, calm — never shouted.
          </p>
        </div>
        <div className="card card-pad">
          <p className="kicker">We are</p>
          <p className="display" style={{ fontSize: "1.3rem", marginTop: 4 }}>
            Faceless on purpose.
          </p>
          <p style={{ color: "var(--pk-muted)", fontSize: "0.9rem", marginTop: 6 }}>
            The star is the star. We&apos;re the desk behind it, replying on WhatsApp in under 60 seconds.
          </p>
        </div>
      </section>

      {/* TRUST SIGNALS */}
      <section
        style={{
          background: "var(--pk-card)",
          borderRadius: "var(--r-md)",
          boxShadow: "var(--pk-shadow-sm)",
          padding: "clamp(24px,5vw,36px)",
        }}
      >
        <p className="kicker">Why trust us</p>
        <h2 className="display" style={{ fontSize: "1.8rem", margin: "4px 0 20px" }}>
          Four things we stake our name on
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
            gap: 20,
          }}
        >
          {[
            {
              glyph: "✓",
              title: "Verified on the ground",
              body: "Every destination is confirmed with a real reference — guesthouses, transfer routes, seasonal windows. If we haven't verified it, it doesn't spin.",
            },
            {
              glyph: "⟳",
              title: "WhatsApp in under 60 s",
              body: "There's a real person behind the star. Message us at any hour and you'll have a reply in under a minute, not a chatbot, not a form.",
            },
            {
              glyph: "₹",
              title: "Itemised, never inflated",
              body: "We show you exactly what the day-rate covers before you pay a rupee. No hidden fees, no bundled commissions dressed as value.",
            },
            {
              glyph: "↩",
              title: "One honest override",
              body: "If the star sends you somewhere you genuinely can't go, we'll spin again — once. The policy is written plainly in the FAQ and repeated at booking.",
            },
          ].map((item) => (
            <div key={item.title} style={{ display: "grid", gap: 6 }}>
              <span
                style={{
                  fontFamily: "var(--display)",
                  fontSize: "1.6rem",
                  color: "var(--pk-accent-deep)",
                  lineHeight: 1,
                }}
                aria-hidden="true"
              >
                {item.glyph}
              </span>
              <p className="display" style={{ fontSize: "1.05rem" }}>
                {item.title}
              </p>
              <p style={{ color: "var(--pk-muted)", fontSize: "0.88rem", lineHeight: 1.55 }}>
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ textAlign: "center", padding: "20px 0" }}>
        <p className="poetry" style={{ fontSize: "1.3rem", color: "var(--pk-muted)", marginBottom: 14 }}>
          So — where will yours send you?
        </p>
        <Link href="/game" className="btn btn-accent btn-lg">
          ✦ Spin my star
        </Link>
      </section>
    </main>
  );
}
