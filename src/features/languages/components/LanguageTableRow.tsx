import LanguageIcon from "@mui/icons-material/Language";
import { TableCell, TableRow } from "@mui/material";
import Link from "next/link";

import { LanguageStatusChip } from "@/features/languages/components/LanguageStatusChip";
import { LanguageType } from "@/features/languages/types/language.type";

interface LanguageTableRowProps {
  language: LanguageType;
}

export function LanguageTableRow({ language }: LanguageTableRowProps) {
  return (
    <TableRow hover key={language.id}>
      <TableCell>{language.code}</TableCell>
      <TableCell>
        <Link
          href={`/${language.code}`}
          style={{
            textDecoration: "none",
            color: "inherit",
            display: "flex",
            alignItems: "center",
          }}
        >
          <LanguageIcon fontSize="small" style={{ marginRight: 4 }} />
          {language.name}
        </Link>
      </TableCell>
      <TableCell>
        {language.status && <LanguageStatusChip status={language.status} />}
      </TableCell>
      <TableCell>{language.spokenIn?.join(", ")}</TableCell>
      <TableCell>{language.writingSystem?.join(", ")}</TableCell>
      <TableCell>{language.nationOfOrigin?.join(", ")}</TableCell>
    </TableRow>
  );
}
