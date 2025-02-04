import { useQuery } from "@tanstack/react-query";

import { fetchLanguageDetailsData } from "@/features/languages/services/languageDetailsAPI";

export function useLanguageDetails(code: string) {
  const { data, isError, isLoading, isSuccess } = useQuery({
    queryKey: ["languageDetails"],
    queryFn: async () => await fetchLanguageDetailsData({ code }),
  });

  return {
    data,
    isError,
    isLoading,
    isSuccess,
  };
}
