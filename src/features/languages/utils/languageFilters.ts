import { LanguageFilterFormValues } from "@/features/languages/components/languageFilters.schema";
import { LanguageType } from "@/features/languages/types/language.type";

export function filterLanguages(
  languages: LanguageType[],
  filters: LanguageFilterFormValues
): LanguageType[] {
  return languages.filter((language) => {
    const matchesCode =
      !filters?.code ||
      language.code.toLowerCase().includes(filters.code.toLowerCase());

    const matchesName =
      !filters?.name ||
      language.name.toLowerCase().includes(filters.name.toLowerCase());

    const matchesStatus =
      !filters?.status || language.status === filters.status;

    const matchesSpokenIn =
      !filters?.spokenIn || language.spokenIn?.includes(filters.spokenIn);

    const matchesWritingSystem =
      !filters?.writingSystem ||
      language.writingSystem?.includes(filters.writingSystem);

    const matchesNationOfOrigin =
      !filters?.nationOfOrigin ||
      language.nationOfOrigin?.includes(filters.nationOfOrigin);

    return (
      matchesCode &&
      matchesName &&
      matchesStatus &&
      matchesSpokenIn &&
      matchesWritingSystem &&
      matchesNationOfOrigin
    );
  });
}
