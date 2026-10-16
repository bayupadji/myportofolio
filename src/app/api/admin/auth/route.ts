import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db, verifyPassword } from "@/infrastructure/drizzle/db";
import { adminUsersTable } from "@/infrastructure/drizzle/schema";

import {
  createSessionToken,
  AUTH_COOKIE_NAME,
  SESSION_MAX_AGE_SEC,
} from "@/infrastructure/auth/session";

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

    const user = await db
      .select()
      .from(adminUsersTable)
      .where(eq(adminUsersTable.username, username.trim()))
      .get();

    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json(
        { error: "Username atau password salah. Silakan coba lagi." },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();
    const sessionToken = createSessionToken(user.username);

    cookieStore.delete({
      name: AUTH_COOKIE_NAME,
      path: "/admin",
    });

    cookieStore.set(AUTH_COOKIE_NAME, sessionToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE_SEC,
      secure: process.env.NODE_ENV === "production",
    });

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

