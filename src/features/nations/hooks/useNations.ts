import { useQuery } from "@tanstack/react-query";

import { fetchNationsData } from "@/features/nations/services/nationAPI";

export function useNations() {
  const { data, isError, isLoading, isSuccess, refetch } = useQuery({
    queryKey: ["nations"],
    queryFn: fetchNationsData,
  });

  return {
    nations: data,
    nationsIsError: isError,
    nationsIsLoading: isLoading,
    nationsIsSuccess: isSuccess,
    retryNations: refetch,
  };
}
