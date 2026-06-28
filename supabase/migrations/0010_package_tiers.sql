-- Tiered packages + destination inclusions/exclusions. Additive & non-destructive.
-- Applied to the remote via the Supabase MCP (apply_migration); this file keeps the
-- schema reproducible for fresh setups. Same RLS invariant as 0004/0005/0008.
--
-- packages.tiers jsonb = array of
--   { key, label, priceINR:number, nights, blurb, inclusions:text[], exclusions:text[] }
-- (3–4 tiers, default labels Budget · Comfort · Luxury). The detail page renders
-- these side-by-side; "from ₹X" listing/teaser lines use the min priceINR.
alter table public.packages
  add column if not exists tiers jsonb not null default '[]'::jsonb;
alter table public.packages
  add column if not exists departures text not null default '';

-- Destinations are the "explore" surface (not the buy surface), so they get plain
-- ✓/✗ arrays rather than the full tier model.
alter table public.destinations
  add column if not exists inclusions text[] not null default '{}';
alter table public.destinations
  add column if not exists exclusions text[] not null default '{}';

notify pgrst, 'reload schema';
