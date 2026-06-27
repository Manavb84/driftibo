import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About · Driftibo",
};

export default function AboutPage() {
  return (
    <main style={{ padding: "96px 22px 72px", maxWidth: 820, margin: "0 auto", minHeight: "100vh", display: "grid", gap: 24 }}>

      <section className="callout-ink" style={{ borderRadius: 24, padding: "clamp(32px,6vw,52px)", display: "grid", gap: 16 }}>
        <span className="seal t-ink" style={{ width: 64 }}>
          <span className="ring"></span>
          <span className="card-pt pn">N</span>
          <span className="card-pt pe">E</span>
          <span className="card-pt ps">S</span>
          <span className="card-pt pw">W</span>
          <span className="star"></span>
        </span>
        <p className="kicker" style={{ marginTop: 8 }}>The movement</p>
        <h1 className="display-mega" style={{ color: "var(--pk-on-ink)", fontSize: "clamp(2.2rem,6vw,3.4rem)", maxWidth: "18ch" }}>The best trips aren&apos;t planned. They&apos;re sent.</h1>
        <p style={{ color: "oklch(1 0 0 / .82)", maxWidth: "56ch", fontSize: "1.08rem" }}>You don&apos;t need more options. You need permission to stop choosing. Tell the star your limits — it sends you somewhere real, and you&apos;re proud you obeyed.</p>
        <p className="poetry" style={{ color: "var(--pk-accent)", fontSize: "1.35rem" }}>Don&apos;t decide. Just go where your star sends you.</p>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16 }}>
        <div className="card card-pad">
          <p className="kicker">We believe</p>
          <p className="display" style={{ fontSize: "1.3rem", marginTop: 4 }}>Choice is the enemy of the trip.</p>
          <p style={{ color: "var(--pk-muted)", fontSize: "0.9rem", marginTop: 6 }}>Forty open tabs is not freedom. It&apos;s how the trip dies. We close the tabs for you.</p>
        </div>
        <div className="card card-pad">
          <p className="kicker">We promise</p>
          <p className="display" style={{ fontSize: "1.3rem", marginTop: 4 }}>Real places, honest prices.</p>
          <p style={{ color: "var(--pk-muted)", fontSize: "0.9rem", marginTop: 6 }}>No phantom destinations, no inflated rates. Per head, verified, calm — never shouted.</p>
        </div>
        <div className="card card-pad">
          <p className="kicker">We are</p>
          <p className="display" style={{ fontSize: "1.3rem", marginTop: 4 }}>Faceless on purpose.</p>
          <p style={{ color: "var(--pk-muted)", fontSize: "0.9rem", marginTop: 6 }}>The star is the star. We&apos;re the desk behind it, replying on WhatsApp in under 60 seconds.</p>
        </div>
      </section>

      <section style={{ background: "var(--pk-card)", borderRadius: 20, boxShadow: "var(--pk-shadow-sm)", padding: "clamp(24px,5vw,36px)" }}>
        <p className="kicker">Honest about AI</p>
        <h2 className="display" style={{ fontSize: "1.8rem", margin: "4px 0 10px" }}>Generated images, real places.</h2>
        <p style={{ maxWidth: "60ch", color: "var(--pk-muted)" }}>Every location image is AI-generated <em style={{ color: "var(--pk-accent-deep)", fontStyle: "italic" }}>and</em> anchored to a real reference photo of that exact place, declared at upload. A location only enters the spin pool once its real reference exists and the render is approved. We never invent a destination.</p>
        <Link href="/legal" className="btn btn-ghost btn-sm" style={{ marginTop: 14 }}>Read the full AI disclosure →</Link>
      </section>

      <section style={{ textAlign: "center", padding: "20px 0" }}>
        <p className="poetry" style={{ fontSize: "1.3rem", color: "var(--pk-muted)", marginBottom: 14 }}>So — where will yours send you?</p>
        <Link href="/game" className="btn btn-accent btn-lg">✦ Spin my star</Link>
      </section>

    </main>
  );
}
