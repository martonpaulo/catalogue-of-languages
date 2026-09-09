import { expect, test } from "@playwright/test";

import {
  applyNameFilter,
  FIXTURE_LANGUAGE_COUNT,
  REVEAL_STEP,
  waitForCatalogue,
} from "./support/syntheticCatalogue";

/** Builds a snapshot payload of any size, to exercise the derivation at real scale. */
function largeSnapshot(languageCount: number, nationCount: number) {
  return {
    index: {
      version: "measured",
      languages: Array.from({ length: languageCount }, (_, index) => ({
        id: `rec_${index}`,
        code: `c${index}`,
        name: `Measured Language ${index}`,
        status: index % 2 === 0 ? "vigorous" : "shifting",
        spokenInId: [`nat_${index % nationCount}`],
        writingSystemId: [`ws_${index % 20}`],
        nationOfOriginId: [`nat_${(index * 3) % nationCount}`],
      })),
    },
    nations: {
      version: "measured",
      nations: Array.from({ length: nationCount }, (_, index) => ({
        id: `nat_${index}`,
        name: `Nation ${index}`,
      })),
    },
    writingSystems: {
      version: "measured",
      writingSystems: Array.from({ length: 20 }, (_, index) => ({
        id: `ws_${index}`,
        name: `Writing System ${index}`,
      })),
    },
  };
}

async function measureReveal(
  page: import("@playwright/test").Page,
  languageCount: number
) {
  const snapshot = largeSnapshot(languageCount, 200);
  const assets: [string, unknown][] = [
    ["**/catalogue/index.json", snapshot.index],
    ["**/catalogue/nations.json", snapshot.nations],
    ["**/catalogue/writing-systems.json", snapshot.writingSystems],
  ];

  for (const [pattern, body] of assets) {
    await page.route(pattern, (route) =>
      route.fulfill({
        contentType: "application/json",
        body: JSON.stringify(body),
      })
    );
  }

  const startedAt = Date.now();
  await page.goto("");
  await expect(page.getByRole("row")).toHaveCount(REVEAL_STEP + 1);
  const initialMs = Date.now() - startedAt;

  const revealStartedAt = Date.now();
  await page.getByText("Loading more languages...").scrollIntoViewIfNeeded();
  await expect(page.getByRole("row")).toHaveCount(REVEAL_STEP * 2 + 1);
  const revealMs = Date.now() - revealStartedAt;

  for (const [pattern] of assets) await page.unroute(pattern);

  return { initialMs, revealMs };
}

test.describe("catalogue derivation", () => {
  test("reveals rows at a cost independent of the snapshot size", async ({
    page,
  }, testInfo) => {
    // If revealing re-derived the snapshot, a 16x larger catalogue would make the reveal
    // step roughly 16x more expensive. Measuring both sizes tests that invariant directly.
    const small = await measureReveal(page, 500);
    const large = await measureReveal(page, 8_000);

    testInfo.annotations.push({
      type: "measurement",
      description:
        `500 languages: initial ${small.initialMs} ms, reveal ${small.revealMs} ms; ` +
        `8000 languages: initial ${large.initialMs} ms, reveal ${large.revealMs} ms`,
    });

    expect(large.revealMs).toBeLessThan(Math.max(small.revealMs, 20) * 4);
  });

  test("keeps the rows it already showed when revealing more", async ({
    page,
  }) => {
    await page.goto("");
    await waitForCatalogue(page);

    const before = await page.getByRole("row").allInnerTexts();

    await page.getByText("Loading more languages...").scrollIntoViewIfNeeded();
    await expect(page.getByRole("row")).toHaveCount(FIXTURE_LANGUAGE_COUNT + 1);

    const after = await page.getByRole("row").allInnerTexts();
    expect(after.slice(0, before.length)).toEqual(before);
  });

  test("restores the same result when a filter is applied and removed", async ({
    page,
  }) => {
    await page.goto("");
    await waitForCatalogue(page);
    const before = await page.getByRole("row").allInnerTexts();

    await applyNameFilter(page, "Lusophone");
    await expect(page.getByRole("row")).toHaveCount(2);

    await page.getByRole("button", { name: "Reset Filters" }).click();
    await expect(page.getByRole("row")).toHaveCount(REVEAL_STEP + 1);

    expect(await page.getByRole("row").allInnerTexts()).toEqual(before);
  });

  test("restarts the reveal position when the filter changes", async ({
    page,
  }) => {
    await page.goto("");
    await waitForCatalogue(page);
    await page.getByText("Loading more languages...").scrollIntoViewIfNeeded();
    await expect(page.getByRole("row")).toHaveCount(FIXTURE_LANGUAGE_COUNT + 1);

    await page.getByLabel("Language Name").fill("Synthetic");
    await page.getByRole("button", { name: "Apply Filters" }).click();

    await expect(page.getByRole("row")).toHaveCount(REVEAL_STEP + 1);
  });

  test("falls back to the raw relation id when a reference name is missing", async ({
    page,
  }) => {
    await page.goto("");
    await applyNameFilter(page, "Unknown Status Sample");

    await expect(page.getByRole("row").nth(1)).toContainText("nat_missing");
  });
});
