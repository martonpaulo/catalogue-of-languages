import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const API_ALLOWED_ORIGINS = process.env.NEXT_PUBLIC_API_ALLOWED_ORIGINS;
const API_STRICT_ORIGIN = process.env.NEXT_PUBLIC_API_STRICT_ORIGIN;

function isDomainAllowed(origin: string | null): boolean {
  if (!origin) return false;
  const allowedOrigins = API_ALLOWED_ORIGINS?.split(",") ?? [];
  return allowedOrigins.includes(origin);
}

export function middleware(req: NextRequest) {
  const origin = req.headers.get("origin");
  const strictOrigin = API_STRICT_ORIGIN === "true";

  if (strictOrigin && !isDomainAllowed(origin)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  return NextResponse.next();
}

// Run middleware for all routes in the API folder
export const config = {
  matcher: "/api/:path*",
};
