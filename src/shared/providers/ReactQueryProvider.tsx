"use client";

import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { ReactNode, useEffect, useState } from "react";

import { buildStorageKey } from "@/shared/utils/localStorageUtils";

interface ReactQueryProviderProps {
  children: ReactNode;
}

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: Infinity,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const [isRestored, setIsRestored] = useState(false);

  useEffect(() => {
    const localStoragePersister = createSyncStoragePersister({
      storage: window.localStorage,
      key: buildStorageKey("react-query-cache"),
    });

    persistQueryClient({
      queryClient,
      persister: localStoragePersister,
      maxAge: 1000 * 60 * 60 * 24, // 1 day in milliseconds
    });

    setIsRestored(true);
  }, [queryClient]);

  if (!isRestored) return null;

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
