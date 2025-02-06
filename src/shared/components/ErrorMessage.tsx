import { Alert } from "@mui/material";

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return <Alert severity="error">{message}</Alert>;
}
