import type { Metadata } from "next";
import DreamClient from "./DreamClient";
import { getDestinations } from "@/lib/content";

export const metadata: Metadata = {
  title: "Dream My Trip · Driftibo",
  description:
    "No itinerary, no stress. Drop a feeling, a budget, a window — and watch a real place appear from the mist.",
};

export default async function DreamPage() {
  const destinations = await getDestinations();
  return <DreamClient destinations={destinations} />;
}
