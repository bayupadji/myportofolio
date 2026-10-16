import { test, expect } from "./fixtures/test-fixtures";

test.describe("CUJ-04: Contact Form Submission & Edge Cases", () => {
  test("submits valid contact inquiry successfully (Happy Path)", async ({ page }) => {
    await page.goto("/contact");

    // Verify form container
    const form = page.getByTestId("contact-form");
    await expect(form).toBeVisible();

    // Fill valid form inputs
    await page.locator("#contact-name").fill("Jane Doe QA");
    await page.locator("#contact-email").fill("qa-jane@playwright.test");
    await page.getByTestId("contact-topic-select").selectOption("freelance");
    await page.locator("#contact-body").fill("We would like to hire you for a 3-month design systems contract starting next month.");

    // Submit form
    const submitBtn = page.getByTestId("contact-submit-btn");
    await expect(submitBtn).toBeEnabled();
    await submitBtn.click();

    // Verify success feedback state (using heading inside success container)
    const successHeading = page.getByRole("heading", { name: /Message Received|Pesan Terkirim/i });
    await expect(successHeading).toBeVisible({ timeout: 10000 });
  });

  test("validates required fields and invalid email format (Validation Failures)", async ({ page }) => {
    await page.goto("/contact");
    const form = page.getByTestId("contact-form");

    // 1. Submit empty form
    const submitBtn = page.getByTestId("contact-submit-btn");
    await submitBtn.click();

    // Expect name validation alert inside the form
    const errorAlert = form.getByRole("alert");
    await expect(errorAlert).toBeVisible();
    await expect(errorAlert).toContainText(/name|nama/i);

    // 2. Fill name, but enter invalid email
    await page.locator("#contact-name").fill("John QA");
    await page.locator("#contact-email").fill("not-an-email");
    await submitBtn.click();

    await expect(errorAlert).toBeVisible();
    await expect(errorAlert).toContainText(/email/i);

    // 3. Fill valid email, but message < 10 characters
    await page.locator("#contact-email").fill("valid@playwright.test");
    await page.locator("#contact-body").fill("Too short");
    await submitBtn.click();

    await expect(errorAlert).toBeVisible();
    await expect(errorAlert).toContainText(/10/i);
  });

  test("silently drops spambot submissions via honeypot trap without crashing", async ({ page }) => {
    await page.goto("/contact");

    // Populate the hidden honeypot trap field via script to simulate spambot autofill
    await page.locator("#website-trap").evaluate((el: HTMLInputElement) => {
      el.value = "http://spam-payload-link.com";
      el.dispatchEvent(new Event("change", { bubbles: true }));
    });

    // Fill valid user fields
    await page.locator("#contact-name").fill("Spam Bot 3000");
    await page.locator("#contact-email").fill("spambot@playwright.test");
    await page.locator("#contact-body").fill("Automated unsolicited commercial pitch message here.");

    // Submit form
    await page.getByTestId("contact-submit-btn").click();

    // Honeypot handler returns synthetic success to fool the bot without storing message
    const successHeading = page.getByRole("heading", { name: /Message Received|Pesan Terkirim/i });
    await expect(successHeading).toBeVisible({ timeout: 10000 });
  });

  test("handles server failure gracefully displaying error alert", async ({ page }) => {
    await page.goto("/contact");

    // Intercept Next.js server action POST to simulate a network outage
    await page.route("**/contact**", (route) => {
      if (route.request().method() === "POST") {
        return route.abort("failed");
      }
      return route.continue();
    });

    await page.locator("#contact-name").fill("Network Test");
    await page.locator("#contact-email").fill("netfail@playwright.test");
    await page.locator("#contact-body").fill("Testing network disconnection edge case handling.");

    await page.getByTestId("contact-submit-btn").click();

    // Alert or toast error should notify the user of submission problem
    const alertOrToast = page.getByRole("alert").or(page.getByText(/failed|error|gagal/i));
    await expect(alertOrToast.first()).toBeVisible({ timeout: 10000 });
  });
});
