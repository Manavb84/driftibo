import Link from "next/link";

// Shared placeholder so every nav/footer target resolves (no 404s) while the real
// page is ported onto this foundation. Replaced one route at a time.
export default function ComingSoonPage({ title, blurb }: { title: string; blurb?: string }) {
  return (
    <main
      style={{
        minHeight: "72vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "140px 24px 96px",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: 560 }}>
        <span className="seal t-coral breathe" style={{ width: 64, margin: "0 auto" }}>
          <span className="ring" />
          <span className="card-pt pn">N</span>
          <span className="card-pt pe">E</span>
          <span className="card-pt ps">S</span>
          <span className="card-pt pw">W</span>
          <span className="star" />
        </span>
        <p className="kicker" style={{ marginTop: 18 }}>
          Coming soon
        </p>
        <h1 className="display-mega" style={{ fontSize: "clamp(2.4rem,7vw,4rem)", margin: "4px 0 10px" }}>
          {title}
        </h1>
        <p className="lede" style={{ maxWidth: "42ch", margin: "0 auto 26px" }}>
          {blurb ??
            "This corner of Driftibo is still being dreamed up. Spin your star in the meantime — it already knows where to send you."}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/game" className="btn btn-accent btn-lg">
            ✦ Spin my star
          </Link>
          <Link href="/" className="btn btn-ghost btn-lg">
            ← Back home
          </Link>
        </div>
      </div>
    </main>
  );
}
