import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// ponytail: reading captures needs service-role (captures SELECT is admin-only);
// inert until both CRON_SECRET and SUPABASE_SERVICE_ROLE_KEY are set.
export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || req.headers.get("Authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    return NextResponse.json({ skipped: "no service role" }, { status: 200 });
  }

  const supabase = createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey);

  // Recent leads (past 24 h)
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data: leads } = await supabase
    .from("captures")
    .select("email, name")
    .eq("kind", "star_drop")
    .not("email", "is", null)
    .gte("created_at", since);

  if (!leads?.length) return NextResponse.json({ sent: 0 });

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ skipped: "no resend key", leads: leads.length });
  }

  const from = process.env.RESEND_FROM ?? "Driftibo <hello@driftibo.com>";
  let sent = 0;
  for (const lead of leads) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [lead.email],
          subject: "Your Driftibo Star Drop ⭐",
          html: `<p>Hi${lead.name ? ` ${lead.name}` : ""},</p><p>Your star drop is ready. Explore your personalised travel picks on Driftibo.</p><p>— The Driftibo Team</p>`,
        }),
      });
      sent++;
    } catch {
      // Individual email failure must not abort the batch
    }
  }

  return NextResponse.json({ sent });
}
