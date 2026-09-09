import { snapshotAssetUrl } from "@/shared/config/deployment";

/** A snapshot asset that could not be read, as opposed to a language that does not exist. */
export class SnapshotAssetError extends Error {
  constructor(
    readonly assetPath: string,
    readonly status?: number
  ) {
    super(
      status
        ? `Failed to load ${assetPath}: ${status}`
        : `Failed to load ${assetPath}`
    );
    this.name = "SnapshotAssetError";
  }
}

/** Reads one published snapshot asset. The browser's own HTTP cache owns freshness. */
export async function fetchSnapshotAsset<T>(assetPath: string): Promise<T> {
  let response: Response;

  try {
    response = await fetch(snapshotAssetUrl(assetPath));
  } catch {
    throw new SnapshotAssetError(assetPath);
  }

  if (!response.ok) {
    throw new SnapshotAssetError(assetPath, response.status);
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new SnapshotAssetError(assetPath);
  }
}
