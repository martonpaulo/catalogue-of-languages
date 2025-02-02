import { useQuery } from "@tanstack/react-query";

import { useNations } from "@/hooks/useNations";
import { useWritingSystems } from "@/hooks/useWritingSystems";
import { fetchLanguagesData } from "@/services/languageService";
import { LanguageType } from "@/types/language";
import { transformNationIdsToNames } from "@/utils/nationFinder";
import { transformWritingSystemIdsToNames } from "@/utils/writingSystemFinder";

export const useLanguages = () => {
  const { nations } = useNations();
  const { writingSystems } = useWritingSystems();

  const { data, isError, isLoading } = useQuery<LanguageType[]>({
    queryKey: ["languages"],
    queryFn: fetchLanguagesData,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const updatedData: LanguageType[] =
    data && nations && writingSystems
      ? data.map((language) => ({
          ...language,
          spokenIn: language.spokenIn
            ? transformNationIdsToNames(language.spokenIn, nations)
            : [],
          writingSystem: language.writingSystem
            ? transformWritingSystemIdsToNames(
                language.writingSystem,
                writingSystems
              )
            : [],
          nationOfOrigin: language.nationOfOrigin
            ? transformNationIdsToNames(language.nationOfOrigin, nations)
            : [],
        }))
      : [];

  return { languages: updatedData, isError, isLoading };
};
