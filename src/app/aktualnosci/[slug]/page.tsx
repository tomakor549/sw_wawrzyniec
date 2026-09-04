import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HtmlContent } from "@/components/HtmlContent";
import { PageHero } from "@/components/PageHero";
import { getArticleBySlug, listArticles } from "@/lib/articles";
import { formatPlDate } from "@/lib/slug";

export const dynamic = "force-dynamic";

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug("aktualnosci", slug);
  if (!article) return { title: "Nie znaleziono" };
  return { title: article.title, description: article.excerpt };
}

export default async function NewsArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const article = await getArticleBySlug("aktualnosci", slug);
  if (!article) notFound();
  const others = (await listArticles("aktualnosci")).filter((item) => item.slug !== slug).slice(0, 3);

  return (
    <>
      <PageHero kicker={formatPlDate(article.date)} title={article.title} />
      <article className="mx-auto max-w-3xl px-4 pb-16">
        <HtmlContent html={article.html} />
      </article>
      {others.length > 0 ? (
        <aside className="mx-auto max-w-3xl px-4 pb-16 text-stone">
          <p className="text-xs uppercase tracking-[0.2em] text-gold-dim">Wcześniejsze ogłoszenia</p>
          <ul className="mt-3 space-y-2">
            {others.map((item) => (
              <li key={item.slug}>
                <a className="text-brick underline decoration-gold underline-offset-4" href={`/aktualnosci/${item.slug}`}>
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </aside>
      ) : null}
    </>
  );
}
