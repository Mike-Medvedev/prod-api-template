import { z, type ZodSchema } from "zod";
import type { Request, Response, NextFunction } from "express"

export const validate = <T>(schema: ZodSchema<T>)  => (req: Request, res: Response, next: NextFunction) => {
        const parsed = schema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(422).json({ detail: parsed.error.format() });
        }
        req.validated = parsed.data as T;
        return next();
    };