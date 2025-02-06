import LanguageIcon from "@mui/icons-material/Language";
import { Stack, Typography } from "@mui/material";

import { LanguageStatusChip } from "./LanguageStatusChip";

interface LanguageHeaderProps {
  name: string;
  code: string;
  status?: string;
}

export function LanguageHeader({ name, code, status }: LanguageHeaderProps) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="flex-start"
    >
      <Stack spacing={1} direction="row">
        <LanguageIcon sx={{ fontSize: "2.25rem" }} />
        <Stack
          spacing={1}
          alignItems="baseline"
          direction={{ mobile: "column", tablet: "row" }}
        >
          <Typography variant="h1">{name}</Typography>
          <Typography variant="h2" fontFamily="Monospace">
            {code.toUpperCase()}
          </Typography>
        </Stack>
      </Stack>
      <LanguageStatusChip status={status} size="medium" />
    </Stack>
  );
}
