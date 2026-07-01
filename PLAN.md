# Driftibo — Finalize the Compass-Seal Logo (site + favicon + business card)

> Status: Parts A, B and the "mark-as-final" addendum are COMPLETE and verified. Parts C and D are in progress at time of writing. See **Status** at the bottom.

## Decision
The **compass-star seal** is the locked, final Driftibo logo: teal disc, coral **double ring**, a **degree-tick bezel** (48 minor + 12 major ticks), a slender **4-point coral star**, and **N·E·S·W** cardinals. It **supersedes** the retired sage drift-line mark (`#7a9e84`, path `M4,38…40,8`), which must not appear in any served asset.

Tokens: teal `#1F4A52` · coral `#F0A582` · on-ink `#ECF3F4`.

Source of truth for the geometry: the `.seal` CSS in `business-card-options.html` (lines ~467–535) — double ring (`::before`), 60-line degree-tick SVG mask (`::after`), 42% 4-point star, cardinals center-anchored at radius 0.42×size.

## Part A — Canonical final logo SVG assets
- `public/driftibo-seal.svg` — FULL seal (disc + inner glow + double ring + degree ticks + 4-point star + N·E·S·W cardinals), coral-on-teal, `viewBox 0 0 100 100`. Canonical mark.
- `public/driftibo-seal-mark.svg` — SIMPLIFIED mark (disc + double ring + star; no ticks/cardinals) for small sizes / favicon base.
- `public/logo.svg` + root `logo.svg` — horizontal lockup (seal mark + "Driftibo" Fraunces wordmark). Replaces the old sage-line logo.
- `BRAND-LOGO.md` — states what the final logo is, the token hexes, which files are canonical, and that it supersedes the sage drift-line.
- Memory note `driftibo-final-logo.md` (+ MEMORY.md index line) pointing at `public/driftibo-seal.svg` as canonical.

## Part B — Favicon (full coverage)
- `public/favicon.svg` (+ root `favicon.svg` + `driftibo-marketing/favicon.svg`) — simplified seal mark tuned for 16px (disc + single bold coral ring + coral star; no ticks/cardinals). No sage.
- `scripts/gen-icons.mjs` (uses `sharp`) → renders `public/apple-touch-icon.png` (180), `public/icon-192.png`, `public/icon-512.png` (seal on teal, maskable-safe padding).
- `public/site.webmanifest` (name/short_name Driftibo, theme_color/background `#1F4A52`, the icon set).
- `app/layout.tsx` — `metadata.icons` → `{ icon:"/favicon.svg", apple:"/apple-touch-icon.png" }`, add `manifest:"/site.webmanifest"`, point Organization JSON-LD `logo` at `https://driftibo.com/driftibo-seal.svg`.

## Part C — Live-site seal upgrade (full detail, size-aware)
Shared CSS in `app/globals.css` (mirrored in `design-system/tokens.css`) upgraded so every seal usage inherits the finalized look:
- Add the **double ring** and the **degree-tick bezel** (`.seal::after`, SVG mask, `currentColor`), pure CSS → applies to all ~20 call sites.
- Fix `.card-pt` (`.pn/.pe/.ps/.pw`) to even center-anchored placement.
- **Size-aware** via container queries: `.seal { container-type: inline-size }`; at ≤32px (and via a `.seal.mini` modifier) drop ticks + cardinals → clean disc + double-ring + star.
- Cardinals markup added to the large brand moments: `SiteFooter.tsx` (48px), `HeroStage.tsx` (already had them), `ComingSoonPage.tsx`, `IntentChooser.tsx`. Nav `SiteNav.tsx` gets `.mini` (no cardinals). Other small usages inherit CSS and stay cardinal-less unless large.
- Keep `.breathe` / `.spinning` animations working; honor reduced-motion.

## Part D — Concept 5 standalone business card
- `driftibo-business-card.html` (repo root) = **Concept 5 only** (Celestial Star-Map), front + back, self-contained, reusing the finalized `.seal` CSS. Front hero + back lockup use the seal (NOT the old driftmark). Keeps star-field/constellation, kicker "BY YOUR OWN STAR", Drifti*b*o wordmark, coords `30.32°N 78.03°E`, aligned contact list, coordinates readout, QR **placeholder** (real QR later) + Save-contact (.vcf). Fixes: back handle-row hairline length + QR caption truncation. Includes a print/CMYK + foil/deboss HTML comment for the vendor.
- Gallery restore: in `business-card-options.html`, swap Concept 5 front+back back to the finalized `.seal` and delete the dead `.driftmark` / `.celestial-north-star` CSS + markup.

## Files
- Add: `public/driftibo-seal.svg`, `public/driftibo-seal-mark.svg`, `public/apple-touch-icon.png`, `public/icon-192.png`, `public/icon-512.png`, `public/site.webmanifest`, `scripts/gen-icons.mjs`, `BRAND-LOGO.md`, `driftibo-final-logo.md` (memory), `driftibo-business-card.html`, `PLAN.md`.
- Replace (kill sage): `public/favicon.svg`, `public/logo.svg`, root `favicon.svg`, root `logo.svg`, `driftibo-marketing/favicon.svg`.
- Edit: `app/layout.tsx`, `app/globals.css`, `design-system/tokens.css`, `components/SiteNav.tsx`, `SiteFooter.tsx`, `HeroStage.tsx`, `ComingSoonPage.tsx`, `IntentChooser.tsx`, `business-card-options.html`, MEMORY.md.

## Verification
1. `public/driftibo-seal.svg` renders the full seal (even cardinals, crisp ticks, double ring, coral-on-teal); mark + favicon read at 16–32px.
2. Favicon: tab shows the seal (not sage); `apple-touch-icon` + `site.webmanifest` resolve; JSON-LD `logo` points at the seal.
3. Site build passes; nav (mini) is clean ring+star; footer/hero/coming-soon/intent show the full detailed seal; hero still spins; reduced-motion honored.
4. `grep -rn "#7a9e84"` finds no sage in served assets (only "supersedes" doc comments).
5. Card: front/back use the seal; handle hairline + QR caption fixed; size/side/print toggles work; Save-contact downloads a valid .vcf.
6. Gallery: Concept 5 uses the seal; no `driftmark` references remain.

## Status (2026-07-01)
- ✅ Part A — assets built and visually verified (full seal, mark, lockup); `BRAND-LOGO.md` + memory note + index line written.
- ✅ Part B — favicon (all 3 copies), 3 PNG icons, `site.webmanifest`, `layout.tsx` wiring all done; sage grep clean.
- ⏳ Part C — live-site CSS + component cardinals: in progress.
- ⏳ Part D — standalone card + gallery restore: in progress.
