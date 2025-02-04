import LanguageIcon from "@mui/icons-material/Language";
import { TableCell, TableRow } from "@mui/material";
import Link from "next/link";

import { StatusChip } from "@/components/StatusChip";
import { LanguageType } from "@/types/language";

interface LanguagesTableRowProps {
  language: LanguageType;
}

export function LanguagesTableRow({ language }: LanguagesTableRowProps) {
  return (
    <TableRow hover key={language.id}>
      <TableCell>{language.code}</TableCell>
      <TableCell>
        <Link
          href={`/languages/${language.code}`}
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
        <StatusChip status={language.status} />
      </TableCell>
      <TableCell>{language.spokenIn?.join(", ")}</TableCell>
      <TableCell>{language.writingSystem?.join(", ")}</TableCell>
      <TableCell>{language.nationOfOrigin?.join(", ")}</TableCell>
    </TableRow>
  );
}
