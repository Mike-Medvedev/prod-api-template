import { z } from "zod";
import type { Request, Response, NextFunction } from "express";

export function validatePayload<T extends z.ZodType>(schema: T) {
  return function (req: Request, _res: Response, next: NextFunction) {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      next(parsed.error); //calling next on an error jumps straight to error handling middleware
    } else {
      req.validated = parsed.data as z.infer<T>;
      next();
    }
  };
}
