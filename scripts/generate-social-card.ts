import { execFileSync } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { chromium } from "@playwright/test";

/**
 * Renders `design/social-card/social-card.html` into `public/social-card.jpg` (on a Mac, with
 * ImageMagick: the drawn interface uses the system font).
 *
 * The card is a committed asset in `public/` rather than a generated route or a file-based
 * metadata convention. A static host serves an extensionless route file with the wrong
 * content type, and the file convention appends a cache-busting query on some routes but not
 * others, so the same image would be advertised under two URLs. Run `pnpm social-card`
 * after changing the design.
 *
 * JPEG q92 with 4:4:4 chroma: a lossless screenshot spends most of its bytes on the gradient,
 * and Chromium's own JPEG subsamples colour, which softens coloured text.
 */
const WIDTH = 1200;
const HEIGHT = 630;
const SOURCE = path.join(process.cwd(), "design", "social-card", "social-card.html");
const OUTPUT = path.join(process.cwd(), "public", "social-card.jpg");

async function main(): Promise<void> {
  const dir = await mkdtemp(path.join(tmpdir(), "linguae-card-"));
  const png = path.join(dir, "card.png");
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({
      viewport: { width: WIDTH, height: HEIGHT },
      deviceScaleFactor: 1,
    });
    await page.goto(pathToFileURL(SOURCE).href, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: png });
  } finally {
    await browser.close();
  }
  execFileSync("magick", [
    png, "-strip", "-quality", "92", "-sampling-factor", "4:4:4", "-interlace", "Plane", OUTPUT,
  ]);
  await rm(dir, { recursive: true, force: true });
}

void main();
