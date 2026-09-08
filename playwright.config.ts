import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.E2E_PORT ?? 3100);
const BASE_URL = `http://localhost:${PORT}`;

/**
 * The catalogue declares Chromium, Gecko and WebKit as acceptance targets, so every
 * project below maps to one of those engine families. The application server runs with
 * placeholder Airtable configuration: the specs intercept `/api/**` in the browser and
 * answer with the synthetic catalogue, so no request ever reaches Airtable.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  expect: { timeout: 15_000 },
  timeout: 60_000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [["github"], ["list"]] : [["list"]],
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  webServer: {
    command: `npx next dev --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      AIRTABLE_API_KEY: "synthetic-key",
      AIRTABLE_BASE_ID: "appSynthetic",
      LANGUAGES_TABLE_ID: "tblLanguages",
      WRITING_SYSTEMS_TABLE_ID: "tblWritingSystems",
      NATIONS_TABLE_ID: "tblNations",
      NEXT_PUBLIC_STORAGE_PREFIX: "catalogue-of-languages",
      NEXT_PUBLIC_STORAGE_VERSION: "test",
    },
  },
});
