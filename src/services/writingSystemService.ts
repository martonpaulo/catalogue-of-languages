import { fetchProxyData } from "@/services/proxyService";
import { WritingSystemType } from "@/types/writingSystem";

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
