import type { MetadataRoute } from "next";
import { getDestinations, getArticles, getPackages } from "@/lib/content";

const BASE = "https://driftibo.com";

// Static, publicly-indexable routes (admin/api excluded via robots.ts).
const STATIC_PATHS = [
  "", "/play", "/game", "/quiz", "/dream", "/starbook",
  "/destinations", "/packages", "/offerings", "/journal", "/about", "/legal", "/go",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [destinations, articles, packages] = await Promise.all([
    getDestinations(),
    getArticles(),
    getPackages(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((p) => ({
    url: `${BASE}${p}`,
    changeFrequency: p === "" ? "weekly" : "monthly",
    priority: p === "" ? 1 : 0.7,
  }));

  const destEntries: MetadataRoute.Sitemap = destinations.map((d) => ({
    url: `${BASE}/destinations/${d.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const articleEntries: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${BASE}/journal/${a.slug}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const packageEntries: MetadataRoute.Sitemap = packages.map((p) => ({
    url: `${BASE}/packages/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...destEntries, ...articleEntries, ...packageEntries];
}
