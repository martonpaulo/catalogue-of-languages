import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { useNations } from "@/hooks/useNations";
import { useWritingSystems } from "@/hooks/useWritingSystems";
import {
  fetchPaginatedLanguagesData,
  FetchPaginatedLanguagesDataParams,
} from "@/services/languageService";
import { useLanguageStore } from "@/stores/languageStore";
import { enrichLanguageDataWithNames } from "@/utils/languageMapper";

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
