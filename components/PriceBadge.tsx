// Canonical price line (was hand-built 4×). e.g. <PriceBadge amount="6,800" unit="/ person / day" />
export default function PriceBadge({
  amount,
  unit = "/ day",
  approx = true,
}: {
  amount: string;
  unit?: string;
  approx?: boolean;
}) {
  return (
    <span>
      {approx ? "≈ " : ""}₹{amount}{" "}
      <span style={{ fontSize: "0.82rem", color: "var(--pk-muted)" }}>{unit}</span>
    </span>
  );
}
