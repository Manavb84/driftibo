import type { Metadata } from "next";
import WaitlistForm from "@/components/WaitlistForm";

export const metadata: Metadata = {
  title: "Driftibo · Almost there",
  description: "Join the Driftibo waitlist before the doors open.",
};

export default function SoonPage() {
  return (
    <main
      style={{
        minHeight: "100svh",
        display: "grid",
        placeItems: "center",
        padding: "clamp(40px, 7vw, 88px) 20px",
        background:
          "linear-gradient(142deg, var(--pk-paper) 0%, oklch(0.955 0.024 208) 48%, oklch(0.968 0.03 34) 100%)",
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      <section aria-labelledby="soon-title" style={{ width: "min(100%, 680px)" }}>
        <span className="seal t-coral breathe" style={{ width: 76, margin: "0 auto" }}>
          <span className="ring" />
          <span className="card-pt pn">N</span>
          <span className="card-pt pe">E</span>
          <span className="card-pt ps">S</span>
          <span className="card-pt pw">W</span>
          <span className="star" />
        </span>
        <h1
          id="soon-title"
          className="display"
          style={{
            fontSize: "clamp(3.6rem, 14vw, 7.8rem)",
            margin: "22px 0 12px",
          }}
        >
          Driftibo
        </h1>
        <p
          className="display"
          style={{
            fontSize: "clamp(1.55rem, 5vw, 2.7rem)",
            lineHeight: 1.1,
            maxWidth: "15ch",
            margin: "0 auto 16px",
          }}
        >
          Great trips take a little wandering. Almost there.
        </p>
        <p className="lede" style={{ margin: "0 auto", maxWidth: "34ch" }}>
          Join the list — be first when the doors open.
        </p>
        <WaitlistForm />
      </section>
    </main>
  );
}
