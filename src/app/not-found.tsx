import { Button, Typography } from "@mui/material";
import Link from "next/link";

import { CenteredPageLayout } from "@/shared/components/CenteredPageLayout";

export default function NotFoundPage() {
  return (
    <CenteredPageLayout>
      <Typography variant="h1" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" gutterBottom>
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
