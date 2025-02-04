import { Stack } from "@mui/material";
import type { ReactNode } from "react";

interface ContentContainerProps {
  children?: ReactNode;
}

export function ContentContainer({ children }: ContentContainerProps) {
  return (
    <Stack
      spacing={{ mobile: 4, desktop: 6 }}
      padding={{ mobile: 2, desktop: 4 }}
    >
      {children}
    </Stack>
  );
}
