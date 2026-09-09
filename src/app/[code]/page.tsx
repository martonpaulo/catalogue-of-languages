import type { Metadata } from "next";
import { notFound } from "next/navigation";

import LanguageDetails from "@/features/languages/components/LanguageDetails";
import { LanguageHeader } from "@/features/languages/components/LanguageHeader";
import {
  readEnrichedLanguage,
  readManifest,
} from "@/features/languages/server/snapshotSource";
import { ContentContainer } from "@/shared/components/ContentContainer";

/** Only codes published by the snapshot have a page; anything else resolves to 404. */
export const dynamicParams = false;

export async function generateStaticParams() {
  const manifest = await readManifest();
  return manifest.codes.map((code) => ({ code }));
}

interface LanguagePageProps {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({
  params,
}: LanguagePageProps): Promise<Metadata> {
  const { code } = await params;
  const language = await readEnrichedLanguage(code);

  if (!language) return { title: "Language not found" };

  return {
    title: `${language.name} | Catalogue of Languages`,
    description:
      language.description ??
      `${language.name} (${code.toUpperCase()}) in the Catalogue of Languages.`,
  };
}

export default async function LanguagePage({ params }: LanguagePageProps) {
  const { code } = await params;
  const language = await readEnrichedLanguage(code);

  if (!language) notFound();

  return (
    <ContentContainer>
      <LanguageHeader
        name={language.name}
        code={code}
        status={language.status}
      />
      <LanguageDetails language={language} />
    </ContentContainer>
  );
}
