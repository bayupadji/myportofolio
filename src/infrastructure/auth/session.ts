import crypto from "crypto";
import { cookies } from "next/headers";

const AUTH_COOKIE_NAME = "portfolio_admin_auth";
const IDLE_TIMEOUT_SEC = 30 * 60; // 30 minutes
const ABSOLUTE_TIMEOUT_SEC = 2 * 60 * 60; // 2 hours
const REFRESH_INTERVAL_SEC = 60; // 1 minute throttle for rolling updates

export const AUTH_COOKIE_OPTIONS = {
  path: "/",
  httpOnly: true,
  sameSite: "lax" as const,
  maxAge: IDLE_TIMEOUT_SEC,
  secure: process.env.NODE_ENV === "production",
};

function getSecretKey(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("AUTH_SECRET environment variable is required in production.");
    }
    return "dev_local_portfolio_insecure_fallback_secret";
  }
  return secret;
}

export function createSessionToken(username: string): string {
  const now = Date.now();
  const payload = `${username}.${now}.${now}`;
  const signature = crypto
    .createHmac("sha256", getSecretKey())
    .update(payload)
    .digest("hex");
  return `${payload}.${signature}`;
}

export type SessionValidationResult =
  | { valid: true; username: string; createdAt: number; lastActiveAt: number }
  | { valid: false; reason: "missing" | "invalid" | "idle" | "absolute" };

export function verifySessionToken(token: string | undefined): SessionValidationResult {
  if (!token) return { valid: false, reason: "missing" };

  const parts = token.split(".");
  if (parts.length !== 4) return { valid: false, reason: "invalid" };

  const [username, createdAtStr, lastActiveAtStr, signature] = parts;
  const createdAt = Number(createdAtStr);
  const lastActiveAt = Number(lastActiveAtStr);

  if (!username || isNaN(createdAt) || isNaN(lastActiveAt)) {
    return { valid: false, reason: "invalid" };
  }

  const payload = `${username}.${createdAtStr}.${lastActiveAtStr}`;
  const expectedSig = crypto
    .createHmac("sha256", getSecretKey())
    .update(payload)
    .digest("hex");

  const isMatch =
    signature.length === expectedSig.length &&
    crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig));

  if (!isMatch) return { valid: false, reason: "invalid" };

  const now = Date.now();
  if (now - createdAt > ABSOLUTE_TIMEOUT_SEC * 1000) {
    return { valid: false, reason: "absolute" };
  }

  if (now - lastActiveAt > IDLE_TIMEOUT_SEC * 1000) {
    return { valid: false, reason: "idle" };
  }

  return { valid: true, username, createdAt, lastActiveAt };
}

export function refreshSessionToken(token: string | undefined): {
  newToken: string;
  shouldUpdate: boolean;
  username: string;
} | null {
  const result = verifySessionToken(token);
  if (!result.valid) return null;

  const now = Date.now();
  if (now - result.lastActiveAt < REFRESH_INTERVAL_SEC * 1000) {
    return { newToken: token!, shouldUpdate: false, username: result.username };
  }

  const payload = `${result.username}.${result.createdAt}.${now}`;
  const signature = crypto
    .createHmac("sha256", getSecretKey())
    .update(payload)
    .digest("hex");

  return {
    newToken: `${payload}.${signature}`,
    shouldUpdate: true,
    username: result.username,
  };
}

export async function assertAdminSession(): Promise<string> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(AUTH_COOKIE_NAME);
  const result = verifySessionToken(authCookie?.value);

  if (!result.valid) {
    throw new Error(`Unauthorized: Admin session expired or invalid (${result.reason})`);
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

export {
  AUTH_COOKIE_NAME,
  IDLE_TIMEOUT_SEC,
  ABSOLUTE_TIMEOUT_SEC,
  REFRESH_INTERVAL_SEC,
};
