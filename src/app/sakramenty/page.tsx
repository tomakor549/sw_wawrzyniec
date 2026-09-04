import { HtmlContent } from "@/components/HtmlContent";
import { PageHero } from "@/components/PageHero";
import { getStaticPage } from "@/lib/pages";
import { getParish } from "@/lib/parish";

export default async function SacramentsPage() {
  const [page, parish] = await Promise.all([getStaticPage("sakramenty"), getParish()]);
  return (
    <>
      <PageHero kicker="Duszpasterstwo" title={page.title} lead={page.description} />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-16 lg:grid-cols-3">
        <article className="lg:col-span-2">
          <HtmlContent html={page.html} />
        </article>
        <aside className="border border-sand/70 bg-cream/70 p-6">
          <h2 className="font-serif text-2xl text-wine">Kancelaria</h2>
          <ul className="mt-3 space-y-1 text-stone">
            {parish.office.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm">
            tel. {parish.contact.phone}
            <br />
            {parish.contact.email}
          </p>
        </aside>
      </div>
    </>
  );
}
