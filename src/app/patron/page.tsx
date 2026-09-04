import { HtmlContent } from "@/components/HtmlContent";
import { PageHero } from "@/components/PageHero";
import { getStaticPage } from "@/lib/pages";

export default async function PatronPage() {
  const page = await getStaticPage("patron");
  return (
    <>
      <PageHero kicker="10 sierpnia" title={page.title} lead={page.description} />
      <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 pb-16 md:grid-cols-[minmax(0,280px)_1fr]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/sw-wawrzyniec.jpg"
          alt="Ikona św. Wawrzyńca, diakona i męczennika, z palmą i kratą"
          className="w-full shadow-card"
        />
        <HtmlContent html={page.html} />
      </div>
    </>
  );
}
