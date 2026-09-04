import { HtmlContent } from "@/components/HtmlContent";
import { PageHero } from "@/components/PageHero";
import { getStaticPage } from "@/lib/pages";

export default async function StandardsPage() {
  const page = await getStaticPage("standardy");
  return (
    <>
      <PageHero kicker="Prewencja" title={page.title} lead={page.description} />
      <article className="mx-auto max-w-3xl px-4 pb-16">
        <HtmlContent html={page.html} />
      </article>
    </>
  );
}
