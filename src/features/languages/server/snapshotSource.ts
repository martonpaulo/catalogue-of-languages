import { readFile } from "node:fs/promises";
import path from "node:path";

import { LanguageType } from "@/features/languages/types/language.type";
import { enrichLanguagesDataWithNames } from "@/features/languages/utils/languageEnrichers";
import {
  SNAPSHOT_BUILD_DIRECTORY,
  SNAPSHOT_DIRECTORY,
  SnapshotLanguageDetail,
  SnapshotManifest,
  SnapshotNations,
  SnapshotWritingSystems,
} from "@/shared/types/snapshot.type";

const BUILD_ROOT = path.join(process.cwd(), SNAPSHOT_BUILD_DIRECTORY);
const PUBLIC_ROOT = path.join(process.cwd(), "public", SNAPSHOT_DIRECTORY);

/**
 * Build-time reader for the published snapshot. It runs while the static pages are
 * generated, so a detail page ships with its record already resolved and the browser never
 * requests it. Reads are memoized because every generated page shares the same references.
 */
export async function readManifest(): Promise<SnapshotManifest> {
  return readAsset<SnapshotManifest>(BUILD_ROOT, "manifest.json");
}

/** The enriched record for one code, or null when the snapshot does not publish it. */
export async function readEnrichedLanguage(
  code: string
): Promise<LanguageType | null> {
  const normalized = code.toLowerCase();
  const manifest = await readManifest();
  if (!manifest.codes.includes(normalized)) return null;

  const [detail, nations, writingSystems] = await Promise.all([
    readAsset<SnapshotLanguageDetail>(BUILD_ROOT, `languages/${normalized}.json`),
    readAsset<SnapshotNations>(PUBLIC_ROOT, "nations.json"),
    readAsset<SnapshotWritingSystems>(PUBLIC_ROOT, "writing-systems.json"),
  ]);

  return enrichLanguagesDataWithNames(
    detail.language,
    nations.nations,
    writingSystems.writingSystems
  );
}

const cache = new Map<string, Promise<unknown>>();

function readAsset<T>(root: string, assetPath: string): Promise<T> {
  const key = path.join(root, assetPath);
  const cached = cache.get(key);
  if (cached) return cached as Promise<T>;

  const pending = readFile(key, "utf8")
    .then((content) => JSON.parse(content) as T)
    .catch(() => {
      throw new Error(
        `Missing snapshot asset "${assetPath}". Run "pnpm snapshot" for the published ` +
          `catalogue or "pnpm snapshot:fixture" for the synthetic one.`
      );
    });

  cache.set(key, pending);
  return pending;
}
