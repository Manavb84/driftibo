"use client";

import { useState, useTransition } from "react";
import { updateLead } from "@/lib/lead-actions";

const STATUSES = ["new", "contacted", "quoted", "won", "lost"] as const;
type LeadStatus = (typeof STATUSES)[number];

export type Lead = {
  id: string;
  created_at: string;
  kind: string;
  email: string | null;
  name: string | null;
  whatsapp: string | null;
  lead_status: string | null;
  deal_value: number | null;
  data: Record<string, unknown> | null;
};

function fmt(ts: string) {
  return new Date(ts).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function buildWaLink(row: Lead): string | null {
  const rawNum =
    row.whatsapp ??
    (typeof row.data?.whatsapp === "string" ? row.data.whatsapp : "");
  if (!rawNum) return null;
  const num = rawNum.replace(/\D/g, "");
  if (!num) return null;

  const name = row.name ?? (typeof row.data?.name === "string" ? row.data.name : "");
  const dest =
    typeof row.data?.resultDestination === "string"
      ? row.data.resultDestination
      : typeof row.data?.destination === "string"
        ? row.data.destination
        : "";
  const limits =
    typeof row.data?.limits === "string" ? row.data.limits : "";

  let text = `Hi${name ? " " + name : ""}, thanks for your interest${dest ? " in " + dest : ""} with Driftibo!`;
  if (limits) text += ` You mentioned your budget is ${limits}.`;
  text += " We'd love to help plan your trip — when would be a good time to connect? 🙏";

  return `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
}

const STATUS_COLORS: Record<string, string> = {
  new: "oklch(0.6 0.12 250)",
  contacted: "oklch(0.6 0.12 200)",
  quoted: "oklch(0.65 0.15 80)",
  won: "oklch(0.55 0.14 155)",
  lost: "oklch(0.55 0.08 20)",
};

function LeadRow({ lead }: { lead: Lead }) {
  const [status, setStatus] = useState<string>(lead.lead_status ?? "new");
  const [dealValue, setDealValue] = useState<string>(
    lead.deal_value !== null ? String(lead.deal_value) : "",
  );
  const [saving, startSave] = useTransition();

  function handleStatusChange(v: string) {
    setStatus(v);
    startSave(async () => {
      await updateLead(lead.id, { lead_status: v as LeadStatus });
    });
  }

  function handleDealBlur() {
    const trimmed = dealValue.trim();
    const num = trimmed === "" ? null : parseFloat(trimmed);
    if (isNaN(num as number) && num !== null) return;
    startSave(async () => {
      await updateLead(lead.id, { deal_value: num });
    });
  }

  const wa = buildWaLink(lead);
  const waNum = lead.whatsapp ?? (typeof lead.data?.whatsapp === "string" ? lead.data.whatsapp : null);

  return (
    <tr
      style={{
        borderTop: "1px solid var(--pk-line-soft, oklch(0.9 0.01 220))",
        opacity: saving ? 0.65 : 1,
        transition: "opacity 0.15s",
      }}
    >
      <td style={{ padding: "10px 14px", whiteSpace: "nowrap", color: "var(--pk-muted)", fontSize: "0.8rem" }}>
        {fmt(lead.created_at)}
      </td>
      <td style={{ padding: "10px 14px", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {lead.email || "—"}
      </td>
      <td style={{ padding: "10px 14px" }}>{lead.name || "—"}</td>
      <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>{waNum || "—"}</td>
      <td style={{ padding: "10px 14px" }}>
        <span
          style={{
            background: "var(--pk-panel, oklch(0.94 0.01 220))",
            borderRadius: 6,
            padding: "2px 8px",
            fontSize: "0.76rem",
            fontWeight: 600,
          }}
        >
          {lead.kind}
        </span>
      </td>
      <td style={{ padding: "10px 14px" }}>
        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          style={{
            fontSize: "0.82rem",
            borderRadius: 7,
            padding: "4px 8px",
            border: "1px solid var(--pk-line)",
            background: "var(--pk-paper)",
            fontFamily: "var(--ui)",
            cursor: "pointer",
            color: STATUS_COLORS[status] ?? "inherit",
            fontWeight: 600,
          }}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </td>
      <td style={{ padding: "10px 14px" }}>
        <input
          type="number"
          value={dealValue}
          onChange={(e) => setDealValue(e.target.value)}
          onBlur={handleDealBlur}
          placeholder="0"
          style={{
            width: 100,
            fontSize: "0.82rem",
            borderRadius: 7,
            padding: "4px 8px",
            border: "1px solid var(--pk-line)",
            background: "var(--pk-paper)",
            fontFamily: "var(--ui)",
          }}
        />
      </td>
      <td style={{ padding: "10px 14px" }}>
        {wa ? (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: "0.82rem",
              color: "oklch(0.48 0.16 155)",
              textDecoration: "none",
              fontWeight: 600,
              whiteSpace: "nowrap",
              padding: "4px 10px",
              borderRadius: 7,
              border: "1px solid oklch(0.48 0.16 155)",
              display: "inline-block",
            }}
          >
            WA Reply
          </a>
        ) : (
          "—"
        )}
      </td>
    </tr>
  );
}

export default function LeadsTable({ leads }: { leads: Lead[] }) {
  if (leads.length === 0) {
    return (
      <div style={{ maxWidth: 1200 }}>
        <h1 style={{ fontFamily: "var(--display)", fontSize: "1.9rem", marginBottom: 4 }}>
          Lead Pipeline
        </h1>
        <div
          className="card"
          style={{ borderRadius: 14, padding: 20, color: "var(--pk-muted)", fontSize: "0.9rem" }}
        >
          No leads yet. Captures will appear here once visitors engage with the site.
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200 }}>
      <h1 style={{ fontFamily: "var(--display)", fontSize: "1.9rem", marginBottom: 4 }}>
        Lead Pipeline
      </h1>
      <p style={{ color: "var(--pk-muted)", fontSize: "0.9rem", marginBottom: 24 }}>
        {leads.length} {leads.length === 1 ? "lead" : "leads"} — status and deal value save on
        change / blur.
      </p>
      <div className="card" style={{ borderRadius: 14, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
          <thead>
            <tr
              style={{
                textAlign: "left",
                color: "var(--pk-muted)",
                fontSize: "0.72rem",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              <th style={{ padding: "10px 14px" }}>When</th>
              <th style={{ padding: "10px 14px" }}>Email</th>
              <th style={{ padding: "10px 14px" }}>Name</th>
              <th style={{ padding: "10px 14px" }}>WhatsApp</th>
              <th style={{ padding: "10px 14px" }}>Kind</th>
              <th style={{ padding: "10px 14px" }}>Status</th>
              <th style={{ padding: "10px 14px" }}>Deal (₹)</th>
              <th style={{ padding: "10px 14px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <LeadRow key={lead.id} lead={lead} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
