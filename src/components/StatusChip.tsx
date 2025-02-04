import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { Chip, ChipProps } from "@mui/material";

interface StatusChipProps extends Omit<ChipProps, "label" | "icon"> {
  status?: string;
}

export function StatusChip({ status, ...props }: StatusChipProps) {
  const safeStatus = status || "Unknown";
  const lowerStatus = safeStatus.toLowerCase();

  let chipColor: ChipProps["color"] = "default";
  let chipIcon: React.ReactElement | undefined = undefined;

  if (lowerStatus === "active") {
    chipColor = "success";
    chipIcon = <CheckCircleIcon fontSize="small" />;
  } else if (lowerStatus === "inactive") {
    chipColor = "error";
    chipIcon = <ErrorIcon fontSize="small" />;
  } else if (lowerStatus === "pending") {
    chipColor = "warning";
    chipIcon = <HourglassEmptyIcon fontSize="small" />;
  }

  return (
    <Chip
      label={safeStatus}
      color={chipColor}
      icon={chipIcon}
      size="small"
      {...props}
    />
  );
}
