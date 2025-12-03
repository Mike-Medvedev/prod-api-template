import { userService } from "@/services/user.service";
import { AuthTokenMissingError } from "@/errors/errors";

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
  const user = await userService.validateUser(token);
  req.user = user;
  next();
}
