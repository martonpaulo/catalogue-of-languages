import { LanguageType } from "@/features/languages/types/language.type";
import { LanguageStatusEnum } from "@/features/languages/types/languageStatus.enum";
import { NationType } from "@/features/nations/types/nation.type";
import { WritingSystemType } from "@/features/writingSystems/types/writingSystem.type";

/** Directory, under the deployed base path, that holds every published snapshot asset. */
export const SNAPSHOT_DIRECTORY = "catalogue";

/**
 * Directory holding the parts of a snapshot the build consumes but the site never serves:
 * the code manifest and one record per language. Keeping them out of `public/` means the
 * deployed artifact carries only what a browser actually requests.
 */
export const SNAPSHOT_BUILD_DIRECTORY = ".snapshot";

/**
 * Identifies one generation of the public catalogue. Every asset in a snapshot shares the
 * same `version`, so a consumer can tell whether the index, the references and a detail
 * record it holds came from the same generation.
 */
export type SnapshotManifest = {
  version: string;
  generatedAt: string;
  languageCount: number;
  /** Every language code the snapshot publishes. Absence here is authoritative. */
  codes: string[];
  /** Status categories actually present in this snapshot, in enum order. */
  statuses: LanguageStatusEnum[];
};

/** The list projection: only the fields the catalogue table renders. */
export type SnapshotLanguageIndexEntry = Pick<
  LanguageType,
  | "id"
  | "code"
  | "name"
  | "status"
  | "spokenInId"
  | "writingSystemId"
  | "nationOfOriginId"
>;

export type SnapshotIndex = {
  version: string;
  languages: SnapshotLanguageIndexEntry[];
};

export type SnapshotNations = {
  version: string;
  nations: NationType[];
};

export type SnapshotWritingSystems = {
  version: string;
  writingSystems: WritingSystemType[];
};

export type SnapshotLanguageDetail = {
  version: string;
  language: LanguageType;
};
