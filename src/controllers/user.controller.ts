import type { Request, Response } from "express"
import { CreateUserModel } from "../models/user.model.ts";
import { userService } from "../services/user.service.ts"
import type z from "zod";

export const createUser = async (req: Request, res: Response) => {
    const validatedUser = req.validated as z.infer<typeof CreateUserModel>;
    const user = await userService.createUser(validatedUser);
    return res.status(201).json(user);
}