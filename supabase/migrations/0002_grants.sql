-- Supabase's auto-grants are skipped for tables created via raw SQL (apply_migration);
-- grant the role privileges explicitly. RLS still governs WHICH rows can be touched.
-- (captures is insert-only with no SELECT policy → the app must insert with
--  `return=minimal`, i.e. supabase-js `.insert()` WITHOUT `.select()`, since reading
--  a row back would require a SELECT policy that intentionally doesn't exist.)
grant insert on public.captures to anon, authenticated;
grant select, insert on public.passport_stamps to authenticated;