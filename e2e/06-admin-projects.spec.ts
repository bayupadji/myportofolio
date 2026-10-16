import { test, expect } from "./fixtures/test-fixtures";

test.describe("CUJ-07: Admin Case Studies CRUD & Publish State Toggle", () => {
  test("loads project manager, searches projects, and filters by status", async ({ adminPage: page }) => {
    await page.goto("/admin/projects");

    // Verify page header
    await expect(page.getByRole("heading", { name: /case studies management/i })).toBeVisible();

    // Verify search input filters projects
    const searchInput = page.getByPlaceholder(/search by title/i);
    await expect(searchInput).toBeVisible();
    await searchInput.fill("paypulse");

    // Only paypulse project should be displayed
    await expect(page.locator("text=/paypulse/i").first()).toBeVisible();

    // Clear search
    await searchInput.fill("");

    // Click "Draft" filter tab
    const draftTab = page.getByRole("button", { name: "Draft", exact: true });
    await draftTab.click();

    // Click "All" filter tab
    const allTab = page.getByRole("button", { name: "All", exact: true });
    await allTab.click();
  });

  test("validates required fields when creating a project without title (Validation Failure)", async ({ adminPage: page }) => {
    await page.goto("/admin/projects");

    // Click "Add New Project"
    await page.getByRole("button", { name: /add new project/i }).click();

    // Modal opens
    await expect(page.getByRole("heading", { name: /add new project/i })).toBeVisible();

    // Clear title input
    const titleInput = page.getByPlaceholder("e.g. PayPulse Merchant App");
    await titleInput.fill("");

    // Click "Save Changes"
    await page.getByRole("button", { name: /save changes/i }).click();

    // Expect validation error
    await expect(page.locator("text=/project title is required/i")).toBeVisible();

    // Cancel modal
    await page.getByRole("button", { name: /cancel/i }).click();
  });

  test("creates a draft project with title & slug and verifies list update (Happy Path)", async ({ adminPage: page }) => {
    await page.goto("/admin/projects");

    // Click "Add New Project"
    await page.getByRole("button", { name: /add new project/i }).click();

    // Fill valid title and test-slug
    const testTitle = "E2E Test Design System";
    const testSlug = "test-e2e-design-system";

    const titleInput = page.getByPlaceholder("e.g. PayPulse Merchant App");
    await titleInput.fill(testTitle);

    const slugInput = page.getByPlaceholder("paypulse-merchant-app");
    await slugInput.fill(testSlug);

    // Click Save Changes
    await page.getByRole("button", { name: /save changes/i }).click();

    // Modal closes and new project appears in list
    await expect(page.locator(`text=${testTitle}`).first()).toBeVisible({ timeout: 10000 });
  });

  test("toggles publish status between published and draft", async ({ adminPage: page }) => {
    await page.goto("/admin/projects");

    // Find the first status toggle button
    const statusBtn = page.locator("button[title='Click to toggle publish status']").first();
    await expect(statusBtn).toBeVisible();

    const initialText = await statusBtn.innerText();
    await statusBtn.click();

    // Status should toggle
    if (initialText.includes("Published")) {
      await expect(statusBtn).toContainText(/draft/i, { timeout: 10000 });
      // Toggle back to published
      await statusBtn.click();
      await expect(statusBtn).toContainText(/published/i, { timeout: 10000 });
    } else {
      await expect(statusBtn).toContainText(/published/i, { timeout: 10000 });
      // Toggle back
      await statusBtn.click();
      await expect(statusBtn).toContainText(/draft/i, { timeout: 10000 });
    }
  });
});
