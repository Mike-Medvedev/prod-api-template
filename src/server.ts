import "dotenv/config";
import "../sentry.config.js";
import express, { json } from "express";
import cors from "cors";
import { requestLogger } from "./middleware/logger.middleware.ts";
import { UserRouter, TransactionRouter, CommitmentRouter } from "./routes/index.ts";
import errorHandler from "./middleware/error.middleware.ts";
import logger from "./logger/logger.ts";
import { requestContextMiddleware } from "./middleware/request-context.middleware.ts";
import { client as pgClient } from "./db/db.ts";
import helmet from "helmet";

const allowedOrigins = process.env.origins!.split(",").map((s) => s.trim());

if (!allowedOrigins || allowedOrigins.length === 0) {
  logger.error("Failed to start: CORS origins environment variable is missing or empty");
  throw new Error("Cors origin env variables required!");
}

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) {
      callback(null, true);
      return;
    }
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    } else {
      callback(new Error(`Origin ${origin} not allowed`));
      return;
    }
  },
};

const app = express();

app.get("/health", (_, res) => {
  logger.info("healthy");
  res.status(200).json({ status: "healthy" });
});

app.use(helmet());
app.use(cors(corsOptions));

app.use(json());
app.use(requestContextMiddleware);
app.use(requestLogger);

app.use("/users", UserRouter);
app.use("/transactions", TransactionRouter);
app.use("/commitments", CommitmentRouter);

app.get("/", (_, res) => {
  res.send("Hello World");
});

app.use(errorHandler);

const server = app.listen(Number(process.env.PORT), "0.0.0.0", (): void => {
  logger.info(`Server listening on port ${process.env.PORT}`);
});

const shutdown = (signal: string) => {
  logger.info({ message: `Shutting down with signal: ${signal}` });
  server.close(async (err): Promise<void> => {
    if (err) {
      logger.error({ message: "Error closing server", err });
      process.exit(1);
    }
    try {
      await pgClient.end();
    } finally {
      process.exit(0);
    }
  });
  setTimeout(() => {
    logger.error({ message: "Forced shutdown timeout" });
    process.exit(1);
  }, 10_000).unref();
};

["SIGTERM", "SIGINT"].forEach((sig) => process.on(sig, () => shutdown(sig)));
process.on("unhandledRejection", (reason) => {
  logger.error({
    message: "unhandledRejection",
    err: reason instanceof Error ? reason : new Error(String(reason)),
  });
});
process.on("uncaughtException", (err) => {
  logger.error({ message: "uncaughtException", err });
  shutdown("uncaughtException");
});
