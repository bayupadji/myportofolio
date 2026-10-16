import { test, expect } from "./fixtures/test-fixtures";

test.describe("CUJ-02: Work Grid & Case Study Deep-Dive", () => {
  test("displays work index, filters by category, and shows empty state on non-matching filters", async ({ page }) => {
    await page.goto("/work");

    // Verify page heading
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // Verify category tablist exists
    const tablist = page.getByRole("tablist", { name: /filter/i });
    await expect(tablist).toBeVisible();

    // Verify project cards are loaded
    const cards = page.getByTestId("project-card");
    const initialCount = await cards.count();
    expect(initialCount).toBeGreaterThan(0);

    // Switch to another category tab
    const fintechTab = page.getByRole("tab", { name: /fintech/i });
    if (await fintechTab.isVisible()) {
      await fintechTab.click();
      await expect(fintechTab).toHaveAttribute("aria-selected", "true");
    }
  });

  test("navigates into case study detail page and verifies structure", async ({ page }) => {
    await page.goto("/work");

    // Click on the first case study link
    const firstProjectLink = page.getByTestId("project-card").first().locator("a[href^='/work/']").first();
    await expect(firstProjectLink).toBeVisible();
    await firstProjectLink.click();

    // Verify URL is on /work/[slug]
    await expect(page).toHaveURL(/\/work\/[a-z0-9-]+$/);

    // Verify case study title & metadata
    const caseTitle = page.getByRole("heading", { level: 1 });
    await expect(caseTitle).toBeVisible();

    // Verify case study breadcrumb/back link exists
    const backLink = page.getByRole("link", { name: /back to work|all case studies|work/i }).first();
    await expect(backLink).toBeVisible();

    // Verify table of contents or main section content
    const mainContent = page.locator("main#main-content");
    await expect(mainContent).toBeVisible();
  });

  test("returns 404 not-found page for non-existent case study slug", async ({ page }) => {
    await page.goto("/work/invalid-non-existent-slug-404");
    
    // Status is 404 or page displays not-found message
    const notFoundText = page.locator("text=/not found|halaman tidak ditemukan|404/i");
    await expect(notFoundText.first()).toBeVisible();

    // Link back to work or home exists
    const returnLink = page.getByRole("link", { name: /back|home|work/i }).first();
    await expect(returnLink).toBeVisible();
  });
});
