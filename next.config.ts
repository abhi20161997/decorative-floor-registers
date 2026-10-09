import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Social card images read these fonts from disk at request time.
  outputFileTracingIncludes: {
    "/**/opengraph-image*": ["./src/assets/fonts/**/*"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mohjyircqwhmxlkqiasl.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
};

export default nextConfig;
