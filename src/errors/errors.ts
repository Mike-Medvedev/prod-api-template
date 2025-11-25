import type { DrizzleQueryError } from "drizzle-orm/errors";
import postgres from "postgres";

const { PostgresError } = postgres; 

export class DatabaseError extends Error {
    query: string;
    code?: string;
    detail?: string | undefined;
    constraintName?: string | undefined;
    columnName?: string | undefined;
    constructor(error: DrizzleQueryError) {
        const postgresError = error.cause
        if (postgresError instanceof PostgresError) {
            super(postgresError.message, { cause: error })
            this.code = postgresError.code
            this.detail = postgresError.detail;
            this.constraintName = postgresError.constraint_name
            this.columnName = postgresError.column_name
        }
        else {
            super(error.message, { cause: error.cause });
        }

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, DatabaseError);
        }
        this.query = error.query
        this.name = this.constructor.name
    }
}


export class UnknownError extends Error{
    constructor(error: unknown) {
        const msg = error instanceof Error ? error.message : String(error);
        super(`Unknown Error: ${msg}`, { cause: error instanceof Error ? error : undefined });
        this.name = 'UnknownError';
        if (Error.captureStackTrace) Error.captureStackTrace(this, UnknownError);
      }
}
