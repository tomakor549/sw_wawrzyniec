import Link from "next/link";
import type { ArticleMeta } from "@/types/content";
import { formatPlDate } from "@/lib/slug";

export function NewsCard({ article }: { article: ArticleMeta }) {
  const href =
    article.kind === "intencje" ? `/intencje/${article.slug}` : `/aktualnosci/${article.slug}`;
  return (
    <article className="group flex h-full flex-col border border-sand/70 bg-white/70 p-6 shadow-card">
      <time className="text-xs uppercase tracking-[0.2em] text-gold-dim" dateTime={article.date}>
        {formatPlDate(article.date)}
      </time>
      <h3 className="mt-3 font-serif text-2xl text-wine group-hover:text-brick">
        <Link href={href}>{article.title}</Link>
      </h3>
      <p className="mt-3 flex-1 text-stone">{article.excerpt}</p>
      <Link href={href} className="mt-5 text-sm font-medium text-brick underline decoration-gold underline-offset-4">
        Czytaj dalej
      </Link>
    </article>
  );
}
