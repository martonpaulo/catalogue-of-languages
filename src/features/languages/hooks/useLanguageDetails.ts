import { useEffect, useState } from "react";

import { useLanguages } from "@/features/languages/hooks/useLanguages";
import { useLanguageStore } from "@/features/languages/store/languageStore";
import { LanguageType } from "@/features/languages/types/language.type";
import { findLanguageByCode } from "@/features/languages/utils/languageMapper";

export function useLanguageDetails(code: string) {
  const languages = useLanguageStore((state) => state.languages);
  const { isLoading } = useLanguages();

  const [language, setLanguage] = useState<LanguageType | undefined>(undefined);

  useEffect(() => {
    if (!isLoading && languages.length > 0) {
      try {
        const found = findLanguageByCode(languages, code);
        setLanguage(found);
      } catch (error) {
        console.error(
          `Failed to find language with code "${code}" in languages:`,
          error
        );
      }
    }
  }, [isLoading, languages, code]);

  return language;
}
