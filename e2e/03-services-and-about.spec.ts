import { test, expect } from "./fixtures/test-fixtures";

test.describe("CUJ-03: Services Exploration & Client Brief CTA", () => {
  test("displays freelance services with deliverables and 3-step workflow", async ({ page }) => {
    await page.goto("/services");

    // Page title and header
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // Availability status indicator
    const availabilityBadge = page.getByTestId("services-availability-badge");
    await expect(availabilityBadge).toBeVisible();

    // Verify service items rendered
    const serviceHeadings = page.getByRole("heading", { level: 2 });
    const count = await serviceHeadings.count();
    expect(count).toBeGreaterThan(0);

    // Verify 3-step collaboration workflow exists
    await expect(page.locator("text=/01/i").first()).toBeVisible();
    await expect(page.locator("text=/02/i").first()).toBeVisible();
    await expect(page.locator("text=/03/i").first()).toBeVisible();

    // Click service CTA inside main content
    const sendBriefCta = page.locator("main a[href*='topic=freelance']").first();
    await expect(sendBriefCta).toBeVisible();
    await sendBriefCta.click();

    // Should navigate to /contact?topic=freelance
    await expect(page).toHaveURL(/\/contact\?topic=freelance/);

    // Topic selector on contact page should have "freelance" selected
    const topicSelect = page.locator("select[name='topic']");
    await expect(topicSelect).toHaveValue("freelance");
  });
});

test.describe("CUJ-05: About & Career Timeline Verification", () => {
  test("renders about bio, download CV link, career timeline and skills", async ({ page }) => {
    await page.goto("/about");

    // Bio heading
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // Download CV link
    const cvLink = page.getByRole("link", { name: /download cv|unduh cv/i });
    await expect(cvLink).toBeVisible();
    await expect(cvLink).toHaveAttribute("href", /.+/);

    // Career timeline
    const experienceSection = page.locator("#experience");
    await expect(experienceSection).toBeVisible();

    // Experience companies/roles
    const expHeadings = experienceSection.getByRole("heading", { level: 3 });
    const expCount = await expHeadings.count();
    expect(expCount).toBeGreaterThan(0);

    // Skills section
    const skillsHeadings = page.getByRole("heading", { name: /skills|keahlian|capabilities/i }).first();
    await expect(skillsHeadings).toBeVisible();
  });
});
