// SERVER component — info-first detail page for ALL 83 catalogue places.
// Pricing/inclusions were removed from Explore; the 5 bookable places link out to
// their /packages/<slug>. Catalogue data is the source of truth; for the 5 bookable
// we merge the Supabase hero image when it exists.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getPlace,
  allPlaces,
  images,
  bookableSlugs,
  DEST_TO_PACKAGE,
  CATALOG_LABEL,
} from "@/lib/catalog";
import { getDestination } from "@/lib/content";
import DestinationView from "./DestinationClient";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return allPlaces().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const place = getPlace(slug);
  if (!place) return {};
  const image = images(slug, place.catalog)[0];
  const title = `${place.name} · ${CATALOG_LABEL[place.catalog]} · Driftibo`;
  return {
    title,
    description: place.pitch,
    alternates: { canonical: `/destinations/${place.slug}` },
    openGraph: {
      title: `${place.name} · Driftibo`,
      description: place.pitch,
      images: [image],
      type: "website",
      url: `/destinations/${place.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${place.name} · Driftibo`,
      description: place.pitch,
      images: [image],
    },
  };
}

export default async function DestinationPage({ params }: Props) {
  const { slug } = await params;
  const place = getPlace(slug);
  if (!place) notFound();

  const bookable = bookableSlugs.has(slug);
  // Merge Supabase hero image for the 5 bookable; everyone else uses landmark photo 1.
  const sup = bookable ? await getDestination(slug) : null;
  const imgs = images(slug, place.catalog);
  const heroImageUrl = sup?.heroImageUrl ?? imgs[0];
  const packageSlug = bookable ? DEST_TO_PACKAGE[slug] ?? null : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: place.name,
    description: place.pitch,
    image: heroImageUrl,
    address: { "@type": "PostalAddress", addressRegion: place.region },
    url: `https://driftibo.com/destinations/${place.slug}`,
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://driftibo.com" },
      { "@type": "ListItem", position: 2, name: "Explore", item: "https://driftibo.com/destinations" },
      {
        "@type": "ListItem",
        position: 3,
        name: place.name,
        item: `https://driftibo.com/destinations/${place.slug}`,
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <DestinationView
        place={place}
        images={imgs}
        heroImageUrl={heroImageUrl}
        packageSlug={packageSlug}
      />
    </>
  );
}
