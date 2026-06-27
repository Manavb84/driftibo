import { notFound } from "next/navigation";
import { getAdminContext } from "@/lib/admin";
import DestinationForm from "../DestinationForm";
import type { Destination, ItinDay } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function EditDestinationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await getAdminContext();

  const { data: row } = await supabase
    .from("destinations")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!row) notFound();

  const mapped: Destination = {
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
    days: Array.isArray(row.days) ? (row.days as ItinDay[]) : [],
    heroImageUrl: row.hero_image_url ?? null,
    portraitImageUrl: row.portrait_image_url ?? null,
    status: row.status ?? "draft",
    sortOrder: row.sort_order ?? 0,
  };

  return <DestinationForm initial={mapped} />;
}
