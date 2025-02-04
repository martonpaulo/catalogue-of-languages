import { NationType } from "@/features/nations/types/nation.type";
import { fetchProxyData } from "@/shared/services/proxyAPI";

interface FetchNationsDataResponse {
  data: NationType[];
}

export async function fetchNationsData(): Promise<NationType[]> {
  const nationsData = await fetchProxyData<FetchNationsDataResponse>(
    "/api/nations"
  );
  return nationsData.data;
}
