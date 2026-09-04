/**
 * Static export for GitHub Pages.
 * Hides API routes, forces static rendering, copies gallery images, runs next build.
 */
import { execSync } from "node:child_process";
import { existsSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const apiDir = path.join(root, "src/app/api");
const apiHidden = path.join(root, "src/app/_api_disabled");
const dynamicLine = 'export const dynamic = "force-dynamic";';
const staticLine = 'export const dynamic = "force-static";';

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) walk(full, acc);
    else if (name.endsWith(".tsx") || name.endsWith(".ts")) acc.push(full);
  }
  return acc;
}

const patched = [];
function patchDynamic() {
  for (const file of walk(path.join(root, "src/app"))) {
    const before = readFileSync(file, "utf8");
    if (!before.includes(dynamicLine)) continue;
    writeFileSync(file, before.replaceAll(dynamicLine, staticLine));
    patched.push(file);
  }
}

function restoreDynamic() {
  for (const file of patched) {
    const now = readFileSync(file, "utf8");
    writeFileSync(file, now.replaceAll(staticLine, dynamicLine));
  }
}

execSync("node scripts/sync-media.mjs", { cwd: root, stdio: "inherit" });

let hidApi = false;
if (existsSync(apiDir) && !existsSync(apiHidden)) {
  renameSync(apiDir, apiHidden);
  hidApi = true;
}

patchDynamic();

try {
  execSync("pnpm exec next build", {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, GITHUB_PAGES: "true" },
  });
  writeFileSync(path.join(root, "out", ".nojekyll"), "");
  console.log("\nNie otwieraj out/index.html z dysku — CSS się nie wczyta.");
  console.log("Podgląd:  pnpm preview:pages");
  console.log("Potem:    http://127.0.0.1:8080/\n");
} finally {
  restoreDynamic();
  if (hidApi && existsSync(apiHidden) && !existsSync(apiDir)) {
    renameSync(apiHidden, apiDir);
  }
}
