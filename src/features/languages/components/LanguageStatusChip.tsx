import { Chip, ChipProps } from "@mui/material";

import { LanguageStatusEnum } from "@/features/languages/types/languageStatus.enum";

interface LanguageStatusChipProps extends Omit<ChipProps, "label" | "icon"> {
  status: string;
}

const MAP_STATUS_TO_COLOR: Record<string, ChipProps["color"]> = {
  // Well-established / healthy languages
  [LanguageStatusEnum.NATIONAL]: "success", // Green (strong)
  [LanguageStatusEnum.PROVINCIAL]: "primary", // Blue (regional)
  [LanguageStatusEnum.WIDER_COMMUNICATION]: "success",
  [LanguageStatusEnum.EDUCATIONAL]: "secondary", // Purple
  [LanguageStatusEnum.DEVELOPING]: "info", // Light blue (developing)
  [LanguageStatusEnum.VIGOROUS]: "success", // Green (strong)

  // Languages in danger
  [LanguageStatusEnum.THREATENED]: "warning", // Orange
  [LanguageStatusEnum.SHIFTING]: "error", // Red (critically endangered)
  [LanguageStatusEnum.MORIBUND]: "error",
  [LanguageStatusEnum.NEARLY_EXTINCT]: "error",
  [LanguageStatusEnum.REAWAKENING]: "warning", // Coming back but requires attention
  [LanguageStatusEnum.SECOND_LANGUAGE_ONLY]: "info", // Still spoken but not natively

  // Extinct or unattested languages
  [LanguageStatusEnum.DORMANT]: "default", // Gray (used to be spoken)
  [LanguageStatusEnum.EXTINCT]: "error", // Strong red (extinct)
  [LanguageStatusEnum.UNATTESTED]: "default", // Gray (unknown)
};

export function LanguageStatusChip({
  status,
  ...props
}: LanguageStatusChipProps) {
  return (
    <Chip
      label={status}
      color={MAP_STATUS_TO_COLOR[status]}
      size="small"
      {...props}
    />
  );
}
