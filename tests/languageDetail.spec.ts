import { expect, test } from "@playwright/test";

import { BASE_PATH } from "../playwright.config";
import {
  applyNameFilter,
  EXTINCT_LANGUAGE,
  NAMED_LANGUAGE,
  NEARLY_EXTINCT_LANGUAGE,
} from "./support/syntheticCatalogue";

test.describe("language detail outcomes", () => {
  test("renders a record whose delivery took longer than five seconds", async ({
    page,
  }) => {
    // The previous implementation declared not-found after a five-second timer.
    await page.route(`**${BASE_PATH}/${NAMED_LANGUAGE.code}/`, async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 6_000));
      await route.continue();
    });

    await page.goto(`${NAMED_LANGUAGE.code}/`);

    await expect(
      page.getByRole("heading", { name: NAMED_LANGUAGE.name })
    ).toBeVisible();
    await expect(page.getByText("Page not found")).toHaveCount(0);
  });

  test("reports a code the snapshot does not publish as not found", async ({
    page,
  }) => {
    const response = await page.goto("zzz/");

    expect(response?.status()).toBe(404);
    await expect(page.getByText("Page not found")).toBeVisible();
  });

  test("shows each code its own record when navigating between them", async ({
    page,
  }) => {
    await page.goto(`${EXTINCT_LANGUAGE.code}/`);
    await expect(
      page.getByRole("heading", { name: EXTINCT_LANGUAGE.name, exact: true })
    ).toBeVisible();

    await page.goto(`${NEARLY_EXTINCT_LANGUAGE.code}/`);
    await expect(
      page.getByRole("heading", { name: NEARLY_EXTINCT_LANGUAGE.name, exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: EXTINCT_LANGUAGE.name, exact: true })
    ).toHaveCount(0);
  });

  test("reaches a detail record from the catalogue by client navigation", async ({
    page,
  }) => {
    await page.goto("");
    await applyNameFilter(page, "Lusophone");
    await expect(page.getByRole("row")).toHaveCount(2);

    await page.getByRole("row").nth(1).click();

    await expect(page).toHaveURL(new RegExp(`${NAMED_LANGUAGE.code}/?$`));
    await expect(
      page.getByRole("heading", { name: NAMED_LANGUAGE.name })
    ).toBeVisible();
  });

  test("carries the language name into the page title", async ({ page }) => {
    await page.goto(`${NAMED_LANGUAGE.code}/`);

    await expect(page).toHaveTitle(
      `${NAMED_LANGUAGE.name} language · Linguae`
    );
  });
});
