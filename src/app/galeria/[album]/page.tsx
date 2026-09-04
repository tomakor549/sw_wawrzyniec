import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Lightbox } from "@/components/Lightbox";
import { PageHero } from "@/components/PageHero";
import { getAlbum } from "@/lib/gallery";
import { formatPlDate } from "@/lib/slug";

export const dynamic = "force-dynamic";

type Params = { album: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { album: slug } = await params;
  const album = await getAlbum(slug);
  if (!album) return { title: "Nie znaleziono" };
  return { title: album.title, description: album.description };
}

export default async function AlbumPage({ params }: { params: Promise<Params> }) {
  const { album: slug } = await params;
  const album = await getAlbum(slug);
  if (!album) notFound();
  return (
    <>
      <PageHero kicker={formatPlDate(album.date)} title={album.title} lead={album.description} />
      <div className="mx-auto max-w-6xl px-4 pb-16">
        <Lightbox images={album.images} />
      </div>
    </>
  );
}
