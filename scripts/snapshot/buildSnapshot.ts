import { createHash } from "node:crypto";
import { mkdir, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { LanguageType } from "@/features/languages/types/language.type";
import { LanguageStatusEnum } from "@/features/languages/types/languageStatus.enum";
import {
  transformAirtableRecordsToBasicLanguages,
  transformAirtableRecordsToDetailedLanguages,
} from "@/features/languages/utils/languageMappers";
import { NationType } from "@/features/nations/types/nation.type";
import { mapAirtableRecordsToNations } from "@/features/nations/utils/nationMappers";
import { WritingSystemType } from "@/features/writingSystems/types/writingSystem.type";
import { mapAirtableRecordsToWritingSystems } from "@/features/writingSystems/utils/writingSystemMapper";
import { AirtableRecordType } from "@/shared/types/airtableRecord.type";
import {
  SNAPSHOT_BUILD_DIRECTORY,
  SNAPSHOT_DIRECTORY,
  SnapshotIndex,
  SnapshotLanguageDetail,
  SnapshotLanguageIndexEntry,
  SnapshotManifest,
  SnapshotNations,
  SnapshotWritingSystems,
} from "@/shared/types/snapshot.type";

/** A language code is exactly three ASCII letters, which is also what the route accepts. */
const CODE_PATTERN = /^[a-z]{3}$/;

export interface SnapshotSource {
  languages: AirtableRecordType[];
  nations: AirtableRecordType[];
  writingSystems: AirtableRecordType[];
}

export interface SnapshotReport {
  version: string;
  languageCount: number;
  nationCount: number;
  writingSystemCount: number;
  statuses: LanguageStatusEnum[];
  skipped: string[];
}

/** Absolute path of the published snapshot assets, served from `public/`. */
export function snapshotPublicDirectory(projectRoot: string): string {
  return path.join(projectRoot, "public", SNAPSHOT_DIRECTORY);
}

/** Absolute path of the build-only snapshot data, never served. */
export function snapshotBuildDirectory(projectRoot: string): string {
  return path.join(projectRoot, SNAPSHOT_BUILD_DIRECTORY);
}

/**
 * Projects raw records into the public snapshot, validates them, writes the whole set into
 * a staging directory and only then replaces the published one. A failure anywhere leaves
 * the previously published snapshot untouched.
 */
export async function buildSnapshot(
  source: SnapshotSource,
  projectRoot: string
): Promise<SnapshotReport> {
  const nations = validateReferences(
    mapAirtableRecordsToNations(source.nations),
    "nation"
  );
  const writingSystems = validateReferences(
    mapAirtableRecordsToWritingSystems(source.writingSystems),
    "writing system"
  );

  const { languages, details, skipped } = selectLanguages(source.languages);

  if (languages.length === 0) {
    throw new Error("Refusing to publish a snapshot with no languages");
  }

  const version = contentVersion({ languages, nations, writingSystems });
  const statuses = presentStatuses(languages);

  const manifest: SnapshotManifest = {
    version,
    generatedAt: new Date().toISOString(),
    languageCount: languages.length,
    codes: languages.map((language) => language.code),
    statuses,
  };

  const publicDirectory = snapshotPublicDirectory(projectRoot);
  const buildDirectory = snapshotBuildDirectory(projectRoot);
  const publicStaging = `${publicDirectory}.staging`;
  const buildStaging = `${buildDirectory}.staging`;

  await rm(publicStaging, { recursive: true, force: true });
  await rm(buildStaging, { recursive: true, force: true });
  await mkdir(publicStaging, { recursive: true });
  await mkdir(path.join(buildStaging, "languages"), { recursive: true });

  await writeJson(path.join(publicStaging, "index.json"), {
    version,
    languages,
  } satisfies SnapshotIndex);
  await writeJson(path.join(publicStaging, "nations.json"), {
    version,
    nations,
  } satisfies SnapshotNations);
  await writeJson(path.join(publicStaging, "writing-systems.json"), {
    version,
    writingSystems,
  } satisfies SnapshotWritingSystems);

  await writeJson(path.join(buildStaging, "manifest.json"), manifest);
  for (const language of details) {
    await writeJson(
      resolveDetailPath(buildStaging, language.code),
      { version, language } satisfies SnapshotLanguageDetail
    );
  }

  await promote(publicStaging, publicDirectory);
  await promote(buildStaging, buildDirectory);

  return {
    version,
    languageCount: languages.length,
    nationCount: nations.length,
    writingSystemCount: writingSystems.length,
    statuses,
    skipped,
  };
}

interface SelectedLanguages {
  languages: SnapshotLanguageIndexEntry[];
  details: LanguageType[];
  skipped: string[];
}

/**
 * Keeps only records with a usable code and name, and rejects duplicate codes rather than
 * letting one language silently overwrite another's detail asset.
 */
function selectLanguages(records: AirtableRecordType[]): SelectedLanguages {
  const languages: SnapshotLanguageIndexEntry[] = [];
  const details: LanguageType[] = [];
  const skipped: string[] = [];
  const seen = new Set<string>();

  const basics = transformAirtableRecordsToBasicLanguages(records);
  const detailed = transformAirtableRecordsToDetailedLanguages(records);

  basics.forEach((basic, index) => {
    const code = typeof basic.code === "string" ? basic.code.toLowerCase() : "";

    if (!CODE_PATTERN.test(code)) {
      skipped.push(`${basic.id}: unusable code`);
      return;
    }
    if (typeof basic.name !== "string" || basic.name.trim() === "") {
      skipped.push(`${basic.id}: missing name`);
      return;
    }
    if (seen.has(code)) {
      skipped.push(`${basic.id}: duplicate code`);
      return;
    }

    seen.add(code);
    languages.push(projectIndexEntry({ ...basic, code }));
    details.push(projectDetail({ ...detailed[index], code }));
  });

  languages.sort((first, second) => first.code.localeCompare(second.code));
  details.sort((first, second) => first.code.localeCompare(second.code));

  return { languages, details, skipped };
}

/** Explicit allowlist: only these fields are published to the list asset. */
function projectIndexEntry(
  language: LanguageType
): SnapshotLanguageIndexEntry {
  return {
    id: language.id,
    code: language.code,
    name: language.name,
    status: language.status,
    spokenInId: relationIds(language.spokenInId),
    writingSystemId: relationIds(language.writingSystemId),
    nationOfOriginId: relationIds(language.nationOfOriginId),
  };
}

/** Explicit allowlist: only these fields are published to a detail asset. */
function projectDetail(language: LanguageType): LanguageType {
  return {
    ...projectIndexEntry(language),
    alternateNames: language.alternateNames,
    dialects: language.dialects,
    statusNotes: language.statusNotes,
    genealogy: language.genealogy,
    demographics: language.demographics,
    use: language.use,
    development: language.development,
    typology: language.typology,
    comments: language.comments,
    description: language.description,
  };
}

function relationIds(ids: unknown): string[] {
  if (!Array.isArray(ids)) return [];
  return ids.filter((id): id is string => typeof id === "string");
}

function validateReferences<T extends NationType | WritingSystemType>(
  entries: T[],
  label: string
): T[] {
  const valid = entries.filter(
    (entry) =>
      typeof entry.id === "string" &&
      typeof entry.name === "string" &&
      entry.name.trim() !== ""
  );

  if (valid.length === 0) {
    throw new Error(`Refusing to publish a snapshot with no ${label} records`);
  }

  return valid;
}

function presentStatuses(
  languages: SnapshotLanguageIndexEntry[]
): LanguageStatusEnum[] {
  const present = new Set(
    languages
      .map((language) => language.status)
      .filter((status): status is LanguageStatusEnum => Boolean(status))
  );

  return Object.values(LanguageStatusEnum).filter((status) =>
    present.has(status)
  );
}

/**
 * Content-addressed version: the same source data always produces the same version, so a
 * rebuild that changed nothing does not invalidate a browser's cached assets.
 */
function contentVersion(content: {
  languages: SnapshotLanguageIndexEntry[];
  nations: NationType[];
  writingSystems: WritingSystemType[];
}): string {
  return createHash("sha256")
    .update(JSON.stringify(content))
    .digest("hex")
    .slice(0, 16);
}

/** Replaces a directory only once its complete replacement has been written. */
async function promote(staging: string, target: string): Promise<void> {
  await rm(target, { recursive: true, force: true });
  await mkdir(path.dirname(target), { recursive: true });
  await rename(staging, target);
}

/** Guards against a code escaping the snapshot directory through its filename. */
function resolveDetailPath(stagingDirectory: string, code: string): string {
  const languagesDirectory = path.join(stagingDirectory, "languages");
  const target = path.join(languagesDirectory, `${code}.json`);

  if (path.dirname(target) !== languagesDirectory) {
    throw new Error(`Refusing to write a detail asset outside the snapshot`);
  }

  return target;
}

async function writeJson(target: string, content: unknown): Promise<void> {
  await writeFile(target, JSON.stringify(content), "utf8");
}
