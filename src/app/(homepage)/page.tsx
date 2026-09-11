"use client";

import { Stack, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import { LanguageFilters } from "@/features/languages/components/LanguageFilters";
import { LanguageFilterFormValues } from "@/features/languages/components/languageFilters.schema";
import { LanguageTable } from "@/features/languages/components/LanguageTable";
import { useLanguages } from "@/features/languages/hooks/useLanguages";
import { restoreFilters } from "@/features/languages/utils/languageFilters";
import { ContentContainer } from "@/shared/components/ContentContainer";
import { ErrorMessage } from "@/shared/components/ErrorMessage";
import { LoadingIndicator } from "@/shared/components/LoadingIndicator";
import { ProjectAttribution } from "@/shared/components/ProjectAttribution";
import { BASE_PATH } from "@/shared/config/deployment";

export default function Home() {
  // Restored once, on mount, and owned here so the form and the query cannot disagree.
  const [initialFilters] = useState<LanguageFilterFormValues>(restoreFilters);
  const [filters, setFilters] =
    useState<LanguageFilterFormValues>(initialFilters);

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
      <Typography
        variant="h1"
        sx={{ display: "flex", alignItems: "center", gap: "0.3em" }}
      >
        {/* The site's own mark (the favicon), decorative: the heading's name is the word. */}
        {/* eslint-disable-next-line @next/next/no-img-element -- a static export has no image optimizer */}
        <img
          src={`${BASE_PATH}/icon.svg`}
          alt=""
          width={40}
          height={40}
          style={{ width: "0.9em", height: "0.9em" }}
        />
        Linguae
      </Typography>

      <Stack spacing={1}>
        <LanguageFilters
          initialFilters={initialFilters}
          onFiltersChange={handleFiltersChange}
        />
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
