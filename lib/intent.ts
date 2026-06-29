// The 3-intent taxonomy — the visitor-facing lens over the 4 catalogs.
// CLIENT-SAFE: imports only the Catalog *type* from lib/catalog (erased at build),
// so the ~900KB catalog.json never lands in the browser bundle. Both the provider
// and the chooser islands import from here.
import type { Catalog } from "./catalog";

export type Intent = "international" | "india" | "spiritual";
export const INTENTS: Intent[] = ["international", "india", "spiritual"];

export const INTENT_LABEL: Record<Intent, string> = {
  international: "International",
  india: "India",
  spiritual: "Spiritual",
};

export const INTENT_GLYPH: Record<Intent, string> = {
  international: "✈",
  india: "✦",
  spiritual: "☼",
};

export const INTENT_LINE: Record<Intent, string> = {
  international: "Visa-easy escapes beyond India — five-star scenery, three-star prices.",
  india: "The names you love and the corners you don't — classic + offbeat, done well.",
  spiritual: "Temple trails and pilgrim circuits — the offbeat ones included.",
};

// "India" merges the two India catalogs; Spiritual is its own circuit.
export const INTENT_TO_CATALOGS: Record<Intent, Catalog[]> = {
  international: ["international"],
  india: ["india-popular", "india-offbeat"],
  spiritual: ["india-spiritual"],
};

// Legacy-safe: an old localStorage value (a catalog key from the previous /start)
// or a stray intent → a current Intent. Returns null if unrecognisable.
export function normalizeIntent(value: string | null | undefined): Intent | null {
  if (!value) return null;
  if ((INTENTS as string[]).includes(value)) return value as Intent;
  switch (value) {
    case "international":
      return "international";
    case "india-popular":
    case "india-offbeat":
      return "india";
    case "india-spiritual":
      return "spiritual";
    default:
      return null;
  }
}
