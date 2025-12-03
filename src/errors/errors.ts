import type { DrizzleQueryError } from "drizzle-orm/errors";
import postgres from "postgres";
import { CustomAuthError } from "@supabase/supabase-js";

const { PostgresError } = postgres;

export class DatabaseError extends Error {
  params?: string[];
  query?: string;
  code?: string;
  constructor(error: DrizzleQueryError) {
    super(error.message, { cause: error.cause });
    if (error.cause instanceof PostgresError) this.message = error.cause.message;
    if (error.cause && typeof (error.cause as any).code === "string") {
      this.code = (error.cause as any).code;
    }
    this.params = error.params;
    this.query = error.query;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DatabaseError);
    }
  }
}
export class AuthTokenMissingError extends CustomAuthError {
  constructor(message: string, status: number) {
    super(message, "AuthTokenMissingError", status, "Missing Token");
  }
}

export class UserNotFoundError extends CustomAuthError {
  constructor(message: string) {
    super(message, "UserNotFoundError", 404, "User Not Found");
  }
}

export class HttpError extends Error {
  status?: number;
  constructor(message: string, cause: unknown, status?: number) {
    super(message, { cause: cause });
    if (status) this.status = status;
  }
}

export class UnknownError extends Error {
  constructor(error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    super(`Unknown Error: ${msg}`, { cause: error instanceof Error ? error : undefined });
    this.name = "UnknownError";
    if (Error.captureStackTrace) Error.captureStackTrace(this, UnknownError);
  }
}

export { AuthInvalidJwtError, AuthError } from "@supabase/supabase-js";
export { ZodError } from "zod";
