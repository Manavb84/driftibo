import { notFound } from "next/navigation";
import { getAdminContext } from "@/lib/admin";
import PackageForm from "@/app/admin/packages/PackageForm";
import type { Package } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function EditPackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await getAdminContext();
  const { data: row } = await supabase
    .from("packages")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!row) notFound();

  const mapped: Package = {
    id: row.id,
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

  return <PackageForm initial={mapped} />;
}
