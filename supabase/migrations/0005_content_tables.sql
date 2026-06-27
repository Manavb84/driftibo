-- Content tables: move destinations/articles/packages/offerings out of static TS into
-- Supabase so the admin CMS can edit them. Same RLS invariant as 0004 — anon key + RLS,
-- no service-role key. Public reads (published only for destinations/articles); admins
-- get full ALL via is_admin(). Arrays as text[], structured fields (days/body) as jsonb.

-- ── destinations ──
create table if not exists public.destinations (
  id                  uuid primary key default gen_random_uuid(),
  slug                text unique not null,
  name                text not null,
  look_like           text not null default '',
  region              text not null default '',
  alt                 text not null default '',
  tag                 text not null default '',
  photo               text not null default '',
  scene               text not null default 's-dusk',
  lede                text not null default '',
  rate                text not null default '',
  day_count           text not null default '',
  mood                text not null default '',
  catches             text[] not null default '{}',
  numbers             text[] not null default '{}',
  days                jsonb not null default '[]',           -- {d,t,p}[]
  hero_image_url      text,
  portrait_image_url  text,
  status              text not null default 'published',     -- published | draft
  sort_order          int not null default 0,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- ── articles (journal) ──
create table if not exists public.articles (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  title           text not null,
  dek             text not null default '',
  kind            text not null default '',
  read            text not null default '',
  photo           text not null default '',
  scene           text not null default 's-dusk',
  body            jsonb not null default '[]',               -- BodyBlock[] {type:p|h|q, text}
  hero_image_url  text,
  status          text not null default 'published',
  sort_order      int not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ── packages ──
create table if not exists public.packages (
  id                  uuid primary key default gen_random_uuid(),
  slug                text unique not null,
  kicker              text not null default '',
  name                text not null,
  region              text not null default '',
  photo               text not null default '',
  glow                text not null default '',
  rate                text not null default '',
  nights              text not null default '',
  tags                text[] not null default '{}',
  blurb               text not null default '',
  cta                 text not null default '',
  context             text not null default '',
  even                boolean not null default false,
  well_scene          text not null default 's-dusk',
  portrait_image_url  text,
  sort_order          int not null default 0,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- ── offerings ──
create table if not exists public.offerings (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,   -- display label e.g. "/surprise"
  name        text not null,
  photo       text not null default '',
  descr       text not null default '',
  form_sub    text not null default '',
  image_url   text,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── indexes for sorted public reads ──
create index if not exists destinations_sort_idx on public.destinations (sort_order, created_at);
create index if not exists articles_sort_idx     on public.articles (sort_order, created_at);
create index if not exists packages_sort_idx     on public.packages (sort_order, created_at);
create index if not exists offerings_sort_idx    on public.offerings (sort_order, created_at);

-- ── RLS: public select (published gate for destinations/articles), admin ALL ──
alter table public.destinations enable row level security;
alter table public.articles     enable row level security;
alter table public.packages     enable row level security;
alter table public.offerings    enable row level security;

create policy "destinations_select_public" on public.destinations
  for select using (status = 'published' or public.is_admin());
create policy "destinations_admin_all" on public.destinations
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "articles_select_public" on public.articles
  for select using (status = 'published' or public.is_admin());
create policy "articles_admin_all" on public.articles
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "packages_select_public" on public.packages
  for select using (true);
create policy "packages_admin_all" on public.packages
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "offerings_select_public" on public.offerings
  for select using (true);
create policy "offerings_admin_all" on public.offerings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ── explicit grants (raw-SQL tables skip Supabase auto-grants; RLS still governs rows) ──
grant select on public.destinations, public.articles, public.packages, public.offerings to anon, authenticated;
grant insert, update, delete on public.destinations, public.articles, public.packages, public.offerings to authenticated;

notify pgrst, 'reload schema';
