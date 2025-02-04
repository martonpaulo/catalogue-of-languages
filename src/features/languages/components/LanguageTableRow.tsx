import LanguageIcon from "@mui/icons-material/Language";
import { Box, Stack, TableCell, TableRow, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

import { LanguageStatusChip } from "@/features/languages/components/LanguageStatusChip";
import { LanguageType } from "@/features/languages/types/language.type";

interface LanguageTableRowProps {
  language: LanguageType;
}

function renderList(items?: string[]) {
  if (!items || items.length === 0) {
    return (
      <Typography variant="body2" color="textSecondary">
        —
      </Typography>
    );
  }

  return items.map((item) => <Box key={item}>{item}</Box>);
}

export function LanguageTableRow({ language }: LanguageTableRowProps) {
  const router = useRouter();

  const handleRowClick = () => {
    router.push(`/${language.code}`);
  };

  return (
    <TableRow hover onClick={handleRowClick} sx={{ cursor: "pointer" }}>
      <TableCell sx={{ fontFamily: "Monospace", width: 80 }}>
        {language.code.toUpperCase()}
      </TableCell>

      <TableCell sx={{ width: 250 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <LanguageIcon fontSize="small" />
          <Typography variant="body2">{language.name}</Typography>
        </Stack>
      </TableCell>

      <TableCell sx={{ width: 200 }}>
        {language.status && <LanguageStatusChip status={language.status} />}
      </TableCell>

      <TableCell sx={{ width: 400 }}>
        {renderList(language.nationOfOrigin)}
      </TableCell>

      <TableCell sx={{ width: 200 }}>
        {renderList(language.writingSystem)}
      </TableCell>

      <TableCell sx={{ width: 350 }}>{renderList(language.spokenIn)}</TableCell>
    </TableRow>
  );
}
