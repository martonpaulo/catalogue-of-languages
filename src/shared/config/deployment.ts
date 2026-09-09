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
