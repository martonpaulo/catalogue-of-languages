import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";

import { LanguageFilterFormValues } from "@/features/languages/components/languageFilters.schema";
import { fetchLanguageIndex } from "@/features/languages/services/languageAPI";
import { LanguageType } from "@/features/languages/types/language.type";
import { enrichLanguagesDataSetListWithNames } from "@/features/languages/utils/languageEnrichers";
import { filterLanguages } from "@/features/languages/utils/languageFilters";
import { useNations } from "@/features/nations/hooks/useNations";
import { useWritingSystems } from "@/features/writingSystems/hooks/useWritingSystems";

/** Rows revealed per step, matching the previous remote page size. */
export const LANGUAGE_PAGE_SIZE = 50;

/**
 * Every dependency the catalogue needs before it can show a row, so a page can tell a
 * pending dependency from a failed one, and both from a search that genuinely matched
 * nothing.
 */
export type LanguagesStatus = "pending" | "error" | "ready";

export interface LanguagesResult {
  languages: LanguageType[];
  status: LanguagesStatus;
  /** Describes the failed dependencies and retries exactly those. */
  errorMessage: string | null;
  retry: () => void;
  hasNextPage: boolean;
  revealMore: () => void;
}

export function useLanguages(
  languageFilterParams: LanguageFilterFormValues
): LanguagesResult {
  const { nations, nationsIsError, retryNations } = useNations();
  const {
    writingSystems,
    writingSystemsIsError,
    retryWritingSystems,
  } = useWritingSystems();

  const {
    data: index,
    isError: indexIsError,
    refetch: retryIndex,
  } = useQuery({
    queryKey: ["languageIndex"],
    queryFn: fetchLanguageIndex,
  });

  const failed = useMemo(
    () => ({
      index: indexIsError,
      nations: nationsIsError,
      writingSystems: writingSystemsIsError,
    }),
    [indexIsError, nationsIsError, writingSystemsIsError]
  );

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

  const retry = useCallback(() => {
    if (failed.index) void retryIndex();
    if (failed.nations) void retryNations();
    if (failed.writingSystems) void retryWritingSystems();
  }, [failed, retryIndex, retryNations, retryWritingSystems]);

  const status: LanguagesStatus = hasAnyFailure(failed)
    ? "error"
    : matchingLanguages
      ? "ready"
      : "pending";

  return {
    languages,
    status,
    errorMessage: hasAnyFailure(failed) ? describeFailure(failed) : null,
    retry,
    // A revealed step only advances over data that is already loaded and complete.
    hasNextPage:
      status === "ready" && revealedCount < (matchingLanguages?.length ?? 0),
    revealMore,
  };
}

type FailedDependencies = Record<
  "index" | "nations" | "writingSystems",
  boolean
>;

function hasAnyFailure(failed: FailedDependencies): boolean {
  return failed.index || failed.nations || failed.writingSystems;
}

function describeFailure(failed: FailedDependencies): string {
  if (failed.index) return "The language catalogue could not be loaded.";

  const missing = [
    failed.nations && "nations",
    failed.writingSystems && "writing systems",
  ].filter(Boolean);

  return `The catalogue needs ${missing.join(" and ")} to show its results, and that data could not be loaded.`;
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
