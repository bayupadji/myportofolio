import test from "node:test";
import assert from "node:assert/strict";
import crypto from "crypto";

const IDLE_TIMEOUT_SEC = 30 * 60; // 30 minutes
const ABSOLUTE_TIMEOUT_SEC = 2 * 60 * 60; // 2 hours
const REFRESH_INTERVAL_SEC = 60; // 1 minute throttle

function createTestToken(username: string, createdAt: number, lastActiveAt: number, secret: string): string {
  const payload = `${username}.${createdAt}.${lastActiveAt}`;
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${signature}`;
}

function verifyTestToken(
  token: string | undefined,
  secret: string,
  now = Date.now()
): { valid: true; username: string } | { valid: false; reason: "missing" | "invalid" | "idle" | "absolute" } {
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
  const expectedSig = crypto.createHmac("sha256", secret).update(payload).digest("hex");

  try {
    const sigBuffer = Buffer.from(signature, "hex");
    const expectedBuffer = Buffer.from(expectedSig, "hex");
    if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      return { valid: false, reason: "invalid" };
    }
  } catch {
    return { valid: false, reason: "invalid" };
  }

  if (now - createdAt > ABSOLUTE_TIMEOUT_SEC * 1000) {
    return { valid: false, reason: "absolute" };
  }

  if (now - lastActiveAt > IDLE_TIMEOUT_SEC * 1000) {
    return { valid: false, reason: "idle" };
  }

  return { valid: true, username };
}

function refreshTestToken(
  token: string,
  secret: string,
  now = Date.now()
): { newToken: string; shouldUpdate: boolean } | null {
  const result = verifyTestToken(token, secret, now);
  if (!result.valid) return null;

  const parts = token.split(".");
  const [username, createdAtStr, lastActiveAtStr] = parts;
  const lastActiveAt = Number(lastActiveAtStr);

  if (now - lastActiveAt < REFRESH_INTERVAL_SEC * 1000) {
    return { newToken: token, shouldUpdate: false };
  }

  const payload = `${username}.${createdAtStr}.${now}`;
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return { newToken: `${payload}.${signature}`, shouldUpdate: true };
}

function testHashPassword(password: string, salt = crypto.randomBytes(16).toString("hex")): string {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function testVerifyPassword(password: string, combinedHash: string): boolean {
  try {
    const [salt, originalHash] = combinedHash.split(":");
    if (!salt || !originalHash) return false;
    const hash = crypto.scryptSync(password, salt, 64).toString("hex");
    return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(originalHash, "hex"));
  } catch {
    return false;
  }
}

test("Session token is valid when within idle and absolute limits", () => {
  const secret = "test_secret_key_123";
  const now = Date.now();
  const token = createTestToken("skyviadmin", now, now, secret);
  const result = verifyTestToken(token, secret, now);

  assert.equal(result.valid, true);
  if (result.valid) {
    assert.equal(result.username, "skyviadmin");
  }
});

test("Session token expires with idle reason after 30 minutes of inactivity", () => {
  const secret = "test_secret_key_123";
  const now = Date.now();
  // Created 35 mins ago, last active 31 mins ago (> 30 mins idle, but < 2 hours absolute)
  const createdAt = now - 35 * 60 * 1000;
  const lastActiveAt = now - 31 * 60 * 1000;
  const token = createTestToken("skyviadmin", createdAt, lastActiveAt, secret);

  const result = verifyTestToken(token, secret, now);
  assert.equal(result.valid, false);
  if (!result.valid) {
    assert.equal(result.reason, "idle");
  }
});

test("Session token expires with absolute reason after 2 hours regardless of activity", () => {
  const secret = "test_secret_key_123";
  const now = Date.now();
  // Created 2 hours and 1 minute ago, but active 1 minute ago
  const createdAt = now - (2 * 60 + 1) * 60 * 1000;
  const lastActiveAt = now - 1 * 60 * 1000;
  const token = createTestToken("skyviadmin", createdAt, lastActiveAt, secret);

  const result = verifyTestToken(token, secret, now);
  assert.equal(result.valid, false);
  if (!result.valid) {
    assert.equal(result.reason, "absolute");
  }
});

test("Rolling refresh extends idle window while preserving absolute creation time", () => {
  const secret = "test_secret_key_123";
  const loginTime = Date.now() - 25 * 60 * 1000; // 25 mins ago
  const initialToken = createTestToken("skyviadmin", loginTime, loginTime, secret);

  // User interacts after 15 minutes
  const activeTime = loginTime + 15 * 60 * 1000;
  const refresh = refreshTestToken(initialToken, secret, activeTime);

  assert.ok(refresh);
  assert.equal(refresh?.shouldUpdate, true);

  // 20 minutes after activeTime (total 35 minutes since login):
  // Without refresh, 35 mins since login would be idle expired (>30m).
  // With refresh, it is only 20 mins since lastActiveAt, so it remains valid!
  const checkTime = activeTime + 20 * 60 * 1000;
  const result = verifyTestToken(refresh!.newToken, secret, checkTime);
  assert.equal(result.valid, true);

  // But after 2 hours and 5 minutes from loginTime, absolute expiration strictly blocks it
  const beyondAbsoluteTime = loginTime + (2 * 60 + 5) * 60 * 1000;
  const absoluteResult = verifyTestToken(refresh!.newToken, secret, beyondAbsoluteTime);
  assert.equal(absoluteResult.valid, false);
  if (!absoluteResult.valid) {
    assert.equal(absoluteResult.reason, "absolute");
  }
});

test("verifyTestToken rejects tampered or invalid signatures", () => {
  const secret = "test_secret_key_123";
  const now = Date.now();
  const token = createTestToken("skyviadmin", now, now, secret);
  const tampered = token.replace("skyviadmin", "attacker");

  assert.equal(verifyTestToken(tampered, secret, now).valid, false);
  assert.equal(verifyTestToken(token, "wrong_secret", now).valid, false);
  assert.equal(verifyTestToken(undefined, secret, now).valid, false);
  assert.equal(verifyTestToken("bad.token", secret, now).valid, false);
});

test("testHashPassword and testVerifyPassword work as expected", () => {
  const password = "mySecurePassword123!";
  const hash = testHashPassword(password);

  assert.equal(testVerifyPassword(password, hash), true);
  assert.equal(testVerifyPassword("wrong", hash), false);
  assert.equal(testVerifyPassword(password, "malformed"), false);
});
