import { LanguageType } from "@/features/languages/types/language.type";
import { fetchProxyData } from "@/shared/services/proxyAPI";

interface PaginatedLanguagesResponse {
  data: LanguageType[];
  nextOffset: string;
}

export interface FetchPaginatedLanguagesDataParams {
  pageParam?: string;
}

export async function fetchPaginatedLanguagesData({
  pageParam,
}: FetchPaginatedLanguagesDataParams): Promise<PaginatedLanguagesResponse> {
  const params = new URLSearchParams();
  if (pageParam) params.set("offset", pageParam);

  const url = `/api/languages?${params.toString()}`;

  const PaginatedLanguagesResponse =
    await fetchProxyData<PaginatedLanguagesResponse>(url);
  return PaginatedLanguagesResponse;
}
