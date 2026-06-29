"use client";

import { useEffect } from "react";

// One IntersectionObserver for the whole page: any element with class `.reveal-target`
// gets `.revealed` when it scrolls into view (CSS does the fade/slide + --i stagger).
// A MutationObserver re-scans for elements added later (route changes, client islands).
// ponytail: one observer over a class selector beats a hook-per-component or a library.
export function useScrollReveal() {
  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;

    // Reduced motion → reveal everything immediately, no observer.
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll(".reveal-target").forEach((el) => el.classList.add("revealed"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("revealed");
            io.unobserve(e.target); // reveal once
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    const scan = () => {
      document.querySelectorAll(".reveal-target:not(.revealed)").forEach((el) => io.observe(el));
    };
    scan();

    // Catch elements rendered after mount (client islands, navigations).
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
}
