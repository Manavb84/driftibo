// SERVER component — exports metadata, renders client island.
import type { Metadata } from "next";
import OfferingsClient from "./OfferingsClient";

export const metadata: Metadata = {
  title: "Offerings · Driftibo",
  description:
    "Four ways to be sent: Surprise me, Custom & honeymoon, Concierge, Corporate offsites. Pick a lane — everything closes on WhatsApp.",
  openGraph: {
    title: "Offerings · Driftibo",
    description:
      "Four ways to be sent: Surprise me, Custom & honeymoon, Concierge, Corporate offsites. Pick a lane — everything closes on WhatsApp.",
  },
};

export default function OfferingsPage() {
  return <OfferingsClient />;
}
