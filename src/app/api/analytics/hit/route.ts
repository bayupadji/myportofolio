import { NextRequest, NextResponse } from "next/server";
import { container } from "@/infrastructure/container";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const path = typeof body?.path === "string" ? body.path : "/";
    const referrer = typeof body?.referrer === "string" ? body.referrer : null;

    // Do not log admin or internal api routes
    if (path.startsWith("/admin") || path.startsWith("/api") || path.includes("_next")) {
      return NextResponse.json({ success: true, ignored: true });
    }

    // Ignore known bots & web crawlers
    const userAgent = req.headers.get("user-agent") || "";
    if (/bot|crawl|spider|slurp|facebookexternalhit|bingpreview/i.test(userAgent)) {
      return NextResponse.json({ success: true, bot: true });
    }

    // Create privacy-friendly daily visitor hash (no IP stored in DB)
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const dayString = new Date().toISOString().split("T")[0];
    const visitorHash = crypto
      .createHash("sha256")
      .update(`${clientIp}-${userAgent}-${dayString}`)
      .digest("hex")
      .substring(0, 16);

    await container.recordPageView.execute(path, referrer, visitorHash);

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Analytics beacon error:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
