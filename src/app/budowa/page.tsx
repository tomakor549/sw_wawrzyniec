import Link from "next/link";
import { Lightbox } from "@/components/Lightbox";
import { PageHero } from "@/components/PageHero";
import { getAlbum } from "@/lib/gallery";
import { getParish } from "@/lib/parish";

export const dynamic = "force-dynamic";

export default async function ConstructionPage() {
  const [parish, album] = await Promise.all([getParish(), getAlbum("budowa-kosciola")]);
  return (
    <>
      <PageHero kicker="Inwestycja" title={parish.construction.title} lead={parish.construction.summary} />
      <div className="mx-auto max-w-6xl px-4 pb-16">
        <div className="mb-10 border border-gold/40 bg-cream/80 p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-gold-dim">Wesprzyj budowę</p>
          <p className="mt-2 font-mono text-lg text-wine">{parish.contact.bankAccount}</p>
          <p className="mt-1 text-stone">{parish.construction.accountNote}</p>
        </div>
        {album ? (
          <Lightbox images={album.images} />
        ) : (
          <p className="text-stone">
            Album budowy pojawi się, gdy w <code>content/galeria/budowa-kosciola</code> znajdą się zdjęcia.{" "}
            <Link href="/galeria" className="text-brick underline">
              Przejdź do galerii
            </Link>
          </p>
        )}
      </div>
    </>
  );
}
