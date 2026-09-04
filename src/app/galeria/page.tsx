import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { listAlbums } from "@/lib/gallery";
import { contentMediaUrl, withBasePath } from "@/lib/media";
import { formatPlDate } from "@/lib/slug";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const albums = await listAlbums();
  return (
    <>
      <PageHero
        kicker="Zdjęcia"
        title="Galeria"
        lead="Nowy album to zwykły folder ze zdjęciami. Można go też utworzyć w panelu i wrzucić pliki z telefonu."
      />
      <div className="mx-auto max-w-6xl px-4 pb-16">
        {albums.length === 0 ? (
          <p className="text-stone">Brak albumów. Utwórz folder w content/galeria.</p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2">
            {albums.map((album) => {
              const cover = album.cover
                ? contentMediaUrl("galeria", album.slug, album.cover)
                : withBasePath("/images/parafia.jpg");
              return (
                <li key={album.slug}>
                  <Link href={`/galeria/${album.slug}`} className="group block overflow-hidden bg-white shadow-card">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={cover} alt="" className="aspect-[16/10] w-full object-cover transition duration-300 group-hover:scale-[1.03]" />
                    <div className="p-5">
                      <p className="text-xs uppercase tracking-[0.2em] text-gold-dim">{formatPlDate(album.date)}</p>
                      <h2 className="mt-2 font-serif text-2xl text-wine">{album.title}</h2>
                      {album.description ? <p className="mt-2 text-stone">{album.description}</p> : null}
                      <p className="mt-3 text-sm text-brick">{album.images.length} zdjęć</p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}
