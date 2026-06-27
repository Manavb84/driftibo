export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getAdminContext } from "@/lib/admin";
import OfferingForm from "@/app/admin/offerings/OfferingForm";

export default async function EditOfferingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await getAdminContext();

  const { data: row } = await supabase
    .from("offerings")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!row) notFound();

  const initial = {
    id: row.id,
    slug: row.slug ?? "",
    name: row.name ?? "",
    photo: row.photo ?? "",
    descr: row.descr ?? "",
    formSub: row.form_sub ?? "",
    imageUrl: row.image_url ?? null,
    sortOrder: row.sort_order ?? 0,
  };

  return <OfferingForm initial={initial} />;
}
