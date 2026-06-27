import type { Metadata } from "next";
import Link from "next/link";
import { getDestinations } from "@/lib/content";

export const metadata: Metadata = {
  title: "Destinations · Driftibo",
  description:
    "83 corners of India that look like abroad — same soul as the postcard you saved, a fraction of the price, and actually bookable.",
  openGraph: {
    title: "Destinations · Driftibo",
    description:
      "83 corners of India that look like abroad — same soul as the postcard you saved, a fraction of the price, and actually bookable.",
  },
};

export default async function DestinationsPage() {
  const destinations = await getDestinations();
  return (
    <main style={{ padding: "96px 22px 72px", maxWidth: 1000, margin: "0 auto", minHeight: "100vh" }}>
      <p className="kicker">The other India</p>
      <h1
        className="display-mega"
        style={{ fontSize: "clamp(2.2rem,7vw,3.4rem)", margin: "4px 0 6px" }}
      >
        83 corners that look like abroad
      </h1>
      <p className="lede" style={{ maxWidth: "48ch", marginBottom: 26 }}>
        Same soul as the postcard you saved — a fraction of the price, and actually bookable. Tap
        one for the honest version.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
          gap: 18,
        }}
      >
        {destinations.map((dest) => (
          <Link
            key={dest.slug}
            href={`/destinations/${dest.slug}`}
            className="card"
            style={{ textDecoration: "none", color: "inherit", textAlign: "left", padding: 0, display: "block" }}
          >
            <div
              className={`well ${dest.scene}`}
              style={{ aspectRatio: "4/3", ...(dest.heroImageUrl ? { backgroundImage: `url(${dest.heroImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" } : {}) }}
              data-label={dest.photo}
            />
            <div className="card-pad">
              <h3 className="display" style={{ fontSize: "1.2rem" }}>
                {dest.name}
              </h3>
              <p
                style={{
                  color: "var(--pk-muted)",
                  fontSize: "0.8rem",
                  marginTop: 2,
                  minHeight: "2.7rem",
                }}
              >
                {dest.tag}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <p
        style={{
          textAlign: "center",
          color: "var(--pk-muted)",
          fontSize: "0.84rem",
          marginTop: 26,
        }}
      >
        + 79 more in the full atlas ·{" "}
        <Link
          href="/game"
          style={{ color: "var(--pk-accent-deep)", textDecoration: "none" }}
        >
          let the star pick instead →
        </Link>
      </p>
    </main>
  );
}
