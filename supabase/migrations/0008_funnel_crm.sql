-- Funnel CRM + payments scaffold. Additive & non-destructive (nullable columns, a new
-- table, an additive grant). Same RLS invariant as 0004/0005: anon key + RLS, no
-- service-role key. Applied via the Supabase MCP (apply_migration).

-- ── captures: CRM fields + an admin UPDATE path (mirrors captures_select_admin) ──
alter table public.captures
  add column if not exists lead_status text not null default 'new'
    check (lead_status in ('new','contacted','quoted','won','lost'));
alter table public.captures
  add column if not exists deal_value numeric;

create policy "captures_update_admin" on public.captures
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
grant update on public.captures to authenticated;

-- ── bookings: the "hold my dates" deposit row (scaffolded; inert until Razorpay keys) ──
create table if not exists public.bookings (
  id                uuid primary key default gen_random_uuid(),
  capture_id        uuid references public.captures(id) on delete set null,
  destination_slug  text not null default '',
  amount            numeric not null default 0,
  currency          text not null default 'INR',
  status            text not null default 'created'
                      check (status in ('created','paid','failed','refunded')),
  provider_order_id text,
  deposit_paid_at   timestamptz,
  created_at        timestamptz not null default now()
);
alter table public.bookings enable row level security;
-- The deposit verify route runs server-side with the anon key (this project has no
-- service-role key), so insert/update must be reachable by anon.
-- ponytail: gated in practice by Razorpay signature verification in the route — add a
-- service-role key and restrict these to is_admin() when payments actually go live.
create policy "bookings_insert_anyone" on public.bookings
  for insert to anon, authenticated with check (true);
create policy "bookings_update_anyone" on public.bookings
  for update to anon, authenticated using (true) with check (true);
create policy "bookings_select_admin" on public.bookings
  for select to authenticated using (public.is_admin());
grant insert, update on public.bookings to anon, authenticated;
grant select on public.bookings to authenticated;
create index if not exists bookings_capture_idx on public.bookings (capture_id, created_at desc);

-- ── audit-high RLS fix: anon evaluates `status='published' or is_admin()` on draft rows,
-- but lacked EXECUTE on is_admin() → "permission denied", breaking ALL anon SELECTs once a
-- draft row exists. Grant EXECUTE so the OR short-circuit path is reachable. ──
grant execute on function public.is_admin() to anon;

-- ── audit-med: pin the status enums that 0005 left as free text ──
alter table public.destinations
  add constraint destinations_status_chk check (status in ('published','draft'));
alter table public.articles
  add constraint articles_status_chk check (status in ('published','draft'));

notify pgrst, 'reload schema';
