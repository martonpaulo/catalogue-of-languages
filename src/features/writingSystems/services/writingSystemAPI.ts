import { WritingSystemType } from "@/features/writingSystems/types/writingSystem.type";
import { fetchProxyData } from "@/shared/services/proxyAPI";

interface FetchWritingSystemsDataResponse {
  data: WritingSystemType[];
}

export async function fetchWritingSystemsData(): Promise<WritingSystemType[]> {
  const writingSystemsData =
    await fetchProxyData<FetchWritingSystemsDataResponse>(
      "/api/writing-systems"
    );
  return writingSystemsData.data;
}
