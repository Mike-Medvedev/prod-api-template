import type { Request, Response, NextFunction } from "express";
import logger from "../logger/logger.js";

export function requestLogger(req: Request, _res: Response, next: NextFunction) {
    const payload = req.body ? `with payload ${JSON.stringify(req.body)}` : ""
    logger.info(`Request received: ${req.method} ${req.url} ${payload}`);
    next();
}