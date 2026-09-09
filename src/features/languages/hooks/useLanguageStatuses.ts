import { useQuery } from "@tanstack/react-query";

import { fetchLanguageIndex } from "@/features/languages/services/languageAPI";
import { LanguageStatusEnum } from "@/features/languages/types/languageStatus.enum";

/**
 * The status categories the loaded snapshot actually publishes, in enum order. Offering
 * anything else would let a person select a category that no record can be in, and
 * categories without a verified source label never appear here at all.
 *
 * This reads the same query as the catalogue list, so it costs no extra request.
 */
export function useLanguageStatuses(): LanguageStatusEnum[] {
  const { data } = useQuery({
    queryKey: ["languageIndex"],
    queryFn: fetchLanguageIndex,
    select: (index) => {
      const present = new Set(
        index.languages
          .map((language) => language.status)
          .filter((status): status is LanguageStatusEnum => Boolean(status))
      );

      return Object.values(LanguageStatusEnum).filter((status) =>
        present.has(status)
      );
    },
  });

  return data ?? [];
}
