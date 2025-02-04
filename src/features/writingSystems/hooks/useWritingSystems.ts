import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { fetchWritingSystemsData } from "@/features/writingSystems/services/writingSystemAPI";
import { useWritingSystemStore } from "@/features/writingSystems/store/writingSystemStore";
import { WritingSystemType } from "@/features/writingSystems/types/writingSystem.type";

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
