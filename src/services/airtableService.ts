import { fetchFromProxy } from "@/services/proxyClient";
import type { LanguageType } from "@/types/language";

export class AirtableRepository {
  static async fetchLanguages(): Promise<LanguageType[]> {
    const languagesData = await fetchFromProxy<LanguageType[]>("/api/airtable");
    return languagesData;
  }
}
