import { useEffect, useState } from "react";

import { useLanguages } from "@/hooks/useLanguages";
import { useLanguageStore } from "@/stores/languageStore";
import { LanguageType } from "@/types/language";
import { findLanguageByCode } from "@/utils/languageMapper";

export function useLanguageByCode(code: string) {
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
