import { NewsCard } from "@/components/NewsCard";
import { PageHero } from "@/components/PageHero";
import { listArticles } from "@/lib/articles";

export const dynamic = "force-dynamic";

export default async function IntentionsListPage() {
  const articles = await listArticles("intencje");
  return (
    <>
      <PageHero
        kicker="Liturgia"
        title="Porządek intencji mszalnych"
        lead="Cotygodniowy porządek Mszy i intencji — wgrywany z dokumentu Word, bez ręcznego przepisywania na stronę."
      />
      <div className="mx-auto max-w-6xl px-4 pb-16">
        {articles.length === 0 ? (
          <p className="text-stone">Brak intencji. Dodaj plik .docx do folderu content/intencje.</p>
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
