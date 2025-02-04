import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { fetchWritingSystemsData } from "@/services/writingSystemService";
import { useWritingSystemStore } from "@/stores/writingSystemStore";
import { WritingSystemType } from "@/types/writingSystem";

export function useWritingSystems() {
  const setWritingSystems = useWritingSystemStore(
    (state) => state.setWritingSystems
  );
  const { data, isError, isLoading, isSuccess } = useQuery<WritingSystemType[]>(
    {
      queryKey: ["writingSystems"],
      queryFn: fetchWritingSystemsData,
    }
  );

  useEffect(() => {
    if (data) setWritingSystems(data);
  }, [data, setWritingSystems]);

  return {
    writingSystems: data,
    writingSystemsIsLoading: isLoading,
    writingSystemsIsError: isError,
    writingSystemsIsSuccess: isSuccess,
  };
}
