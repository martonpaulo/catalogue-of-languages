import { fetchProxyData } from "@/services/proxyService";
import { NationType } from "@/types/nation";

export const fetchNationsData = async (): Promise<NationType[]> => {
  const nationsData = await fetchProxyData<NationType[]>("/api/nations");
  return nationsData;
};
