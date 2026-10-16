import crypto from "crypto";
import { cookies } from "next/headers";

const AUTH_COOKIE_NAME = "portfolio_admin_auth";
const SESSION_MAX_AGE_SEC = 2 * 60 * 60; // 2 hours

function getSecretKey(): string {
  return process.env.AUTH_SECRET || "default_local_portfolio_dev_secret_fallback_key";
}

export function createSessionToken(username: string): string {
  const expiresAt = Date.now() + SESSION_MAX_AGE_SEC * 1000;
  const payload = `${username}.${expiresAt}`;
  const signature = crypto
    .createHmac("sha256", getSecretKey())
    .update(payload)
    .digest("hex");
  return `${payload}.${signature}`;
}

export function verifySessionToken(token: string | undefined): {
  valid: boolean;
  username?: string;
} {
  if (!token) return { valid: false };

  const parts = token.split(".");
  if (parts.length !== 3) return { valid: false };

  const [username, expiresAtStr, signature] = parts;
  const expiresAt = Number(expiresAtStr);

  if (!username || isNaN(expiresAt) || expiresAt < Date.now()) {
    return { valid: false };
  }

  const payload = `${username}.${expiresAtStr}`;
  const expectedSig = crypto
    .createHmac("sha256", getSecretKey())
    .update(payload)
    .digest("hex");

  // Constant-time comparison prevents timing attacks
  const isMatch =
    signature.length === expectedSig.length &&
    crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig));

  if (!isMatch) return { valid: false };

  return { valid: true, username };
}

export async function assertAdminSession(): Promise<string> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(AUTH_COOKIE_NAME);
  const result = verifySessionToken(authCookie?.value);

  if (!result.valid || !result.username) {
    throw new Error("Unauthorized: Invalid or expired admin session");
  }

  return result.username;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get(AUTH_COOKIE_NAME);
    const result = verifySessionToken(authCookie?.value);
    return result.valid;
  } catch {
    return false;
  }
}

export { AUTH_COOKIE_NAME, SESSION_MAX_AGE_SEC };
