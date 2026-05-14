import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://6c8620e52e2c5d6228a7c649e135a5ba@o4511389758914560.ingest.de.sentry.io/4511389769465936",
  
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  replaysOnErrorSampleRate: 1.0,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      // Additional Replay configuration goes in here, for example:
      maskAllText: true,
      blockAllMedia: true,
    }),
    // send console.log, console.warn, and console.error calls as logs to Sentry
    Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
  ],
  tracePropagationTargets: ["localhost", /^https:\/\/ic1101\.vercel\.app\/api/],
});
