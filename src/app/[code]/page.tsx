"use client";

import { useParams } from "next/navigation";

import LanguageDetails from "@/features/languages/components/LanguageDetails";
import { useLanguageDetails } from "@/features/languages/hooks/useLanguageDetails";
import { ContentContainer } from "@/shared/components/ContentContainer";

export default function LanguagePage() {
  const params = useParams<{ code: string }>();
  const language = useLanguageDetails(params.code);

  const titleSuffix = "Catalogue of Languages";
  const languageName = language?.name || undefined;
  const title = languageName ? `${languageName} | ${titleSuffix}` : titleSuffix;

  if (!language || !languageName) {
    return <p>Language not found.</p>;
  }

  return (
    <ContentContainer title={languageName}>
      <title>{title}</title>

      <LanguageDetails language={language} />
    </ContentContainer>
  );
}
