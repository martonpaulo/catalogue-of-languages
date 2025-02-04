import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import { LanguageFilterFormValues } from "@/features/languages/components/languageFilters.schema";
import {
  fetchPaginatedLanguagesData,
  FetchPaginatedLanguagesDataParams,
} from "@/features/languages/services/languageAPI";
import { LanguageType } from "@/features/languages/types/language.type";
import { enrichLanguagesDataSetListWithNames } from "@/features/languages/utils/languageEnrichers";
import { useNations } from "@/features/nations/hooks/useNations";
import { useWritingSystems } from "@/features/writingSystems/hooks/useWritingSystems";

export function useLanguages(languageFilterParams: LanguageFilterFormValues) {
  const { nations } = useNations();
  const { writingSystems } = useWritingSystems();

  const {
    data,
    isError,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["languages", languageFilterParams],
    queryFn: ({ pageParam = undefined }: FetchPaginatedLanguagesDataParams) =>
      fetchPaginatedLanguagesData({ pageParam, languageFilterParams }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage?.nextOffset;
      return nextPage !== null ? nextPage : undefined;
    },
  });

  const enrichedLanguagesRef = useRef<LanguageType[]>([]);
  const processedPagesRef = useRef(0);

  // Reset refs when the filters (query key) change
  useEffect(() => {
    enrichedLanguagesRef.current = [];
    processedPagesRef.current = 0;
  }, [languageFilterParams]);

  useEffect(() => {
    if (!data?.pages || !nations || !writingSystems) return;

    if (data.pages.length > processedPagesRef.current) {
      const newPages = data.pages.slice(processedPagesRef.current);
      const newEnriched = newPages.flatMap((page) =>
        enrichLanguagesDataSetListWithNames(page.data, nations, writingSystems)
      );
      enrichedLanguagesRef.current = [
        ...enrichedLanguagesRef.current,
        ...newEnriched,
      ];
      processedPagesRef.current = data.pages.length;
    }
  }, [data?.pages, nations, writingSystems]);

  return {
    languages: enrichedLanguagesRef.current,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  };
}
