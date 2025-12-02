import { z } from "zod";
import logger from "@/logger/logger";

const EnvSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.string().transform((v) => Number(v)),
    DATABASE_URL: z.string(),
    SENTRY_KEY: z.string(),
    origins: z.string(),
    SUPABASE_PROJECT_ID: z.string(),
    SUPABASE_PUBLISHABLE_API_KEY: z.string(),
  })
  .loose();

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  logger.error({ message: "Invalid environment variables", err: parsed.error });
  throw new Error("Invalid environment variables see stack trace for details");
}
