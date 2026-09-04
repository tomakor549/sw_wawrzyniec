/** Prefix for GitHub project Pages, e.g. `/sw_wawrzyniec`. Empty on Docker and custom domains. */
export function withBasePath(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

/**
 * Gallery and DOCX images.
 * GitHub Pages serves copies from /media (see scripts/sync-media.mjs).
 * Docker serves the same files live via /api/media.
 */
export function contentMediaUrl(...parts: string[]): string {
  const relative = parts.join("/");
  if (process.env.GITHUB_PAGES === "true") {
    return withBasePath(`/media/${relative}`);
  }
  return withBasePath(`/api/media/${relative}`);
}

export const isGitHubPages = process.env.GITHUB_PAGES === "true";
