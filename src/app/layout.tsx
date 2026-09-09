import { Container } from "@mui/material";
import type { Metadata, Viewport } from "next";

import { readManifest } from "@/features/languages/server/snapshotSource";
import {
  canonicalUrl,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_ORIGIN,
  SOCIAL_IMAGE,
} from "@/shared/config/deployment";
import { AppThemeProvider } from "@/shared/providers/AppThemeProvider";
import { ReactQueryProvider } from "@/shared/providers/ReactQueryProvider";
import { poppins } from "@/shared/styles/fonts";

export const metadata: Metadata = {
  // The origin only: the framework adds the base path to every relative metadata asset.
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: canonicalUrl() },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: canonicalUrl(),
    locale: "en_US",
    images: [SOCIAL_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [SOCIAL_IMAGE],
  },
};

export const viewport: Viewport = {
  themeColor: "#E3F2FD",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const manifest = await readManifest();

  // Describes what the site is, for a reader that parses rather than renders.
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "DataCatalog",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: canonicalUrl(),
    inLanguage: "en",
    isAccessibleForFree: true,
    license: "https://opensource.org/licenses/MIT",
    creator: { "@type": "Person", name: "Marton Paulo" },
    dateModified: manifest.generatedAt,
    size: `${manifest.languageCount} languages`,
  };

  return (
    <html lang="en">
      <body className={poppins.variable}>
        <script
          type="application/ld+json"
          // The content is built here from the snapshot, never from user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <AppThemeProvider>
          <ReactQueryProvider>
            <Container>{children}</Container>
          </ReactQueryProvider>
        </AppThemeProvider>
      </body>
    </html>
  );
}
