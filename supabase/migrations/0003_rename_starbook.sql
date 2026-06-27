-- Passport → Starbook rename. "Passport" reads as visa services on a travel site;
-- the feature is now Starbook. Zero rows today → no data loss. RLS policies
-- (stamps_select_own / stamps_insert_own) and grants follow the table automatically.

alter table public.passport_stamps rename to starbook_stamps;

-- PostgREST caches the schema; tell it to reload so the renamed table is queryable.
notify pgrst, 'reload schema';
