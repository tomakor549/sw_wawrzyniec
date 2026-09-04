import { NewsCard } from "@/components/NewsCard";
import { PageHero } from "@/components/PageHero";
import { listArticles } from "@/lib/articles";

export const dynamic = "force-dynamic";

export default async function NewsListPage() {
  const articles = await listArticles("aktualnosci");
  return (
    <>
      <PageHero
        kicker="Z życia parafii"
        title="Aktualności i ogłoszenia"
        lead="Ogłoszenia niedzielne wgrywane są z pliku Worda — tak, jak redaguje je kancelaria."
      />
      <div className="mx-auto max-w-6xl px-4 pb-16">
        {articles.length === 0 ? (
          <p className="text-stone">Brak ogłoszeń. Dodaj plik .docx do folderu content/aktualnosci albo przez panel.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {articles.map((article) => (
              <NewsCard key={article.filename} article={article} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
