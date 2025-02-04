import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function isDomainAllowed(origin: string | null): boolean {
  if (!origin) return false;
  const allowedOrigins = process.env.API_ALLOWED_ORIGINS?.split(",") ?? [];
  return allowedOrigins.includes(origin);
}

export function middleware(req: NextRequest) {
  const origin = req.headers.get("origin");
  const strictOrigin = process.env.API_STRICT_ORIGIN === "true";

  if (strictOrigin && !isDomainAllowed(origin)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  return NextResponse.next();
}

// Run middleware for all routes in the API folder
export const config = {
  matcher: "/api/:path*",
};
