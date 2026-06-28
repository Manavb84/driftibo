-- Admin dashboard counts in ONE round-trip without the PostgREST 1000-row cap that a
-- client-side select('kind') reduce silently hits. SECURITY INVOKER (no definer), so the
-- existing captures RLS governs: an admin sees the true total, a non-admin sees nothing.
create or replace function public.get_capture_counts()
returns table(kind text, n bigint)
language sql
stable
set search_path = public
as $$
  select kind, count(*) from public.captures group by kind;
$$;
grant execute on function public.get_capture_counts() to authenticated;

notify pgrst, 'reload schema';
