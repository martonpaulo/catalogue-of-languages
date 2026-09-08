import { useQuery } from "@tanstack/react-query";

import { fetchWritingSystemsData } from "@/features/writingSystems/services/writingSystemAPI";
import { WritingSystemType } from "@/features/writingSystems/types/writingSystem.type";

export function useWritingSystems() {
  const { data, isError, isLoading, isSuccess } = useQuery<WritingSystemType[]>({
    queryKey: ["writingSystems"],
    queryFn: fetchWritingSystemsData,
  });

  return {
    writingSystems: data,
    writingSystemsIsLoading: isLoading,
    writingSystemsIsError: isError,
    writingSystemsIsSuccess: isSuccess,
  };
}
