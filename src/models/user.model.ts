import type z from "zod";
import { users } from "@/db/schema.ts";
import { createSelectSchema } from "drizzle-zod";

export const UserModel = createSelectSchema(users);

export const CreateUserModel = UserModel.omit({ id: true, createdAt: true });
export type CreateUser = z.infer<typeof CreateUserModel>;
