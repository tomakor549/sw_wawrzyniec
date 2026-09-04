import "server-only";

import { mkdir, readdir, readFile, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Article, ArticleKind, ArticleMeta } from "@/types/content";
import { parseDocxFile } from "./docx";
import { contentPath, isSafeFilename } from "./paths";
import { parseContentFilename, todayIso } from "./slug";

const KINDS: ArticleKind[] = ["aktualnosci", "intencje"];

function isDocx(name: string): boolean {
  return name.toLowerCase().endsWith(".docx") && !name.startsWith("~$");
}

async function listDocx(kind: ArticleKind): Promise<string[]> {
  const dir = contentPath(kind);
  await mkdir(dir, { recursive: true });
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && isDocx(entry.name) && isSafeFilename(entry.name.replace(/\s/g, "-")))
    .map((entry) => entry.name)
    .sort()
    .reverse();
}

function cachePath(kind: ArticleKind, filename: string): string {
  return contentPath(".generated", kind, `${filename}.json`);
}

type CachedArticle = Article & { sourceMtime: number };

async function readCache(kind: ArticleKind, filename: string, mtimeMs: number): Promise<Article | null> {
  try {
    const raw = await readFile(cachePath(kind, filename), "utf8");
    const cached = JSON.parse(raw) as CachedArticle;
    if (cached.sourceMtime === mtimeMs && cached.html && cached.slug) {
      const { sourceMtime: _, ...article } = cached;
      return article;
    }
  } catch {
    return null;
  }
  return null;
}

async function writeCache(kind: ArticleKind, filename: string, article: Article, mtimeMs: number): Promise<void> {
  const file = cachePath(kind, filename);
  await mkdir(path.dirname(file), { recursive: true });
  const payload: CachedArticle = { ...article, sourceMtime: mtimeMs };
  await writeFile(file, JSON.stringify(payload), "utf8");
}

export async function loadArticle(kind: ArticleKind, filename: string): Promise<Article> {
  const filePath = contentPath(kind, filename);
  const info = await stat(filePath);
  const cached = await readCache(kind, filename, info.mtimeMs);
  if (cached) return cached;

  const parsedName = parseContentFilename(filename);
  const parsed = await parseDocxFile(filePath, {
    kind,
    slug: parsedName.slug,
    titleHint: parsedName.titleHint,
  });
  const article: Article = {
    slug: parsedName.slug,
    kind,
    title: parsed.title,
    date: parsedName.date ?? todayIso(info.mtime),
    filename,
    excerpt: parsed.excerpt,
    html: parsed.html,
  };
  await writeCache(kind, filename, article, info.mtimeMs);
  return article;
}

export async function listArticles(kind: ArticleKind): Promise<ArticleMeta[]> {
  const names = await listDocx(kind);
  const articles = await Promise.all(
    names.map(async (filename) => {
      const article = await loadArticle(kind, filename);
      const { html: _, ...meta } = article;
      return meta;
    }),
  );
  return articles.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export async function getArticleBySlug(kind: ArticleKind, slug: string): Promise<Article | null> {
  const names = await listDocx(kind);
  for (const filename of names) {
    const parsed = parseContentFilename(filename);
    if (parsed.slug === slug) {
      return loadArticle(kind, filename);
    }
  }
  return null;
}

export async function latestArticle(kind: ArticleKind): Promise<Article | null> {
  const list = await listArticles(kind);
  if (!list[0]) return null;
  return loadArticle(kind, list[0].filename);
}

export async function saveUploadedDocx(
  kind: ArticleKind,
  originalName: string,
  buffer: Buffer,
): Promise<Article> {
  const parsed = parseContentFilename(originalName);
  const date = parsed.date ?? todayIso();
  const slug = parsed.slug || "wpis";
  const filename = `${date}-${slug}.docx`;
  if (!isSafeFilename(filename)) {
    throw new Error("Nieprawidłowa nazwa pliku");
  }
  const destination = contentPath(kind, filename);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, buffer);
  return loadArticle(kind, filename);
}

export async function deleteArticle(kind: ArticleKind, filename: string): Promise<void> {
  if (!isDocx(filename) || !isSafeFilename(filename)) {
    throw new Error("Nieprawidłowa nazwa pliku");
  }
  await unlink(contentPath(kind, filename));
  await unlink(cachePath(kind, filename)).catch(() => undefined);
}

export function assertKind(value: string): ArticleKind {
  if ((KINDS as string[]).includes(value)) return value as ArticleKind;
  throw new Error("Nieznany rodzaj treści");
}
