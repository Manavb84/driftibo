-- Lane dimension on commerce tables — the "intent" spine reaches product.
-- `lane` stores an Intent key (international | india | spiritual), the visitor-facing
-- lens from lib/intent.ts. getDestinations(lane)/getPackages(lane) filter on it so the
-- right product surfaces per chosen lane. Additive & non-destructive; same RLS as 0005.
alter table public.destinations
  add column if not exists lane text not null default 'india';
alter table public.packages
  add column if not exists lane text not null default 'india';

-- Backfill the original 4+4 to their real lanes (Char Dham is the lone spiritual seed).
update public.destinations set lane = 'india'     where slug in ('chopta','spiti','ziro','gokarna');
update public.destinations set lane = 'spiritual' where slug in ('char-dham');
update public.packages     set lane = 'india'     where slug in ('temple-ridge','cold-desert','rice-and-fog','slow-coast');
update public.packages     set lane = 'spiritual' where slug in ('char-dham-circuit');

create index if not exists destinations_lane_idx on public.destinations (lane, sort_order);
create index if not exists packages_lane_idx     on public.packages (lane, sort_order);

notify pgrst, 'reload schema';
