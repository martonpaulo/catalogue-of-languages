import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { fetchNationsData } from "@/services/nationService";
import { useNationsStore } from "@/stores/nationsStore";
import { NationType } from "@/types/nation";

export const useNations = () => {
  const setNations = useNationsStore((state) => state.setNations);
  const { data, isError, isLoading } = useQuery<NationType[]>({
    queryKey: ["nations"],
    queryFn: fetchNationsData,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  useEffect(() => {
    if (data) setNations(data);
  }, [data, setNations]);

  return { nations: data, isError, isLoading };
};
