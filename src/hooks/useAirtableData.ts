import { useQuery } from "@tanstack/react-query";

import { AirtableRepository } from "@/services/airtableService";
import type { LanguageType } from "@/types/language";

export const useLanguages = () => {
  const {
    data = [],
    isError,
    isLoading,
  } = useQuery<LanguageType[]>({
    queryKey: ["languages"],
    queryFn: async () => await AirtableRepository.fetchLanguages(),
  });

  return { languages: data, isError, isLoading };
};
