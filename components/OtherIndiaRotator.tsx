"use client";

import { useEffect, useState } from "react";

// [abroad name, abroad line, India twin, India line]
const FACTS: [string, string, string, string][] = [
  ["Gangtey", "gets the mood board.", "Chopta", "gets you there — same soul, 80% less, no visa."],
  ["Switzerland", "sells you the postcard.", "Chopta", "hands you the same meadow — for the price of the postcard."],
  ["Iceland", "charges for the moonscape.", "Spiti", "throws in monasteries and a 4am sky, for free."],
  ["Bali", "rents out the rice terraces.", "Ziro", "lets you walk straight into them — no gate, no queue."],
  ["Goa", "got loud.", "Gokarna", "kept the cliff path, the tide and the quiet."],
  ["Tuscany", "has the golden light.", "Coorg", "has it too — over a coffee estate, half the flight."],
  ["The Maldives", "wants your whole honeymoon.", "Havelock", "just wants a long weekend."],
  ["Patagonia", "is thirty hours away.", "Sandakphu", "shows you four Himalayan giants before breakfast."],
];

const em = { color: "var(--pk-accent-deep)" };

export default function OtherIndiaRotator() {
  const [oi, setOi] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    let swap: ReturnType<typeof setTimeout>;
    const iv = setInterval(() => {
      setVisible(false);
      swap = setTimeout(() => {
        setOi((o) => (o + 1) % FACTS.length);
        setVisible(true);
      }, 560);
    }, 4600);
    return () => {
      clearInterval(iv);
      clearTimeout(swap);
    };
  }, []);

  const f = FACTS[oi];

  return (
    <section style={{ background: "var(--pk-panel)", padding: "60px 24px", textAlign: "center" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <p className="kicker">The other India</p>
        <p
          data-other-india
          className="display"
          style={{
            fontSize: "clamp(1.6rem,3.6vw,2.5rem)",
            maxWidth: "24ch",
            margin: "10px auto 0",
            transition: "opacity .55s ease",
            minHeight: "2.6em",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: visible ? 1 : 0,
          }}
        >
          <span data-oi-inner>
            <em className="poetry" style={em}>
              {f[0]}
            </em>{" "}
            {f[1]}{" "}
            <em className="poetry" style={em}>
              {f[2]}
            </em>{" "}
            {f[3]}
          </span>
        </p>
      </div>
    </section>
  );
}
