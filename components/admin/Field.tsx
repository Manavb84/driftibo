"use client";

const INPUT_STYLE: React.CSSProperties = {
  width: "100%",
  fontFamily: "var(--ui)",
  fontSize: "0.92rem",
  padding: "9px 12px",
  border: "1px solid var(--pk-line)",
  borderRadius: 10,
  background: "var(--pk-card, #fff)",
  color: "var(--pk-text)",
  boxSizing: "border-box",
  outline: "none",
};

const LABEL_STYLE: React.CSSProperties = {
  fontFamily: "var(--ui)",
  fontSize: "0.8rem",
  fontWeight: 600,
  color: "var(--pk-muted)",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const HINT_STYLE: React.CSSProperties = {
  fontFamily: "var(--ui)",
  fontSize: "0.76rem",
  color: "var(--pk-muted)",
  margin: 0,
};

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: "text" | "textarea" | "select" | "number";
  options?: { value: string; label: string }[];
  placeholder?: string;
  hint?: string;
}

export default function Field({
  label,
  value,
  onChange,
  type = "text",
  options,
  placeholder,
  hint,
}: FieldProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={LABEL_STYLE}>{label}</label>

      {type === "textarea" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          style={{ ...INPUT_STYLE, resize: "vertical", lineHeight: 1.55 }}
        />
      ) : type === "select" ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={INPUT_STYLE}
        >
          {options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={INPUT_STYLE}
        />
      )}

      {hint && <p style={HINT_STYLE}>{hint}</p>}
    </div>
  );
}

// ── ArrayField ────────────────────────────────────────────────────────────────
// Edits a string[] as one-per-line textarea; splits/joins on "\n", drops blanks.

export function ArrayField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  hint?: string;
}) {
  const text = (value ?? []).join("\n");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={LABEL_STYLE}>{label}</label>
      <textarea
        value={text}
        onChange={(e) =>
          onChange(
            e.target.value
              .split("\n")
              .filter((line) => line.trim() !== ""),
          )
        }
        rows={4}
        style={{ ...INPUT_STYLE, resize: "vertical", lineHeight: 1.55 }}
      />
      {hint && <p style={HINT_STYLE}>{hint}</p>}
    </div>
  );
}
