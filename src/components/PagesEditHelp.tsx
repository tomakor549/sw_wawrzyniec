export function PagesEditHelp() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <p className="text-xs uppercase tracking-[0.28em] text-gold-dim">GitHub Pages</p>
      <h1 className="mt-2 font-serif text-4xl text-wine">Jak dodać ogłoszenia i zdjęcia</h1>
      <p className="mt-4 text-lg text-stone">
        Ta kopia strony jest statyczna. Nie ma panelu wgrywania — treści trafiają do repozytorium, a GitHub sam
        przebudowuje witrynę.
      </p>
      <ol className="prose-liturgy mt-8 list-decimal pl-5">
        <li>
          Ogłoszenia: plik Word <code>RRRR-MM-DD-tytul.docx</code> do folderu <code>content/aktualnosci/</code>.
        </li>
        <li>
          Intencje: analogicznie do <code>content/intencje/</code>.
        </li>
        <li>
          Galeria: nowy folder <code>content/galeria/nazwa-albumu/</code> ze zdjęciami i plikiem{" "}
          <code>album.yml</code>.
        </li>
        <li>
          Zrób commit i <code>git push</code>. Po 1–2 minutach strona na GitHub Pages się odświeży.
        </li>
      </ol>
      <p className="mt-8 text-stone">
        Szczegóły: plik <code>content/README.md</code> w repozytorium. Panel z wgrywaniem plików działa przy
        hostingu Docker/Node (<code>docker compose up</code>).
      </p>
    </div>
  );
}
