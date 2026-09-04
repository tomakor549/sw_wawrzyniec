# Parafia św. Wawrzyńca · Wilchwy

Nowa strona parafii w Wodzisławiu Śląskim. Zastępuje starą witrynę WordPress pod adresem [sw-wawrzyniec.com.pl](http://sw-wawrzyniec.com.pl/).

Treści redaguje się **plikami**, bez bazy danych i bez panelu WordPress:

- ogłoszenia i intencje — z dokumentu **Word (.docx)**
- galeria — foldery ze zdjęciami
- dane stałe (msze, telefon, konto) — jeden plik YAML

## Uruchomienie

Wymagany Node.js 20+.

```bash
cp .env.example .env.local
# ustaw ADMIN_PASSWORD i ADMIN_SECRET

pnpm install
python3 scripts/make_docx.py   # przykładowe ogłoszenia i intencje
pnpm dev
```

Strona: <http://localhost:3000>  
Panel: <http://localhost:3000/admin>

```bash
pnpm test
pnpm build
pnpm start
```

Docker:

```bash
docker compose up --build
```

Folder `content/` jest montowany jako wolumen — wgrane ogłoszenia i zdjęcia zostają.

## Jak dodawać treści

Pełna instrukcja: [`content/README.md`](content/README.md).

Skrót:

1. **Ogłoszenia** — zapisz Worda jako `2026-09-06-ogloszenia.docx` i wgraj w `/admin` albo skopiuj do `content/aktualnosci/`.
2. **Intencje** — analogicznie do `content/intencje/`.
3. **Zdjęcia** — nowy folder w `content/galeria/nazwa-albumu/` plus `album.yml`, albo album z panelu.
4. **Msze, kontakt, grupy** — edycja `content/parafia.yml`.

Nazwa pliku z datą `RRRR-MM-DD-tytul.docx` ustawia datę publikacji. Tytuł na stronie bierze się z pierwszego nagłówka w dokumencie.

## Architektura

| Warstwa | Odpowiedzialność |
| --- | --- |
| `content/` | jedyne źródło prawdy (DOCX, YAML, Markdown, zdjęcia) |
| `src/lib/` | odczyt, konwersja Word → HTML (mammoth), sanityzacja, galeria |
| `src/app/` | strony Next.js App Router |
| `/admin` | wgrywanie DOCX i zdjęć (hasło z `ADMIN_PASSWORD`) |
| `/api/media` | bezpieczne serwowanie plików z `content/` |

HTML z Worda jest czyszczony (`sanitize-html`) — skrypty i niebezpieczne linki są usuwane. Ścieżki plików nie mogą wyjść poza `content/`.

## Struktura

```
content/
  parafia.yml
  aktualnosci/*.docx
  intencje/*.docx
  galeria/<album>/album.yml + zdjęcia
  strony/*.md
src/
  app/          trasy i API
  components/   UI
  lib/          treść, auth, parser DOCX
```

## Uwagi duszpasterskie

Teksty historii, nabożeństw i danych kontaktowych pochodzą z dotychczasowej strony parafii oraz schematyzmu Archidiecezji Katowickiej. Zdjęcia hero i galerii — z archiwum parafialnego. Ikona patrona jest ilustracją liturgiczną, nie fotografią.

Przed publikacją w internecie ustaw mocne `ADMIN_PASSWORD` oraz `ADMIN_SECRET` i podaj `NEXT_PUBLIC_SITE_URL`.
