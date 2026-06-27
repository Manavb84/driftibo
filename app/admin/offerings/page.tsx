export const dynamic = "force-dynamic";

import { getAdminContext } from "@/lib/admin";
import AdminTable from "@/components/admin/AdminTable";

export default async function OfferingsIndexPage() {
  const { supabase } = await getAdminContext();

  const { data } = await supabase
    .from("offerings")
    .select("*")
    .order("sort_order")
    .order("created_at");

  return (
    <AdminTable
      title="Offerings"
      newHref="/admin/offerings/new"
      columns={[
        { key: "name", label: "Name" },
        { key: "slug", label: "Label" },
        { key: "sort_order", label: "Order" },
      ]}
      rows={data ?? []}
      getHref={(r) => "/admin/offerings/" + r.id}
      renderActions={undefined}
    />
  );
}
