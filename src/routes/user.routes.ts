import express from "express"
import * as UserController from "../controllers/user.controller.ts"
import { validate } from "../middleware/request-validator.ts";
import { CreateUserModel } from "../models/user.model.ts";

const UserRouter = express.Router()

UserRouter.post("/", validate(CreateUserModel), UserController.createUser);


export default UserRouter;