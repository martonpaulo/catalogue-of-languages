import type { SxProps, Theme } from "@mui/material";

/**
 * Single owner of the language-table heading fill. It is declared on the head row and
 * applied through the heading-cell slot, so a new column inherits it without repeating
 * the value.
 */
export const languageTableHeadSx: SxProps<Theme> = {
  "& .MuiTableCell-head": { backgroundColor: "#E3F2FD" },
};

/**
 * Single owner of the language-code typography, shared by the list cell and the detail
 * header so both surfaces present a code the same way.
 */
export const languageCodeSx: SxProps<Theme> = {
  fontFamily: "Monospace",
};
