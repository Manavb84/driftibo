import type { Metadata } from "next";
import DreamClient from "./DreamClient";

export const metadata: Metadata = {
  title: "Dream My Trip · Driftibo",
  description:
    "No itinerary, no stress. Drop a feeling, a budget, a window — and watch a real place appear from the mist.",
};

export default function DreamPage() {
  return <DreamClient />;
}
