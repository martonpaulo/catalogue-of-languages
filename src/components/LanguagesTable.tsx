import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import { LanguageType } from "@/types/language";

interface LanguagesTableProps {
  languages: LanguageType[];
}

export function LanguagesTable({ languages }: LanguagesTableProps) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Code</TableCell>
            <TableCell>Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {languages.map((language) => (
            <TableRow key={language.id}>
              <TableCell>{language.code}</TableCell>
              <TableCell>{language.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
