import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { LanguageFilterFormValues } from "@/features/languages/components/languageFilters.schema";
import {
  fetchPaginatedLanguagesData,
  FetchPaginatedLanguagesDataParams,
} from "@/features/languages/services/languageAPI";
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
    queryFn: ({ pageParam }: FetchPaginatedLanguagesDataParams) =>
      fetchPaginatedLanguagesData({ pageParam, languageFilterParams }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage?.nextOffset ?? undefined,
  });

  const enrichedLanguages = useMemo(() => {
    if (!data?.pages || !nations || !writingSystems) return [];

    return data.pages.flatMap((page) =>
      enrichLanguagesDataSetListWithNames(page.data, nations, writingSystems)
    );
  }, [data?.pages, nations, writingSystems]);

  return {
    languages: enrichedLanguages,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  };
}
