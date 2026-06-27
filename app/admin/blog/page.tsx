import { getAdminContext } from "@/lib/admin";
import AdminTable from "@/components/admin/AdminTable";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const { supabase } = await getAdminContext();
  const { data } = await supabase
    .from("articles")
    .select("*")
    .order("sort_order")
    .order("created_at");

  return (
    <AdminTable
      title="Blog"
      newHref="/admin/blog/new"
      columns={[
        { key: "title", label: "Title" },
        { key: "kind", label: "Kind" },
        { key: "status", label: "Status" },
        { key: "sort_order", label: "Order" },
      ]}
      rows={data ?? []}
      getHref={(r) => "/admin/blog/" + r.id}
      renderActions={undefined}
    />
  );
}
