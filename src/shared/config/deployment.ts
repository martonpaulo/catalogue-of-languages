import { SNAPSHOT_DIRECTORY } from "@/shared/types/snapshot.type";

/**
 * Prefix the deployment is served from. Empty: the site is served from the root of its own
 * subdomain. Declared once so the framework configuration
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
  process.env.NEXT_PUBLIC_SITE_ORIGIN ?? "https://linguae.martonpaulo.com";

export const SITE_NAME = "Linguae";

/**
 * What the site is, in the words someone would search for. It follows the name in the home
 * page's title, where the bare brand said nothing a search engine could match.
 */
export const SITE_TAGLINE = "Every documented language in one searchable table";

/** Separates a page's own subject from the brand in every title: `{page} · Linguae`. */
export const TITLE_SEPARATOR = " · ";

/** The home page title: the brand first, then what the site does. */
export const HOME_TITLE = `${SITE_NAME}${TITLE_SEPARATOR}${SITE_TAGLINE}`;

/**
 * Full title of any other page, brand last. The root layout's title template produces the same
 * string for `<title>`; Open Graph and Twitter titles are not templated, so they use this.
 */
export function pageTitle(subject: string): string {
  return `${subject}${TITLE_SEPARATOR}${SITE_NAME}`;
}

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
  url: `${SITE_ORIGIN}${BASE_PATH}/opengraph-image.jpg`,
  width: 1200,
  height: 630,
  type: "image/jpeg",
  alt: `${SITE_NAME}: every documented language from the Wikitongues database, in one searchable table.`,
};
