import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.E2E_PORT ?? 3100);
export const BASE_PATH = "";
const BASE_URL = `http://localhost:${PORT}${BASE_PATH}/`;

/**
 * The catalogue declares Chromium, Gecko and WebKit as acceptance targets, so every project
 * below maps to one of those engine families.
 *
 * The suite runs against the real static export served the way GitHub Pages serves it,
 * from the root of the origin. The development server is deliberately not used: its
 * unknown-route behavior differs from the exported artifact, so it cannot prove the
 * deployed 404 contract. The export is built from the synthetic fixture snapshot, so runs
 * need no credentials and never reach Airtable.
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
    command: [
      "npm run snapshot:fixture",
      "npm run build:export",
      `npm run serve:export -- --port=${PORT} --base-path=${BASE_PATH}`,
    ].join(" && "),
    url: BASE_URL,
    reuseExistingServer: false,
    timeout: 300_000,
    env: {
      NEXT_PUBLIC_STORAGE_PREFIX: "linguae",
      NEXT_PUBLIC_STORAGE_VERSION: "test",
    },
  },
});
