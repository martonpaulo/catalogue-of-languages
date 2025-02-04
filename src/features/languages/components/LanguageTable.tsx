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

import { LanguageFilterFormValues } from "@/features/languages/components/languageFilters.schema";
import { LanguageTableRow } from "@/features/languages/components/LanguageTableRow";
import { LanguageType } from "@/features/languages/types/language.type";

interface LanguageTableProps {
  languages: LanguageType[];
  filters?: LanguageFilterFormValues;
}

export function LanguageTable({ languages, filters }: LanguageTableProps) {
  const filteredLanguages = languages.filter((language) => {
    if (
      filters?.code &&
      language.code.toLowerCase() !== filters.code.toLowerCase()
    ) {
      return false;
    }
    if (
      filters?.name &&
      !language.name.toLowerCase().includes(filters.name.toLowerCase())
    ) {
      return false;
    }
    if (filters?.status && language.status !== filters.status) {
      return false;
    }
    if (
      filters?.spokenIn &&
      (!language.spokenIn || !language.spokenIn.includes(filters.spokenIn))
    ) {
      return false;
    }
    if (
      filters?.writingSystem &&
      (!language.writingSystem ||
        !language.writingSystem.includes(filters.writingSystem))
    ) {
      return false;
    }
    if (
      filters?.nationOfOrigin &&
      (!language.nationOfOrigin ||
        !language.nationOfOrigin.includes(filters.nationOfOrigin))
    ) {
      return false;
    }
    return true;
  });

  return (
    <TableContainer
      component={Paper}
      sx={{ overflowX: "auto" }}
      variant="outlined"
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ backgroundColor: "#E3F2FD" }}>Code</TableCell>
            <TableCell sx={{ backgroundColor: "#E3F2FD" }}>Name</TableCell>
            <TableCell sx={{ backgroundColor: "#E3F2FD" }}>Status</TableCell>
            <TableCell sx={{ backgroundColor: "#E3F2FD" }}>
              Nation of Origin
            </TableCell>
            <TableCell sx={{ backgroundColor: "#E3F2FD" }}>
              Writing System
            </TableCell>
            <TableCell sx={{ backgroundColor: "#E3F2FD" }}>Spoken In</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredLanguages.length > 0 ? (
            filteredLanguages.map((language) => (
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
