import { DrizzleQueryError } from "drizzle-orm/errors";
import type { ErrorRequestHandler, Request, Response, NextFunction } from "express"
import { DatabaseError, UnknownError, ZodError } from "../errors/errors.ts";
import logger from "../logger/logger.ts";
import z from "zod";


const errorHandler: ErrorRequestHandler = function (error, _req: Request, res: Response, _next: NextFunction) {
    if (error instanceof DrizzleQueryError) {
        const databaseError = new DatabaseError(error)
        if (databaseError?.code === "23505") {
            logger.error({ message: databaseError.message, err: databaseError })
            return res.sendStatus(409);
        }
        if (databaseError?.code === "ECONNREFUSED") {
            logger.error({ message: "database refused to connect, retry not setup", err: databaseError })
            return res.sendStatus(500);
        }
    }
    else if (error instanceof ZodError){
        logger.error({message: "Zod validation error see trace for details", err: {stack: error.stack}})
        
        return res.status(422).json({ detail: z.treeifyError(error) });
    }
    else {
        const unknownError = new UnknownError(error)
        logger.error(unknownError.message);
    }
    return res.sendStatus(500)
}
export default errorHandler;
