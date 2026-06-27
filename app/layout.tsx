import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { PersonaProvider } from "@/components/PersonaProvider";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

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
    "Driftibo sends you to real Indian places that look like abroad — six taps, no destination choice. Chopta = mini-Switzerland. Spiti = Iceland. Zero visa.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Driftibo · Travel by your own star",
    description:
      "The best trips aren't planned. They're sent. Six taps — terrain, vibe, budget — and your star draws a real Indian place.",
    images: ["/og.jpg"],
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

// Set the persona class on <html> before first paint so type-scale, accent, and
// copy don't flash the default. Mirrors PersonaProvider's mount logic (default 'mil').
const noFoucScript = `(function(){try{var p=localStorage.getItem('driftibo-persona');document.documentElement.classList.add('persona-'+(p==='genz'||p==='mil'||p==='classic'?p:'mil'))}catch(e){document.documentElement.classList.add('persona-mil')}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN" className={`${fraunces.variable} ${jakarta.variable}`} suppressHydrationWarning>
      <body className="grain">
        <script dangerouslySetInnerHTML={{ __html: noFoucScript }} />
        <PersonaProvider>
          <SiteNav />
          {children}
          <SiteFooter />
        </PersonaProvider>
      </body>
    </html>
  );
}
