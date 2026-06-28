import type { CSSProperties } from "react";

// Canonical form-input style (was copy-pasted 4×). Dark surfaces layer their own
// background/border/color on top via spread: {...INPUT_STYLE, background: "oklch(1 0 0 / .08)"}.
export const INPUT_STYLE: CSSProperties = {
  display: "block",
  width: "100%",
  marginTop: 6,
  padding: "11px 13px",
  borderRadius: 10,
  border: "1px solid var(--pk-line)",
  background: "var(--pk-paper)",
  fontFamily: "var(--ui)",
  fontSize: "0.9rem",
  color: "var(--pk-text)",
  outline: "none",
};
