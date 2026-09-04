import Link from "next/link";
import { MassTimes } from "@/components/MassTimes";
import { NewsCard } from "@/components/NewsCard";
import { listArticles, latestArticle } from "@/lib/articles";
import { listAlbums } from "@/lib/gallery";
import { getParish } from "@/lib/parish";
import { formatPlDate } from "@/lib/slug";
import { HtmlContent } from "@/components/HtmlContent";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [parish, news, intentions, latestNews, latestIntentions, albums] = await Promise.all([
    getParish(),
    listArticles("aktualnosci"),
    listArticles("intencje"),
    latestArticle("aktualnosci"),
    latestArticle("intencje"),
    listAlbums(),
  ]);
  const cover = albums[0]?.cover
    ? `/api/media/galeria/${albums[0].slug}/${albums[0].cover}`
    : "/images/parafia.jpg";

  return (
    <>
      <section className="relative min-h-[78vh] overflow-hidden bg-wine-deep text-cream">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/parafia.jpg"
          alt="Kościół pw. św. Wawrzyńca na Wilchwach w budowie, z tęczą nad dachem"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-wine-deep via-wine-deep/55 to-wine/20" />
        <div className="relative mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-end px-4 pb-16 pt-28">
          <p className="text-xs uppercase tracking-[0.32em] text-gold-pale">
            {parish.diocese} · odpust {parish.feastDay}
          </p>
          <h1 className="mt-3 max-w-3xl font-serif text-5xl leading-tight md:text-7xl">{parish.name}</h1>
          <p className="mt-5 max-w-xl font-serif text-2xl italic text-gold-pale">„{parish.motto}”</p>
          <p className="mt-4 max-w-xl text-cream/85">
            Rzymskokatolicka parafia na Wilchwach. Msze, ogłoszenia i intencje — zawsze aktualne, prosto z kancelarii.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/aktualnosci" className="bg-gold px-5 py-3 text-sm font-semibold text-ink hover:bg-gold-pale">
              Ogłoszenia parafialne
            </Link>
            <Link href="/intencje" className="border border-cream/40 px-5 py-3 text-sm text-cream hover:bg-white/10">
              Intencje mszalne
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          {latestNews ? (
            <section className="border border-sand/70 bg-white/80 p-6 shadow-card md:p-8">
              <p className="text-xs uppercase tracking-[0.28em] text-gold-dim">
                {formatPlDate(latestNews.date)}
              </p>
              <h2 className="mt-2 font-serif text-3xl text-wine">{latestNews.title}</h2>
              <div className="mt-6 max-h-[28rem] overflow-hidden">
                <HtmlContent html={latestNews.html} />
              </div>
              <Link
                href={`/aktualnosci/${latestNews.slug}`}
                className="mt-6 inline-block text-sm font-medium text-brick underline decoration-gold underline-offset-4"
              >
                Całe ogłoszenia
              </Link>
            </section>
          ) : (
            <section className="border border-dashed border-sand p-8 text-stone">
              Brak ogłoszeń. Wgraj plik DOCX w panelu administracyjnym albo do folderu{" "}
              <code>content/aktualnosci</code>.
            </section>
          )}
        </div>
        <div className="space-y-8">
          <MassTimes parish={parish} />
          {latestIntentions ? (
            <section className="border border-sand/70 bg-cream/60 p-6">
              <p className="text-xs uppercase tracking-[0.28em] text-gold-dim">Ten tydzień</p>
              <h2 className="mt-2 font-serif text-2xl text-wine">Intencje mszalne</h2>
              <p className="mt-3 text-stone">{latestIntentions.excerpt}</p>
              <Link
                href={`/intencje/${latestIntentions.slug}`}
                className="mt-4 inline-block text-sm font-medium text-brick underline decoration-gold underline-offset-4"
              >
                Pełny porządek
              </Link>
            </section>
          ) : null}
        </div>
      </div>

      <section className="bg-wine text-cream">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-gold-pale">{parish.construction.title}</p>
            <h2 className="mt-2 font-serif text-4xl">Świątynia rośnie dzięki ofiarom parafian</h2>
            <p className="mt-4 text-cream/85">{parish.construction.summary}</p>
            {parish.contact.bankAccount ? (
              <p className="mt-6 font-mono text-gold-pale">{parish.contact.bankAccount}</p>
            ) : null}
            <p className="mt-2 text-sm text-cream/70">{parish.construction.accountNote}</p>
            <Link href="/budowa" className="mt-6 inline-block bg-gold px-5 py-3 text-sm font-semibold text-ink">
              Zobacz postęp budowy
            </Link>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cover} alt="Postęp budowy kościoła" className="h-80 w-full object-cover" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-gold-dim">Wspólnota</p>
            <h2 className="mt-2 font-serif text-4xl text-wine">Grupy parafialne</h2>
          </div>
          <Link href="/o-parafii" className="hidden text-sm text-brick underline decoration-gold underline-offset-4 sm:inline">
            Historia parafii
          </Link>
        </div>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {parish.groups.map((group) => (
            <li key={group.name} className="border border-sand/70 bg-white/70 p-5">
              <h3 className="font-serif text-2xl text-wine">{group.name}</h3>
              <p className="mt-2 text-stone">{group.description}</p>
              {group.meeting ? <p className="mt-3 text-sm text-gold-dim">{group.meeting}</p> : null}
            </li>
          ))}
        </ul>
      </section>

      {news.length > 1 || intentions.length > 0 ? (
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <h2 className="font-serif text-4xl text-wine">Ostatnie wpisy</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {news.slice(0, 2).map((article) => (
              <NewsCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
