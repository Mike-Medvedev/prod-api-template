import type { DrizzleQueryError } from "drizzle-orm/errors";
import postgres from "postgres";

const { PostgresError } = postgres

export class DatabaseError extends Error {
    params?: any[];
    query?: string;
    code?: string;
    constructor(error: DrizzleQueryError) {
        super(error.message, { cause: error.cause });
        if(error.cause instanceof PostgresError) this.message = error.cause.message
        if (error.cause && typeof (error.cause as any).code === 'string') {
            this.code = (error.cause as any).code;
        }
        this.params = error.params;
        this.query = error.query;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, DatabaseError);
        }
    }
}

export { ZodError } from "zod";

export class UnknownError extends Error{
    constructor(error: unknown) {
        const msg = error instanceof Error ? error.message : String(error);
        super(`Unknown Error: ${msg}`, { cause: error instanceof Error ? error : undefined });
        this.name = 'UnknownError';
        if (Error.captureStackTrace) Error.captureStackTrace(this, UnknownError);
      }
}
