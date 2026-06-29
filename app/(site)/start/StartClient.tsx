"use client";

import StartTriptych from "@/components/StartTriptych";

// The /start front door — an immersive full-viewport triptych (the redesigned chooser).
// The IntentProvider suppresses its first-visit modal on /start so the two choosers
// never stack (see IntentProvider).
export default function StartClient() {
  return <StartTriptych />;
}
