"use client";

import { Stack, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import { LanguageFilters } from "@/features/languages/components/LanguageFilters";
import { LanguageFilterFormValues } from "@/features/languages/components/languageFilters.schema";
import { LanguageTable } from "@/features/languages/components/LanguageTable";
import { useLanguages } from "@/features/languages/hooks/useLanguages";
import { filtersAfterRefresh } from "@/features/languages/utils/languageFilters";
import { ContentContainer } from "@/shared/components/ContentContainer";
import { ErrorMessage } from "@/shared/components/ErrorMessage";
import { LoadingIndicator } from "@/shared/components/LoadingIndicator";
import { ProjectAttribution } from "@/shared/components/ProjectAttribution";

export default function Home() {
  const [filters, setFilters] = useState<LanguageFilterFormValues>(
    filtersAfterRefresh()
  );

  const { ref, inView } = useInView();

  const { languages, status, errorMessage, retry, hasNextPage, revealMore } =
    useLanguages(filters);

  const handleFiltersChange = useCallback(
    (newFilters: LanguageFilterFormValues) => {
      setFilters(newFilters);
    },
    []
  );

  useEffect(() => {
    if (inView && hasNextPage) revealMore();
  }, [inView, hasNextPage, revealMore]);

  return (
    <ContentContainer>
      <Typography variant="h1">🌎 Catalogue of Languages</Typography>

      <Stack spacing={1}>
        <LanguageFilters onFiltersChange={handleFiltersChange} />
        <ProjectAttribution />
      </Stack>

      {status === "error" && errorMessage && (
        <ErrorMessage message={errorMessage} onRetry={retry} />
      )}

      {status === "pending" && (
        <LoadingIndicator size="large" message="Loading languages..." />
      )}

      {status === "ready" && (
        <Stack>
          <LanguageTable languages={languages} />
          {hasNextPage && (
            <Stack>
              <div ref={ref} />
              <LoadingIndicator message="Loading more languages..." />
            </Stack>
          )}
        </Stack>
      )}
    </ContentContainer>
  );
}
