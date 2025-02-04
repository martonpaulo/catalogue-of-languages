import { LanguageFilterFormValues } from "@/features/languages/components/languageFilters.schema";

export const DEFAULT_LANGUAGE_FILTERS: LanguageFilterFormValues = {
  code: "",
  name: "",
  status: "",
  spokenIn: "",
  writingSystem: "",
  nationOfOrigin: "",
};

export const STATUS_OPTIONS: string[] = [
  "Active",
  "Extinct",
  "Historical",
  "Inactive",
].sort();
