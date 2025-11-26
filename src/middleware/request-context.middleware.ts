import { randomUUID } from "node:crypto";
import { requestContext } from "../context/request.context.ts";
import type { Request, Response, NextFunction } from "express";

export function requestContextMiddleware(req: Request, _res: Response, next: NextFunction) {
  const context = {
    reqId: randomUUID(),
    method: req.method,
    path: req.originalUrl,
    body: req.body,
  };
  req.id = context.reqId;
  requestContext.run(context, next);
}
