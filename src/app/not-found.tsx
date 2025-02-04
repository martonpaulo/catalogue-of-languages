"use client";

import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
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
    </Box>
  );
}
