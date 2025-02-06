import { NextResponse } from "next/server";

interface ErrorProps {
  message?: string;
  error: unknown;
}

export function handleError({
  message = "Unknown error",
  error,
}: ErrorProps): NextResponse {
  return NextResponse.json(
    {
      message: { message },
      error: error instanceof Error ? error.message : { message },
    },
    { status: 500 }
  );
}
