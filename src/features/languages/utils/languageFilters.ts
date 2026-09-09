import {
  LanguageFilterFormValues,
  languageFilterSchema,
} from "@/features/languages/components/languageFilters.schema";
import { LanguageType } from "@/features/languages/types/language.type";
import {
  readStoredText,
  writeStoredText,
} from "@/shared/utils/localStorageUtils";

const FILTER_STORAGE_KEY = "language-filters";

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

export const DEFAULT_LANGUAGE_FILTERS: LanguageFilterFormValues = {
  code: "",
  name: "",
  status: "",
  spokenIn: "",
  writingSystem: "",
  nationOfOrigin: "",
};

/**
 * The filters to start from. Anything that is not a valid filter set — absent, unreadable,
 * malformed, or carrying a field of the wrong type or an over-long code — restores the
 * defaults rather than failing the render.
 */
export function restoreFilters(): LanguageFilterFormValues {
  const stored = readStoredText(FILTER_STORAGE_KEY);
  if (!stored) return DEFAULT_LANGUAGE_FILTERS;

  let parsed: unknown;
  try {
    parsed = JSON.parse(stored);
  } catch {
    return DEFAULT_LANGUAGE_FILTERS;
  }

  const validated = languageFilterSchema.safeParse(parsed);
  if (!validated.success) return DEFAULT_LANGUAGE_FILTERS;

  return { ...DEFAULT_LANGUAGE_FILTERS, ...validated.data };
}

/** Saves the filters. False means they apply now but will not survive a reload. */
export function saveFilters(filters: LanguageFilterFormValues): boolean {
  return writeStoredText(FILTER_STORAGE_KEY, JSON.stringify(filters));
}

export function buildAirtableApiFilters(searchParams: URLSearchParams): string {
  const filters: string[] = [];
  const filterFields = [
    { param: "code", field: "ISO 639-3" },
    { param: "name", field: "Official Name" },
    { param: "status", field: "Language Status" },
    { param: "nationOfOrigin", field: "Nation of Origin" },
    { param: "writingSystem", field: "Writing System" },
    { param: "spokenIn", field: "Principal in" },
  ];

  filterFields.forEach(({ param, field }) => {
    const value = searchParams.get(param) || "";
    filters.push(`(SEARCH(LOWER("${value}"), LOWER({${field}})) > 0)`);
  });

  return `AND(${filters[0]}, ${filters[1]}, ${filters[2]}, ${filters[3]}, ${filters[4]}, ${filters[5]})`;
}
