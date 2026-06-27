import Link from "next/link";
import type { ReactNode } from "react";

type Column = { key: string; label: string };

interface AdminTableProps {
  columns: Column[];
  rows: Record<string, unknown>[];
  getHref?: (row: Record<string, unknown>) => string;
  newHref?: string;
  title: string;
  renderActions?: (row: Record<string, unknown>) => ReactNode;
}

function cellDisplay(v: unknown): string {
  if (v === null || v === undefined) return "—";
  if (Array.isArray(v)) return v.join(", ");
  const s = String(v);
  return s.length > 80 ? s.slice(0, 77) + "…" : s;
}

export default function AdminTable({
  columns,
  rows,
  getHref,
  newHref,
  title,
  renderActions,
}: AdminTableProps) {
  return (
    <div style={{ maxWidth: 1100 }}>
      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <h1
          style={{
            fontFamily: "var(--display)",
            fontSize: "1.9rem",
            margin: 0,
          }}
        >
          {title}
        </h1>
        {newHref && (
          <Link href={newHref} className="btn btn-primary btn-sm">
            + New
          </Link>
        )}
      </div>

      {/* Table card */}
      <div className="card" style={{ borderRadius: 14, overflow: "hidden" }}>
        {rows.length === 0 ? (
          <p
            style={{
              padding: 20,
              color: "var(--pk-muted)",
              fontSize: "0.9rem",
            }}
          >
            Nothing here yet.
          </p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.85rem",
            }}
          >
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
                {columns.map((col) => (
                  <th key={col.key} style={{ padding: "10px 14px" }}>
                    {col.label}
                  </th>
                ))}
                {renderActions && <th style={{ padding: "10px 14px" }} />}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={i}
                  style={{
                    borderTop:
                      "1px solid var(--pk-line-soft, oklch(0.9 0.01 220))",
                  }}
                >
                  {columns.map((col, ci) => (
                    <td
                      key={col.key}
                      style={{
                        padding: "10px 14px",
                        maxWidth: ci === 0 ? undefined : 260,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {ci === 0 && getHref ? (
                        <Link
                          href={getHref(row)}
                          style={{
                            color: "var(--pk-accent-deep)",
                            textDecoration: "none",
                            fontWeight: 600,
                          }}
                        >
                          {cellDisplay(row[col.key])}
                        </Link>
                      ) : (
                        cellDisplay(row[col.key])
                      )}
                    </td>
                  ))}
                  {renderActions && (
                    <td
                      style={{ padding: "10px 14px", whiteSpace: "nowrap" }}
                    >
                      {renderActions(row)}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
