import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db, verifyPassword } from "@/infrastructure/drizzle/db";
import { adminUsersTable } from "@/infrastructure/drizzle/schema";

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

    // Query admin user from SQLite using Drizzle ORM
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
    const sessionToken = `authenticated:${Date.now()}`;

    // Clean up any old path-specific cookies
    cookieStore.delete({
      name: "portfolio_admin_auth",
      path: "/admin",
    });

    cookieStore.set("portfolio_admin_auth", sessionToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 5 * 60, // 5 menit (300 detik)
      secure: process.env.NODE_ENV === "production",
    });

    return NextResponse.json({
      success: true,
      message: "Autentikasi berhasil. Sesi aktif selama 5 menit.",
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
    name: "portfolio_admin_auth",
    path: "/",
  });
  cookieStore.delete({
    name: "portfolio_admin_auth",
    path: "/admin",
  });
  return NextResponse.json({ success: true, message: "Berhasil logout" });
}

