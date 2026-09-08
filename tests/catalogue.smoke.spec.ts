import { expect, test } from "@playwright/test";

import {
  mockCatalogueApi,
  PAGE_SIZE,
} from "./support/syntheticCatalogue";

test.describe("catalogue smoke journey", () => {
  test.beforeEach(async ({ page }) => {
    await mockCatalogueApi(page);
  });

  test("lists the first page of languages", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: "🌎 Catalogue of Languages" })
    ).toBeVisible();
    await expect(page.getByRole("row").filter({ hasText: "Portuguese" })).toBeVisible();
    await expect(page.getByRole("row")).toHaveCount(PAGE_SIZE + 1); // + header row
  });

  test("applies and resets a name filter", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("row").nth(1)).toBeVisible();

    await page.getByLabel("Language Name").fill("Portuguese");
    await page.getByRole("button", { name: "Apply Filters" }).click();

    await expect(page.getByRole("row")).toHaveCount(2);
    await expect(page.getByRole("row").nth(1)).toContainText("Portuguese");

    await page.getByRole("button", { name: "Reset Filters" }).click();
    await expect(page.getByRole("row")).toHaveCount(PAGE_SIZE + 1);
  });

  test("reveals more rows when the sentinel scrolls into view", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByRole("row")).toHaveCount(PAGE_SIZE + 1);

    await page
      .getByText("Loading more languages...")
      .scrollIntoViewIfNeeded();
    await expect(page.getByRole("row")).toHaveCount(PAGE_SIZE * 2 + 1);
  });

  test("opens a language detail route", async ({ page }) => {
    await page.goto("/por");

    await expect(page.getByRole("heading", { name: "Portuguese" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "POR", exact: true })).toBeVisible();
    await expect(page.getByText("A Romance language")).toBeVisible();
  });

  test("shows the not-found page for an unknown language code", async ({
    page,
  }) => {
    await mockCatalogueApi(page, { missingCodes: ["zzz"] });
    await page.goto("/zzz");

    await expect(page.getByText(/not found/i).first()).toBeVisible({
      timeout: 15_000,
    });
  });
});
