import { fetchProxyData } from "@/services/proxyService";
import { WritingSystemType } from "@/types/writingSystem";

export const fetchWritingSystemsData = async (): Promise<
  WritingSystemType[]
> => {
  const writingSystemsData = await fetchProxyData<WritingSystemType[]>(
    "/api/writing-systems"
  );
  return writingSystemsData;
};
