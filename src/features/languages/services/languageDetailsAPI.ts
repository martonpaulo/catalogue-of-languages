import { LanguageType } from "@/features/languages/types/language.type";
import { fetchProxyData } from "@/shared/services/proxyAPI";

interface FetchLanguageDetailsDataResponse {
  data: LanguageType;
}

export interface FetchLanguageDetailsDataParams {
  code: string;
}

export async function fetchLanguageDetailsData({
  code,
}: FetchLanguageDetailsDataParams): Promise<LanguageType> {
  const languageDetailData =
    await fetchProxyData<FetchLanguageDetailsDataResponse>(
      `/api/languages/${code}`
    );
  return languageDetailData.data;
}
