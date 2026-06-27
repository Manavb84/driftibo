import type { Metadata } from "next";
import { getAdminContext } from "@/lib/admin";
import AdminGate from "./AdminGate";
import AdminShell from "./AdminShell";

export const metadata: Metadata = {
  title: "Admin · Driftibo",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin } = await getAdminContext();
  if (!user || !isAdmin) return <AdminGate signedInEmail={user?.email ?? null} />;
  return <AdminShell email={user.email ?? "admin"}>{children}</AdminShell>;
}
