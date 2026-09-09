import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";

import { LanguageFilterFormValues } from "@/features/languages/components/languageFilters.schema";
import { fetchLanguageIndex } from "@/features/languages/services/languageAPI";
import { enrichLanguagesDataSetListWithNames } from "@/features/languages/utils/languageEnrichers";
import { filterLanguages } from "@/features/languages/utils/languageFilters";
import { useNations } from "@/features/nations/hooks/useNations";
import { useWritingSystems } from "@/features/writingSystems/hooks/useWritingSystems";

/** Rows revealed per step, matching the previous remote page size. */
export const LANGUAGE_PAGE_SIZE = 50;

export function useLanguages(languageFilterParams: LanguageFilterFormValues) {
  const { nations, nationsIsError } = useNations();
  const { writingSystems, writingSystemsIsError } = useWritingSystems();

  const {
    data: index,
    isError: indexIsError,
    isLoading: indexIsLoading,
  } = useQuery({
    queryKey: ["languageIndex"],
    queryFn: fetchLanguageIndex,
  });

  const enrichedLanguages = useMemo(() => {
    if (!index || !nations || !writingSystems) return null;
    return enrichLanguagesDataSetListWithNames(
      index.languages,
      nations,
      writingSystems
    );
  }, [index, nations, writingSystems]);

  const matchingLanguages = useMemo(() => {
    if (!enrichedLanguages) return null;
    return filterLanguages(enrichedLanguages, languageFilterParams);
  }, [enrichedLanguages, languageFilterParams]);

  const { revealedCount, revealMore } = useRevealedCount([
    index?.version,
    languageFilterParams,
  ]);

  const languages = useMemo(
    () => matchingLanguages?.slice(0, revealedCount) ?? [],
    [matchingLanguages, revealedCount]
  );

  return {
    languages,
    isLoading: indexIsLoading || !enrichedLanguages,
    isError: indexIsError || nationsIsError || writingSystemsIsError,
    isFetchingNextPage: false,
    hasNextPage: revealedCount < (matchingLanguages?.length ?? 0),
    fetchNextPage: revealMore,
  };
}

/**
 * Reveals rows in steps over the already loaded snapshot. The count resets whenever the
 * snapshot version or the filters change, so a new result set always starts at its first
 * step instead of inheriting the previous one's position.
 */
function useRevealedCount(resetOn: unknown[]) {
  const resetKey = JSON.stringify(resetOn);
  const [state, setState] = useState({
    key: resetKey,
    count: LANGUAGE_PAGE_SIZE,
  });

  if (state.key !== resetKey) {
    setState({ key: resetKey, count: LANGUAGE_PAGE_SIZE });
  }

  const revealMore = useCallback(() => {
    setState((previous) => ({
      key: previous.key,
      count: previous.count + LANGUAGE_PAGE_SIZE,
    }));
  }, []);

  const revealedCount =
    state.key === resetKey ? state.count : LANGUAGE_PAGE_SIZE;

  return { revealedCount, revealMore };
}
