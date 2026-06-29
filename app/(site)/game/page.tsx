import type { Metadata } from "next";
import { getDestinations } from "@/lib/content";
import GameClient from "./GameClient";

export const metadata: Metadata = {
  title: "The Star Game · Driftibo",
  description: "Seven taps. Zero typing. Tell your star your limits — it picks a real place that fits. Free reveal, no email yet.",
};

export default async function GamePage() {
  const destinations = await getDestinations();
  return <GameClient destinations={destinations} />;
}
