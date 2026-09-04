"use client";

import { useCallback, useEffect, useState } from "react";
import type { GalleryImage } from "@/types/content";

export function Lightbox({ images }: { images: GalleryImage[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const close = useCallback(() => setIndex(null), []);
  const prev = useCallback(() => {
    setIndex((current) => (current === null ? current : (current + images.length - 1) % images.length));
  }, [images.length]);
  const next = useCallback(() => {
    setIndex((current) => (current === null ? current : (current + 1) % images.length));
  }, [images.length]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") prev();
      if (event.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, close, prev, next]);

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {images.map((image, i) => (
          <li key={image.src}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="block w-full overflow-hidden bg-cream"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.src}
                alt={image.alt}
                className="aspect-[4/3] h-full w-full object-cover transition duration-300 hover:scale-[1.03]"
              />
            </button>
          </li>
        ))}
      </ul>
      {index !== null ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Podgląd zdjęcia"
          onClick={close}
        >
          <button
            type="button"
            className="absolute right-4 top-4 h-11 px-4 text-cream"
            onClick={close}
          >
            Zamknij
          </button>
          <button type="button" className="absolute left-2 h-11 px-3 text-cream md:left-6" onClick={(e) => { e.stopPropagation(); prev(); }}>
            ←
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[index].src}
            alt={images[index].alt}
            className="max-h-[88vh] max-w-[92vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button type="button" className="absolute right-2 h-11 px-3 text-cream md:right-6" onClick={(e) => { e.stopPropagation(); next(); }}>
            →
          </button>
        </div>
      ) : null}
    </>
  );
}
