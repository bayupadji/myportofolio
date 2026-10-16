import { test as base, expect, Page } from "@playwright/test";
import { STORAGE_STATE } from "../../playwright.config";
import { cleanupE2ETestData } from "../helpers/db-fixture";

type CustomFixtures = {
  adminPage: Page;
};

export const test = base.extend<CustomFixtures>({
  adminPage: async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: STORAGE_STATE });
    const page = await context.newPage();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(page);
    await context.close();
  },
});

test.beforeEach(async () => {
  cleanupE2ETestData();
});

test.afterEach(async () => {
  cleanupE2ETestData();
});

export { expect };
