"use client";

import { useScrollReveal } from "@/lib/hooks/useScrollReveal";

// Mounts the single page-wide scroll-reveal observer. Renders nothing — server
// components just add `className="reveal-target"` (+ optional `--i` stagger) and this
// flips them to `.revealed` as they enter view. Mounted once in app/(site)/layout.
export default function ScrollReveal() {
  useScrollReveal();
  return null;
}
