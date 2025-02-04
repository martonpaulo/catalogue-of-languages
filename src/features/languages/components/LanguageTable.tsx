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
