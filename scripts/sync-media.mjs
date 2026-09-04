import { cp, mkdir, readdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const content = path.join(root, "content");
const destRoot = path.join(root, "public", "media");

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

async function copyImages(from, to) {
  let entries;
  try {
    entries = await readdir(from, { withFileTypes: true });
  } catch {
    return;
  }
  await mkdir(to, { recursive: true });
  for (const entry of entries) {
    const src = path.join(from, entry.name);
    const dest = path.join(to, entry.name);
    if (entry.isDirectory()) {
      await copyImages(src, dest);
    } else if (IMAGE_EXT.has(path.extname(entry.name).toLowerCase())) {
      await cp(src, dest);
    }
  }
}

await rm(destRoot, { recursive: true, force: true });
await copyImages(path.join(content, "galeria"), path.join(destRoot, "galeria"));
await copyImages(path.join(content, "aktualnosci", "media"), path.join(destRoot, "aktualnosci", "media"));
await copyImages(path.join(content, "intencje", "media"), path.join(destRoot, "intencje", "media"));

const exists = await stat(destRoot).catch(() => null);
if (exists) {
  console.log("Synced content images → public/media");
}
