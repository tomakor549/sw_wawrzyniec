import type { MetadataRoute } from "next";
import { listArticles } from "@/lib/articles";
import { listAlbums } from "@/lib/gallery";
import { siteUrl } from "@/lib/parish";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [news, intentions, albums] = await Promise.all([
    listArticles("aktualnosci"),
    listArticles("intencje"),
    listAlbums(),
  ]);
  const staticPaths = [
    "",
    "/aktualnosci",
    "/intencje",
    "/galeria",
    "/o-parafii",
    "/patron",
    "/sakramenty",
    "/budowa",
    "/kontakt",
    "/standardy",
    "/malzenstwo",
    "/prywatnosc",
  ];
  return [
    ...staticPaths.map((path) => ({ url: `${siteUrl}${path}`, changeFrequency: "weekly" as const })),
    ...news.map((item) => ({ url: `${siteUrl}/aktualnosci/${item.slug}`, changeFrequency: "weekly" as const })),
    ...intentions.map((item) => ({ url: `${siteUrl}/intencje/${item.slug}`, changeFrequency: "weekly" as const })),
    ...albums.map((item) => ({ url: `${siteUrl}/galeria/${item.slug}`, changeFrequency: "monthly" as const })),
  ];
}
