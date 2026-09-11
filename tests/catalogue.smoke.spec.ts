import { expect, test } from "@playwright/test";

import {
  applyNameFilter,
  FIXTURE_LANGUAGE_COUNT,
  NAMED_LANGUAGE,
  REVEAL_STEP,
  waitForCatalogue,
} from "./support/syntheticCatalogue";

test.describe("catalogue smoke journey", () => {
  test("lists the first reveal step of languages", async ({ page }) => {
    await page.goto("");

    await expect(
      page.getByRole("heading", { name: "Linguae" })
    ).toBeVisible();
    await expect(page.getByRole("row")).toHaveCount(REVEAL_STEP + 1); // + header
  });

  test("applies and resets a name filter", async ({ page }) => {
    await page.goto("");
    await applyNameFilter(page, "Lusophone");

    await expect(page.getByRole("row")).toHaveCount(2);
    await expect(page.getByRole("row").nth(1)).toContainText(
      NAMED_LANGUAGE.name
    );

    await page.getByRole("button", { name: "Reset Filters" }).click();
    await expect(page.getByRole("row")).toHaveCount(REVEAL_STEP + 1);
  });

  test("reveals the remaining rows when the sentinel scrolls into view", async ({
    page,
  }) => {
    await page.goto("");
    await waitForCatalogue(page);

    await page
      .getByText("Loading more languages...")
      .scrollIntoViewIfNeeded();

    await expect(page.getByRole("row")).toHaveCount(
      FIXTURE_LANGUAGE_COUNT + 1
    );
  });

  test("opens a language detail route", async ({ page }) => {
    await page.goto(`${NAMED_LANGUAGE.code}/`);

    await expect(
      page.getByRole("heading", { name: NAMED_LANGUAGE.name })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "POR", exact: true })
    ).toBeVisible();
    await expect(page.getByText(NAMED_LANGUAGE.description)).toBeVisible();
  });

  test("shows the not-found page for a code the snapshot does not publish", async ({
    page,
  }) => {
    const response = await page.goto("zzz/");

    expect(response?.status()).toBe(404);
    await expect(page.getByText("Page not found")).toBeVisible();
  });
});
