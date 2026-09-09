import type { Metadata } from "next";
import { notFound } from "next/navigation";

import LanguageDetails from "@/features/languages/components/LanguageDetails";
import { LanguageHeader } from "@/features/languages/components/LanguageHeader";
import {
  readEnrichedLanguage,
  readManifest,
} from "@/features/languages/server/snapshotSource";
import { ContentContainer } from "@/shared/components/ContentContainer";
import {
  canonicalUrl,
  SITE_NAME,
  SOCIAL_IMAGE,
} from "@/shared/config/deployment";

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

  const url = canonicalUrl(code);
  const description = describe(language.name, code, language.description);

  return {
    title: language.name,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      siteName: SITE_NAME,
      title: language.name,
      description,
      url,
      locale: "en_US",
      images: [SOCIAL_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: language.name,
      description,
      images: [SOCIAL_IMAGE],
    },
  };
}

function describe(
  name: string,
  code: string,
  description: string | undefined
): string {
  return (
    description ??
    `${name} (${code.toUpperCase()}) on ${SITE_NAME}: status, genealogy, writing systems and where it is spoken.`
  );
}

export default async function LanguagePage({ params }: LanguagePageProps) {
  const { code } = await params;
  const language = await readEnrichedLanguage(code);

  if (!language) notFound();

  // Describes the record itself, for a reader that parses rather than renders.
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Language",
    name: language.name,
    identifier: code.toLowerCase(),
    url: canonicalUrl(code),
    description: describe(language.name, code, language.description),
    ...(language.alternateNames
      ? { alternateName: language.alternateNames }
      : {}),
  };

  return (
    <ContentContainer>
      <script
        type="application/ld+json"
        // The content is built here from the snapshot, never from user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <LanguageHeader
        name={language.name}
        code={code}
        status={language.status}
      />
      <LanguageDetails language={language} />
    </ContentContainer>
  );
}
