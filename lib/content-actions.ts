"use server";

import { revalidateTag, revalidatePath } from "next/cache";
import { getAdminContext } from "@/lib/admin";
import type { Destination, Article, Package, Offering } from "@/lib/content";
import type { BodyBlock } from "@/lib/blocks";

type ActionResult = { ok: boolean; error?: string; slug?: string };

// ── Destinations ──────────────────────────────────────────────────────────

export async function upsertDestination(
  input: Partial<Destination>,
): Promise<ActionResult> {
  const { supabase, isAdmin } = await getAdminContext();
  if (!isAdmin) return { ok: false, error: "Not authorized." };

  const slug = input.slug?.trim();
  const name = input.name?.trim();
  if (!slug) return { ok: false, error: "slug is required." };
  if (!name) return { ok: false, error: "name is required." };

  const row: Record<string, unknown> = {
    slug,
    name,
    look_like: input.lookLike ?? "",
    region: input.region ?? "",
    alt: input.alt ?? "",
    tag: input.tag ?? "",
    photo: input.photo ?? "",
    scene: input.scene ?? "",
    lede: input.lede ?? "",
    rate: input.rate ?? "",
    day_count: input.dayCount ?? "",
    mood: input.mood ?? "",
    catches: Array.isArray(input.catches) ? input.catches : [],
    numbers: Array.isArray(input.numbers) ? input.numbers : [],
    days: Array.isArray(input.days) ? input.days : [],
    hero_image_url: input.heroImageUrl ?? null,
    portrait_image_url: input.portraitImageUrl ?? null,
    status: input.status ?? "draft",
    sort_order: input.sortOrder ?? 0,
    updated_at: new Date().toISOString(),
  };

  let error;
  if (input.id) {
    ({ error } = await supabase
      .from("destinations")
      .update(row)
      .eq("id", input.id));
  } else {
    ({ error } = await supabase.from("destinations").insert(row));
  }
  if (error) return { ok: false, error: error.message };

  revalidateTag("destinations");
  revalidatePath("/destinations");
  revalidatePath("/destinations/" + slug);
  return { ok: true, slug };
}

export async function deleteDestination(id: string): Promise<ActionResult> {
  const { supabase, isAdmin } = await getAdminContext();
  if (!isAdmin) return { ok: false, error: "Not authorized." };
  if (!id) return { ok: false, error: "id is required." };

  const { error } = await supabase.from("destinations").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidateTag("destinations");
  revalidatePath("/destinations");
  return { ok: true };
}

// ── Articles ──────────────────────────────────────────────────────────────

export async function upsertArticle(
  input: Partial<Article>,
): Promise<ActionResult> {
  const { supabase, isAdmin } = await getAdminContext();
  if (!isAdmin) return { ok: false, error: "Not authorized." };

  const slug = input.slug?.trim();
  const title = input.title?.trim();
  if (!slug) return { ok: false, error: "slug is required." };
  if (!title) return { ok: false, error: "title is required." };

  const body: BodyBlock[] = Array.isArray(input.body) ? input.body : [];

  const row: Record<string, unknown> = {
    slug,
    title,
    dek: input.dek ?? "",
    kind: input.kind ?? "",
    read: input.read ?? "",
    photo: input.photo ?? "",
    scene: input.scene ?? "",
    body,
    hero_image_url: input.heroImageUrl ?? null,
    status: input.status ?? "draft",
    sort_order: input.sortOrder ?? 0,
    updated_at: new Date().toISOString(),
  };

  let error;
  if (input.id) {
    ({ error } = await supabase.from("articles").update(row).eq("id", input.id));
  } else {
    ({ error } = await supabase.from("articles").insert(row));
  }
  if (error) return { ok: false, error: error.message };

  revalidateTag("articles");
  revalidatePath("/journal");
  revalidatePath("/journal/" + slug);
  return { ok: true, slug };
}

export async function deleteArticle(id: string): Promise<ActionResult> {
  const { supabase, isAdmin } = await getAdminContext();
  if (!isAdmin) return { ok: false, error: "Not authorized." };
  if (!id) return { ok: false, error: "id is required." };

  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidateTag("articles");
  revalidatePath("/journal");
  return { ok: true };
}

// ── Packages ──────────────────────────────────────────────────────────────

export async function upsertPackage(
  input: Partial<Package>,
): Promise<ActionResult> {
  const { supabase, isAdmin } = await getAdminContext();
  if (!isAdmin) return { ok: false, error: "Not authorized." };

  const slug = input.slug?.trim();
  const name = input.name?.trim();
  if (!slug) return { ok: false, error: "slug is required." };
  if (!name) return { ok: false, error: "name is required." };

  const row: Record<string, unknown> = {
    slug,
    name,
    kicker: input.kicker ?? "",
    region: input.region ?? "",
    photo: input.photo ?? "",
    glow: input.glow ?? "",
    rate: input.rate ?? "",
    nights: input.nights ?? "",
    tags: Array.isArray(input.tags) ? input.tags : [],
    blurb: input.blurb ?? "",
    cta: input.cta ?? "",
    context: input.context ?? "",
    even: input.even === true,
    well_scene: input.wellScene ?? "",
    portrait_image_url: input.portraitImageUrl ?? null,
    sort_order: input.sortOrder ?? 0,
    updated_at: new Date().toISOString(),
  };

  let error;
  if (input.id) {
    ({ error } = await supabase.from("packages").update(row).eq("id", input.id));
  } else {
    ({ error } = await supabase.from("packages").insert(row));
  }
  if (error) return { ok: false, error: error.message };

  revalidateTag("packages");
  revalidatePath("/packages");
  return { ok: true, slug };
}

export async function deletePackage(id: string): Promise<ActionResult> {
  const { supabase, isAdmin } = await getAdminContext();
  if (!isAdmin) return { ok: false, error: "Not authorized." };
  if (!id) return { ok: false, error: "id is required." };

  const { error } = await supabase.from("packages").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidateTag("packages");
  revalidatePath("/packages");
  return { ok: true };
}

// ── Offerings ─────────────────────────────────────────────────────────────

export async function upsertOffering(
  input: Partial<Offering>,
): Promise<ActionResult> {
  const { supabase, isAdmin } = await getAdminContext();
  if (!isAdmin) return { ok: false, error: "Not authorized." };

  const slug = input.slug?.trim();
  const name = input.name?.trim();
  if (!slug) return { ok: false, error: "slug is required." };
  if (!name) return { ok: false, error: "name is required." };

  const row: Record<string, unknown> = {
    slug,
    name,
    photo: input.photo ?? "",
    descr: input.descr ?? "",
    form_sub: input.formSub ?? "",
    image_url: input.imageUrl ?? null,
    sort_order: input.sortOrder ?? 0,
    updated_at: new Date().toISOString(),
  };

  let error;
  if (input.id) {
    ({ error } = await supabase.from("offerings").update(row).eq("id", input.id));
  } else {
    ({ error } = await supabase.from("offerings").insert(row));
  }
  if (error) return { ok: false, error: error.message };

  revalidateTag("offerings");
  revalidatePath("/offerings");
  return { ok: true, slug };
}

export async function deleteOffering(id: string): Promise<ActionResult> {
  const { supabase, isAdmin } = await getAdminContext();
  if (!isAdmin) return { ok: false, error: "Not authorized." };
  if (!id) return { ok: false, error: "id is required." };

  const { error } = await supabase.from("offerings").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidateTag("offerings");
  revalidatePath("/offerings");
  return { ok: true };
}
