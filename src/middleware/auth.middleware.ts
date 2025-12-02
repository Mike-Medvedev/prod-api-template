import { supabaseClient } from "@/auth/auth";
import { AuthTokenMissingError, AuthInvalidJwtError } from "@/errors/errors";

import type { Request, Response, NextFunction } from "express";

export async function validateTokenMiddleware(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    throw new AuthTokenMissingError("Missing authorization token", 401);
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new AuthTokenMissingError("Missing authorization token", 401);
  }

  const {
    data: { user },
    error,
  } = await supabaseClient.auth.getUser(token);

  if (error) {
    throw new AuthInvalidJwtError(error.message || "Invalid or expired token");
  }

  if (!user) {
    throw new AuthInvalidJwtError("User not found");
  }

  req.user = user;
  next();
}
