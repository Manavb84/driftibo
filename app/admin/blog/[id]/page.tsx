import { notFound } from "next/navigation";
import { getAdminContext } from "@/lib/admin";
import BlogForm from "../BlogForm";

export const dynamic = "force-dynamic";

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await getAdminContext();
  const { data: row } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!row) notFound();

  const mapped = {
    id: row.id,
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
  };

  return <BlogForm initial={mapped} />;
}
