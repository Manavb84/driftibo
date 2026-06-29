import type { Metadata } from "next";
import StarbookComingSoon from "./StarbookComingSoon";
// StarbookClient.tsx is parked (unimported) — the full collection/badges/Star-Drop
// implementation is preserved on disk for revival once the concept is made relevant.

export const metadata: Metadata = {
  title: "Starbook · Driftibo",
};

export default function Page() {
  return <StarbookComingSoon />;
}
