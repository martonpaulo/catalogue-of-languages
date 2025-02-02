import { fetchProxyData } from "@/services/proxyService";
import { LanguageType } from "@/types/language";

export const fetchLanguagesData = async (): Promise<LanguageType[]> => {
  const languagesData = await fetchProxyData<LanguageType[]>("/api/languages");
  return languagesData;
};
