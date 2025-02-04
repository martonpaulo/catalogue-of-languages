"use client";

import LanguageIcon from "@mui/icons-material/Language";
import { Stack, Typography } from "@mui/material";
import { useParams } from "next/navigation";

import LanguageDetails from "@/features/languages/components/LanguageDetails";
import { LanguageStatusChip } from "@/features/languages/components/LanguageStatusChip";
import { useLanguageDetails } from "@/features/languages/hooks/useLanguageDetails";
import { ContentContainer } from "@/shared/components/ContentContainer";

export default function LanguagePage() {
  const { code } = useParams<{ code: string }>();
  const language = useLanguageDetails(code);
  const titleSuffix = "Catalogue of Languages";

  if (!language || !language.name) {
    return <p>Language not found.</p>;
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
            <Typography variant="h2" fontFamily={"Monospace"}>
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
