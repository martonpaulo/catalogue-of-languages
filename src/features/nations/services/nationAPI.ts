import { NationType } from "@/features/nations/types/nation.type";
import { fetchSnapshotAsset } from "@/shared/services/snapshotAPI";
import { SnapshotNations } from "@/shared/types/snapshot.type";

export async function fetchNationsData(): Promise<NationType[]> {
  const asset = await fetchSnapshotAsset<SnapshotNations>("nations.json");
  return asset.nations;
}
