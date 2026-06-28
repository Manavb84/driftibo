// SERVER component — exports metadata + renders the client island.
// The three-view state (overview/itinerary) lives in DestinationClient.tsx ("use client").
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDestination, getDestinations } from "@/lib/content";
import DestinationClient from "./DestinationClient";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getDestinations()).map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dest = await getDestination(slug);
  if (!dest) return {};
  const image = dest.heroImageUrl ?? dest.portraitImageUrl ?? "/og.jpg";
  return {
    title: `${dest.name} · Destinations · Driftibo`,
    description: dest.lede,
    alternates: { canonical: `/destinations/${dest.slug}` },
    openGraph: {
      title: `${dest.name} · Driftibo`,
      description: dest.lede,
      images: [image],
      type: "website",
      url: `/destinations/${dest.slug}`,
    },
    twitter: { card: "summary_large_image", title: `${dest.name} · Driftibo`, description: dest.lede, images: [image] },
  };
}

// TouristDestination structured data for rich results.
function destinationJsonLd(dest: NonNullable<Awaited<ReturnType<typeof getDestination>>>) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: dest.name,
    description: dest.lede,
    ...(dest.heroImageUrl ? { image: dest.heroImageUrl } : {}),
    ...(dest.region ? { address: { "@type": "PostalAddress", addressRegion: dest.region, addressCountry: "IN" } } : {}),
    url: `https://driftibo.com/destinations/${dest.slug}`,
  };
}

function destinationBreadcrumb(dest: NonNullable<Awaited<ReturnType<typeof getDestination>>>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://driftibo.com" },
      { "@type": "ListItem", position: 2, name: "Destinations", item: "https://driftibo.com/destinations" },
      { "@type": "ListItem", position: 3, name: dest.name, item: `https://driftibo.com/destinations/${dest.slug}` },
    ],
  };
}

export default async function DestinationPage({ params }: Props) {
  const { slug } = await params;
  const dest = await getDestination(slug);
  if (!dest) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(destinationJsonLd(dest)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(destinationBreadcrumb(dest)) }}
      />
      <DestinationClient dest={dest} />
    </>
  );
}
