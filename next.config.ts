import type { NextConfig } from "next";
const staticExport = process.env.STUDIO_DALO_STATIC_EXPORT === "1";
const config: NextConfig = {
  poweredByHeader: false,
  allowedDevOrigins: ["127.0.0.1"],
  ...(staticExport
    ? {
        output: "export" as const,
        distDir: ".next-static",
        trailingSlash: true,
        images: {
          unoptimized: true,
          remotePatterns: [
            {
              protocol: "https",
              hostname: "cdn.sanity.io",
              pathname: "/images/**",
            },
          ],
        },
      }
    : {
        images: {
          remotePatterns: [
            {
              protocol: "https",
              hostname: "cdn.sanity.io",
              pathname: "/images/**",
            },
          ],
        },
        async headers() {
          return [
            {
              source: "/:path*",
              headers: [
                { key: "X-Content-Type-Options", value: "nosniff" },
                {
                  key: "Referrer-Policy",
                  value: "strict-origin-when-cross-origin",
                },
                {
                  key: "Permissions-Policy",
                  value: "camera=(), microphone=(), geolocation=()",
                },
              ],
            },
          ];
        },
      }),
};
export default config;
