"use client";

import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import { LanguageFilters } from "@/features/languages/components/LanguageFilters";
import { LanguageFilterFormValues } from "@/features/languages/components/languageFilters.schema";
import { LanguageTable } from "@/features/languages/components/LanguageTable";
import { useLanguages } from "@/features/languages/hooks/useLanguages";
import { DEFAULT_LANGUAGE_FILTERS } from "@/features/languages/utils/languageFiltersConstants";
import { ContentContainer } from "@/shared/components/ContentContainer";

export default function Home() {
  const { ref, inView } = useInView();

  const [filters, setFilters] = useState<LanguageFilterFormValues>(
    DEFAULT_LANGUAGE_FILTERS
  );

  const {
    languages,
    isLoading,
    isError,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useLanguages(filters);

  const handleFiltersChange = useCallback(
    (newFilters: LanguageFilterFormValues) => {
      setFilters(newFilters);
    },
    []
  );

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <ContentContainer>
      <Typography variant="h1">🌎 Catalogue of Languages</Typography>
      <LanguageFilters onFiltersChange={handleFiltersChange} />

      {isLoading && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="20rem"
        >
          <CircularProgress />
        </Box>
      )}

      {isError && (
        <Alert severity="error">
          An error occurred while loading languages.
        </Alert>
      )}

      {!isLoading && !isError && (
        <>
          <LanguageTable languages={languages} />
          <Box mt={2} display="flex" justifyContent="center">
            {hasNextPage && (
              <Box display="flex" alignItems="center" gap={1}>
                <CircularProgress size={24} />
                <Typography variant="body2">
                  Loading more languages...
                </Typography>
              </Box>
            )}
          </Box>
          <div ref={ref} />
        </>
      )}
    </ContentContainer>
  );
}
