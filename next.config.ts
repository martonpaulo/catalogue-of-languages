import type { NextConfig } from "next";

/**
 * The catalogue is published as a static export under a sub-path. `NEXT_PUBLIC_BASE_PATH`
 * is the single declaration of that prefix: the framework applies it to routes and assets,
 * and `src/shared/config/deployment.ts` reads the same value for snapshot asset URLs.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
