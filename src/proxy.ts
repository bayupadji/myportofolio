import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  AUTH_COOKIE_NAME,
  AUTH_COOKIE_OPTIONS,
  verifySessionToken,
  refreshSessionToken,
} from "@/infrastructure/auth/session";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Do not intercept the login page itself or auth API
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const validation = verifySessionToken(token);

  if (!validation.valid) {
    const reason =
      validation.reason === "idle" || validation.reason === "absolute"
        ? `?reason=${validation.reason}`
        : validation.reason === "missing"
        ? ""
        : "?expired=1";

    const loginUrl = new URL(`/admin/login${reason}`, request.url);
    const response = NextResponse.redirect(loginUrl);

    // Explicit root-path clearance ensures the cookie is removed across all browsers
    response.cookies.set(AUTH_COOKIE_NAME, "", { ...AUTH_COOKIE_OPTIONS, maxAge: 0 });
    return response;
  }

  const response = NextResponse.next();

  // Slide idle timeout window if minimum throttle interval has passed
  const refresh = refreshSessionToken(token);
  if (refresh?.shouldUpdate) {
    response.cookies.set(AUTH_COOKIE_NAME, refresh.newToken, AUTH_COOKIE_OPTIONS);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
