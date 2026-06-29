import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Play · Driftibo",
  description: "Four little games — each one ends with a real place. Pick the one that matches your mood.",
  alternates: { canonical: "/play" },
  openGraph: {
    title: "Play · Driftibo",
    description: "Four little games — each one ends with a real place. Pick the one that matches your mood.",
    images: ["/og.jpg"],
    type: "website",
    url: "/play",
  },
  twitter: {
    card: "summary_large_image",
    title: "Play · Driftibo",
    description: "Four little games — each one ends with a real place. Pick the one that matches your mood.",
    images: ["/og.jpg"],
  },
};

export default function PlayPage() {
  return (
    <main
      style={{
        background:
          "radial-gradient(80% 70% at 12% 0%, oklch(0.50 0.09 200 / .6), transparent 60%),radial-gradient(70% 80% at 96% 100%, oklch(0.62 0.12 30 / .35), transparent 55%),linear-gradient(158deg, oklch(0.42 0.07 222), oklch(0.29 0.06 233))",
        minHeight: "100vh",
        padding: "96px 22px 72px",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 48px" }}>
          <p className="kicker" style={{ color: "var(--pk-accent)" }}>
            Every road in is a game
          </p>
          <h1
            className="display-mega"
            style={{ color: "var(--pk-on-ink)", marginTop: 10 }}
          >
            Pick your way in
          </h1>
          <p
            className="lede"
            style={{ color: "oklch(0.95 0.01 210 / .8)", marginTop: 14 }}
          >
            Four little games. Each one ends with a real place — pick the one
            that matches your mood.
          </p>
        </div>

        {/* Cards grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(248px,1fr))",
            gap: 20,
          }}
        >
          {/* 01 · Star Game */}
          <Link href="/game" className="play-card">
            <div
              className="well bg s-game-spin"
              style={{
                height: 158,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: 18,
              }}
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
                  borderRadius: "var(--r-pill)",
                }}
              >
                Surprise me
              </span>
              <span
                className="display"
                style={{
                  fontSize: "3.4rem",
                  color: "oklch(1 0 0 / .92)",
                  lineHeight: 0.8,
                  textShadow: "0 2px 16px oklch(0.2 0.05 320 / .5)",
                }}
              >
                01
              </span>
            </div>
            <div
              style={{
                padding: 24,
                display: "flex",
                flexDirection: "column",
                gap: 8,
                flex: 1,
              }}
            >
              <h3 className="display" style={{ fontSize: "1.5rem" }}>
                Star Game
              </h3>
              <p style={{ color: "var(--pk-muted)", fontSize: "0.92rem" }}>
                Tap seven limits — never a destination. Your star draws a real
                place that fits and closes it on WhatsApp.
              </p>
              <span className="play-go">Spin it →</span>
            </div>
          </Link>

          {/* 02 · Dream My Trip */}
          <Link href="/dream" className="play-card">
            <div
              className="well bg s-game-dream"
              style={{
                height: 158,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: 18,
              }}
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
                  borderRadius: "var(--r-pill)",
                }}
              >
                Conjure it
              </span>
              <span
                className="display"
                style={{
                  fontSize: "3.4rem",
                  color: "oklch(1 0 0 / .92)",
                  lineHeight: 0.8,
                  textShadow: "0 2px 16px oklch(0.18 0.06 150 / .5)",
                }}
              >
                02
              </span>
            </div>
            <div
              style={{
                padding: 24,
                display: "flex",
                flexDirection: "column",
                gap: 8,
                flex: 1,
              }}
            >
              <h3 className="display" style={{ fontSize: "1.5rem" }}>
                Dream My Trip
              </h3>
              <p style={{ color: "var(--pk-muted)", fontSize: "0.92rem" }}>
                No itinerary, no stress. Drop a feeling, a budget, a window —
                and watch a real place appear from the mist.
              </p>
              <span className="play-go">Dream it →</span>
            </div>
          </Link>

          {/* 03 · Vibe Quiz */}
          <Link href="/quiz" className="play-card">
            <div
              className="well bg s-game-quiz"
              style={{
                height: 158,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: 18,
              }}
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
                  borderRadius: "var(--r-pill)",
                }}
              >
                Know thyself
              </span>
              <span
                className="display"
                style={{
                  fontSize: "3.4rem",
                  color: "oklch(1 0 0 / .92)",
                  lineHeight: 0.8,
                  textShadow: "0 2px 16px oklch(0.2 0.05 40 / .5)",
                }}
              >
                03
              </span>
            </div>
            <div
              style={{
                padding: 24,
                display: "flex",
                flexDirection: "column",
                gap: 8,
                flex: 1,
              }}
            >
              <h3 className="display" style={{ fontSize: "1.5rem" }}>
                Vibe Quiz
              </h3>
              <p style={{ color: "var(--pk-muted)", fontSize: "0.92rem" }}>
                Five taps, no right answers. We read the pattern and name the
                kind of drifter you are — with a place to match.
              </p>
              <span className="play-go">Find my soul →</span>
            </div>
          </Link>

          {/* 04 · Starbook — star-filled night sky; page is a "Coming soon" placeholder */}
          <Link href="/starbook" className="play-card">
            <div
              className="well bg s-starbook"
              style={{
                height: 158,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: 18,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--ui)",
                    fontWeight: 800,
                    fontSize: "0.62rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "oklch(0.99 0.01 20)",
                    background: "oklch(0.28 0.05 250 / .42)",
                    WebkitBackdropFilter: "blur(4px)",
                    backdropFilter: "blur(4px)",
                    padding: "5px 10px",
                    borderRadius: "var(--r-pill)",
                  }}
                >
                  Collect it
                </span>
                <span
                  style={{
                    fontFamily: "var(--ui)",
                    fontWeight: 800,
                    fontSize: "0.62rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "oklch(0.2 0.04 280)",
                    background: "oklch(0.92 0.06 90)",
                    padding: "5px 10px",
                    borderRadius: "var(--r-pill)",
                  }}
                >
                  Soon
                </span>
              </div>
              <span
                className="display"
                style={{
                  fontSize: "3.4rem",
                  color: "oklch(1 0 0 / .92)",
                  lineHeight: 0.8,
                  textShadow: "0 2px 16px oklch(0.18 0.05 250 / .5)",
                }}
              >
                04
              </span>
            </div>
            <div
              style={{
                padding: 24,
                display: "flex",
                flexDirection: "column",
                gap: 8,
                flex: 1,
              }}
            >
              <h3 className="display" style={{ fontSize: "1.5rem" }}>
                Starbook
              </h3>
              <p style={{ color: "var(--pk-muted)", fontSize: "0.92rem" }}>
                Every place your star sent you, stamped. Fate-earned badges, and
                a door that only opens on Thursdays.
              </p>
              <span className="play-go">Open my Starbook →</span>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
