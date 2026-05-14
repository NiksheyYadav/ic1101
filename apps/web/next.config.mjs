import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true
  },
};

export default withSentryConfig(nextConfig, {
  // Suppresses source map uploading logs during bundling
  silent: true,
  org: "niksheyyadav",
  project: "javascript-nextjs",

  // Don't fail the build if Sentry source map upload fails
  errorHandler: (err) => {
    console.warn("Sentry source map upload error (non-fatal):", err.message);
  },
}, {
  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Transpiles SDK to be compatible with IE11 (increases bundle size)
  transpileClientSDK: true,

  // Routes HTTP requests through Sentry to circumvent ad-blockers (increases server load)
  tunnelRoute: "/monitoring",

  // Hides source maps from visitors
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors.
  automaticVercelMonitors: true,
});
