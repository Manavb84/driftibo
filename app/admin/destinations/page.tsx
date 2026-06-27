import { getAdminContext } from "@/lib/admin";
import AdminTable from "@/components/admin/AdminTable";

export const dynamic = "force-dynamic";

export default async function DestinationsAdminPage() {
  const { supabase } = await getAdminContext();
  const { data } = await supabase
    .from("destinations")
    .select("*")
    .order("sort_order")
    .order("created_at");

  return (
    <AdminTable
      title="Destinations"
      newHref="/admin/destinations/new"
      columns={[
        { key: "name", label: "Name" },
        { key: "region", label: "Region" },
        { key: "status", label: "Status" },
        { key: "sort_order", label: "Order" },
      ]}
      rows={data ?? []}
      getHref={(r) => "/admin/destinations/" + r.id}
      renderActions={undefined}
    />
  );
}
