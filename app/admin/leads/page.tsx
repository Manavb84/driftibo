import { getAdminContext } from "@/lib/admin";
import LeadsTable, { type Lead } from "./LeadsTable";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const { supabase, isAdmin } = await getAdminContext();

  if (!isAdmin) {
    return (
      <div style={{ padding: 40, color: "var(--pk-muted)", fontSize: "0.9rem" }}>
        Not authorized. Sign in with an admin account to view this page.
      </div>
    );
  }

  const { data } = await supabase
    .from("captures")
    .select("id,created_at,kind,email,name,whatsapp,lead_status,deal_value,data")
    .order("created_at", { ascending: false })
    .limit(300);

  const leads = (data ?? []) as Lead[];

  return <LeadsTable leads={leads} />;
}
