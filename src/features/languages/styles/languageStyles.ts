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

/**
 * The result link. It keeps a visible keyboard focus indication of its own so the row does
 * not have to rely on a browser default that varies between engines.
 */
export const languageLinkSx: SxProps<Theme> = {
  color: "inherit",
  textDecorationColor: "inherit",
  "&:focus-visible": {
    outline: "2px solid",
    outlineColor: "primary.main",
    outlineOffset: 2,
    borderRadius: 1,
  },
};
