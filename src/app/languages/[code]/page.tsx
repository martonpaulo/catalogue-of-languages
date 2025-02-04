"use client";

import { useParams } from "next/navigation";

import { ContentContainer } from "@/components/ContentContainer";
import LanguageDetails from "@/components/LanguageDetails";
import { useLanguageByCode } from "@/hooks/useLanguageByCode";

export default function LanguagePage() {
  const params = useParams<{ code: string }>();
  const language = useLanguageByCode(params.code);

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
