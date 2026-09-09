import { fetchSnapshotAsset } from "@/shared/services/snapshotAPI";
import { SnapshotIndex } from "@/shared/types/snapshot.type";

/** Loads the published catalogue index once; filtering and paging happen locally. */
export async function fetchLanguageIndex(): Promise<SnapshotIndex> {
  return fetchSnapshotAsset<SnapshotIndex>("index.json");
}
