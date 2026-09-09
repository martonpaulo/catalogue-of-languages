import { mkdir } from "node:fs/promises";
import path from "node:path";

import { chromium } from "@playwright/test";

import { SITE_NAME } from "@/shared/config/deployment";

/**
 * Renders the 1200x630 social card into `public/opengraph-image.jpg`.
 *
 * The card is a committed asset in `public/` rather than a generated route or a file-based
 * metadata convention. A static host serves an extensionless route file with the wrong
 * content type, and the file convention appends a cache-busting query on some routes but not
 * others, so the same image would be advertised under two URLs. Run `npm run social-card`
 * after changing the design below.
 */
const WIDTH = 1200;
const HEIGHT = 630;
const OUTPUT = path.join(process.cwd(), "public", "opengraph-image.jpg");

/**
 * JPEG, not PNG. The card is a linear gradient behind two lines of text, and a lossless screenshot
 * of it weighed 223 kB: almost every byte described a gradient that JPEG stores in a fraction of
 * the space. At this quality the gradient stays smooth and the text stays sharp, and the file is
 * about 50 kB. Open Graph accepts JPEG, and no other consumer of this file cares.
 */
const QUALITY = 88;

const TEMPLATE = `<!doctype html>
<html><head><meta charset="utf-8"><style>
  * { margin: 0; box-sizing: border-box; }
  body {
    width: ${WIDTH}px; height: ${HEIGHT}px;
    display: flex; flex-direction: column; justify-content: center;
    padding: 0 96px;
    background: linear-gradient(135deg, #E3F2FD 0%, #FFFFFF 62%);
    color: #0B2545;
    font-family: -apple-system, "Helvetica Neue", Arial, sans-serif;
  }
  .globe { font-size: 128px; line-height: 1; }
  h1 { font-size: 78px; font-weight: 600; margin-top: 28px; letter-spacing: -1px; }
  p { font-size: 34px; margin-top: 26px; max-width: 900px; color: #24405E; }
</style></head>
<body>
  <div class="globe">🌎</div>
  <h1>${SITE_NAME}</h1>
  <p>Every documented language from the Wikitongues database, in one searchable table.</p>
</body></html>`;

async function main(): Promise<void> {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
  });

  await page.setContent(TEMPLATE, { waitUntil: "load" });
  await mkdir(path.dirname(OUTPUT), { recursive: true });
  await page.screenshot({ path: OUTPUT, type: "jpeg", quality: QUALITY });
  await browser.close();

  console.warn(`Wrote ${path.relative(process.cwd(), OUTPUT)} (${WIDTH}x${HEIGHT})`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
