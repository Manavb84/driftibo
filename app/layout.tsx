import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Analytics from "@/components/Analytics";

// Fraunces — variable, optical-size axis, normal + italic (replaces the blocking @import).
const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-display",
});

// Plus Jakarta Sans — variable, full 400–800 range used across UI.
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ui",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://driftibo.com"),
  title: "Driftibo · Travel by your own star",
  description:
    "Stop choosing. Start packing. Surprise travel, hand-planned: you set the limits, your star picks a real place, and we close it on WhatsApp. Seven taps, no destination choice — India's hidden corners and visa-easy escapes beyond.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Driftibo · Travel by your own star",
    description:
      "The best trips aren't planned. They're sent. Seven taps — terrain, vibe, budget — and your star draws a real place to go.",
    images: ["/og.jpg"],
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // `persona-mil` is now static (the generational customization was removed) — it
  // drives the "Refined" look: --persona-* vars, accent, scale, and the .cm copy.
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Driftibo",
    url: "https://driftibo.com",
    logo: "https://driftibo.com/favicon.svg",
    description:
      "Driftibo plans surprise trips to real places — India's hidden corners and easy escapes abroad — and closes them on WhatsApp. You set the limits; your star picks.",
    sameAs: ["https://instagram.com/driftibo"],
  };
  return (
    <html lang="en-IN" className={`persona-mil ${fraunces.variable} ${jakarta.variable}`}>
      <body className="grain">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <Analytics />
        {children}
      </body>
    </html>
  );
}
