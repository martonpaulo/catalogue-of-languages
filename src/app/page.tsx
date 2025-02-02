"use client";

import { Alert, Typography } from "@mui/material";

import { ContentContainer } from "@/components/ContentContainer";
import { LanguagesTable } from "@/components/LanguagesTable";
import { useLanguages } from "@/hooks/useAirtableData";

export default function Home() {
  const { languages, isError, isLoading } = useLanguages();

  return (
    <ContentContainer title="Home">
      {isLoading ? (
        <Typography variant="h6">Loading...</Typography>
      ) : isError ? (
        <Alert severity="error">An error occurred</Alert>
      ) : (
        <LanguagesTable languages={languages} />
      )}
    </ContentContainer>
  );
}
