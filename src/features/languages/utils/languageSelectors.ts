import { LanguageType } from "@/features/languages/types/language.type";

export function findLanguageByCode(
  languages: LanguageType[],
  code: string
): LanguageType | undefined {
  return languages.find((language) => language.code === code);
}
