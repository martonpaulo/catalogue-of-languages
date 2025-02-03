import { fetchProxyData } from "@/services/proxyService";
import { NationType } from "@/types/nation";

interface FetchNationsDataResponse {
  data: NationType[];
}

export async function fetchNationsData(): Promise<NationType[]> {
  const nationsData = await fetchProxyData<FetchNationsDataResponse>(
    "/api/nations"
  );
  return nationsData.data;
}
