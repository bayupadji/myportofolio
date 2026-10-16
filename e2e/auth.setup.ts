import { test as setup, expect } from "@playwright/test";
import { STORAGE_STATE } from "../playwright.config";
import fs from "fs";
import path from "path";

setup("authenticate admin", async ({ request }) => {
  const authDir = path.dirname(STORAGE_STATE);
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  const username = (process.env.ADMIN_USERNAME || "skyviadmin").trim();
  const password = process.env.ADMIN_PASSWORD || "skyvi1234";

  const res = await request.post("/api/admin/auth", {
    data: {
      username,
      password,
    },
  });

  expect(res.ok()).toBeTruthy();

  // Persist cookies to STORAGE_STATE for authenticated test runs
  await request.storageState({ path: STORAGE_STATE });
});
