import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { LanguageTableRow } from "@/features/languages/components/LanguageTableRow";
import { languageTableHeadSx } from "@/features/languages/styles/languageStyles";
import { LanguageType } from "@/features/languages/types/language.type";

interface LanguageTableProps {
  languages: LanguageType[];
}

export function LanguageTable({ languages }: LanguageTableProps) {
  return (
    <TableContainer
      component={Paper}
      sx={{ overflowX: "auto" }}
      variant="outlined"
    >
      <Table>
        <TableHead sx={languageTableHeadSx}>
          <TableRow>
            <TableCell>Code</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Nation of Origin</TableCell>
            <TableCell>Writing System</TableCell>
            <TableCell>Spoken In</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {languages.length > 0 ? (
            languages.map((language) => (
              <LanguageTableRow key={language.id} language={language} />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6}>
                <Typography align="center" variant="body2">
                  No languages found matching the filters.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
