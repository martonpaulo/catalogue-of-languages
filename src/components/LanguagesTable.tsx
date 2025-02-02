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
            <TableCell>Status</TableCell>
            <TableCell>Spoken In</TableCell>
            <TableCell>Writing System</TableCell>
            <TableCell>Nation of Origin</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {languages.map((language) => (
            <TableRow key={language.id}>
              <TableCell>{language.code}</TableCell>
              <TableCell>{language.name}</TableCell>
              <TableCell>{language.status}</TableCell>
              <TableCell>{language.spokenIn?.join(", ")}</TableCell>
              <TableCell>{language.writingSystem?.join(", ")}</TableCell>
              <TableCell>{language.nationOfOrigin?.join(", ")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
