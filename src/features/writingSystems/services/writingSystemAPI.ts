import { WritingSystemType } from "@/features/writingSystems/types/writingSystem.type";
import { fetchSnapshotAsset } from "@/shared/services/snapshotAPI";
import { SnapshotWritingSystems } from "@/shared/types/snapshot.type";

export async function fetchWritingSystemsData(): Promise<WritingSystemType[]> {
  const asset =
    await fetchSnapshotAsset<SnapshotWritingSystems>("writing-systems.json");
  return asset.writingSystems;
}
