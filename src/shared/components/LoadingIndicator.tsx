import { Box, CircularProgress, Typography } from "@mui/material";

interface LoadingIndicatorProps {
  message: string;
  size?: "small" | "large";
}

export function LoadingIndicator({
  message,
  size = "small",
}: LoadingIndicatorProps) {
  return (
    <Box
      display="flex"
      flexDirection={size === "small" ? "row" : "column"}
      paddingTop={6}
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      <CircularProgress size={size === "small" ? 20 : 60} />
      <Typography variant="body2">{message}</Typography>
    </Box>
  );
}
