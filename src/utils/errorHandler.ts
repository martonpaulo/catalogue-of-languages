export function handleError(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  return "Internal Server Error";
}
