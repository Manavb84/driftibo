// SERVER component — exports metadata + renders the client island.
// The three-view state (overview/itinerary) lives in DestinationClient.tsx ("use client").
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import destinations, { getDestination } from "@/lib/data/destinations";
import DestinationClient from "./DestinationClient";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dest = getDestination(slug);
  if (!dest) return {};
  return {
    title: `${dest.name} · Destinations · Driftibo`,
    description: dest.lede,
    openGraph: {
      title: `${dest.name} · Driftibo`,
      description: dest.lede,
    },
  };
}

export default async function DestinationPage({ params }: Props) {
  const { slug } = await params;
  const dest = getDestination(slug);
  if (!dest) notFound();

  return <DestinationClient dest={dest} />;
}
