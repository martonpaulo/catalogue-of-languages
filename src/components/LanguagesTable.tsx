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
import React from "react";

import { LanguageFilterFormValues } from "@/components/LanguageFilters/languageFilterSchema";
import { LanguagesTableRow } from "@/components/LanguagesTableRow";
import { LanguageType } from "@/types/language";

interface LanguagesTableProps {
  languages: LanguageType[];
  filters?: LanguageFilterFormValues;
}

export function LanguagesTable({ languages, filters }: LanguagesTableProps) {
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
          {filteredLanguages.length > 0 ? (
            filteredLanguages.map((language) => (
              <LanguagesTableRow key={language.id} language={language} />
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
