import type { MetadataRoute } from "next";

import { readManifest } from "@/features/languages/server/snapshotSource";
import { canonicalUrl } from "@/shared/config/deployment";

export const dynamic = "force-static";

/**
 * Lists the catalogue and every generated language page. Every entry is under the deployed
 * prefix, which is what makes a sitemap valid at a sub-path of a domain this project does
 * not own.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const manifest = await readManifest();
  const lastModified = new Date(manifest.generatedAt);

  return [
    {
      url: canonicalUrl(),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...manifest.codes.map((code) => ({
      url: canonicalUrl(code),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
