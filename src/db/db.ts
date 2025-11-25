import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import logger from '../logger/logger.js'

let connectionString = process.env.DATABASE_URL
if (!connectionString) {
    logger.error('Failed to start: DATABASE_URL environment variable is missing')
    throw new Error("Error reading Database connection string from env vars")
}

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(connectionString, { prepare: false })
export const db = drizzle(client, { casing: "snake_case" });
export type DB = typeof db