import { test, expect } from "./fixtures/test-fixtures";

test.describe("CUJ-06: Admin Authentication, Route Protection & Inactivity Expiration", () => {
  // Use a fresh unauthenticated browser context for testing login flows
  test.use({ storageState: { cookies: [], origins: [] } });

  test("redirects unauthenticated access from /admin to login page", async ({ page }) => {
    await page.goto("/admin");

    // Must be redirected to /admin/login
    await expect(page).toHaveURL(/\/admin\/login/);
    await expect(page.locator("#username-input")).toBeVisible();
    await expect(page.locator("#password-input")).toBeVisible();
  });

  test("shows descriptive session timeout banners for idle and absolute expirations", async ({ page }) => {
    // 1. Idle timeout banner (30 minutes inactivity)
    await page.goto("/admin/login?reason=idle");
    const idleBanner = page.getByRole("status");
    await expect(idleBanner).toBeVisible();
    await expect(idleBanner).toContainText(/30 menit|berakhir/i);

    // 2. Absolute expiration banner (2 hours max duration)
    await page.goto("/admin/login?reason=absolute");
    const absBanner = page.getByRole("status");
    await expect(absBanner).toBeVisible();
    await expect(absBanner).toContainText(/2 jam|keamanan/i);
  });

  test("shows error alert on invalid password credentials (Failure State)", async ({ page }) => {
    await page.goto("/admin/login");

    await page.locator("#username-input").fill("skyviadmin");
    await page.locator("#password-input").fill("wrong-password-attempt-999");
    await page.locator("button[type='submit']").click();

    // Verify error banner is displayed
    const errorAlert = page.locator("[role='alert']:not(#__next-route-announcer__)");
    await expect(errorAlert).toBeVisible();
    await expect(errorAlert).toContainText(/salah|gagal|kredensial|invalid/i);

    // User stays on login page
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("logs in successfully with valid credentials and redirects to dashboard (Happy Path)", async ({ page }) => {
    await page.goto("/admin/login");

    const username = process.env.ADMIN_USERNAME || "skyviadmin";
    const password = process.env.ADMIN_PASSWORD || "skyvi1234";

    await page.locator("#username-input").fill(username);
    await page.locator("#password-input").fill(password);
    await page.locator("button[type='submit']").click();

    // Redirects to /admin
    await expect(page).toHaveURL(/\/admin$/, { timeout: 10000 });

    // Verify admin overview page elements
    await expect(page.getByRole("heading", { name: /studio command center|command center|overview/i }).first()).toBeVisible();
  });
});
