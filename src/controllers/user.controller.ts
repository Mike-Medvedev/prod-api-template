import type { Request, Response } from "express";
import { type CreateUser } from "@/models/user.model.ts";
import { userService } from "@/services/user.service.ts";
import logger from "@/logger/logger.ts";

export const createUser = async (req: Request, res: Response) => {
  logger.info("Creating User");
  const validatedUser = req.validated as CreateUser;
  const user = await userService.createUser(validatedUser);
  return res.status(201).json(user);
};
