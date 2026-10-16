import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db, verifyPassword } from "@/infrastructure/drizzle/db";
import { adminUsersTable } from "@/infrastructure/drizzle/schema";

import {
  createSessionToken,
  AUTH_COOKIE_NAME,
  AUTH_COOKIE_OPTIONS,
} from "@/infrastructure/auth/session";

interface LoginAttemptRecord {
  count: number;
  resetAt: number;
}

const loginAttempts = new Map<string, LoginAttemptRecord>();
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function getClientIdentifier(req: Request, username: string): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown_ip";
  return `${ip}:${username.trim().toLowerCase()}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username dan password wajib diisi." },
        { status: 400 }
      );
    }

    const clientKey = getClientIdentifier(req, username);
    const now = Date.now();

    if (loginAttempts.size > 100) {
      for (const [key, val] of loginAttempts.entries()) {
        if (val.resetAt <= now) loginAttempts.delete(key);
      }
    }

    const attempt = loginAttempts.get(clientKey);

    if (attempt && attempt.resetAt > now && attempt.count >= MAX_FAILED_ATTEMPTS) {
      const retryAfterSec = Math.ceil((attempt.resetAt - now) / 1000);
      return NextResponse.json(
        { error: `Terlalu banyak percobaan login yang gagal. Silakan coba lagi dalam ${Math.ceil(retryAfterSec / 60)} menit.` },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfterSec) },
        }
      );
    }

    const user = await db
      .select()
      .from(adminUsersTable)
      .where(eq(adminUsersTable.username, username.trim()))
      .get();

    if (!user || !verifyPassword(password, user.passwordHash)) {
      const currentCount = attempt && attempt.resetAt > now ? attempt.count + 1 : 1;
      loginAttempts.set(clientKey, {
        count: currentCount,
        resetAt: now + LOCKOUT_WINDOW_MS,
      });

      return NextResponse.json(
        { error: "Username atau password salah. Silakan coba lagi." },
        { status: 401 }
      );
    }

    // Reset failed counter upon successful login
    loginAttempts.delete(clientKey);

    const cookieStore = await cookies();
    const sessionToken = createSessionToken(user.username);

    cookieStore.delete({
      name: AUTH_COOKIE_NAME,
      path: "/admin",
    });

    cookieStore.set(AUTH_COOKIE_NAME, sessionToken, AUTH_COOKIE_OPTIONS);

    return NextResponse.json({
      success: true,
      message: "Autentikasi berhasil.",
      user: {
        username: user.username,
        role: user.role,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan internal";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete({
    name: AUTH_COOKIE_NAME,
    path: "/",
  });
  cookieStore.delete({
    name: AUTH_COOKIE_NAME,
    path: "/admin",
  });
  return NextResponse.json({ success: true, message: "Berhasil logout" });
}

