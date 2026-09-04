import { NextResponse } from "next/server";
import { createSession, setSessionCookie, verifyPassword } from "@/lib/auth";

export async function POST(request: Request) {
  const form = await request.formData();
  const password = String(form.get("password") ?? "");
  if (!verifyPassword(password)) {
    return NextResponse.redirect(new URL("/admin/login?error=1", request.url), { status: 303 });
  }
  const token = await createSession();
  await setSessionCookie(token);
  return NextResponse.redirect(new URL("/admin", request.url), { status: 303 });
}
