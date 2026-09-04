import "server-only";

import { mkdir, readdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import yaml from "js-yaml";
import type { Album, GalleryImage } from "@/types/content";
import { contentPath, isSafeFilename, isSafeSlug } from "./paths";
import { contentMediaUrl } from "./media";
import { slugify, todayIso } from "./slug";

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

type AlbumYaml = {
  title?: string;
  date?: string;
  description?: string;
  cover?: string;
};

function isImage(name: string): boolean {
  return IMAGE_EXT.has(path.extname(name).toLowerCase()) && isSafeFilename(name);
}

async function readYaml(file: string): Promise<AlbumYaml> {
  try {
    const raw = await readFile(file, "utf8");
    const parsed = yaml.load(raw);
    if (parsed && typeof parsed === "object") return parsed as AlbumYaml;
  } catch {
    return {};
  }
  return {};
}

async function loadAlbum(slug: string): Promise<Album> {
  if (!isSafeSlug(slug)) throw new Error("Nieprawidłowy album");
  const dir = contentPath("galeria", slug);
  const entries = await readdir(dir, { withFileTypes: true });
  const meta = await readYaml(path.join(dir, "album.yml"));
  const files = entries
    .filter((entry) => entry.isFile() && isImage(entry.name))
    .map((entry) => entry.name)
    .sort();

  const images: GalleryImage[] = files.map((filename) => ({
    filename,
    src: contentMediaUrl("galeria", slug, filename),
    alt: `${meta.title ?? slug} — ${filename}`,
  }));

  return {
    slug,
    title: meta.title ?? slug.replace(/-/g, " "),
    date: meta.date ?? todayIso(),
    description: meta.description ?? "",
    cover: meta.cover && files.includes(meta.cover) ? meta.cover : files[0],
    images,
  };
}

export async function listAlbums(): Promise<Album[]> {
  const root = contentPath("galeria");
  await mkdir(root, { recursive: true });
  const entries = await readdir(root, { withFileTypes: true });
  const slugs = entries.filter((entry) => entry.isDirectory() && isSafeSlug(entry.name)).map((entry) => entry.name);
  const albums = await Promise.all(slugs.map((slug) => loadAlbum(slug)));
  return albums.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export async function getAlbum(slug: string): Promise<Album | null> {
  try {
    return await loadAlbum(slug);
  } catch {
    return null;
  }
}

export async function createAlbum(input: {
  title: string;
  date?: string;
  description?: string;
}): Promise<Album> {
  const slug = slugify(input.title);
  if (!isSafeSlug(slug)) throw new Error("Nie udało się utworzyć nazwy albumu");
  const dir = contentPath("galeria", slug);
  await mkdir(dir, { recursive: true });
  const meta: AlbumYaml = {
    title: input.title.trim(),
    date: input.date || todayIso(),
    description: input.description?.trim() ?? "",
  };
  await writeFile(path.join(dir, "album.yml"), yaml.dump(meta, { lineWidth: 80 }), "utf8");
  return loadAlbum(slug);
}

export async function saveAlbumPhotos(slug: string, files: { name: string; buffer: Buffer }[]): Promise<Album> {
  if (!isSafeSlug(slug)) throw new Error("Nieprawidłowy album");
  const dir = contentPath("galeria", slug);
  await mkdir(dir, { recursive: true });
  for (const file of files) {
    const ext = path.extname(file.name).toLowerCase();
    if (!IMAGE_EXT.has(ext)) continue;
    const base = slugify(path.basename(file.name, ext)) || "zdjecie";
    const filename = `${base}${ext}`;
    if (!isSafeFilename(filename)) continue;
    await writeFile(path.join(dir, filename), file.buffer);
  }
  const album = await loadAlbum(slug);
  const metaPath = path.join(dir, "album.yml");
  const meta = await readYaml(metaPath);
  if (!meta.cover && album.cover) {
    meta.cover = album.cover;
    meta.title = meta.title ?? album.title;
    meta.date = meta.date ?? album.date;
    await writeFile(metaPath, yaml.dump(meta, { lineWidth: 80 }), "utf8");
  }
  return album;
}

export async function deleteAlbumImage(slug: string, filename: string): Promise<void> {
  if (!isSafeSlug(slug) || !isImage(filename)) throw new Error("Nieprawidłowe zdjęcie");
  await unlink(contentPath("galeria", slug, filename));
}
