import type { Metadata } from "next";
import LegalTabs from "./LegalTabs";

export const metadata: Metadata = {
  title: "Legal · Driftibo",
};

export default function LegalPage() {
  return (
    <main style={{ padding: "96px 22px 72px", maxWidth: 760, margin: "0 auto", minHeight: "100vh" }}>
      <p className="kicker">The fine print, in plain words</p>
      <h1 className="display-mega" style={{ fontSize: "clamp(2rem,6vw,3rem)", margin: "4px 0 20px" }}>Honest by default</h1>

      <LegalTabs />

      <p style={{ textAlign: "center", color: "var(--pk-muted)", fontSize: "0.82rem", marginTop: 22 }}>
        Questions?{" "}
        <a
          href="mailto:privacy@driftibo.com"
          style={{ color: "var(--pk-accent-deep)", textDecoration: "none" }}
        >
          privacy@driftibo.com
        </a>{" "}
        · we actually reply.
      </p>
    </main>
  );
}
