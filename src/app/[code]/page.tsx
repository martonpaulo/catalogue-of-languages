"use client";

import LanguageIcon from "@mui/icons-material/Language";
import { Box, CircularProgress } from "@mui/material";
import { Stack, Typography } from "@mui/material";
import { notFound } from "next/navigation";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import LanguageDetails from "@/features/languages/components/LanguageDetails";
import { LanguageStatusChip } from "@/features/languages/components/LanguageStatusChip";
import { useLanguageDetails } from "@/features/languages/hooks/useLanguageDetails";
import { ContentContainer } from "@/shared/components/ContentContainer";

export default function LanguagePage() {
  const { code } = useParams<{ code: string }>();

  if (!code || code.length !== 3) notFound();

  const { language } = useLanguageDetails(code);
  const titleSuffix = "Catalogue of Languages";
  const [loadingTimeoutPassed, setLoadingTimeoutPassed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoadingTimeoutPassed(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  // While language is not loaded, show spinner until timeout
  if (!language) {
    if (loadingTimeoutPassed) {
      notFound();
    }

    return (
      <ContentContainer>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="50vh"
        >
          <CircularProgress />
          <Typography variant="body1" mt={2}>
            Loading language details...
          </Typography>
        </Box>
      </ContentContainer>
    );
  }

  const pageTitle = `${language.name} | ${titleSuffix}`;

  return (
    <ContentContainer>
      <title>{pageTitle}</title>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Stack spacing={1} direction="row">
          <LanguageIcon sx={{ fontSize: "2.25rem" }} />
          <Stack
            spacing={1}
            alignItems="baseline"
            direction={{ mobile: "column", tablet: "row" }}
          >
            <Typography variant="h1">{language.name}</Typography>
            <Typography variant="h2" fontFamily="Monospace">
              {code.toUpperCase()}
            </Typography>
          </Stack>
        </Stack>
        <LanguageStatusChip status={language.status} size="medium" />
      </Stack>
      <LanguageDetails language={language} />
    </ContentContainer>
  );
}
