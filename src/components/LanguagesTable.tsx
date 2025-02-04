import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";

import { LanguagesTableRow } from "@/components/LanguagesTableRow";
import { LanguageType } from "@/types/language";

interface LanguagesTableProps {
  languages: LanguageType[];
}

export function LanguagesTable({ languages }: LanguagesTableProps) {
  return (
    <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
      <Table stickyHeader size="small">
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
            <LanguagesTableRow key={language.id} language={language} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
