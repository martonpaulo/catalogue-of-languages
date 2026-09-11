import { Button, Typography } from "@mui/material";
import type { Metadata } from "next";
import Link from "next/link";

import { CenteredPageLayout } from "@/shared/components/CenteredPageLayout";
import {
  canonicalUrl,
  pageTitle,
  SITE_DESCRIPTION,
  SITE_NAME,
  SOCIAL_IMAGE,
} from "@/shared/config/deployment";

const NOT_FOUND = "Page not found";

// Without its own title the exported 404 inherited the home page's. The Open Graph and Twitter
// blocks repeat the layout's fields because a nested route's blocks replace the layout's whole.
export const metadata: Metadata = {
  title: NOT_FOUND,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: pageTitle(NOT_FOUND),
    description: SITE_DESCRIPTION,
    url: canonicalUrl(),
    locale: "en_US",
    images: [SOCIAL_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle(NOT_FOUND),
    description: SITE_DESCRIPTION,
    images: [SOCIAL_IMAGE],
  },
};

export default function NotFoundPage() {
  return (
    <CenteredPageLayout>
      <Typography variant="h1" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        Page not found
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        The page you are looking for may not exist or may be temporarily
        unavailable.
      </Typography>
      <Button variant="contained" component={Link} href="/" color="primary">
        Go Home
      </Button>
    </CenteredPageLayout>
  );
}
