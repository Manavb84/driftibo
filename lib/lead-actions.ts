"use server";

import { revalidatePath } from "next/cache";
import { getAdminContext } from "@/lib/admin";

const LEAD_STATUSES = ["new", "contacted", "quoted", "won", "lost"] as const;
type LeadStatus = (typeof LEAD_STATUSES)[number];

export type LeadPatch = {
  lead_status?: LeadStatus;
  deal_value?: number | null;
};

export async function updateLead(
  id: string,
  patch: LeadPatch,
): Promise<{ ok: boolean; error?: string }> {
  const { supabase, isAdmin } = await getAdminContext();
  if (!isAdmin) return { ok: false, error: "Not authorized." };

  if (
    patch.lead_status !== undefined &&
    !LEAD_STATUSES.includes(patch.lead_status)
  ) {
    return { ok: false, error: "Invalid status value." };
  }

  const { error } = await supabase
    .from("captures")
    .update(patch)
    .eq("id", id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/leads");
  return { ok: true };
}
