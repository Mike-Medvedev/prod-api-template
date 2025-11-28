import { pgTable, pgEnum, integer, varchar, timestamp } from "drizzle-orm/pg-core";

export const userEnum = pgEnum("user_enu,", ["name", "age"]);

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  firstName: varchar("first_name", { length: 50 }),
  lastName: varchar("last_name", { length: 50 }),
  phone: varchar("phone", { length: 14 }).unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
