# Driftibo Logo

The FINAL Driftibo logo is the compass-star seal: teal disc, coral double ring, a degree-tick bezel (48 minor + 12 major ticks), a slender 4-point coral star, and N·E·S·W cardinals.

Token hexes: teal `#1F4A52`, coral `#F0A582`, on-ink `#ECF3F4`.

Canonical files:
- `public/driftibo-seal.svg` (FULL seal — the canonical mark)
- `public/driftibo-seal-mark.svg` (simplified, for small sizes/favicon base)
- `public/favicon.svg` (16px favicon mark)
- `public/logo.svg` (horizontal lockup with Fraunces wordmark)
- Raster icons: `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, plus `site.webmanifest`

Supersedes: this retires the legacy sage drift-line mark (`#7a9e84`, path `M4,38…40,8`); it must not appear in any served asset.

## Background variants

| Background | Asset | Treatment |
| --- | --- | --- |
| Light / paper | public/driftibo-seal.svg | teal disc, coral rim + coral marks (primary) |
| Dark section | public/driftibo-seal-on-dark.svg | cream disc, teal marks, coral rim |
| Coral accent | public/driftibo-seal-on-coral.svg | teal disc, cream rim + cream marks |
| Footer (dark teal, CSS) | .seal.t-ink | teal disc + coral rim provides the boundary |
| Nav (small, CSS) | .seal.full | full detail (ticks + N/E/S/W) forced at nav size |

Every variant carries a coral edge rim (--seal-edge, coral by default; ink on the coral disc) so the mark never loses its outer circle against a same-color ground.

## Logo change checklist

When the seal changes, update EVERY instance so nothing drifts out of sync:
- [ ] CSS — both app/globals.css and design-system/tokens.css (.seal rim/--seal-edge, .seal.full, themes)
- [ ] SVGs — public/driftibo-seal.svg, driftibo-seal-mark.svg, logo.svg, favicon.svg
- [ ] Variants — public/driftibo-seal-on-dark.svg, public/driftibo-seal-on-coral.svg
- [ ] Regenerate rasters — node scripts/gen-icons.mjs → apple-touch-icon.png, icon-192.png, icon-512.png
- [ ] Business cards — driftibo-business-card.html, driftibo-business-card-sunil.html, business-card-options.html
- [ ] Reference sheet — design-system/foundations/compass-seal.html
- [ ] This doc
