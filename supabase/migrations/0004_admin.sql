-- Admin access layer. No service-role key needed: an email allowlist + is_admin()
-- helper drives RLS so admins can READ the funnel and (later) WRITE content, while
-- everyone else stays locked out. Admins log in with the same email-OTP flow.

-- ── allowlist (managed via SQL/dashboard; no API access) ──
create table if not exists public.admin_users (
  email      text primary key,
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;
-- intentionally no policies → not reachable through the API. is_admin() reads it
-- as SECURITY DEFINER (bypasses RLS), so the check still works.

-- ── is_admin(): true when the caller's JWT email is on the allowlist ──
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admin_users
    where email = (auth.jwt() ->> 'email')
  );
$$;
grant execute on function public.is_admin() to authenticated;

-- ── admins can read the funnel + all stamps ──
create policy "captures_select_admin" on public.captures
  for select to authenticated using (public.is_admin());
grant select on public.captures to authenticated;

create policy "stamps_select_admin" on public.starbook_stamps
  for select to authenticated using (public.is_admin());

-- ── seed founder admins (edit in the admin_users table to add/remove) ──
insert into public.admin_users (email) values
  ('manavb84@gmail.com'),
  ('travel@driftibo.com')
on conflict (email) do nothing;

notify pgrst, 'reload schema';
