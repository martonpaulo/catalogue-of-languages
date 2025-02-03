import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { fetchNationsData } from "@/services/nationService";
import { useNationStore } from "@/stores/nationStore";

export function useNations() {
  const setNations = useNationStore((state) => state.setNations);
  const { data, isError, isLoading, isSuccess } = useQuery({
    queryKey: ["nations"],
    queryFn: fetchNationsData,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data) setNations(data);
  }, [data, setNations]);

  return {
    nations: data,
    nationsIsError: isError,
    nationsIsLoading: isLoading,
    nationsIsSuccess: isSuccess,
  };
}
