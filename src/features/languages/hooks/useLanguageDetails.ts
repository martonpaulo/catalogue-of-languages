import { useQuery } from "@tanstack/react-query";

import { fetchLanguageDetailsData } from "@/features/languages/services/languageDetailsAPI";
import { enrichLanguagesDataWithNames } from "@/features/languages/utils/languageEnrichers";
import { useNations } from "@/features/nations/hooks/useNations";
import { useWritingSystems } from "@/features/writingSystems/hooks/useWritingSystems";

export function useLanguageDetails(code: string) {
  const { nations } = useNations();
  const { writingSystems } = useWritingSystems();

  const { data, isError, isLoading, isSuccess } = useQuery({
    queryKey: ["languageDetails", code],
    queryFn: async () => await fetchLanguageDetailsData({ code }),
  });

  const language =
    data && nations && writingSystems
      ? enrichLanguagesDataWithNames(data, nations, writingSystems)
      : null;

  return {
    language,
    isError,
    isLoading,
    isSuccess,
  };
}
