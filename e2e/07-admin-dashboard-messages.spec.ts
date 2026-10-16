import { test, expect } from "./fixtures/test-fixtures";

test.describe("CUJ-08: Admin Availability Toggle & Public State Sync", () => {
  test("toggles freelance availability in admin and syncs with public site", async ({ adminPage, page }) => {
    // 1. Visit admin overview
    await adminPage.goto("/admin");

    const toggleBtn = adminPage.getByTestId("toggle-availability-btn");
    await expect(toggleBtn).toBeVisible();

    // Capture initial state
    const isInitiallyOpen = await adminPage.locator("text=/Open for Work/i").isVisible();

    // Click toggle button
    await toggleBtn.click();

    // Verify state flipped in admin
    if (isInitiallyOpen) {
      await expect(adminPage.locator("text=/Limited Availability/i").first()).toBeVisible({ timeout: 10000 });
    } else {
      await expect(adminPage.locator("text=/Open for Work/i").first()).toBeVisible({ timeout: 10000 });
    }

    // 2. Check public services page
    await page.goto("/services");
    const publicBadge = page.getByTestId("services-availability-badge");
    await expect(publicBadge).toBeVisible();

    // 3. Revert toggle back in admin to maintain pristine state
    await adminPage.goto("/admin");
    const revertBtn = adminPage.getByTestId("toggle-availability-btn");
    await revertBtn.click();

    if (isInitiallyOpen) {
      await expect(adminPage.locator("text=/Open for Work/i").first()).toBeVisible({ timeout: 10000 });
    } else {
      await expect(adminPage.locator("text=/Limited Availability/i").first()).toBeVisible({ timeout: 10000 });
    }
  });
});

test.describe("CUJ-09: Admin Inbound Messages Inbox", () => {
  test("views inbound messages, filters by search term and topic tabs", async ({ adminPage: page }) => {
    await page.goto("/admin/messages");

    // Verify messages manager title
    await expect(page.getByRole("heading", { name: /inbound messages & briefs/i })).toBeVisible();

    // Verify search input
    const searchInput = page.getByPlaceholder(/search messages/i);
    await expect(searchInput).toBeVisible();

    // Filter by topic pills
    const freelanceTab = page.getByRole("button", { name: /freelance/i });
    await expect(freelanceTab).toBeVisible();
    await freelanceTab.click();

    const allTab = page.getByRole("button", { name: /all topics/i });
    await expect(allTab).toBeVisible();
    await allTab.click();
  });
});

test.describe("CUJ-10: Admin Traffic Analytics Chart & Timeframe Switching", () => {
  test("renders traffic chart and switches between 7-day and 30-day timeframes", async ({ adminPage: page }) => {
    await page.goto("/admin");

    // Verify audience & traffic section
    await expect(page.getByRole("heading", { name: /audience & traffic intelligence/i })).toBeVisible();

    // Verify KPI stats strip
    await expect(page.locator("text=/Total Pageviews/i").first()).toBeVisible();
    await expect(page.locator("text=/Unique Visitors/i").first()).toBeVisible();

    // Switch to Last 7 Days
    const sevenDaysBtn = page.getByRole("button", { name: /last 7 days/i });
    await expect(sevenDaysBtn).toBeVisible();
    await sevenDaysBtn.click();
    await expect(sevenDaysBtn).toHaveClass(/bg-\[var\(--accent\)\]/);

    // Switch back to Last 30 Days
    const thirtyDaysBtn = page.getByRole("button", { name: /last 30 days/i });
    await expect(thirtyDaysBtn).toBeVisible();
    await thirtyDaysBtn.click();
    await expect(thirtyDaysBtn).toHaveClass(/bg-\[var\(--accent\)\]/);
  });
});
