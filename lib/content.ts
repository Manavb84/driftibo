import { unstable_cache } from "next/cache";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { BodyBlock } from "@/lib/blocks";

export type { BodyBlock };

// Cookieless anon client for public reads. The cookie-bound SSR client calls cookies(),
// which Next forbids inside unstable_cache — and public content needs no session anyway
// (RLS exposes published rows to anon). One client, reused across cached reads.
function publicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}

// ── Canonical types (camelCase) ────────────────────────────────────────────

export type ItinDay = { d: string; t: string; p: string };

export type Destination = {
  id: string;
  slug: string;
  name: string;
  lookLike: string;
  region: string;
  alt: string;
  tag: string;
  photo: string;
  scene: string;
  lede: string;
  rate: string;
  dayCount: string;
  mood: string;
  catches: string[];
  numbers: string[];
  days: ItinDay[];
  heroImageUrl: string | null;
  portraitImageUrl: string | null;
  status: string;
  sortOrder: number;
};

export type Article = {
  id: string;
  slug: string;
  title: string;
  dek: string;
  kind: string;
  read: string;
  photo: string;
  scene: string;
  body: BodyBlock[];
  heroImageUrl: string | null;
  status: string;
  sortOrder: number;
  publishedAt: string | null;
};

export type Package = {
  id: string;
  slug: string;
  kicker: string;
  name: string;
  region: string;
  photo: string;
  glow: string;
  rate: string;
  nights: string;
  tags: string[];
  blurb: string;
  cta: string;
  context: string;
  even: boolean;
  wellScene: string;
  portraitImageUrl: string | null;
  sortOrder: number;
};

export type Offering = {
  id: string;
  slug: string;
  name: string;
  photo: string;
  descr: string;
  formSub: string;
  imageUrl: string | null;
  sortOrder: number;
};

// ── Row → type mappers ─────────────────────────────────────────────────────

function toDestination(row: any): Destination {
  return {
    id: row.id ?? "",
    slug: row.slug ?? "",
    name: row.name ?? "",
    lookLike: row.look_like ?? "",
    region: row.region ?? "",
    alt: row.alt ?? "",
    tag: row.tag ?? "",
    photo: row.photo ?? "",
    scene: row.scene ?? "",
    lede: row.lede ?? "",
    rate: row.rate ?? "",
    dayCount: row.day_count ?? "",
    mood: row.mood ?? "",
    catches: Array.isArray(row.catches) ? row.catches : [],
    numbers: Array.isArray(row.numbers) ? row.numbers : [],
    days: Array.isArray(row.days) ? row.days : [],
    heroImageUrl: row.hero_image_url ?? null,
    portraitImageUrl: row.portrait_image_url ?? null,
    status: row.status ?? "draft",
    sortOrder: row.sort_order ?? 0,
  };
}

function toArticle(row: any): Article {
  return {
    id: row.id ?? "",
    slug: row.slug ?? "",
    title: row.title ?? "",
    dek: row.dek ?? "",
    kind: row.kind ?? "",
    read: row.read ?? "",
    photo: row.photo ?? "",
    scene: row.scene ?? "",
    body: Array.isArray(row.body) ? row.body : [],
    heroImageUrl: row.hero_image_url ?? null,
    status: row.status ?? "draft",
    sortOrder: row.sort_order ?? 0,
    // Fall back through published_at → created_at → null; no DB change needed.
    publishedAt: row.published_at ?? row.created_at ?? null,
  };
}

function toPackage(row: any): Package {
  return {
    id: row.id ?? "",
    slug: row.slug ?? "",
    kicker: row.kicker ?? "",
    name: row.name ?? "",
    region: row.region ?? "",
    photo: row.photo ?? "",
    glow: row.glow ?? "",
    rate: row.rate ?? "",
    nights: row.nights ?? "",
    tags: Array.isArray(row.tags) ? row.tags : [],
    blurb: row.blurb ?? "",
    cta: row.cta ?? "",
    context: row.context ?? "",
    even: row.even === true,
    wellScene: row.well_scene ?? "",
    portraitImageUrl: row.portrait_image_url ?? null,
    sortOrder: row.sort_order ?? 0,
  };
}

function toOffering(row: any): Offering {
  return {
    id: row.id ?? "",
    slug: row.slug ?? "",
    name: row.name ?? "",
    photo: row.photo ?? "",
    descr: row.descr ?? "",
    formSub: row.form_sub ?? "",
    imageUrl: row.image_url ?? null,
    sortOrder: row.sort_order ?? 0,
  };
}

// ── Cached read helpers ────────────────────────────────────────────────────

export async function getDestinations(): Promise<Destination[]> {
  return unstable_cache(
    async () => {
      const supabase = publicClient();
      const { data } = await supabase
        .from("destinations")
        .select("*")
        .eq("status", "published")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      return (data ?? []).map(toDestination);
    },
    ["destinations"],
    { tags: ["destinations"] },
  )();
}

export async function getDestination(slug: string): Promise<Destination | null> {
  return unstable_cache(
    async () => {
      const supabase = publicClient();
      const { data } = await supabase
        .from("destinations")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();
      return data ? toDestination(data) : null;
    },
    ["destination", slug],
    { tags: ["destinations"] },
  )();
}

export async function getArticles(): Promise<Article[]> {
  return unstable_cache(
    async () => {
      const supabase = publicClient();
      const { data } = await supabase
        .from("articles")
        .select("*")
        .eq("status", "published")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      return (data ?? []).map(toArticle);
    },
    ["articles"],
    { tags: ["articles"] },
  )();
}

export async function getArticle(slug: string): Promise<Article | null> {
  return unstable_cache(
    async () => {
      const supabase = publicClient();
      const { data } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();
      return data ? toArticle(data) : null;
    },
    ["article", slug],
    { tags: ["articles"] },
  )();
}

export async function getPackage(slug: string): Promise<Package | null> {
  return unstable_cache(
    async () => {
      const supabase = publicClient();
      const { data } = await supabase
        .from("packages")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      return data ? toPackage(data) : null;
    },
    ["package", slug],
    { tags: ["packages"] },
  )();
}

export async function getPackages(): Promise<Package[]> {
  return unstable_cache(
    async () => {
      const supabase = publicClient();
      const { data } = await supabase
        .from("packages")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      return (data ?? []).map(toPackage);
    },
    ["packages"],
    { tags: ["packages"] },
  )();
}

export async function getOfferings(): Promise<Offering[]> {
  return unstable_cache(
    async () => {
      const supabase = publicClient();
      const { data } = await supabase
        .from("offerings")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      return (data ?? []).map(toOffering);
    },
    ["offerings"],
    { tags: ["offerings"] },
  )();
}
