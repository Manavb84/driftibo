import { getAdminContext } from "@/lib/admin";

export const dynamic = "force-dynamic";

type Capture = {
  id: string;
  created_at: string;
  kind: string;
  email: string | null;
  name: string | null;
  whatsapp: string | null;
  persona: string | null;
  data: Record<string, unknown> | null;
};

const KINDS: { key: string; label: string }[] = [
  { key: "lead", label: "Leads" },
  { key: "game", label: "Game plays" },
  { key: "quiz", label: "Quiz results" },
  { key: "dream", label: "Dream requests" },
  { key: "offering", label: "Offering enquiries" },
  { key: "star_drop", label: "Star Drop signups" },
];

const KIND_LABEL: Record<string, string> = Object.fromEntries(KINDS.map((k) => [k.key, k.label]));

function fmt(ts: string) {
  const d = new Date(ts);
  return d.toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default async function AdminDashboard() {
  const { supabase } = await getAdminContext(); // layout already guaranteed admin

  // Per-kind counts (head:true → count only, no rows) + total Starbook stamps.
  const counts: Record<string, number> = {};
  await Promise.all(
    KINDS.map(async ({ key }) => {
      const { count } = await supabase.from("captures").select("*", { count: "exact", head: true }).eq("kind", key);
      counts[key] = count ?? 0;
    }),
  );
  const { count: stampCount } = await supabase.from("starbook_stamps").select("*", { count: "exact", head: true });
  const { data: recent } = await supabase
    .from("captures")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(25);
  const rows = (recent ?? []) as Capture[];

  const cards = [...KINDS.map((k) => ({ label: k.label, n: counts[k.key] ?? 0 })), { label: "Starbook stamps", n: stampCount ?? 0 }];

  return (
    <div style={{ maxWidth: 1100 }}>
      <h1 style={{ fontFamily: "var(--display)", fontSize: "1.9rem", marginBottom: 4 }}>Dashboard</h1>
      <p style={{ color: "var(--pk-muted)", fontSize: "0.9rem", marginBottom: 24 }}>Everything coming in from the site, live.</p>

      {/* KPI cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 14, marginBottom: 30 }}>
        {cards.map((c) => (
          <div key={c.label} className="card" style={{ padding: 16, borderRadius: 14 }}>
            <div style={{ fontFamily: "var(--display)", fontSize: "2rem", lineHeight: 1 }}>{c.n}</div>
            <div style={{ color: "var(--pk-muted)", fontSize: "0.78rem", marginTop: 6 }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <h2 style={{ fontFamily: "var(--display)", fontSize: "1.2rem", marginBottom: 12 }}>Recent activity</h2>
      <div className="card" style={{ borderRadius: 14, overflow: "hidden" }}>
        {rows.length === 0 ? (
          <p style={{ padding: 20, color: "var(--pk-muted)", fontSize: "0.9rem" }}>Nothing yet. Submissions will appear here as they come in.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ textAlign: "left", color: "var(--pk-muted)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                <th style={{ padding: "10px 14px" }}>When</th>
                <th style={{ padding: "10px 14px" }}>Type</th>
                <th style={{ padding: "10px 14px" }}>Email</th>
                <th style={{ padding: "10px 14px" }}>Persona</th>
                <th style={{ padding: "10px 14px" }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} style={{ borderTop: "1px solid var(--pk-line-soft, oklch(0.9 0.01 220))" }}>
                  <td style={{ padding: "10px 14px", whiteSpace: "nowrap", color: "var(--pk-muted)" }}>{fmt(r.created_at)}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <span style={{ background: "var(--pk-panel, oklch(0.94 0.01 220))", borderRadius: 6, padding: "2px 8px", fontSize: "0.76rem", fontWeight: 600 }}>{KIND_LABEL[r.kind] ?? r.kind}</span>
                  </td>
                  <td style={{ padding: "10px 14px" }}>{r.email || r.whatsapp || "—"}</td>
                  <td style={{ padding: "10px 14px", color: "var(--pk-muted)" }}>{r.persona || "—"}</td>
                  <td style={{ padding: "10px 14px", color: "var(--pk-muted)", maxWidth: 320, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {r.data && Object.keys(r.data).length ? JSON.stringify(r.data) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
