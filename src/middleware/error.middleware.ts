import { DrizzleQueryError } from "drizzle-orm/errors";
import type { ErrorRequestHandler, Request, Response, NextFunction } from "express"
import { DatabaseError, UnknownError } from "../errors/errors.ts";
import logger from "../logger/logger.ts";


const errorHandler: ErrorRequestHandler = function (error, _req: Request, res: Response, _next: NextFunction) {
    if (error instanceof DrizzleQueryError) {
        const databaseError = new DatabaseError(error)
        logger.error(databaseError);
        if(databaseError?.code === "23505"){
            return res.sendStatus(409);
        }
    }
    else {
        const unknownError = new UnknownError(error)
        logger.error(unknownError);
    }
    return res.sendStatus(500)
}
 export default errorHandler;
