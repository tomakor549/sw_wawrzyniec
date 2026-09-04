import { redirect } from "next/navigation";
import { AdminPanel } from "@/components/AdminPanel";
import { PageHero } from "@/components/PageHero";
import { listArticles } from "@/lib/articles";
import { isAdmin } from "@/lib/auth";
import { listAlbums } from "@/lib/gallery";

export default async function NodeAdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const [news, intentions, albums] = await Promise.all([
    listArticles("aktualnosci"),
    listArticles("intencje"),
    listAlbums(),
  ]);
  return (
    <>
      <PageHero
        kicker="Redakcja"
        title="Dodawanie treści"
        lead="Ogłoszenia z Worda, intencje z Worda, zdjęcia do albumów. Bez bazy danych."
      />
      <div className="mx-auto max-w-6xl px-4 pb-16">
        <form action="/api/admin/logout" method="post" className="mb-8">
          <button className="text-sm text-brick underline decoration-gold underline-offset-4">Wyloguj</button>
        </form>
        <AdminPanel news={news} intentions={intentions} albums={albums} />
      </div>
    </>
  );
}
