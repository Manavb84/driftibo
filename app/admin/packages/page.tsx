import { getAdminContext } from "@/lib/admin";
import AdminTable from "@/components/admin/AdminTable";

export const dynamic = "force-dynamic";

export default async function PackagesIndexPage() {
  const { supabase } = await getAdminContext();
  const { data } = await supabase
    .from("packages")
    .select("*")
    .order("sort_order")
    .order("created_at");

  return (
    <AdminTable
      title="Packages"
      newHref="/admin/packages/new"
      columns={[
        { key: "name", label: "Name" },
        { key: "region", label: "Region" },
        { key: "rate", label: "Rate" },
        { key: "sort_order", label: "Order" },
      ]}
      rows={data ?? []}
      getHref={(r) => "/admin/packages/" + r.id}
      renderActions={undefined}
    />
  );
}
