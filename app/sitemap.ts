import type { MetadataRoute } from "next";
import { getArticles, getPackages } from "@/lib/content";
import { allPlaces } from "@/lib/catalog";

const BASE = "https://driftibo.com";

// Static, publicly-indexable routes (admin/api excluded via robots.ts).
const STATIC_PATHS = [
  "", "/start", "/play", "/game", "/quiz", "/dream", "/starbook",
  "/destinations", "/destinations/calendar",
  "/packages", "/offerings", "/journal", "/about", "/legal", "/go",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, packages] = await Promise.all([getArticles(), getPackages()]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((p) => ({
    url: `${BASE}${p}`,
    changeFrequency: p === "" ? "weekly" : "monthly",
    priority: p === "" ? 1 : 0.7,
  }));

  // All 83 catalogue detail pages (includes the 5 bookable).
  const destEntries: MetadataRoute.Sitemap = allPlaces().map((p) => ({
    url: `${BASE}/destinations/${p.slug}`,
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
