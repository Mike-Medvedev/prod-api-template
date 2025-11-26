import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_KEY,
  environment: process.env.NODE_ENV || "development",
  enableLogs: true,
  sendDefaultPii: true,
});
