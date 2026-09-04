import "server-only";

import path from "node:path";

export const ROOT = process.cwd();
export const CONTENT_ROOT = path.join(ROOT, "content");
export const PUBLIC_ROOT = path.join(ROOT, "public");

export function contentPath(...parts: string[]): string {
  const resolved = path.resolve(CONTENT_ROOT, ...parts);
  const relative = path.relative(CONTENT_ROOT, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error("Niedozwolona ścieżka treści");
  }
  return resolved;
}

export function isSafeFilename(name: string): boolean {
  return /^[A-Za-z0-9][A-Za-z0-9._-]{0,180}$/.test(name);
}

export function isSafeSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length <= 80;
}
