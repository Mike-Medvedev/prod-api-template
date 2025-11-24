import { pgTable, integer, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const users = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  firstname: varchar({ length: 50 }),
  lastname: varchar({ length: 50 }),
  phone: varchar('phone', { length: 13 }),
});

export const UserSchema = createInsertSchema(users)