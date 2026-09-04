"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { Album, ArticleMeta } from "@/types/content";

type Props = {
  news: ArticleMeta[];
  intentions: ArticleMeta[];
  albums: Album[];
};

export function AdminPanel({ news, intentions, albums }: Props) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const albumOptions = useMemo(() => albums, [albums]);

  async function onNews(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setBusy(true);
    setMessage(null);
    const res = await fetch("/api/admin/news", { method: "POST", body: data });
    const json = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setMessage(json.error ?? "Nie udało się wgrać pliku");
      return;
    }
    form.reset();
    setMessage("Wgrano dokument.");
    router.refresh();
  }

  async function onAlbum(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    data.set("action", "create");
    setBusy(true);
    const res = await fetch("/api/admin/gallery", { method: "POST", body: data });
    const json = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setMessage(json.error ?? "Nie udało się utworzyć albumu");
      return;
    }
    form.reset();
    setMessage("Utworzono album. Możesz dodać zdjęcia poniżej.");
    router.refresh();
  }

  async function onPhotos(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    data.set("action", "upload");
    setBusy(true);
    const res = await fetch("/api/admin/gallery", { method: "POST", body: data });
    const json = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setMessage(json.error ?? "Nie udało się wgrać zdjęć");
      return;
    }
    form.reset();
    setMessage("Dodano zdjęcia do albumu.");
    router.refresh();
  }

  async function removeNews(kind: string, filename: string) {
    if (!confirm("Usunąć ten dokument ze strony?")) return;
    await fetch("/api/admin/news", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, filename }),
    });
    setMessage("Usunięto dokument.");
    router.refresh();
  }

  return (
    <div className="space-y-12">
      {message ? <p className="border border-gold/40 bg-cream px-4 py-3">{message}</p> : null}

      <section className="border border-sand/70 bg-white/80 p-6">
        <h2 className="font-serif text-3xl text-wine">Aktualności z Worda</h2>
        <p className="mt-2 text-stone">
          Zapisujesz ogłoszenia albo intencje w Wordzie i wgrywasz plik <strong>.docx</strong>.
          Najlepsza nazwa: <code>2026-08-30-ogloszenia.docx</code> — data z nazwy staje się datą wpisu.
        </p>
        <form onSubmit={onNews} className="mt-6 grid gap-4 md:grid-cols-[1fr_auto_auto] md:items-end">
          <label className="block text-sm">
            Plik DOCX
            <input type="file" name="file" accept=".docx" required className="mt-1 block w-full" />
          </label>
          <label className="block text-sm">
            Dział
            <select name="kind" className="mt-1 block w-full border border-sand bg-white px-3 py-2">
              <option value="aktualnosci">Ogłoszenia / aktualności</option>
              <option value="intencje">Intencje mszalne</option>
            </select>
          </label>
          <button disabled={busy} className="bg-wine px-5 py-3 text-cream disabled:opacity-60">
            Opublikuj
          </button>
        </form>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <DocList title="Ogłoszenia" items={news} kind="aktualnosci" onRemove={removeNews} />
          <DocList title="Intencje" items={intentions} kind="intencje" onRemove={removeNews} />
        </div>
      </section>

      <section className="border border-sand/70 bg-white/80 p-6">
        <h2 className="font-serif text-3xl text-wine">Galeria</h2>
        <p className="mt-2 text-stone">Najpierw utwórz album, potem wrzuć zdjęcia. Możesz też skopiować folder do content/galeria.</p>
        <form onSubmit={onAlbum} className="mt-6 grid gap-4 md:grid-cols-3">
          <label className="block text-sm md:col-span-2">
            Nazwa albumu
            <input name="title" required className="mt-1 w-full border border-sand px-3 py-2" placeholder="Odpust 2026" />
          </label>
          <label className="block text-sm">
            Data
            <input type="date" name="date" className="mt-1 w-full border border-sand px-3 py-2" />
          </label>
          <label className="block text-sm md:col-span-3">
            Opis
            <input name="description" className="mt-1 w-full border border-sand px-3 py-2" />
          </label>
          <button disabled={busy} className="bg-wine px-5 py-3 text-cream">
            Utwórz album
          </button>
        </form>

        <form onSubmit={onPhotos} className="mt-8 grid gap-4 md:grid-cols-[1fr_2fr_auto] md:items-end">
          <label className="block text-sm">
            Album
            <select name="slug" required className="mt-1 w-full border border-sand bg-white px-3 py-2">
              {albumOptions.map((album) => (
                <option key={album.slug} value={album.slug}>
                  {album.title}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            Zdjęcia
            <input type="file" name="files" accept="image/*" multiple required className="mt-1 block w-full" />
          </label>
          <button disabled={busy} className="bg-brick px-5 py-3 text-cream">
            Dodaj zdjęcia
          </button>
        </form>

        <ul className="mt-8 space-y-3">
          {albums.map((album) => (
            <li key={album.slug} className="border-t border-sand/50 pt-3 text-sm">
              <strong>{album.title}</strong> — {album.images.length} zdjęć
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function DocList({
  title,
  items,
  kind,
  onRemove,
}: {
  title: string;
  items: ArticleMeta[];
  kind: string;
  onRemove: (kind: string, filename: string) => void;
}) {
  return (
    <div>
      <h3 className="font-serif text-xl text-wine">{title}</h3>
      <ul className="mt-3 space-y-2">
        {items.length === 0 ? <li className="text-stone">Brak wpisów.</li> : null}
        {items.map((item) => (
          <li key={item.filename} className="flex items-start justify-between gap-3">
            <span>
              {item.date} — {item.title}
            </span>
            <button type="button" className="text-brick underline" onClick={() => onRemove(kind, item.filename)}>
              Usuń
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
