// SERVER component — metadata only. The chooser is the immersive triptych, rendered by
// StartClient (StartTriptych); IntentProvider suppresses its first-visit overlay on
// /start so the two never stack. Lives inside app/(site) so it carries nav + footer;
// kept as the /start deep-link / link-in-bio front door.
import type { Metadata } from "next";
import StartClient from "./StartClient";

export const metadata: Metadata = {
  title: "Find my kind of trip · Driftibo",
  description:
    "One question to start: what kind of trip are you after? Somewhere abroad, classic India, offbeat India, or a spiritual journey — we'll point you at the right places.",
  alternates: { canonical: "/start" },
};

export default function Page() {
  return <StartClient />;
}
