import { NextResponse } from "next/server";
import { assertKind, deleteArticle, listArticles, saveUploadedDocx } from "@/lib/articles";
import { isAdmin } from "@/lib/auth";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Brak uprawnień" }, { status: 401 });
  const [aktualnosci, intencje] = await Promise.all([listArticles("aktualnosci"), listArticles("intencje")]);
  return NextResponse.json({ aktualnosci, intencje });
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Brak uprawnień" }, { status: 401 });
  const form = await request.formData();
  const kind = assertKind(String(form.get("kind") ?? "aktualnosci"));
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Wybierz plik DOCX" }, { status: 400 });
  }
  if (!file.name.toLowerCase().endsWith(".docx")) {
    return NextResponse.json({ error: "Dozwolone są tylko pliki .docx" }, { status: 400 });
  }
  if (file.size > 12 * 1024 * 1024) {
    return NextResponse.json({ error: "Plik jest zbyt duży (max 12 MB)" }, { status: 400 });
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const article = await saveUploadedDocx(kind, file.name, buffer);
  return NextResponse.json({ ok: true, article });
}

export async function DELETE(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Brak uprawnień" }, { status: 401 });
  const body = (await request.json()) as { kind?: string; filename?: string };
  const kind = assertKind(String(body.kind ?? ""));
  if (!body.filename) return NextResponse.json({ error: "Brak pliku" }, { status: 400 });
  await deleteArticle(kind, body.filename);
  return NextResponse.json({ ok: true });
}
