import type { Metadata } from "next";
import GoClient from "./GoClient";
import { getDestinations, getArticles } from "@/lib/content";

export const metadata: Metadata = {
  title: "@driftibo · Start here",
};

export default async function Page() {
  const [destinations, articles] = await Promise.all([getDestinations(), getArticles()]);
  return <GoClient destinations={destinations} articles={articles} />;
}
