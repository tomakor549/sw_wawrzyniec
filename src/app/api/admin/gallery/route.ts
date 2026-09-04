import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { createAlbum, deleteAlbumImage, listAlbums, saveAlbumPhotos } from "@/lib/gallery";
import { isSafeSlug } from "@/lib/paths";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Brak uprawnień" }, { status: 401 });
  return NextResponse.json({ albums: await listAlbums() });
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Brak uprawnień" }, { status: 401 });
  const form = await request.formData();
  const action = String(form.get("action") ?? "upload");

  if (action === "create") {
    const title = String(form.get("title") ?? "").trim();
    if (!title) return NextResponse.json({ error: "Podaj nazwę albumu" }, { status: 400 });
    const album = await createAlbum({
      title,
      date: String(form.get("date") ?? "") || undefined,
      description: String(form.get("description") ?? ""),
    });
    return NextResponse.json({ ok: true, album });
  }

  const slug = String(form.get("slug") ?? "");
  if (!isSafeSlug(slug)) return NextResponse.json({ error: "Nieprawidłowy album" }, { status: 400 });
  const files = form.getAll("files").filter((item): item is File => item instanceof File);
  if (files.length === 0) return NextResponse.json({ error: "Wybierz zdjęcia" }, { status: 400 });
  const payload = [];
  for (const file of files) {
    if (file.size > 15 * 1024 * 1024) continue;
    payload.push({ name: file.name, buffer: Buffer.from(await file.arrayBuffer()) });
  }
  const album = await saveAlbumPhotos(slug, payload);
  return NextResponse.json({ ok: true, album });
}

export async function DELETE(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Brak uprawnień" }, { status: 401 });
  const body = (await request.json()) as { slug?: string; filename?: string };
  if (!body.slug || !body.filename) return NextResponse.json({ error: "Brak danych" }, { status: 400 });
  await deleteAlbumImage(body.slug, body.filename);
  return NextResponse.json({ ok: true });
}
