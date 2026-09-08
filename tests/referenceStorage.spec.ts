import { expect, test } from "@playwright/test";

import { mockCatalogueApi } from "./support/syntheticCatalogue";

/**
 * React Query is the single owner of fetched reference data. Nothing may copy nations or
 * writing systems into a second persisted owner, because such a copy is never read back
 * and cannot recover a failed query.
 */
test("does not copy reference data into application storage", async ({
  page,
}) => {
  await mockCatalogueApi(page);
  await page.goto("/");

  // The reference data has arrived once the lookup-backed selects are populated.
  await page.getByRole("row").nth(1).waitFor();
  await page.getByLabel("Nation of Origin").click();
  await expect(page.getByRole("option", { name: "Brazil" })).toBeVisible();
  await page.keyboard.press("Escape");

  const referenceKeys = await page.evaluate(() =>
    Object.keys(window.localStorage).filter(
      (key) => key.includes("nation-store") || key.includes("writing-system-store")
    )
  );

  expect(referenceKeys).toEqual([]);
});
