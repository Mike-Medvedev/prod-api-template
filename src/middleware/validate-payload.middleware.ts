import { z } from "zod";
import type { Request, Response, NextFunction } from "express"

export function validatePayload<T extends z.ZodTypeAny>(schema: T) {
    return function (req: Request, res: Response, next: NextFunction) {
        const parsed = schema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(422).json({ detail: z.treeifyError(parsed.error) });
        }
        req.validated = parsed.data as z.infer<T>;
        return next();
    }
};