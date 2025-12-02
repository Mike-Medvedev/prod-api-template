import { pgTable, pgEnum, uuid, varchar, timestamp, text } from "drizzle-orm/pg-core";

export const userEnum = pgEnum("user_enum", ["name", "age"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  firstName: varchar("first_name", { length: 50 }),
  lastName: varchar("last_name", { length: 50 }),
  phone: varchar("phone", { length: 14 }).unique(),
  email: text("email").unique().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
