-- Driftibo backend schema. Applied via the Supabase MCP (apply_migration).
-- Two tables: a unified funnel capture, and per-user Star Passport stamps.

-- ── captures: one row per funnel submission, partitioned by `kind` ──
create table if not exists public.captures (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  kind       text not null check (kind in ('lead','quiz','dream','offering','game','star_drop')),
  email      text,
  name       text,
  whatsapp   text,
  persona    text,
  data       jsonb not null default '{}'::jsonb
);
alter table public.captures enable row level security;
-- Anyone (anon or signed-in) may submit; nobody may read back through the API.
-- The team reads leads in the Supabase dashboard / via the service role.
create policy "captures_insert_anyone" on public.captures
  for insert to anon, authenticated with check (true);
create index if not exists captures_kind_created_idx on public.captures (kind, created_at desc);

-- ── passport_stamps: the real per-user Star Passport ──
create table if not exists public.passport_stamps (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  slug       text not null,
  label      text not null,
  created_at timestamptz not null default now(),
  unique (user_id, slug)
);
alter table public.passport_stamps enable row level security;
create policy "stamps_select_own" on public.passport_stamps
  for select to authenticated using (auth.uid() = user_id);
create policy "stamps_insert_own" on public.passport_stamps
  for insert to authenticated with check (auth.uid() = user_id);
