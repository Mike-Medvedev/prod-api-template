import { DrizzleQueryError } from "drizzle-orm/errors";
import type { ErrorRequestHandler, Request, Response, NextFunction } from "express"
import { DatabaseError, UnknownError } from "../errors/errors.ts";
import { logError } from "../logger/errorLogger.ts";

const errorHandler: ErrorRequestHandler = function (error, _req: Request, res: Response, _next: NextFunction) {
    if (error instanceof DrizzleQueryError) {
        const databaseError = new DatabaseError(error)
        logError(databaseError, { route: 'POST /users' });
        if(databaseError?.code === "23505"){
            return res.sendStatus(409);
        }
    }
    else {
        const unknownError = new UnknownError(error)
        logError(unknownError);
    }
    return res.sendStatus(500)
}
 export default errorHandler;
