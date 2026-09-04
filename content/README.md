# Treści strony — jak dodawać

Strona **nie ma bazy danych**. Wszystko leży w tym folderze. Po wgraniu pliku wpis pojawia się sam.

## Ogłoszenia i aktualności

1. Napisz tekst w Wordzie (pogrubienia, śródtytuły, listy — zostaną zachowane).
2. Zapisz jako `.docx`.
3. Nazwij plik z datą na początku:

   `2026-08-30-ogloszenia-parafialne.docx`

4. Wgraj go:
   - w panelu `/admin`, albo
   - skopiuj do `content/aktualnosci/`.

Pierwszy nagłówek w dokumencie staje się tytułem na stronie. Zdjęcia wklejone do Worda są wyciągane automatycznie.

## Intencje mszalne

Tak samo, tylko folder `content/intencje/` (albo dział „Intencje” w panelu).

`2026-08-30-porzadek-intencji.docx`

## Galeria

Nowy album:

```
content/galeria/odpust-2026/
  album.yml
  01.jpg
  02.jpg
```

Przykład `album.yml`:

```yaml
title: Odpust 2026
date: "2026-08-10"
description: Uroczystość św. Wawrzyńca.
cover: 01.jpg
```

Zdjęcia: JPG, PNG, WEBP. Można też utworzyć album i wrzucić pliki w `/admin`.

Na **GitHub Pages** nie ma panelu `/admin` z wgrywaniem. Dodajesz pliki w git i po `git push` strona sama się przebudowuje.

## Dane stałe parafii

Msze, telefony, konto, grupy — plik `parafia.yml`.
Strony (historia, sakramenty, patron) — pliki Markdown w `strony/`.
