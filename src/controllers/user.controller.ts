import type { Request, Response, NextFunction } from "express"
import { CreateUserModel } from "../models/user.model.ts";
import { userService } from "../services/user.service.ts"

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const newUser = req.validated;
    try {
        const newlyCreatedUser = userService.createUser(newUser);

        return res.status(201).json(CreateUserModel.parse(newlyCreatedUser));

    } catch (e) {
        console.error("DB Insert Error:", e);
        next(e)
        return res.status(500).json({
            detail: "Database insert failed",
            error: String(e),
        });
    }
}