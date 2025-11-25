import type { Request, Response, NextFunction } from "express";
export function logger(req: Request, _: Response, next: NextFunction) {
    const payload = req.body ? `with payload ${JSON.stringify(req.body)}` : ""
    console.log(`Request received: ${req.method} ${req.url} ${payload}`);
    next();
}