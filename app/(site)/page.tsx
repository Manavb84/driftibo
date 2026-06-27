import Link from "next/link";
import HeroStage from "@/components/HeroStage";
import OtherIndiaRotator from "@/components/OtherIndiaRotator";

export default function Home() {
  return (
    <>
      <HeroStage />

      {/* DUPE STRIP — rotates 8 "other India" one-liners */}
      <OtherIndiaRotator />

      {/* HOW IT WORKS */}
      <section style={{ maxWidth: 1080, margin: "0 auto", padding: "72px 24px" }}>
        <p className="kicker" style={{ textAlign: "center" }}>
          How the star works
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
              Six taps — terrain, vibe, who&apos;s coming, how long, how far. No typing, no second-guessing.
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
              The star draws a real place that fits — anchored to a real reference photo. No phantom destinations.
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

      {/* ░░ GAMES HUB BAND ░░ */}
      <section
        style={{
          position: "relative",
          padding: "84px 24px",
          overflow: "hidden",
          background:
            "radial-gradient(80% 70% at 12% 0%, oklch(0.50 0.09 200 / .6), transparent 60%),radial-gradient(70% 80% at 96% 100%, oklch(0.62 0.12 30 / .35), transparent 55%),linear-gradient(158deg, oklch(0.42 0.07 222), oklch(0.29 0.06 233))",
        }}
      >
        <div style={{ maxWidth: 1080, margin: "0 auto", position: "relative" }}>
          <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 40px" }}>
            <p className="kicker" style={{ color: "oklch(0.86 0.09 32)" }}>
              Three ways to play
            </p>
            <h2
              className="display"
              style={{ color: "var(--pk-on-ink)", fontSize: "clamp(1.9rem,4.4vw,2.8rem)", marginTop: 8 }}
            >
              <span className="cz">Don&apos;t plan it. Play for it.</span>
              <span className="cm">Don&apos;t plan it. Play for it.</span>
              <span className="ct">Don&apos;t plan it. Earn it.</span>
            </h2>
            <p className="lede" style={{ color: "oklch(0.95 0.01 210 / .8)", marginTop: 10 }}>
              Every road into Driftibo is a little game. Pick the one that matches your mood — each takes under two minutes.
            </p>
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(248px,1fr))", gap: 20 }}
          >
            <Link href="/game" className="play-card">
              <div
                className="well bg s-dusk"
                style={{ height: 158, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 18 }}
              >
                <span
                  style={{
                    alignSelf: "flex-start",
                    fontFamily: "var(--ui)",
                    fontWeight: 800,
                    fontSize: "0.62rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "oklch(0.99 0.01 20)",
                    background: "oklch(0.3 0.06 320 / .4)",
                    WebkitBackdropFilter: "blur(4px)",
                    backdropFilter: "blur(4px)",
                    padding: "5px 10px",
                    borderRadius: 99,
                  }}
                >
                  Surprise me
                </span>
                <span
                  className="display"
                  style={{ fontSize: "3.4rem", color: "oklch(1 0 0 / .92)", lineHeight: 0.8, textShadow: "0 2px 16px oklch(0.2 0.05 320 / .5)" }}
                >
                  01
                </span>
              </div>
              <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                <h3 className="display" style={{ fontSize: "1.5rem" }}>
                  Spin my star
                </h3>
                <p style={{ color: "var(--pk-muted)", fontSize: "0.92rem" }}>
                  Tap six limits — never a destination. Your star draws a real place that fits and closes it on WhatsApp.
                </p>
                <span className="play-go">Spin it →</span>
              </div>
            </Link>

            <Link href="/quiz" className="play-card">
              <div
                className="well bg s-gokarna"
                style={{ height: 158, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 18 }}
              >
                <span
                  style={{
                    alignSelf: "flex-start",
                    fontFamily: "var(--ui)",
                    fontWeight: 800,
                    fontSize: "0.62rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "oklch(0.99 0.01 20)",
                    background: "oklch(0.3 0.05 40 / .4)",
                    WebkitBackdropFilter: "blur(4px)",
                    backdropFilter: "blur(4px)",
                    padding: "5px 10px",
                    borderRadius: 99,
                  }}
                >
                  Know thyself
                </span>
                <span
                  className="display"
                  style={{ fontSize: "3.4rem", color: "oklch(1 0 0 / .92)", lineHeight: 0.8, textShadow: "0 2px 16px oklch(0.2 0.05 40 / .5)" }}
                >
                  02
                </span>
              </div>
              <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                <h3 className="display" style={{ fontSize: "1.5rem" }}>
                  The Vibe Quiz
                </h3>
                <p style={{ color: "var(--pk-muted)", fontSize: "0.92rem" }}>
                  Five taps, no right answers. We read the pattern and name the kind of drifter you are — with a place to match.
                </p>
                <span className="play-go">Find my soul →</span>
              </div>
            </Link>

            <Link href="/dream" className="play-card">
              <div
                className="well bg s-ziro"
                style={{ height: 158, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 18 }}
              >
                <span
                  style={{
                    alignSelf: "flex-start",
                    fontFamily: "var(--ui)",
                    fontWeight: 800,
                    fontSize: "0.62rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "oklch(0.99 0.01 20)",
                    background: "oklch(0.28 0.06 150 / .42)",
                    WebkitBackdropFilter: "blur(4px)",
                    backdropFilter: "blur(4px)",
                    padding: "5px 10px",
                    borderRadius: 99,
                  }}
                >
                  Conjure it
                </span>
                <span
                  className="display"
                  style={{ fontSize: "3.4rem", color: "oklch(1 0 0 / .92)", lineHeight: 0.8, textShadow: "0 2px 16px oklch(0.18 0.06 150 / .5)" }}
                >
                  03
                </span>
              </div>
              <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                <h3 className="display" style={{ fontSize: "1.5rem" }}>
                  Dream My Trip
                </h3>
                <p style={{ color: "var(--pk-muted)", fontSize: "0.92rem" }}>
                  No itinerary, no stress. Drop a feeling, a budget, a window — and watch a real place appear from the mist.
                </p>
                <span className="play-go">Dream it →</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* PACKAGES TEASER */}
      <section style={{ background: "var(--pk-panel)", padding: "72px 24px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 14 }}>
            <div>
              <p className="kicker">Done-for-you drifts</p>
              <h2 className="display" style={{ fontSize: "clamp(1.7rem,3.5vw,2.3rem)", marginTop: 6 }}>
                Four trips, already dreamed up
              </h2>
            </div>
            <Link href="/packages" className="btn btn-ghost btn-sm">
              See all packages →
            </Link>
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 18, marginTop: 28 }}
          >
            {(
              [
                ["s-spiti", "Spiti · ref ✓", "The Cold Desert", "Spiti, 7 nights · monastery silence", "≈ ₹7,400 / day"],
                ["s-gokarna", "Gokarna · ref ✓", "Slow Coast", "Gokarna, 5 nights · five quiet beaches", "≈ ₹6,200 / day"],
                ["s-ziro", "Ziro · ref ✓", "Rice & Fog", "Ziro, 6 nights · Apatani valley", "≈ ₹6,900 / day"],
                ["s-chopta", "Chopta · ref ✓", "Temple Ridge", "Chopta, 5 nights · mini-Switzerland", "≈ ₹6,800 / day"],
              ] as const
            ).map(([scene, label, title, sub, price]) => (
              <Link key={title} href="/packages" className="card" style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                <div className={`well ${scene}`} style={{ aspectRatio: "5/4" }} data-label={label} />
                <div className="card-pad">
                  <h3 className="display" style={{ fontSize: "1.3rem" }}>
                    {title}
                  </h3>
                  <p style={{ color: "var(--pk-muted)", fontSize: "0.85rem", margin: "4px 0 10px", minHeight: "2.6rem" }}>
                    {sub}
                  </p>
                  <span className="pill is-on">{price}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* OTHER INDIA GALLERY */}
      <section style={{ maxWidth: 1080, margin: "0 auto", padding: "8px 24px 72px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 14 }}>
          <div>
            <p className="kicker">India that looks like abroad</p>
            <h2 className="display" style={{ fontSize: "clamp(1.6rem,3.4vw,2.2rem)", marginTop: 6 }}>
              Same soul. A fraction of the price.
            </h2>
          </div>
          <Link href="/destinations" className="btn btn-ghost btn-sm">
            All 83 corners →
          </Link>
        </div>
        <div
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 18, marginTop: 24 }}
        >
          {(
            [
              ["s-chopta", "Chopta · ref ✓", "Chopta", "Mini-Switzerland · Uttarakhand", "chopta-portrait"],
              ["s-spiti", "Spiti", "Spiti", "Looks like Iceland · Himachal", "spiti-portrait"],
              ["s-ziro", "Ziro", "Ziro", "Rice terraces to rival Bali · Arunachal", "ziro-portrait"],
              ["s-gokarna", "Gokarna", "Gokarna", "Goa's quieter coast · Karnataka", "gokarna-portrait"],
            ] as const
          ).map(([scene, label, title, sub, portrait]) => (
            <Link key={title} href="/destinations" className="card" style={{ textDecoration: "none", color: "inherit" }}>
              <div className={`well ${scene}`} style={{ aspectRatio: "3/4", backgroundImage: `url(/images/${portrait}.jpg)`, backgroundSize: "cover", backgroundPosition: "center" }} data-label={label} />
              <div className="card-pad">
                <h3 className="display" style={{ fontSize: "1.2rem" }}>
                  {title}
                </h3>
                <p style={{ color: "var(--pk-muted)", fontSize: "0.8rem", marginTop: 2, minHeight: "2.7rem" }}>
                  {sub}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* OFFERINGS QUAD */}
      <section style={{ maxWidth: 1080, margin: "0 auto", padding: "72px 24px" }}>
        <p className="kicker" style={{ textAlign: "center" }}>
          When you want a human, not a spin
        </p>
        <h2 className="display" style={{ fontSize: "clamp(1.7rem,3.5vw,2.3rem)", textAlign: "center", marginTop: 6 }}>
          Four ways to be sent
        </h2>
        <div
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 20, marginTop: 28 }}
        >
          {(
            [
              ["s-spiti", "Hands-off", "oklch(0.28 0.06 262 / .42)", "oklch(0.99 0.01 210)", "✦", "0 2px 16px oklch(0.2 0.05 262 / .5)", "Surprise me", "Let the star pick. We book the trip it sends.", "Be sent →"],
              ["s-gokarna", "Yours, tailored", "oklch(0.3 0.06 40 / .42)", "oklch(0.99 0.01 20)", "♡", "0 2px 16px oklch(0.2 0.05 40 / .5)", "Custom & honeymoon", "You have a place in mind. We tailor it.", "Plan it with us →"],
              ["s-chopta", "White-glove", "oklch(0.26 0.06 200 / .42)", "oklch(0.99 0.01 210)", "◆", "0 2px 16px oklch(0.2 0.05 200 / .5)", "Concierge", "Premium, hands-off, end to end.", "Go premium →"],
              ["s-dusk", "For teams", "oklch(0.3 0.06 320 / .42)", "oklch(0.99 0.01 20)", "◈", "0 2px 16px oklch(0.2 0.05 320 / .5)", "Corporate offsites", "Teams, logistics, one point of contact.", "Brief us →"],
            ] as const
          ).map(([scene, sticker, stickerBg, stickerColor, glyph, glyphShadow, title, blurb, go]) => (
            <Link key={title} href="/offerings" className="play-card">
              <div
                className={`well bg ${scene}`}
                style={{ height: 128, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 16 }}
              >
                <span
                  style={{
                    alignSelf: "flex-start",
                    fontFamily: "var(--ui)",
                    fontWeight: 800,
                    fontSize: "0.58rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: stickerColor,
                    background: stickerBg,
                    WebkitBackdropFilter: "blur(4px)",
                    backdropFilter: "blur(4px)",
                    padding: "5px 10px",
                    borderRadius: 99,
                  }}
                >
                  {sticker}
                </span>
                <span
                  className="display"
                  style={{ fontSize: "2.4rem", color: "oklch(1 0 0 / .92)", lineHeight: 0.8, textShadow: glyphShadow }}
                >
                  {glyph}
                </span>
              </div>
              <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 7, flex: 1 }}>
                <h3 className="display" style={{ fontSize: "1.3rem" }}>
                  {title}
                </h3>
                <p style={{ color: "var(--pk-muted)", fontSize: "0.88rem" }}>{blurb}</p>
                <span className="play-go">{go}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* VALUE-PROOF MOMENT */}
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
              borderRadius: 18,
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
                ≈ ₹6,800 <span style={{ fontSize: "0.82rem", color: "var(--pk-muted)" }}>/ person / day</span>
              </p>
            </div>
            <p style={{ fontSize: "0.82rem", color: "var(--pk-muted)", maxWidth: "20ch", textAlign: "right" }}>
              Stay, transfers, a guided day. Verified, never inflated. The surprise game stays price-free on purpose.
            </p>
          </div>
        </div>
      </section>

      {/* HONEST ABOUT AI */}
      <section style={{ maxWidth: 1080, margin: "0 auto", padding: "72px 24px" }}>
        <div
          className="callout-ink"
          style={{
            borderRadius: "var(--persona-radius)",
            padding: "42px 38px",
            display: "flex",
            gap: 32,
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ maxWidth: "44ch" }}>
            <p className="kicker">Honest about AI</p>
            <p
              className="poetry"
              style={{ color: "var(--pk-on-ink)", fontSize: "1.4rem", marginTop: 10, lineHeight: 1.3 }}
            >
              Every image is generated — and anchored to a real reference photo of the real place. We never invent a destination.
            </p>
          </div>
          <Link
            href="/legal#ai-disclosure"
            className="btn btn-ghost"
            style={{ color: "var(--pk-on-ink)", boxShadow: "inset 0 0 0 1px oklch(1 0 0 / .3)" }}
          >
            Read our AI disclosure
          </Link>
        </div>
        <p style={{ textAlign: "center", color: "var(--pk-muted)", fontSize: "0.82rem", marginTop: 26 }}>
          83 corners, 9 states ·{" "}
          <Link href="/go" style={{ color: "var(--pk-accent-deep)", textDecoration: "none" }}>
            #StarSent
          </Link>
        </p>
      </section>
    </>
  );
}
