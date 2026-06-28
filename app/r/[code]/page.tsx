import { redirect } from "next/navigation";

// Referral landing for shared star-report cards (driftibo.com/r/<slug>). We just
// bounce the friend into the game with the source tagged for attribution; the
// `code` (the sharer's destination slug) rides along as a UTM campaign.
export default async function ReferralPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  redirect(`/game?utm_source=share&utm_medium=referral&utm_campaign=${encodeURIComponent(code)}`);
}
