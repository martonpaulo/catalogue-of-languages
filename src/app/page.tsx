"use client";

import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import { LanguageFilters } from "@/features/languages/components/LanguageFilters";
import { LanguageFilterFormValues } from "@/features/languages/components/languageFilters.schema";
import { LanguageTable } from "@/features/languages/components/LanguageTable";
import { useLanguages } from "@/features/languages/hooks/useLanguages";
import { ContentContainer } from "@/shared/components/ContentContainer";

export default function Home() {
  const { ref, inView } = useInView();

  const {
    languages,
    isLoading,
    isError,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useLanguages();

  const [filters, setFilters] = useState<LanguageFilterFormValues>({});

  const handleFiltersChange = useCallback(
    (newFilters: LanguageFilterFormValues) => {
      console.warn("Filters changed:", newFilters);
      setFilters({});
    },
    []
  );

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <ContentContainer title="Home">
      <LanguageFilters onFiltersChange={handleFiltersChange} />

      {isLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="200px"
        >
          <CircularProgress />
        </Box>
      ) : isError ? (
        <Alert severity="error">
          An error occurred while loading languages.
        </Alert>
      ) : (
        <>
          <LanguageTable languages={languages} filters={filters} />

          <Box mt={2} display="flex" justifyContent="center">
            {isFetchingNextPage && hasNextPage ? (
              <Box display="flex" alignItems="center" gap={1}>
                <CircularProgress size={24} />
                <Typography variant="body2">
                  Loading more languages...
                </Typography>
              </Box>
            ) : (
              <Typography variant="body2" align="center">
                No more languages found.
              </Typography>
            )}
          </Box>

          <div ref={ref} />
        </>
      )}
    </ContentContainer>
  );
}
