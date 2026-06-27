-- Media storage: a single public-read 'media' bucket for admin-uploaded and
-- AI-generated images. Writes gated by is_admin() (same anon-key + RLS invariant —
-- no service-role key). Public read so the live site can <img> straight from Storage.

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Public read of media objects.
create policy "media_read_public" on storage.objects
  for select using (bucket_id = 'media');

-- Admin-only writes (insert / update / delete) on the media bucket.
create policy "media_insert_admin" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and public.is_admin());
create policy "media_update_admin" on storage.objects
  for update to authenticated using (bucket_id = 'media' and public.is_admin()) with check (bucket_id = 'media' and public.is_admin());
create policy "media_delete_admin" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and public.is_admin());
