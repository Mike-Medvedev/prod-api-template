import { users } from "../db/schema.ts"
import { createSelectSchema } from 'drizzle-zod';

export const UserModel = createSelectSchema(users);
