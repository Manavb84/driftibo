import type { Metadata } from "next";
import GameClient from "./GameClient";

export const metadata: Metadata = {
  title: "The Star Game · Driftibo",
  description: "Six taps. Zero typing. Tell your star your limits — it picks a real place that fits. Free reveal, no email yet.",
};

export default function GamePage() {
  return <GameClient />;
}
