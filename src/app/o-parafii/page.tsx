import Link from "next/link";
import { HtmlContent } from "@/components/HtmlContent";
import { PageHero } from "@/components/PageHero";
import { getStaticPage } from "@/lib/pages";
import { getParish } from "@/lib/parish";

export default async function AboutPage() {
  const [page, parish] = await Promise.all([getStaticPage("historia"), getParish()]);
  return (
    <>
      <PageHero kicker="Wilchwy" title={page.title} lead={page.description} />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-16 lg:grid-cols-3">
        <article className="lg:col-span-2">
          <HtmlContent html={page.html} />
        </article>
        <aside className="space-y-6">
          <div className="border border-sand/70 bg-white/70 p-6">
            <h2 className="font-serif text-2xl text-wine">W skrócie</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-stone">Erygowana</dt>
                <dd className="font-medium">{parish.erected}</dd>
              </div>
              <div>
                <dt className="text-stone">Patron</dt>
                <dd className="font-medium">{parish.patron}</dd>
              </div>
              <div>
                <dt className="text-stone">Odpust</dt>
                <dd className="font-medium">{parish.feastDay}</dd>
              </div>
              <div>
                <dt className="text-stone">Diecezja</dt>
                <dd className="font-medium">{parish.diocese}</dd>
              </div>
            </dl>
          </div>
          <nav className="flex flex-col gap-2 text-brick">
            <Link href="/patron" className="underline decoration-gold underline-offset-4">
              Święty Wawrzyniec
            </Link>
            <Link href="/budowa" className="underline decoration-gold underline-offset-4">
              Budowa kościoła
            </Link>
            <Link href="/sakramenty" className="underline decoration-gold underline-offset-4">
              Sakramenty
            </Link>
            <Link href="/galeria" className="underline decoration-gold underline-offset-4">
              Galeria
            </Link>
          </nav>
        </aside>
      </div>
    </>
  );
}
