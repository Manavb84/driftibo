// Per-place image variants. Files follow the convention /images/{slug}-{variant}.jpg.
// Only some variants are generated for some places, so this table is the single
// source of truth the gen script (scripts/gen-images.mjs ROWS) and the UI share —
// it lets a surface ask for a secondary shot and fall back when a place lacks it.
// ponytail: a small static table, not a filesystem probe — these are committed files.
export const PLACE_VARIANTS: Record<string, string[]> = {
  chopta: ["hero", "portrait", "detail", "reveal", "story"],
  spiti: ["hero", "portrait", "detail"],
  ziro: ["hero", "portrait", "detail"],
  gokarna: ["hero", "portrait", "detail"],
  "char-dham": ["hero", "portrait"],
};

// First listed variant that exists for this place, as a committed image URL; else null.
// e.g. placeImage("spiti", "detail", "hero") → "/images/spiti-detail.jpg".
export function placeImage(slug: string, ...prefer: string[]): string | null {
  const have = PLACE_VARIANTS[slug];
  if (!have) return null;
  const v = prefer.find((p) => have.includes(p));
  return v ? `/images/${slug}-${v}.jpg` : null;
}
