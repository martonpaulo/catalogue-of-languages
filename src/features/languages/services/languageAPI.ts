import { LanguageFilterFormValues } from "@/features/languages/components/languageFilters.schema";
import { LanguageType } from "@/features/languages/types/language.type";
import { fetchProxyData } from "@/shared/services/proxyAPI";

interface PaginatedLanguagesResponse {
  data: LanguageType[];
  nextOffset: string;
}

export interface FetchPaginatedLanguagesDataParams {
  pageParam?: string;
  languageFilterParams?: LanguageFilterFormValues;
}

export async function fetchPaginatedLanguagesData({
  pageParam,
  languageFilterParams,
}: FetchPaginatedLanguagesDataParams): Promise<PaginatedLanguagesResponse> {
  const params = new URLSearchParams();
  if (pageParam) params.set("offset", pageParam);
  const { code, name, status, nationOfOrigin, writingSystem, spokenIn } =
    languageFilterParams || {};

  if (code) params.set("code", code);
  if (name) params.set("name", name);
  if (status) params.set("status", status);
  if (nationOfOrigin) params.set("nationOfOrigin", nationOfOrigin);
  if (writingSystem) params.set("writingSystem", writingSystem);
  if (spokenIn) params.set("spokenIn", spokenIn);

  const url = `/api/languages?${params.toString()}`;

  const PaginatedLanguagesResponse =
    await fetchProxyData<PaginatedLanguagesResponse>(url);
  return PaginatedLanguagesResponse;
}
