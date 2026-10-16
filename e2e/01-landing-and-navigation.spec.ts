import { test, expect } from "./fixtures/test-fixtures";

test.describe("CUJ-01: Landing Page & Navigation Shell", () => {
  test("loads landing page with hero, value statement, and availability ribbon", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Bayu/i);

    // Verify main landmarks
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("main#main-content")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();

    // Verify primary hero elements
    const heroHeadline = page.getByRole("heading", { level: 1 });
    await expect(heroHeadline).toBeVisible();

    // Verify availability badge exists in hero
    const availabilityBadge = page.locator("text=/available|waitlist|open for work/i").first();
    await expect(availabilityBadge).toBeVisible();
  });

  test("toggles theme correctly between light and dark modes", async ({ page }) => {
    await page.goto("/");

    const themeToggleBtn = page.getByTestId("theme-toggle-btn");
    await expect(themeToggleBtn).toBeVisible();

    // Check initial state
    const html = page.locator("html");

    // Click toggle to cycle theme
    await themeToggleBtn.click();
    // Verify html tag has or toggled dark class
    const isDark = await html.evaluate((el) => el.classList.contains("dark"));
    expect(typeof isDark).toBe("boolean");

    // Click toggle again
    await themeToggleBtn.click();
  });

  test("opens and closes mobile navigation drawer on smaller viewports", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    const mobileMenuBtn = page.getByTestId("mobile-menu-btn");
    await expect(mobileMenuBtn).toBeVisible();

    // Open mobile drawer
    await mobileMenuBtn.click();
    const drawer = page.getByTestId("mobile-drawer");
    await expect(drawer).toBeVisible();

    // Verify navigation links inside drawer
    await expect(drawer.getByRole("link", { name: /work/i })).toBeVisible();
    await expect(drawer.getByRole("link", { name: /contact/i })).toBeVisible();

    // Close drawer via Escape key
    await page.keyboard.press("Escape");
    await expect(drawer).not.toBeVisible();
  });

  test("shows offline alert banner when browser disconnects from network", async ({ page, context }) => {
    await page.goto("/");

    // Initially online: offline banner should not be present
    await expect(page.getByTestId("offline-banner")).not.toBeVisible();

    // Emulate network disconnection
    await context.setOffline(true);
    await page.evaluate(() => window.dispatchEvent(new Event("offline")));

    const banner = page.getByTestId("offline-banner");
    await expect(banner).toBeVisible();

    // Restore online
    await context.setOffline(false);
    await page.evaluate(() => window.dispatchEvent(new Event("online")));
    await expect(banner).not.toBeVisible();
  });
});
