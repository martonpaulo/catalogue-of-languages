import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import {
  fetchPaginatedLanguagesData,
  FetchPaginatedLanguagesDataParams,
} from "@/features/languages/services/languageAPI";
import { useLanguageStore } from "@/features/languages/store/languageStore";
import { enrichLanguageDataWithNames } from "@/features/languages/utils/languageMapper";
import { useNations } from "@/features/nations/hooks/useNations";
import { useWritingSystems } from "@/features/writingSystems/hooks/useWritingSystems";

export function useLanguages() {
  const { nations } = useNations();
  const { writingSystems } = useWritingSystems();
  const { languages, setLanguages } = useLanguageStore((state) => state);

  const {
    data,
    isError,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["languages"],
    queryFn: ({ pageParam = undefined }: FetchPaginatedLanguagesDataParams) =>
      fetchPaginatedLanguagesData({ pageParam: pageParam }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage?.nextOffset;
      return nextPage !== null ? nextPage : undefined;
    },
  });

  useEffect(() => {
    if (data?.pages && nations && writingSystems) {
      const enrichedLanguages = data.pages.flatMap((page) =>
        enrichLanguageDataWithNames(page.data, nations, writingSystems)
      );
      setLanguages(enrichedLanguages);
    }
  }, [data, nations, writingSystems, setLanguages]);

  return {
    languages,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  };
}
