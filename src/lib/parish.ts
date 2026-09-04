import "server-only";

import { readFile } from "node:fs/promises";
import yaml from "js-yaml";
import type { Parish } from "@/types/content";
import { contentPath } from "./paths";

let cache: { parish: Parish; mtime: number } | null = null;

export async function getParish(): Promise<Parish> {
  const file = contentPath("parafia.yml");
  const { stat } = await import("node:fs/promises");
  const info = await stat(file);
  if (cache && cache.mtime === info.mtimeMs) return cache.parish;
  const raw = await readFile(file, "utf8");
  const parsed = yaml.load(raw);
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Niepoprawny plik content/parafia.yml");
  }
  const parish = parsed as Parish;
  cache = { parish, mtime: info.mtimeMs };
  return parish;
}

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
