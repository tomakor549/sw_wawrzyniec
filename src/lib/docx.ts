import "server-only";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import mammoth from "mammoth";
import { contentPath } from "./paths";
import { contentMediaUrl } from "./media";
import { excerptFrom, sanitizeArticleHtml, titleFromHtml } from "./sanitize";

export type ParsedDocx = {
  html: string;
  title: string;
  excerpt: string;
};

type MammothImage = {
  contentType: string;
  read: (encoding: "base64") => Promise<string>;
};

function extensionFor(contentType: string): string {
  if (contentType.includes("jpeg")) return "jpg";
  if (contentType.includes("png")) return "png";
  if (contentType.includes("gif")) return "gif";
  if (contentType.includes("webp")) return "webp";
  return "bin";
}

export async function parseDocxFile(
  filePath: string,
  options: { kind: "aktualnosci" | "intencje"; slug: string; titleHint: string },
): Promise<ParsedDocx> {
  let imageIndex = 0;
  const mediaDir = contentPath(options.kind, "media", options.slug);

  const result = await mammoth.convertToHtml(
    { path: filePath },
    {
      convertImage: mammoth.images.imgElement(async (image: MammothImage) => {
        imageIndex += 1;
        const ext = extensionFor(image.contentType);
        const filename = `obraz-${imageIndex}.${ext}`;
        await mkdir(mediaDir, { recursive: true });
        const buffer = Buffer.from(await image.read("base64"), "base64");
        await writeFile(path.join(mediaDir, filename), buffer);
        return {
          src: contentMediaUrl(options.kind, "media", options.slug, filename),
        };
      }),
    },
  );

  const html = sanitizeArticleHtml(result.value);
  return {
    html,
    title: titleFromHtml(html, options.titleHint),
    excerpt: excerptFrom(html),
  };
}

export async function parseDocxBuffer(
  buffer: Buffer,
  options: { kind: "aktualnosci" | "intencje"; slug: string; titleHint: string },
): Promise<ParsedDocx> {
  const tmpDir = contentPath(".generated");
  await mkdir(tmpDir, { recursive: true });
  const tmpPath = path.join(tmpDir, `${options.slug}-${Date.now()}.docx`);
  await writeFile(tmpPath, buffer);
  try {
    return await parseDocxFile(tmpPath, options);
  } finally {
    const { unlink } = await import("node:fs/promises");
    await unlink(tmpPath).catch(() => undefined);
  }
}
