import "server-only";

import { readFile } from "node:fs/promises";
import matter from "gray-matter";
import { marked } from "marked";
import type { StaticPage } from "@/types/content";
import { contentPath } from "./paths";
import { sanitizeArticleHtml } from "./sanitize";

marked.setOptions({ gfm: true, breaks: true });

export async function getStaticPage(slug: string): Promise<StaticPage> {
  const file = contentPath("strony", `${slug}.md`);
  const raw = await readFile(file, "utf8");
  const { data, content } = matter(raw);
  const html = sanitizeArticleHtml(await marked.parse(content));
  return {
    slug,
    title: typeof data.title === "string" ? data.title : slug,
    description: typeof data.description === "string" ? data.description : undefined,
    html,
  };
}
