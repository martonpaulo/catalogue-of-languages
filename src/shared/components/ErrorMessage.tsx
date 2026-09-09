import { Alert, Button } from "@mui/material";

interface ErrorMessageProps {
  message: string;
  /** Retries the operation that failed. Omitted when there is nothing to retry. */
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <Alert
      severity="error"
      action={
        onRetry && (
          <Button color="inherit" size="small" onClick={onRetry}>
            Try again
          </Button>
        )
      }
    >
      {message}
    </Alert>
  );
}
