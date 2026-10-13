import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const DEFAULT_PIN = "1234";

export async function POST(req: Request) {
  try {
    const { pin } = await req.json();
    const expectedPin = process.env.ADMIN_PASSCODE || process.env.NEXT_PUBLIC_ADMIN_PIN || DEFAULT_PIN;

    if (!pin || pin.trim() !== expectedPin.trim()) {
      return NextResponse.json(
        { error: "PIN yang dimasukkan salah. Silakan coba lagi." },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();
    cookieStore.set("portfolio_admin_auth", "authenticated", {
      path: "/admin",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      secure: process.env.NODE_ENV === "production",
    });

    return NextResponse.json({ success: true, message: "Autentikasi berhasil" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan internal";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("portfolio_admin_auth");
  return NextResponse.json({ success: true, message: "Berhasil logout" });
}
