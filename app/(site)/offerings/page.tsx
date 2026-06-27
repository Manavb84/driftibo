// SERVER component — exports metadata, renders client island.
import type { Metadata } from "next";
import OfferingsClient from "./OfferingsClient";
import { getOfferings } from "@/lib/content";

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

export default async function OfferingsPage() {
  const offers = await getOfferings();
  return <OfferingsClient offers={offers} />;
}
