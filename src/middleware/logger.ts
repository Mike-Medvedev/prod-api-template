import type { Request, Response, NextFunction } from "express";
export function logger(req: Request, _: Response, next: NextFunction) {
    console.log(`Request received: ${req.method} ${req.url}`);
    next();
}