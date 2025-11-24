import { createSelectSchema } from "drizzle-zod";
import { transactions } from "../db/schema.ts"

export const Transaction = createSelectSchema(transactions);
