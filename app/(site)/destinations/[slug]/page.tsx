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
  const dest = await getDestination(slug);
  if (!dest) notFound();

  return <DestinationClient dest={dest} />;
}
