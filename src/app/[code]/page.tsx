"use client";

import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";

import LanguageDetails from "@/features/languages/components/LanguageDetails";
import { LanguageHeader } from "@/features/languages/components/LanguageHeader";
import { useLanguageDetails } from "@/features/languages/hooks/useLanguageDetails";
import { CenteredPageLayout } from "@/shared/components/CenteredPageLayout";
import { ContentContainer } from "@/shared/components/ContentContainer";
import { LoadingIndicator } from "@/shared/components/LoadingIndicator";

export default function LanguagePage() {
  const { code } = useParams<{ code: string }>();

  if (!code || code.length !== 3) notFound();

  const { language } = useLanguageDetails(code);
  const [loadingTimeoutPassed, setLoadingTimeoutPassed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoadingTimeoutPassed(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!language) {
    if (loadingTimeoutPassed) notFound();
    return (
      <CenteredPageLayout>
        <LoadingIndicator size="large" message="Loading language details..." />
      </CenteredPageLayout>
    );
  }

  return (
    <ContentContainer>
      {language.name && (
        <title>{`${language.name} | Catalogue of Languages`}</title>
      )}
      <LanguageHeader
        name={language.name}
        code={code}
        status={language.status}
      />
      <LanguageDetails language={language} />
    </ContentContainer>
  );
}
