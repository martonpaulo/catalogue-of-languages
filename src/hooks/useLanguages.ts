import { useInfiniteQuery } from "@tanstack/react-query";

import { useNations } from "@/hooks/useNations";
import { useWritingSystems } from "@/hooks/useWritingSystems";
import {
  fetchPaginatedLanguagesData,
  FetchPaginatedLanguagesDataParams,
} from "@/services/languageService";
import { enrichLanguageDataWithNames } from "@/utils/languageMapper";

export function useLanguages() {
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
    queryKey: ["languages"],
    queryFn: ({ pageParam = undefined }: FetchPaginatedLanguagesDataParams) =>
      fetchPaginatedLanguagesData({ pageParam: pageParam }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage?.nextOffset;
      return nextPage !== null ? nextPage : undefined;
    },
  });

  const languages =
    (data?.pages &&
      nations &&
      writingSystems &&
      data?.pages.flatMap((page) =>
        enrichLanguageDataWithNames(page.data, nations, writingSystems)
      )) ??
    [];

  return {
    languages,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  };
}
