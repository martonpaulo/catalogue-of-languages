import { Box } from "@mui/material";
import { ReactNode } from "react";

interface CenteredPageLayoutProps {
  children: ReactNode;
}

export function CenteredPageLayout({ children }: CenteredPageLayoutProps) {
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
      {children}
    </Box>
  );
}
