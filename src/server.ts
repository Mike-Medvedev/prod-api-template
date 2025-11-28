import "dotenv/config";
import "./config.ts";
import "../sentry.config.js";
import express, { json, type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import { requestLogger } from "./middleware/logger.middleware.ts";
import { UserRouter } from "./routes/index.ts";
import errorHandler from "./middleware/error.middleware.ts";
import logger from "./logger/logger.ts";
import { requestContextMiddleware } from "./middleware/request-context.middleware.ts";
import { client as pgClient } from "./db/db.ts";
import helmet from "helmet";
import { rateLimit, type Options } from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: { error: "Too many requests, please try again later." },
  handler: (req: Request, res: Response, _: NextFunction, opts: Options) => {
    logger.warn(`Client (${req.ip}) has been rate limited`);
    res.sendStatus(opts.statusCode);
  },
  standardHeaders: true,
  legacyHeaders: false,
  ipv6Subnet: 56,
});

const allowedOrigins = process.env.origins?.split(",").map((s) => s.trim());

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

app.set("trust proxy", 1); // trust the first reverse proxy which forwards client ip and headers

app.use(helmet());
app.use(cors(corsOptions));
app.use(limiter);
app.use(json());
app.use(requestContextMiddleware);
app.use(requestLogger);

app.get("/health", (_, res) => {
  logger.info("healthy");
  res.status(200).json({ status: "healthy" });
});

app.use("/users", UserRouter);

app.get("/", (req, res) => {
  logger.info(req.ip);
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
