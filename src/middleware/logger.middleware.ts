import type { Request, Response, NextFunction } from "express";
import logger from "../logger/logger.ts";

export function requestLogger(_req: Request, _res: Response, next: NextFunction) {
  logger.info("Request received");
  next();
}
