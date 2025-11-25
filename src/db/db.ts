import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
let connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error("Error reading Database connection string from env vars")

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(connectionString, { prepare: false })
export const db = drizzle(client, { casing: "snake_case" });
export type DB = typeof db