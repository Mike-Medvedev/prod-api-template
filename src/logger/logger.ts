import { createLogger, format, transports } from "winston";
import type { TransformableInfo } from "logform";
import { requestContext } from "../context/request.context.ts";
import * as nodePath from "node:path";
import Transport from "winston-transport";
import * as Sentry from "@sentry/node";

const SentryWinstonTransport = Sentry.createSentryWinstonTransport(Transport);

const logFile = nodePath.resolve(process.cwd(), "log.log");

type RequestLogInfo = TransformableInfo & {
  reqId?: string;
  method?: string;
  path?: string;
  body?: unknown;
  err?: { cause?: string; stack?: string };
};

function devFormat(info: RequestLogInfo): string {
  const requestMetaData = Object.entries({
    requestId: info.reqId,
    method: info.method,
    path: info.path,
    body: info.body,
  }).filter(([, v]) => v !== undefined && v !== null);

  const meta =
    requestMetaData.length > 0 ? JSON.stringify(Object.fromEntries(requestMetaData), null, 2) : "";

  const lines = [`${info.timestamp} ${info.level} ${info.message}`];
  if (info.err?.cause) lines.push(String(info.err.cause));
  if (info.err?.stack) lines.push(String(info.err.stack));

  if (meta) lines.push(meta);

  return lines.join("\r\n");
}

const addRequestContext = format((info) => {
  const { reqId, method, path, body } = requestContext.getStore() ?? {};
  return process.env.NODE_ENV === "production"
    ? { ...info, reqId, method, path }
    : { ...info, reqId, method, path, body };
});

const devLoggerOptions = {
  level: "info",
  format: format.combine(
    addRequestContext(),
    format.timestamp({ format: "YYYY-MM-DD hh:mm:ss A" }),
    format.colorize(),
    format.errors({ stack: true }),
    format.printf(devFormat),
  ),
  transports: [new transports.Console(), new SentryWinstonTransport()],
};

const prodLoggerOptions = {
  level: "info",
  defaultMeta: {
    service: "lock-in-api",
    env: process.env.NODE_ENV,
  },
  format: format.combine(
    addRequestContext(),
    format.timestamp({ format: "YYYY-MM-DD hh:mm:ss A" }),
    format.errors({ stack: true }),
    format.json(),
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: logFile, options: { flags: "w" } }),
    new SentryWinstonTransport(),
  ],
};

const winstonLoggerOptions =
  process.env.NODE_ENV !== "production" ? devLoggerOptions : prodLoggerOptions;

const logger = createLogger(winstonLoggerOptions);

export default logger;
