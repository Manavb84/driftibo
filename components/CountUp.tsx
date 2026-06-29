"use client";

import { useEffect, useRef, useState } from "react";

// Animated price line — same shape as PriceBadge ("≈ ₹6,800 / person / day") but the
// number counts up from 0 the first time it scrolls into view. Reduced-motion → static.
export default function CountUp({
  amount,
  unit = "/ day",
  approx = true,
}: {
  amount: string;
  unit?: string;
  approx?: boolean;
}) {
  const target = Number(amount.replace(/[^\d]/g, "")) || 0;
  const ref = useRef<HTMLSpanElement | null>(null);
  const [val, setVal] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      setVal(target);
      setDone(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !done) {
          setDone(true);
          const start = performance.now();
          const dur = 1100;
          const tick = (now: number) => {
            const p = Math.min(1, (now - start) / dur);
            // easeOutCubic
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(Math.round(target * eased));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target, done]);

  return (
    <span ref={ref} className="count-up">
      {approx ? "≈ " : ""}₹{val.toLocaleString("en-IN")}{" "}
      <span style={{ fontSize: "0.82rem", color: "var(--pk-muted)" }}>{unit}</span>
    </span>
  );
}
