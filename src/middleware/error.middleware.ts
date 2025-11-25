import { DrizzleQueryError } from "drizzle-orm/errors";
import type { ErrorRequestHandler, Request, Response, NextFunction } from "express"
import { DatabaseError, UnknownError } from "../errors/errors.ts";


const errorHandler: ErrorRequestHandler = function (error, _req: Request, res: Response, _next: NextFunction) {
    if (error instanceof DrizzleQueryError) {
        const databaseError = new DatabaseError(error)
        console.error(databaseError);
        if(databaseError?.code === "23505"){
            return res.sendStatus(409);
        }
    }
    else {
        const unknownError = new UnknownError(error)
        console.error(unknownError);
    }
    return res.sendStatus(500)
}
 export default errorHandler;
