import type { MetadataRoute } from "next";
import { listArticles } from "@/lib/articles";
import { listAlbums } from "@/lib/gallery";
import { siteUrl } from "@/lib/parish";

export const dynamic = "force-static";

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
  const slash = process.env.GITHUB_PAGES === "true" ? "/" : "";
  const loc = (path: string) => (path ? `${siteUrl}${path}${slash}` : `${siteUrl}${slash || "/"}`);
  return [
    ...staticPaths.map((path) => ({ url: loc(path), changeFrequency: "weekly" as const })),
    ...news.map((item) => ({ url: loc(`/aktualnosci/${item.slug}`), changeFrequency: "weekly" as const })),
    ...intentions.map((item) => ({ url: loc(`/intencje/${item.slug}`), changeFrequency: "weekly" as const })),
    ...albums.map((item) => ({ url: loc(`/galeria/${item.slug}`), changeFrequency: "monthly" as const })),
  ];
}
