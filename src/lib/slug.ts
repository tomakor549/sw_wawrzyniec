const POLISH: Record<string, string> = {
  ą: "a",
  ć: "c",
  ę: "e",
  ł: "l",
  ń: "n",
  ó: "o",
  ś: "s",
  ź: "z",
  ż: "z",
};

export function slugify(input: string): string {
  const folded = input
    .trim()
    .toLowerCase()
    .split("")
    .map((ch) => POLISH[ch] ?? ch)
    .join("");
  return folded
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export type FilenameMeta = {
  date: string | null;
  slug: string;
  titleHint: string;
};

const DATE_PREFIX = /^(\d{4}-\d{2}-\d{2})[-_\s]+(.+)$/;

export function parseContentFilename(filename: string): FilenameMeta {
  const base = filename.replace(/\.(docx|md|html)$/i, "");
  const match = base.match(DATE_PREFIX);
  const rest = match ? match[2] : base;
  const slug = slugify(rest) || "wpis";
  return {
    date: match ? match[1] : null,
    slug,
    titleHint: humanizeSlug(slug),
  };
}

export function humanizeSlug(slug: string): string {
  if (!slug) return "Wpis";
  const text = slug.replace(/-/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const MONTHS_PL = [
  "stycznia",
  "lutego",
  "marca",
  "kwietnia",
  "maja",
  "czerwca",
  "lipca",
  "sierpnia",
  "września",
  "października",
  "listopada",
  "grudnia",
];

export function formatPlDate(iso: string): string {
  const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!parts) return iso;
  const day = Number(parts[3]);
  const month = Number(parts[2]) - 1;
  const year = parts[1];
  if (month < 0 || month > 11) return iso;
  return `${day} ${MONTHS_PL[month]} ${year}`;
}

export function todayIso(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
