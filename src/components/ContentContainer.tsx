import { Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface ContentContainerProps {
  title: string;
  children?: ReactNode;
}

export function ContentContainer({ title, children }: ContentContainerProps) {
  return (
    <Stack
      spacing={{ mobile: 4, desktop: 6 }}
      padding={{ mobile: 0, desktop: 4 }}
    >
      <Typography variant="h1">{title}</Typography>

      {children}
    </Stack>
  );
}
