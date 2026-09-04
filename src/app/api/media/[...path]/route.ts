import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { contentPath } from "@/lib/paths";

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: parts } = await params;
  if (!parts?.length) {
    return new NextResponse("Not found", { status: 404 });
  }
  try {
    const file = contentPath(...parts);
    const info = await stat(file);
    if (!info.isFile()) return new NextResponse("Not found", { status: 404 });
    const ext = path.extname(file).toLowerCase();
    const type = MIME[ext];
    if (!type) return new NextResponse("Unsupported", { status: 415 });
    const body = await readFile(file);
    return new NextResponse(new Uint8Array(body), {
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
