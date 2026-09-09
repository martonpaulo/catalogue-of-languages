import { SNAPSHOT_DIRECTORY } from "@/shared/types/snapshot.type";

/**
 * Prefix the deployment is served from. Empty during development and tests, and set to the
 * published sub-path by the production build. Declared once so the framework configuration
 * and the snapshot asset URLs cannot disagree.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** URL of one published snapshot asset, relative to the deployed origin. */
export function snapshotAssetUrl(assetPath: string): string {
  return `${BASE_PATH}/${SNAPSHOT_DIRECTORY}/${assetPath}`;
}

/**
 * Origin the catalogue is published under. Declared once so canonical, Open Graph and
 * sitemap URLs cannot disagree with each other or with the deployment.
 */
export const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN ?? "https://martonpaulo.com";

export const SITE_NAME = "Catalogue of Languages";

export const SITE_DESCRIPTION =
  "Interactive table featuring all documented languages from the Wikitongues database, " +
  "providing an easy way to explore global linguistic diversity.";

/**
 * Absolute URL of a page, in the form the deployment actually answers: every path ends in a
 * trailing slash, so a canonical never points at a URL that redirects.
 */
export function canonicalUrl(path = ""): string {
  const normalized = path ? `${path.replace(/^\/|\/$/g, "")}/` : "";
  return `${SITE_ORIGIN}${BASE_PATH}/${normalized}`;
}

/**
 * The shared social card. It is declared here rather than left to the file convention,
 * because a nested route that sets its own Open Graph metadata does not inherit it.
 */
export const SOCIAL_IMAGE = {
  url: `${SITE_ORIGIN}${BASE_PATH}/opengraph-image.png`,
  width: 1200,
  height: 630,
  type: "image/png",
  alt: `${SITE_NAME}: every documented language from the Wikitongues database, in one searchable table.`,
};
