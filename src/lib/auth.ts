import "server-only";

import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "parafia_admin";
const TTL_MS = 1000 * 60 * 60 * 12;

function secret(): string {
  const value = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "dev-only-secret-change-me";
  return value.padEnd(32, "0");
}

function expectedPassword(): string {
  return process.env.ADMIN_PASSWORD || "zmien-mnie";
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function verifyPassword(password: string): boolean {
  const expected = expectedPassword();
  const salt = "parafia-sw-wawrzyniec";
  const a = scryptSync(password, salt, 32);
  const b = scryptSync(expected, salt, 32);
  return timingSafeEqual(a, b);
}

export async function createSession(): Promise<string> {
  const exp = Date.now() + TTL_MS;
  const nonce = randomBytes(8).toString("hex");
  const payload = `${exp}.${nonce}`;
  return `${payload}.${sign(payload)}`;
}

export function readSession(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [exp, nonce, mac] = parts;
  const payload = `${exp}.${nonce}`;
  const expected = sign(payload);
  const left = Buffer.from(mac);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) return false;
  return Number(exp) > Date.now();
}

export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  return readSession(jar.get(COOKIE)?.value);
}

export async function setSessionCookie(token: string): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: TTL_MS / 1000,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearSessionCookie(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}
