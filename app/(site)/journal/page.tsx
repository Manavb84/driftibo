import type { Metadata } from "next";
import Link from "next/link";
import { articles } from "@/lib/data/journal";

export const metadata: Metadata = {
  title: "Journal · Driftibo",
};

export default function Page() {
  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <main
      style={{
        padding: "96px 22px 72px",
        maxWidth: 820,
        margin: "0 auto",
        minHeight: "100vh",
      }}
    >
      <p className="kicker">The Journal</p>
      <h1
        className="display-mega"
        style={{ fontSize: "clamp(2.2rem,7vw,3.4rem)", margin: "4px 0 6px" }}
      >
        Field notes from the drift
      </h1>
      <p
        className="lede"
        style={{ maxWidth: "46ch", marginBottom: 26 }}
      >
        Honest guides, short essays, and the occasional confession about how we work.
      </p>

      <Link
        href="/journal/switzerland-twins"
        className="card"
        style={{
          display: "block",
          textDecoration: "none",
          color: "inherit",
          marginBottom: 18,
        }}
      >
        <div
          className={`well ${featured.scene}`}
          style={{ aspectRatio: "16/7" }}
          data-label="Chopta ridge · ref ✓"
        />
        <div className="card-pad">
          <p className="kicker">
            {featured.kind} · {featured.read}
          </p>
          <h2
            className="display"
            style={{ fontSize: "clamp(1.5rem,4vw,2rem)" }}
          >
            {featured.title}
          </h2>
          <p style={{ color: "var(--pk-muted)", fontSize: "0.95rem" }}>{featured.dek}</p>
        </div>
      </Link>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
          gap: 18,
        }}
      >
        {rest.map((article) => (
          <Link
            key={article.slug}
            href={`/journal/${article.slug}`}
            className="card"
            style={{ display: "block", textDecoration: "none", color: "inherit" }}
          >
            <div
              className={`well ${article.scene}`}
              style={{ aspectRatio: "4/3" }}
              data-label={article.photo}
            />
            <div className="card-pad">
              <p className="kicker">{article.kind}</p>
              <h3 className="display" style={{ fontSize: "1.2rem" }}>
                {article.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
