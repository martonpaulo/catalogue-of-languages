import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { fetchNationsData } from "@/features/nations/services/nationAPI";
import { useNationStore } from "@/features/nations/store/nationStore";

export function useNations() {
  const setNations = useNationStore((state) => state.setNations);
  const { data, isError, isLoading, isSuccess } = useQuery({
    queryKey: ["nations"],
    queryFn: fetchNationsData,
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
