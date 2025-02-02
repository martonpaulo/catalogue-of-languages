import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { fetchWritingSystemsData } from "@/services/writingSystemService";
import { useWritingSystemsStore } from "@/stores/writingSystemsStore";
import { WritingSystemType } from "@/types/writingSystem";

export const useWritingSystems = () => {
  const setWritingSystems = useWritingSystemsStore(
    (state) => state.setWritingSystems
  );
  const { data, isError, isLoading } = useQuery<WritingSystemType[]>({
    queryKey: ["writingSystems"],
    queryFn: fetchWritingSystemsData,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  useEffect(() => {
    if (data) setWritingSystems(data);
  }, [data, setWritingSystems]);

  return { writingSystems: data, isError, isLoading };
};
