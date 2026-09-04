import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HtmlContent } from "@/components/HtmlContent";
import { PageHero } from "@/components/PageHero";
import { getArticleBySlug } from "@/lib/articles";
import { formatPlDate } from "@/lib/slug";

export const dynamic = "force-dynamic";

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug("intencje", slug);
  if (!article) return { title: "Nie znaleziono" };
  return { title: article.title, description: article.excerpt };
}

export default async function IntentionPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const article = await getArticleBySlug("intencje", slug);
  if (!article) notFound();
  return (
    <>
      <PageHero kicker={formatPlDate(article.date)} title={article.title} />
      <article className="mx-auto max-w-3xl px-4 pb-16">
        <HtmlContent html={article.html} />
      </article>
    </>
  );
}
