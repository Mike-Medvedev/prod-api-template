import express from "express";
import * as UserController from "@/controllers/user.controller.ts";
import { validatePayload } from "@/middleware/validate-payload.middleware.ts";
import { CreateUserModel } from "@/models/user.model.ts";

const UserRouter = express.Router();

UserRouter.post("/", validatePayload(CreateUserModel), UserController.createUser);

export default UserRouter;
