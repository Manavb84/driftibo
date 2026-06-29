"use client";

import IntentChooser from "@/components/IntentChooser";

// The /start front door — now inside (site) so it carries nav + footer, and the
// intent picker is the single shared chooser (page mode). Kept as the deep-link /
// link-in-bio URL; picking routes into Explore focused on the chosen lane.
export default function StartClient() {
  return <IntentChooser mode="page" />;
}
